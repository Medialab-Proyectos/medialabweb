import "server-only"
import { getServiceClient } from "./db"
import type { Cuenta, Movimiento, Empresa, MetodoPago, ContratoEmpresa, GastoRecurrente, Inversion } from "./contabilidad"

const CUENTA_COLS = "id,nombre,banco,numero_cuenta,plataforma,moneda,saldo_inicial,activa,orden,creado_en,actualizado_en"
const MOV_BASE =
  "id,cuenta_id,cuenta_destino_id,fecha,tipo,categoria,concepto,contraparte,empresa_id,empleado_id,valor,tasa,costo,valor_destino,iva_tipo,iva_valor,estado,referencia,creado_por,creado_en,actualizado_en"
// fecha_estimada / tasa_real / valor_real / moneda llegan en fase43 (resiliente si aún no está).
const MOV_COLS = `${MOV_BASE},fecha_estimada,tasa_real,valor_real,moneda`
const faltaMovFase43 = (e: unknown) =>
  /fecha_estimada|tasa_real|valor_real|moneda|column|schema cache|find the/i.test(String((e as { message?: string })?.message ?? ""))

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
  const q = (cols: string) => sb
    .from("movimientos")
    .select(cols)
    .order("fecha", { ascending: false })
    .order("creado_en", { ascending: false })
  let data: unknown = null
  let error: unknown = null
  ;({ data, error } = await q(MOV_COLS))
  if (error && faltaMovFase43(error)) ({ data, error } = await q(MOV_BASE))
  if (error) throw error
  return ((data ?? []) as Movimiento[])
}

/** Conteo de movimientos pendientes (por pagar = egresos, por cobrar = ingresos) — panel del CEO. */
export async function contarPendientesFlujo(): Promise<{ porPagar: number; porCobrar: number }> {
  const sb = getServiceClient()
  const [pagar, cobrar] = await Promise.all([
    sb.from("movimientos").select("id", { count: "exact", head: true }).eq("estado", "pendiente").eq("tipo", "egreso"),
    sb.from("movimientos").select("id", { count: "exact", head: true }).eq("estado", "pendiente").eq("tipo", "ingreso"),
  ])
  if (pagar.error) throw pagar.error
  if (cobrar.error) throw cobrar.error
  return { porPagar: pagar.count ?? 0, porCobrar: cobrar.count ?? 0 }
}

export async function getMovimiento(id: string) {
  const sb = getServiceClient()
  let data: unknown = null
  let error: unknown = null
  ;({ data, error } = await sb.from("movimientos").select(MOV_COLS).eq("id", id).maybeSingle())
  if (error && faltaMovFase43(error)) ({ data, error } = await sb.from("movimientos").select(MOV_BASE).eq("id", id).maybeSingle())
  if (error) throw error
  return data as Movimiento | null
}

export type MovimientoInput = Omit<Movimiento, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertMovimiento(input: MovimientoInput) {
  const sb = getServiceClient()
  let data: unknown = null
  let error: unknown = null
  ;({ data, error } = await sb.from("movimientos").upsert(input).select(MOV_COLS).single())
  if (error && faltaMovFase43(error)) {
    const { fecha_estimada: _f, tasa_real: _t, valor_real: _v, moneda: _mo, ...base } = input as Record<string, unknown>
    void _mo
    void _f; void _t; void _v
    ;({ data, error } = await sb.from("movimientos").upsert(base).select(MOV_BASE).single())
  }
  if (error) throw error
  return data as Movimiento
}

export async function eliminarMovimiento(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("movimientos").delete().eq("id", id)
  if (error) throw error
}

/**
 * Anula (elimina) el egreso de liquidación registrado para un empleado. Se usa al reliquidar:
 * borra el movimiento de contabilidad que se creó al generar. Devuelve cuántos borró y si
 * alguno ya estaba pagado (realizado) para avisar al CEO.
 */
export async function anularEgresoLiquidacion(empleadoId: string): Promise<{ borrados: number; habiaPagado: boolean }> {
  const sb = getServiceClient()
  const { data: movs, error } = await sb
    .from("movimientos")
    .select("id,estado")
    .eq("empleado_id", empleadoId)
    .eq("categoria", "liquidacion")
    .eq("tipo", "egreso")
  if (error) throw error
  const lista = (movs ?? []) as { id: string; estado: string }[]
  if (lista.length === 0) return { borrados: 0, habiaPagado: false }
  const habiaPagado = lista.some((m) => m.estado === "realizado")
  const { error: delErr } = await sb.from("movimientos").delete().in("id", lista.map((m) => m.id))
  if (delErr) throw delErr
  return { borrados: lista.length, habiaPagado }
}

// ── Gastos recurrentes (catálogo) ─────────────────────────────────────────────
const GASTO_BASE = "id,nombre,categoria,proveedor,moneda,valor,cuenta_id,activo,orden,creado_en"
// dia_cobro y debito_automatico llegan en fase43: si aún no existen, se cae a las base.
const GASTO_COLS = `${GASTO_BASE},dia_cobro,debito_automatico`
const faltaFase43 = (e: unknown) => /dia_cobro|debito_automatico|column|schema cache|find the/i.test(String((e as { message?: string })?.message ?? ""))

export async function listGastosRecurrentes() {
  const sb = getServiceClient()
  let data: unknown = null
  let error: unknown = null
  ;({ data, error } = await sb.from("gastos_recurrentes").select(GASTO_COLS).order("orden").order("nombre"))
  if (error && faltaFase43(error)) {
    ;({ data, error } = await sb.from("gastos_recurrentes").select(GASTO_BASE).order("orden").order("nombre"))
  }
  if (error) throw error
  return ((data ?? []) as GastoRecurrente[])
}

export type GastoRecurrenteInput = Omit<GastoRecurrente, "id" | "creado_en"> & { id?: string }

export async function upsertGastoRecurrente(input: GastoRecurrenteInput) {
  const sb = getServiceClient()
  let { data, error } = await sb.from("gastos_recurrentes").upsert(input).select(GASTO_COLS).single()
  if (error && faltaFase43(error)) {
    const { dia_cobro: _d, debito_automatico: _b, ...base } = input as Record<string, unknown>
    void _d; void _b
    ;({ data, error } = await sb.from("gastos_recurrentes").upsert(base).select(GASTO_BASE).single())
  }
  if (error) throw error
  return data as unknown as GastoRecurrente
}

export async function eliminarGastoRecurrente(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("gastos_recurrentes").delete().eq("id", id)
  if (error) throw error
}

// ── Empresas ────────────────────────────────────────────────────────────────
const EMPRESA_COLS = "id,nombre,nit,correo,pais,telefono,direccion,ciudad,creado_en,actualizado_en"
const CONTRATO_EMPRESA_COLS = "id,empresa_id,nombre,modo,tarifa,moneda,activo,requiere_cuenta_cobro,notas,creado_en,actualizado_en"

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

// ── Inversiones (CDTs u otras) ────────────────────────────────────────────────
const INVERSION_COLS =
  "id,entidad,tipo,monto,moneda,tasa,rendimiento_esperado,rendimiento_real,fecha_apertura,fecha_vencimiento,cuenta_id,estado,notas,creado_por,creado_en,actualizado_en"

export async function listInversiones() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("inversiones").select(INVERSION_COLS).order("fecha_vencimiento", { ascending: true, nullsFirst: false }).order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as Inversion[]
}

export type InversionInput = Omit<Inversion, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertInversion(input: InversionInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("inversiones").upsert(input).select(INVERSION_COLS).single()
  if (error) throw error
  return data as Inversion
}

export async function eliminarInversion(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("inversiones").delete().eq("id", id)
  if (error) throw error
}

/** Nº de inversiones abiertas que vencen en los próximos `dias` días — alerta del CEO. */
export async function contarInversionesPorVencer(dias = 15) {
  const sb = getServiceClient()
  const limite = new Date(Date.now() + dias * 86_400_000).toISOString().slice(0, 10)
  const { count, error } = await sb
    .from("inversiones")
    .select("id", { count: "exact", head: true })
    .eq("estado", "abierta")
    .not("fecha_vencimiento", "is", null)
    .lte("fecha_vencimiento", limite)
  if (error) throw error
  return count ?? 0
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
