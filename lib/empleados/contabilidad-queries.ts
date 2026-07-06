import "server-only"
import { getServiceClient } from "./db"
import type { Cuenta, Movimiento } from "./contabilidad"

const CUENTA_COLS = "id,nombre,banco,moneda,saldo_inicial,activa,orden,creado_en,actualizado_en"
const MOV_COLS =
  "id,cuenta_id,cuenta_destino_id,fecha,tipo,categoria,concepto,contraparte,valor,estado,referencia,creado_por,creado_en,actualizado_en"

// ── Cuentas ───────────────────────────────────────────────────────────────────
export async function listCuentas() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cuentas").select(CUENTA_COLS).order("orden").order("creado_en")
  if (error) throw error
  return (data ?? []) as Cuenta[]
}

export async function getCuenta(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cuentas").select(CUENTA_COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Cuenta | null
}

export type CuentaInput = Omit<Cuenta, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertCuenta(input: CuentaInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cuentas").upsert(input).select(CUENTA_COLS).single()
  if (error) throw error
  return data as Cuenta
}

export async function eliminarCuenta(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("cuentas").delete().eq("id", id)
  if (error) throw error
}

// ── Movimientos ────────────────────────────────────────────────────────────────
/** Todos los movimientos (se necesitan completos para calcular saldos acumulados). */
export async function listMovimientos() {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("movimientos")
    .select(MOV_COLS)
    .order("fecha", { ascending: false })
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as Movimiento[]
}

export async function getMovimiento(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("movimientos").select(MOV_COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Movimiento | null
}

export type MovimientoInput = Omit<Movimiento, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertMovimiento(input: MovimientoInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("movimientos").upsert(input).select(MOV_COLS).single()
  if (error) throw error
  return data as Movimiento
}

export async function eliminarMovimiento(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("movimientos").delete().eq("id", id)
  if (error) throw error
}
