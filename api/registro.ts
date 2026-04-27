/**
 * Vercel Edge Function: POST /api/registro
 * --------------------------------------------------------------------
 * Generates a one-time access token for the clinical questionnaire and
 * inserts it into Supabase. Returns the redirect URL that points the
 * patient to the formulario1 subdomain with their token in the query string.
 *
 * Why an Edge Function and not a direct Supabase call from the browser:
 * - The clinica_enlaces_pacientes table allows anon INSERT (the existing
 *   admin.html flow needs this), which means anyone could spam the table
 *   from anywhere on the internet by crafting a curl request. By routing
 *   through this Edge Function we:
 *     a) Keep server-side input validation (length, character set, no XSS)
 *     b) Apply per-IP rate limiting
 *     c) Use the SERVICE_ROLE_KEY (which never reaches the browser)
 *     d) Set agent_id authoritatively to 'centro_landing' (the patient
 *        cannot fake their origin)
 *
 * Runtime: Edge (Cloudflare-style isolate, NOT Node.js). This means:
 * - No filesystem
 * - No native modules
 * - Must use fetch() instead of node 'http'
 * - In-memory state is per-region (does NOT cross worldwide regions)
 *
 * Rate limit:
 * - 5 requests per minute per IP, in-memory Map
 * - Map is per-region, so a single attacker hitting from the same IP gets
 *   limited PER region (not globally). Acceptable trade-off vs adding
 *   Upstash KV plumbing — if abuse is detected, we can graduate to KV later.
 * - The Map self-resets when the isolate is recycled (~15 min idle)
 */

export const config = {
  runtime: 'edge',
  // We don't need geo data, no need to invoke specific regions.
}

// --------------------------- Rate limiting ---------------------------

type RateBucket = { count: number; windowStart: number }
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const rateBuckets = new Map<string, RateBucket>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)

  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, windowStart: now })
    return false
  }

  if (bucket.count >= RATE_LIMIT_MAX) return true

  bucket.count++
  return false
}

// --------------------------- Validation ------------------------------

const NAME_REGEX = /^[\p{L}\p{M}\s'’\-\.]{3,80}$/u
// Letters (any language), marks (accents), space, apostrophe, hyphen, dot.
// 3 to 80 chars. No digits, no special chars beyond punctuation.

const PHONE_REGEX = /^[\+\d\s\-\(\)]{6,20}$/
// + digits spaces - ( ). 6-20 chars. Permissive to allow international formats.

type RegistroPayload = {
  nombre: string
  telefono: string
}

type ValidationResult =
  | { ok: true; nombre: string; telefono: string }
  | { ok: false; error: string }

function validatePayload(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Payload inválido' }
  }
  const p = raw as Partial<RegistroPayload>

  if (typeof p.nombre !== 'string') {
    return { ok: false, error: 'Nombre requerido' }
  }
  const nombre = p.nombre.trim()
  if (!NAME_REGEX.test(nombre)) {
    return {
      ok: false,
      error:
        'Nombre debe tener entre 3 y 80 caracteres, solo letras y signos válidos',
    }
  }

  if (typeof p.telefono !== 'string') {
    return { ok: false, error: 'Teléfono requerido' }
  }
  const telefono = p.telefono.trim()
  if (!PHONE_REGEX.test(telefono)) {
    return {
      ok: false,
      error: 'Teléfono inválido (6-20 caracteres, dígitos y + - ( ) espacios)',
    }
  }

  return { ok: true, nombre, telefono }
}

// --------------------------- Token generator -------------------------

function generateToken(): string {
  // 16 bytes = 32 hex chars, same format as the existing admin.html
  // generates. Cryptographically random via the Edge runtime's
  // built-in crypto (Web Crypto API).
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// --------------------------- Supabase insert -------------------------

const SUPABASE_URL = 'https://bpazmmbjjducdmxgfoum.supabase.co'
const FORMULARIO_BASE_URL = 'https://formulario1.nexthorizont.ai'
const TOKEN_TTL_DAYS = 7

async function insertEnlace(
  serviceKey: string,
  nombre: string,
  telefono: string,
): Promise<{ token: string }> {
  const token = generateToken()
  const expiraAt = new Date(
    Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString()

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clinica_enlaces_pacientes`,
    {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        token,
        nombre_paciente: nombre,
        telefono,
        usado: false,
        expira_at: expiraAt,
        agent_id: 'centro_landing',
      }),
    },
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase insert failed (HTTP ${res.status}): ${body}`)
  }

  return { token }
}

// --------------------------- Handler ---------------------------------

export default async function handler(req: Request): Promise<Response> {
  // Only POST allowed
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  // Get IP (Vercel forwards via x-forwarded-for header)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    return jsonResponse(
      {
        error: 'Demasiadas solicitudes. Espera 1 minuto e inténtalo de nuevo.',
      },
      429,
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'JSON inválido' }, 400)
  }

  // Validate
  const validated = validatePayload(body)
  if (!validated.ok) {
    return jsonResponse({ error: validated.error }, 400)
  }

  // Service key — must be configured in Vercel Project Settings
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY not configured')
    return jsonResponse(
      {
        error:
          'El servicio no está disponible temporalmente. Inténtalo más tarde.',
      },
      503,
    )
  }

  // Insert
  try {
    const { token } = await insertEnlace(
      serviceKey,
      validated.nombre,
      validated.telefono,
    )

    return jsonResponse({
      ok: true,
      token,
      redirectUrl: `${FORMULARIO_BASE_URL}/?t=${token}`,
    })
  } catch (err) {
    console.error('Registro error:', err)
    return jsonResponse(
      { error: 'No se pudo crear el registro. Inténtalo de nuevo.' },
      500,
    )
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Prevent caching of dynamic responses
      'Cache-Control': 'no-store',
    },
  })
}
