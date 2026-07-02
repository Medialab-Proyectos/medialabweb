import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase con SERVICE ROLE (ignora RLS). SOLO servidor.
 * Nunca importar desde componentes cliente. La creación es perezosa para no
 * romper el build cuando las env vars aún no están configuradas.
 */
let _client: SupabaseClient | null = null

export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      "Portal de empleados sin configurar: faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.",
    )
  }
  if (!_client) {
    _client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _client
}

/** True si el portal ya tiene backend configurado (para mensajes claros). */
export function portalConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.EMPLEADOS_SESSION_SECRET,
  )
}
