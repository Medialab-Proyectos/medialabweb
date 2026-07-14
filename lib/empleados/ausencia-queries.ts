import "server-only"
import { getServiceClient } from "./db"
import type { SolicitudAusencia, TipoAusencia, EstadoAusencia } from "./ausencia"

const COLS =
  "id,empleado_id,tipo,fecha_inicio,fecha_fin,dias_habiles,dias_calendario,motivo,estado,aprobado_por,comentario,creado_en,decidido_en"
// Columnas de permiso por horas (fase 42). Se leen con fallback por si la migración no está.
const COLS_HORAS = `${COLS},por_horas,hora_inicio,hora_fin`

export type EmpleadoVacacion = {
  id: string
  nombre: string
  cedula: string
  cargo: string | null
  lider_id: string | null
  fecha_ingreso: string | null
  vacaciones_saldo_inicial: number
  vacaciones_corte: string | null
}

export async function getEmpleadoVacacion(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("empleados")
    .select("id,nombre,cedula,cargo,lider_id,fecha_ingreso,vacaciones_saldo_inicial,vacaciones_corte")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  return data as EmpleadoVacacion | null
}

export async function listSolicitudes(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("solicitudes_ausencia")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as SolicitudAusencia[]
}

export type SolicitudConEmpleado = SolicitudAusencia & {
  empleado: { nombre: string; cedula: string } | null
}

/** Solicitudes de un conjunto de empleados (para el líder / CEO). */
export async function listSolicitudesDeEmpleados(ids: string[], soloPendientes = false) {
  if (ids.length === 0) return []
  const sb = getServiceClient()
  // Desambiguar la FK: solicitudes_ausencia tiene dos referencias a empleados
  // (empleado_id y aprobado_por); sin el hint el embed es ambiguo y falla.
  const run = (cols: string) => {
    let q = sb.from("solicitudes_ausencia").select(`${cols}, empleado:empleados!empleado_id(nombre,cedula)`).in("empleado_id", ids)
    if (soloPendientes) q = q.eq("estado", "pendiente")
    return q.order("creado_en", { ascending: false })
  }
  let { data, error } = await run(COLS_HORAS)
  if (error) ({ data, error } = await run(COLS)) // fallback si aún no está la migración fase 42
  if (error) throw error
  return (data ?? []) as unknown as SolicitudConEmpleado[]
}

/** Empleados ausentes HOY (ausencia aprobada que cubre la fecha de hoy) — para el panel del CEO. */
export async function listAusentesHoy(): Promise<{ nombre: string; tipo: TipoAusencia }[]> {
  const sb = getServiceClient()
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
  const { data, error } = await sb
    .from("solicitudes_ausencia")
    .select(`tipo, empleado:empleados!empleado_id(nombre)`)
    .eq("estado", "aprobada")
    .lte("fecha_inicio", hoy)
    .gte("fecha_fin", hoy)
  if (error) throw error
  const filas = (data ?? []) as unknown as { tipo: TipoAusencia; empleado: { nombre: string } | null }[]
  return filas.map((r) => ({ nombre: r.empleado?.nombre ?? "—", tipo: r.tipo }))
}

/** Nº de solicitudes de ausencia pendientes (global) — para alertas del CEO. */
export async function contarAusenciasPendientes() {
  const sb = getServiceClient()
  const { count, error } = await sb
    .from("solicitudes_ausencia")
    .select("id", { count: "exact", head: true })
    .eq("estado", "pendiente")
  if (error) throw error
  return count ?? 0
}

export async function getSolicitud(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("solicitudes_ausencia").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as SolicitudAusencia | null
}

export type NuevaSolicitud = {
  empleado_id: string
  tipo: TipoAusencia
  fecha_inicio: string
  fecha_fin: string
  dias_habiles: number
  dias_calendario: number
  motivo: string | null
  por_horas?: boolean
  hora_inicio?: string | null
  hora_fin?: string | null
}

export async function crearSolicitud(input: NuevaSolicitud) {
  const sb = getServiceClient()
  const { por_horas, hora_inicio, hora_fin, ...base } = input
  const row: Record<string, unknown> = { ...base, estado: "pendiente" }
  // Solo se escriben las columnas de fase 42 cuando es un permiso por horas.
  if (por_horas) { row.por_horas = true; row.hora_inicio = hora_inicio ?? null; row.hora_fin = hora_fin ?? null }
  const { data, error } = await sb.from("solicitudes_ausencia").insert(row).select(COLS).single()
  if (error) throw error
  return data as SolicitudAusencia
}

export async function decidirSolicitud(
  id: string,
  cambios: { estado: EstadoAusencia; aprobado_por: string; comentario: string | null },
) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("solicitudes_ausencia")
    .update({ ...cambios, decidido_en: new Date().toISOString() })
    .eq("id", id)
    .select(COLS)
    .single()
  if (error) throw error
  return data as SolicitudAusencia
}

/** El CEO define el saldo inicial (días pendientes del año anterior) y la fecha de corte. */
export async function actualizarSaldoVacaciones(empleadoId: string, saldoInicial: number, corte: string | null) {
  const sb = getServiceClient()
  const { error } = await sb
    .from("empleados")
    .update({ vacaciones_saldo_inicial: saldoInicial, vacaciones_corte: corte })
    .eq("id", empleadoId)
  if (error) throw error
}
