import "server-only"
import { getServiceClient } from "./db"

export type ContactoAliado = {
  id: string
  nombre: string
  rol: string | null
  empresa: string | null
  telefono: string | null
  email: string | null
  notas: string | null
  orden: number
  creado_en: string
}

const COLS = "id,nombre,rol,empresa,telefono,email,notas,orden,creado_en"

export async function listContactos(): Promise<ContactoAliado[]> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contactos_aliados").select(COLS).order("orden").order("nombre")
  if (error) throw error
  return (data ?? []) as ContactoAliado[]
}

export type ContactoInput = Omit<ContactoAliado, "id" | "creado_en"> & { id?: string }

export async function upsertContacto(input: ContactoInput): Promise<ContactoAliado> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contactos_aliados").upsert(input).select(COLS).single()
  if (error) throw error
  return data as ContactoAliado
}

export async function eliminarContacto(id: string): Promise<void> {
  const sb = getServiceClient()
  const { error } = await sb.from("contactos_aliados").delete().eq("id", id)
  if (error) throw error
}
