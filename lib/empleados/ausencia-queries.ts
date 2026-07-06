import "server-only"
import { getServiceClient } from "./db"
import type { SolicitudAusencia, TipoAusencia, EstadoAusencia } from "./ausencia"

const COLS =
  "id,empleado_id,tipo,fecha_inicio,fecha_fin,dias_habiles,dias_calendario,motivo,estado,aprobado_por,comentario,creado_en,decidido_en"

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
  let q = sb
    .from("solicitudes_ausencia")
    // Desambiguar la FK: solicitudes_ausencia tiene dos referencias a empleados
    // (empleado_id y aprobado_por); sin el hint el embed es ambiguo y falla.
    .select(`${COLS}, empleado:empleados!empleado_id(nombre,cedula)`)
    .in("empleado_id", ids)
  if (soloPendientes) q = q.eq("estado", "pendiente")
  const { data, error } = await q.order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as SolicitudConEmpleado[]
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
}

export async function crearSolicitud(input: NuevaSolicitud) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("solicitudes_ausencia")
    .insert({ ...input, estado: "pendiente" })
    .select(COLS)
    .single()
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
