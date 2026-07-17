import "server-only"
import { getServiceClient } from "./db"

export type FechaEspecial = {
  id: string
  titulo: string
  fecha: string // YYYY-MM-DD
  recurrente: boolean
  nota: string | null
  creado_en: string
}

const COLS = "id,titulo,fecha,recurrente,nota,creado_en"

export async function listFechasEspeciales(): Promise<FechaEspecial[]> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("fechas_especiales").select(COLS).order("fecha")
  if (error) throw error
  return (data ?? []) as FechaEspecial[]
}

export async function crearFechaEspecial(f: { titulo: string; fecha: string; recurrente: boolean; nota: string | null }): Promise<FechaEspecial> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("fechas_especiales").insert(f).select(COLS).single()
  if (error) throw error
  return data as FechaEspecial
}

export async function eliminarFechaEspecial(id: string): Promise<void> {
  const sb = getServiceClient()
  const { error } = await sb.from("fechas_especiales").delete().eq("id", id)
  if (error) throw error
}
