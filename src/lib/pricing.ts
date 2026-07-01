/**
 * Pricing — única fuente de verdad: Supabase public.diettissima_products,
 * servida por la Edge Function GET /api/products (con cache).
 * Regla de proyecto: PROHIBIDO hardcodear precios en el código.
 */
import { useEffect, useState } from 'react'

export type BillingPeriod = 'one_time' | 'monthly'

export interface Product {
  code: string
  name: string
  priceEur: number
  billingPeriod: BillingPeriod
}

type PriceMap = Record<string, Product>

let cache: PriceMap | null = null
let inflight: Promise<PriceMap> | null = null

async function fetchPrices(): Promise<PriceMap> {
  const res = await fetch('/api/products', { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`products ${res.status}`)
  const rows: Array<{
    code: string
    name: string
    price_eur: string | number
    billing_period: string
  }> = await res.json()
  const map: PriceMap = {}
  for (const r of rows) {
    const price = typeof r.price_eur === 'number' ? r.price_eur : Number(r.price_eur)
    if (!r.code || Number.isNaN(price)) continue
    map[r.code] = {
      code: r.code,
      name: r.name,
      priceEur: price,
      billingPeriod: r.billing_period === 'monthly' ? 'monthly' : 'one_time',
    }
  }
  return map
}

/** Hook con caché a nivel de módulo: un único fetch por sesión de página. */
export function usePricing(): { prices: PriceMap | null; error: boolean } {
  const [prices, setPrices] = useState<PriceMap | null>(cache)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (cache) return
    if (!inflight) inflight = fetchPrices()
    let alive = true
    inflight
      .then((map) => {
        cache = map
        if (alive) setPrices(map)
      })
      .catch(() => {
        inflight = null
        if (alive) setError(true)
      })
    return () => {
      alive = false
    }
  }, [])

  return { prices, error }
}

/** Formatea el precio con sufijo mensual cuando aplica. Sin producto → em-dash (nunca una cifra inventada). */
export function formatPriceEUR(p: Product | undefined): string {
  if (!p) return '—'
  const base = `${Number.isInteger(p.priceEur) ? p.priceEur.toFixed(0) : p.priceEur.toFixed(2)}€`
  return p.billingPeriod === 'monthly' ? `${base}/mes` : base
}
