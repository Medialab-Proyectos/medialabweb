import "server-only"
import { getServiceClient } from "./db"
import type { Horario, EstadoHorario } from "./horario"

export type HorarioRow = {
  id: string
  empleado_id: string
  horario: Horario
  horas_semana: number
  estado: EstadoHorario
  aprobado_por: string | null
  comentario: string | null
  creado_en: string
  decidido_en: string | null
}

const COLS = "id,empleado_id,horario,horas_semana,estado,aprobado_por,comentario,creado_en,decidido_en"

/** Horario VIGENTE del empleado = el más reciente con estado 'aprobado'. */
export async function getHorarioVigente(empleadoId: string): Promise<HorarioRow | null> {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horarios_empleado")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .eq("estado", "aprobado")
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return (data as HorarioRow | null) ?? null
}

/** Propuesta pendiente (si el empleado envió una y aún no la deciden). */
export async function getHorarioPendiente(empleadoId: string): Promise<HorarioRow | null> {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horarios_empleado")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .eq("estado", "pendiente")
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return (data as HorarioRow | null) ?? null
}

/** Envía un horario para aprobación: descarta pendientes previos y crea uno nuevo. */
export async function crearHorario(empleadoId: string, horario: Horario, horasSemana: number): Promise<HorarioRow> {
  const sb = getServiceClient()
  await sb.from("horarios_empleado").delete().eq("empleado_id", empleadoId).eq("estado", "pendiente")
  const { data, error } = await sb
    .from("horarios_empleado")
    .insert({ empleado_id: empleadoId, horario, horas_semana: horasSemana, estado: "pendiente" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as HorarioRow
}

export async function getHorarioRow(id: string): Promise<HorarioRow | null> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("horarios_empleado").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return (data as HorarioRow | null) ?? null
}

export async function decidirHorario(id: string, cambios: { estado: EstadoHorario; aprobado_por: string; comentario: string | null }): Promise<HorarioRow> {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horarios_empleado")
    .update({ ...cambios, decidido_en: new Date().toISOString() })
    .eq("id", id)
    .select(COLS)
    .single()
  if (error) throw error
  return data as HorarioRow
}

export type HorarioConEmpleado = HorarioRow & { empleado: { nombre: string; cedula: string } | null }

/** Horarios de un conjunto de empleados (para el líder / CEO). */
export async function listHorariosDeEmpleados(ids: string[], soloPendientes = false): Promise<HorarioConEmpleado[]> {
  if (ids.length === 0) return []
  const sb = getServiceClient()
  let q = sb.from("horarios_empleado").select(`${COLS}, empleado:empleados!empleado_id(nombre,cedula)`).in("empleado_id", ids)
  if (soloPendientes) q = q.eq("estado", "pendiente")
  const { data, error } = await q.order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as HorarioConEmpleado[]
}

/** Mapa empleado_id → horario VIGENTE (para el panel "quién está activo ahora"). */
export async function getHorariosVigentesMap(): Promise<Map<string, Horario>> {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horarios_empleado")
    .select("empleado_id,horario,creado_en,estado")
    .eq("estado", "aprobado")
    .order("creado_en", { ascending: false })
  if (error) throw error
  const map = new Map<string, Horario>()
  for (const r of (data ?? []) as { empleado_id: string; horario: Horario }[]) {
    if (!map.has(r.empleado_id)) map.set(r.empleado_id, r.horario) // el primero = más reciente
  }
  return map
}

/** Nº de horarios pendientes de aprobar (global) — alerta del CEO. */
export async function contarHorariosPendientes(): Promise<number> {
  const sb = getServiceClient()
  const { count, error } = await sb.from("horarios_empleado").select("id", { count: "exact", head: true }).eq("estado", "pendiente")
  if (error) throw error
  return count ?? 0
}
