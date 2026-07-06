import "server-only"
import { getServiceClient } from "./db"
import type { CuentaCobro } from "./cuenta-cobro"

const COLS =
  "id,numero,emisor,empresa_id,modo,cantidad,tarifa,moneda,mes_servicio,concepto,cuenta_id,fecha_emision,fecha_pago,observaciones,estado,creado_por,creado_en,actualizado_en"

export async function listCuentasCobro() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cuentas_cobro").select(COLS).order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as CuentaCobro[]
}

export async function getCuentaCobro(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cuentas_cobro").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as CuentaCobro | null
}

export type CuentaCobroInput = Omit<CuentaCobro, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertCuentaCobro(input: CuentaCobroInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cuentas_cobro").upsert(input).select(COLS).single()
  if (error) throw error
  return data as CuentaCobro
}

export async function eliminarCuentaCobro(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("cuentas_cobro").delete().eq("id", id)
  if (error) throw error
}

/** Nº de cuentas de cobro por pasar: con fecha_pago <= hoy+dias y no pagadas. */
export async function contarCuentasCobroPorPasar(dias = 5) {
  const sb = getServiceClient()
  const limite = new Date(Date.now() + dias * 86_400_000).toISOString().slice(0, 10)
  const { count, error } = await sb
    .from("cuentas_cobro")
    .select("id", { count: "exact", head: true })
    .neq("estado", "pagada")
    .not("fecha_pago", "is", null)
    .lte("fecha_pago", limite)
  if (error) throw error
  return count ?? 0
}
