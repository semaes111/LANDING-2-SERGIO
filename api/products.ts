/**
 * Vercel Edge Function: GET /api/products
 * --------------------------------------------------------------------
 * Devuelve el catálogo de productos activos de Diettissima desde
 * Supabase (public.diettissima_products) — la ÚNICA fuente de verdad
 * de precios de la landing. Regla de proyecto: prohibido hardcodear
 * precios en el frontend.
 *
 * Diseño:
 * - La tabla tiene RLS (SELECT público solo de filas active=true),
 *   pero se lee server-side con SERVICE_ROLE_KEY para no introducir
 *   claves en el navegador y mantener el patrón de /api/registro
 *   y /api/informe.
 * - Cache-Control agresivo: los precios cambian rara vez; el edge
 *   cache de Vercel (s-maxage) absorbe el tráfico y SWR evita esperas.
 * - Solo GET. Cualquier otro método → 405.
 *
 * Runtime: Edge (Web standard APIs only, no Node.js).
 */

export const config = {
  runtime: 'edge',
}

const SUPABASE_URL = 'https://bpazmmbjjducdmxgfoum.supabase.co'

type ProductRow = {
  code: string
  name: string
  price_eur: string | number
  billing_period: 'one_time' | 'monthly'
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }

  const url =
    `${SUPABASE_URL}/rest/v1/diettissima_products` +
    `?select=code,name,price_eur,billing_period&active=eq.true&order=sort_order.asc`

  const upstream = await fetch(url, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: 'application/json',
    },
  })

  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: 'Upstream error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }

  const rows = (await upstream.json()) as ProductRow[]

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
