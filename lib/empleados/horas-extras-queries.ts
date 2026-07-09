import "server-only"
import { getServiceClient } from "./db"
import type { HoraExtra, TipoHoraExtra, EstadoHoraExtra } from "./horas-extras"

const COLS =
  "id,empleado_id,fecha,tipo,horas,valor_hora,valor,constitutivo_salario,motivo,estado,aprobado_por,comentario,pagada_en,creado_en,decidido_en"

/** Horas extra de un empleado (todas, más recientes primero). */
export async function listHorasExtras(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horas_extras")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .order("fecha", { ascending: false })
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as HoraExtra[]
}

/** Horas extra de un empleado dentro de un rango de fechas (para liquidación / promedios). */
export async function listHorasExtrasRango(empleadoId: string, desdeISO: string, hastaISO: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horas_extras")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .gte("fecha", desdeISO)
    .lte("fecha", hastaISO)
    .order("fecha", { ascending: false })
  if (error) throw error
  return (data ?? []) as HoraExtra[]
}

export type HoraExtraConEmpleado = HoraExtra & { empleado: { nombre: string; cedula: string } | null }

/** Horas extra de un conjunto de empleados (para el líder / CEO). */
export async function listHorasExtrasDeEmpleados(ids: string[], soloPendientes = false) {
  if (ids.length === 0) return []
  const sb = getServiceClient()
  let q = sb
    .from("horas_extras")
    // Desambiguar la FK: hay dos referencias a empleados (empleado_id y aprobado_por).
    .select(`${COLS}, empleado:empleados!empleado_id(nombre,cedula)`)
    .in("empleado_id", ids)
  if (soloPendientes) q = q.eq("estado", "pendiente")
  const { data, error } = await q.order("fecha", { ascending: false }).order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as HoraExtraConEmpleado[]
}

/** Nº de horas extra pendientes de aprobar (global) — alerta del CEO. */
export async function contarHorasExtrasPendientes() {
  const sb = getServiceClient()
  const { count, error } = await sb
    .from("horas_extras")
    .select("id", { count: "exact", head: true })
    .eq("estado", "pendiente")
  if (error) throw error
  return count ?? 0
}

export async function getHoraExtra(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("horas_extras").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as HoraExtra | null
}

export type NuevaHoraExtra = {
  empleado_id: string
  fecha: string
  tipo: TipoHoraExtra
  horas: number
  valor_hora: number
  valor: number
  motivo: string | null
}

export async function crearHoraExtra(input: NuevaHoraExtra) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horas_extras")
    .insert({ ...input, constitutivo_salario: true, estado: "pendiente" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as HoraExtra
}

export async function decidirHoraExtra(
  id: string,
  cambios: { estado: EstadoHoraExtra; aprobado_por: string; comentario: string | null },
) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("horas_extras")
    .update({ ...cambios, decidido_en: new Date().toISOString() })
    .eq("id", id)
    .select(COLS)
    .single()
  if (error) throw error
  return data as HoraExtra
}

/** El empleado puede borrar su reporte solo mientras siga pendiente. */
export async function eliminarHoraExtra(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("horas_extras").delete().eq("id", id)
  if (error) throw error
}

/** Marca como pagadas un conjunto de horas extra (al incluirlas en un desprendible/liquidación). */
export async function marcarHorasExtrasPagadas(ids: string[]) {
  if (ids.length === 0) return
  const sb = getServiceClient()
  const { error } = await sb
    .from("horas_extras")
    .update({ estado: "pagada", pagada_en: new Date().toISOString() })
    .in("id", ids)
  if (error) throw error
}
