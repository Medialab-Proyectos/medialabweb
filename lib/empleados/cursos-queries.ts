import "server-only"
import { getServiceClient } from "./db"

export type Curso = {
  id: string
  titulo: string
  descripcion: string | null
  plataforma: string | null
  url: string
  categoria: string | null
  activo: boolean
  orden: number
  creado_en: string
}

const COLS = "id,titulo,descripcion,plataforma,url,categoria,activo,orden,creado_en"

/** Cursos publicados (activos) para todo el equipo. */
export async function listCursosActivos(): Promise<Curso[]> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cursos").select(COLS).eq("activo", true).order("orden").order("titulo")
  if (error) throw error
  return (data ?? []) as Curso[]
}

/** Todos los cursos (activos e inactivos) — solo para la gestión del CEO. */
export async function listCursos(): Promise<Curso[]> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cursos").select(COLS).order("orden").order("titulo")
  if (error) throw error
  return (data ?? []) as Curso[]
}

export type CursoInput = Omit<Curso, "id" | "creado_en"> & { id?: string }

export async function upsertCurso(input: CursoInput): Promise<Curso> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cursos").upsert(input).select(COLS).single()
  if (error) throw error
  return data as Curso
}

export async function eliminarCurso(id: string): Promise<void> {
  const sb = getServiceClient()
  const { error } = await sb.from("cursos").delete().eq("id", id)
  if (error) throw error
}
