/**
 * Backend de la landing Diettissima.
 * La web se sirve ESTÁTICA (hosting compartido Hostinger); todo el backend
 * vive en Supabase: PostgREST para lecturas públicas protegidas por RLS y
 * Edge Functions (landing-registro, landing-informe) para la lógica server-side.
 *
 * La clave anon es pública por diseño (publishable key): la seguridad la
 * imponen las políticas RLS y la validación/rate-limit de las funciones.
 */
export const SUPABASE_URL = 'https://bpazmmbjjducdmxgfoum.supabase.co'

export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYXptbWJqamR1Y2RteGdmb3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MjY1MTksImV4cCI6MjA4MzQwMjUxOX0.uZd2m7JMXd_i-bZVsTQTcqTEhJMxLXwvdPLK74h07Kw'

export const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`

export const supabaseHeaders: Record<string, string> = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
}
