import "server-only"
import { getServiceClient } from "./db"
import type { Herramienta } from "./herramienta"

const COLS = "id,nombre,tipo,url,usuario,clave,indicaciones,activa,orden,creado_en,actualizado_en"

/** Todas las herramientas (para el CEO). */
export async function listHerramientas() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("herramientas").select(COLS).order("orden").order("nombre")
  if (error) throw error
  return (data ?? []) as Herramienta[]
}

/** Herramientas activas (para los empleados). */
export async function listHerramientasActivas() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("herramientas").select(COLS).eq("activa", true).order("orden").order("nombre")
  if (error) throw error
  return (data ?? []) as Herramienta[]
}

export async function getHerramienta(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("herramientas").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Herramienta | null
}

export type HerramientaInput = Omit<Herramienta, "id" | "creado_en" | "actualizado_en"> & { id?: string }

export async function upsertHerramienta(input: HerramientaInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("herramientas").upsert(input).select(COLS).single()
  if (error) throw error
  return data as Herramienta
}

export async function eliminarHerramienta(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("herramientas").delete().eq("id", id)
  if (error) throw error
}
