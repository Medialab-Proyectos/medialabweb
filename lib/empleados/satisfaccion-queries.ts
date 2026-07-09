import "server-only"
import { getServiceClient } from "./db"
import type { Satisfaccion, OrigenSatisfaccion } from "./satisfaccion"

const COLS = "id,origen,empleado_id,empresa,periodo,puntaje,recomendacion,comentario,creado_por,creado_en"

export async function getRespuestaEmpleado(empleadoId: string, periodo: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("satisfaccion").select(COLS).eq("origen", "empleado").eq("empleado_id", empleadoId).eq("periodo", periodo).maybeSingle()
  if (error) throw error
  return data as Satisfaccion | null
}

export async function upsertRespuestaEmpleado(input: { empleado_id: string; periodo: string; puntaje: number; recomendacion: number | null; comentario: string | null }) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("satisfaccion").upsert(
    { origen: "empleado", ...input },
    { onConflict: "empleado_id,periodo" },
  ).select(COLS).single()
  if (error) throw error
  return data as Satisfaccion
}

export async function crearSatisfaccionEmpresa(input: { empresa: string; periodo: string; puntaje: number; comentario: string | null; creado_por: string | null }) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("satisfaccion").insert({ origen: "empresa", ...input }).select(COLS).single()
  if (error) throw error
  return data as Satisfaccion
}

export async function listSatisfaccion(origen?: OrigenSatisfaccion) {
  const sb = getServiceClient()
  let q = sb.from("satisfaccion").select(COLS).order("creado_en", { ascending: false })
  if (origen) q = q.eq("origen", origen)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Satisfaccion[]
}

export async function eliminarSatisfaccion(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("satisfaccion").delete().eq("id", id)
  if (error) throw error
}

/** Promedio de puntaje (0..100) de un origen en un periodo (o el más reciente si no se indica). null si no hay datos. */
export async function promedioSatisfaccion(origen: OrigenSatisfaccion, periodo?: string): Promise<number | null> {
  const sb = getServiceClient()
  let q = sb.from("satisfaccion").select("puntaje,periodo").eq("origen", origen)
  if (periodo) q = q.eq("periodo", periodo)
  const { data, error } = await q
  if (error) throw error
  const filas = (data ?? []) as { puntaje: number; periodo: string }[]
  if (filas.length === 0) return null
  // Sin periodo: usa el periodo más reciente presente.
  const usar = periodo ?? filas.map((f) => f.periodo).sort().at(-1)
  const rel = filas.filter((f) => f.periodo === usar)
  if (rel.length === 0) return null
  return Math.round(rel.reduce((a, f) => a + (Number(f.puntaje) || 0), 0) / rel.length)
}
