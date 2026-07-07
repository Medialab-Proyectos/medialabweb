import "server-only"
import { getServiceClient } from "./db"
import type { Cuenta, Movimiento, Empresa, MetodoPago, ContratoEmpresa, GastoRecurrente } from "./contabilidad"

const CUENTA_COLS = "id,nombre,banco,plataforma,moneda,saldo_inicial,activa,orden,creado_en,actualizado_en"
const MOV_COLS =
  "id,cuenta_id,cuenta_destino_id,fecha,tipo,categoria,concepto,contraparte,empresa_id,empleado_id,valor,tasa,costo,valor_destino,iva_tipo,iva_valor,estado,referencia,creado_por,creado_en,actualizado_en"

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

// ── Gastos recurrentes (catálogo) ─────────────────────────────────────────────
const GASTO_COLS = "id,nombre,categoria,proveedor,moneda,valor,cuenta_id,activo,orden,creado_en"

export async function listGastosRecurrentes() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("gastos_recurrentes").select(GASTO_COLS).order("orden").order("nombre")
  if (error) throw error
  return (data ?? []) as GastoRecurrente[]
}

export type GastoRecurrenteInput = Omit<GastoRecurrente, "id" | "creado_en"> & { id?: string }

export async function upsertGastoRecurrente(input: GastoRecurrenteInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("gastos_recurrentes").upsert(input).select(GASTO_COLS).single()
  if (error) throw error
  return data as GastoRecurrente
}

export async function eliminarGastoRecurrente(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("gastos_recurrentes").delete().eq("id", id)
  if (error) throw error
}

// ── Empresas ────────────────────────────────────────────────────────────────
const EMPRESA_COLS = "id,nombre,nit,correo,pais,telefono,creado_en,actualizado_en"
const CONTRATO_EMPRESA_COLS = "id,empresa_id,nombre,modo,tarifa,moneda,activo,notas,creado_en,actualizado_en"

export async function listEmpresas() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empresas").select(EMPRESA_COLS).order("nombre")
  if (error) throw error
  return (data ?? []) as Empresa[]
}

export async function getEmpresa(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empresas").select(EMPRESA_COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Empresa | null
}

export type EmpresaInput = Omit<Empresa, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertEmpresa(input: EmpresaInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empresas").upsert(input).select(EMPRESA_COLS).single()
  if (error) throw error
  return data as Empresa
}

export async function eliminarEmpresa(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("empresas").delete().eq("id", id)
  if (error) throw error
}

// ── Contratos con empresa (cliente) ───────────────────────────────────────────
export async function listContratosEmpresa() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contratos_empresa").select(CONTRATO_EMPRESA_COLS).order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as ContratoEmpresa[]
}

export async function getContratoEmpresa(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contratos_empresa").select(CONTRATO_EMPRESA_COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as ContratoEmpresa | null
}

export type ContratoEmpresaInput = Omit<ContratoEmpresa, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertContratoEmpresa(input: ContratoEmpresaInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contratos_empresa").upsert(input).select(CONTRATO_EMPRESA_COLS).single()
  if (error) throw error
  return data as ContratoEmpresa
}

export async function eliminarContratoEmpresa(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("contratos_empresa").delete().eq("id", id)
  if (error) throw error
}

// ── Métodos de pago (catálogo) ──────────────────────────────────────────────
export async function listMetodosPago() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("metodos_pago").select("id,nombre,creado_en").order("nombre")
  if (error) throw error
  return (data ?? []) as MetodoPago[]
}

/** Añade un método si no existe (idempotente por nombre). Devuelve el catálogo actualizado. */
export async function crearMetodoPago(nombre: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("metodos_pago").upsert({ nombre }, { onConflict: "nombre" })
  if (error) throw error
  return listMetodosPago()
}
