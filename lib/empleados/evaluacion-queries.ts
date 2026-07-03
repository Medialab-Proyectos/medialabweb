import "server-only"
import { getServiceClient } from "./db"
import type { Evaluacion, EstadoEvaluacion, Puntajes } from "./evaluacion"

const COLS =
  "id,evaluado_id,evaluador_id,periodo,estado,puntajes,puntos_mejora,puntos_criticos,comentarios,creado_en,completado_en"

export type EvaluacionConNombre = Evaluacion & {
  evaluado?: { nombre: string; cedula: string } | null
  evaluador?: { nombre: string } | null
}

/** Evaluaciones RECIBIDAS por un empleado (con el nombre de quien evaluó). */
export async function listRecibidas(evaluadoId: string, soloCompletadas = true) {
  const sb = getServiceClient()
  let q = sb
    .from("evaluaciones")
    .select(`${COLS}, evaluador:empleados!evaluador_id(nombre)`)
    .eq("evaluado_id", evaluadoId)
  if (soloCompletadas) q = q.eq("estado", "completada")
  const { data, error } = await q.order("periodo", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as EvaluacionConNombre[]
}

/** Evaluaciones HECHAS por un evaluador en un período (con el nombre del evaluado). */
export async function listHechas(evaluadorId: string, periodo: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("evaluaciones")
    .select(`${COLS}, evaluado:empleados!evaluado_id(nombre,cedula)`)
    .eq("evaluador_id", evaluadorId)
    .eq("periodo", periodo)
  if (error) throw error
  return (data ?? []) as unknown as EvaluacionConNombre[]
}

export async function getEvaluacion(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("evaluaciones").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Evaluacion | null
}

export type EvaluacionInput = {
  evaluado_id: string
  evaluador_id: string
  periodo: string
  estado: EstadoEvaluacion
  puntajes: Puntajes
  puntos_mejora: string | null
  puntos_criticos: string | null
  comentarios: string | null
  completado_en: string | null
}

export async function upsertEvaluacion(input: EvaluacionInput) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("evaluaciones")
    .upsert(input, { onConflict: "evaluado_id,evaluador_id,periodo" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as Evaluacion
}
