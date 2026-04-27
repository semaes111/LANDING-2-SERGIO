/**
 * Vercel Edge Function: GET /api/informe?token=xxx
 * --------------------------------------------------------------------
 * Retrieves a clinical recommendation report by its access token,
 * validates it (expiration, revocation), increments the view counter
 * atomically via RPC, and returns the JSON payload.
 *
 * Why an Edge Function:
 * - Table nm_informes_paciente has RLS enabled. Browser-side anon
 *   reads would fail. Routing through this function lets us use
 *   SUPABASE_SERVICE_ROLE_KEY server-side (never reaches the browser).
 * - Validation: token format, expiration, revocation, all checked here.
 * - View counter increment via RPC `increment_informe_view` is
 *   transactionally atomic (no race conditions).
 *
 * Security:
 * - Token must be exactly 64 hex chars. Anything else returns 400.
 * - Revoked or expired reports return 410 Gone.
 * - Non-existent token returns 404.
 * - Soft-deleted reports (HITO 4.I cron) return 404 transparently
 *   because the function reads from `nm_informes_paciente_active` view
 *   instead of the underlying table.
 * - Cache-Control: no-store always.
 *
 * Runtime: Edge (Web standard APIs only, no Node.js).
 * Rate limit: 30 req/min per IP.
 */

export const config = {
  runtime: 'edge',
}

// --------------------------- Rate limiting ---------------------------

type RateBucket = { count: number; windowStart: number }
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 30
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

const TOKEN_REGEX = /^[a-f0-9]{64}$/

// --------------------------- Supabase --------------------------------

const SUPABASE_URL = 'https://bpazmmbjjducdmxgfoum.supabase.co'

type InformeRow = {
  id: string
  token_acceso: string
  paciente_id: string
  paciente_nombre: string
  contenido_json: Record<string, unknown>
  generado_en: string
  expira_en: string
  revocado: boolean
  revocado_motivo: string | null
  vistas_count: number
  primera_vista_en: string | null
  ultima_vista_en: string | null
}

async function fetchInforme(
  serviceKey: string,
  token: string,
): Promise<InformeRow | null> {
  // HITO 4.I: read from the active view, which transparently excludes
  // soft-deleted rows (deleted_at IS NOT NULL). When the cleanup cron marks
  // an informe as soft-deleted, this query returns 0 rows and the caller
  // gets a 404, which is semantically correct ("informe no longer available").
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/nm_informes_paciente_active?token_acceso=eq.${encodeURIComponent(token)}&select=*&limit=1`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: 'application/json',
      },
    },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase fetch failed (HTTP ${res.status}): ${body}`)
  }
  const rows = (await res.json()) as InformeRow[]
  return rows.length === 0 ? null : rows[0]
}

type IncrementResult = {
  out_vistas_count: number
  out_primera_vista_en: string
  out_ultima_vista_en: string
}

async function incrementView(
  serviceKey: string,
  informeId: string,
): Promise<IncrementResult | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_informe_view`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_informe_id: informeId }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`RPC increment failed (HTTP ${res.status}): ${body}`)
  }
  const rows = (await res.json()) as IncrementResult[]
  return rows.length === 0 ? null : rows[0]
}

// --------------------------- Handler ---------------------------------

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    return jsonResponse(
      { error: 'Demasiadas solicitudes. Espera 1 minuto.' },
      429,
    )
  }

  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return jsonResponse({ error: 'Token requerido' }, 400)
  }
  if (!TOKEN_REGEX.test(token)) {
    return jsonResponse({ error: 'Token con formato inválido' }, 400)
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY not configured')
    return jsonResponse(
      { error: 'Servicio no disponible temporalmente' },
      503,
    )
  }

  let row: InformeRow | null
  try {
    row = await fetchInforme(serviceKey, token)
  } catch (err) {
    console.error('fetchInforme error:', err)
    return jsonResponse({ error: 'Error al recuperar el informe' }, 500)
  }

  if (!row) {
    return jsonResponse({ error: 'Informe no encontrado' }, 404)
  }

  if (row.revocado) {
    return jsonResponse(
      {
        error: 'Este informe ya no está disponible',
        motivo: row.revocado_motivo || 'Informe revocado',
      },
      410,
    )
  }

  const now = new Date()
  const expira = new Date(row.expira_en)
  if (expira < now) {
    return jsonResponse(
      { error: 'Este informe ha caducado', expirado_en: row.expira_en },
      410,
    )
  }

  // Best-effort: si falla, devolvemos el informe igual
  let viewMetadata: IncrementResult | null = null
  try {
    viewMetadata = await incrementView(serviceKey, row.id)
  } catch (err) {
    console.error('incrementView error (non-fatal):', err)
  }

  return jsonResponse({
    ok: true,
    informe: row.contenido_json,
    metadata: {
      generado_en: row.generado_en,
      expira_en: row.expira_en,
      vistas_count: viewMetadata?.out_vistas_count ?? row.vistas_count,
      primera_vista: row.primera_vista_en === null,
    },
  })
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}