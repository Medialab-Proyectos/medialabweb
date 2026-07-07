import "server-only"
import { getServiceClient } from "./db"
import type { RolFunciones } from "./roles-funciones"

const COLS = "id,nombre,funciones,orden,creado_en"

export async function listRolesFunciones() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("roles_funciones").select(COLS).order("orden").order("nombre")
  if (error) throw error
  return (data ?? []) as RolFunciones[]
}

export async function getRolFunciones(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("roles_funciones").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as RolFunciones | null
}

export type RolFuncionesInput = { id?: string; nombre: string; funciones: string[]; orden?: number }

export async function upsertRolFunciones(input: RolFuncionesInput) {
  const sb = getServiceClient()
  const row = { ...(input.id ? { id: input.id } : {}), nombre: input.nombre, funciones: input.funciones, orden: input.orden ?? 0 }
  const { data, error } = await sb.from("roles_funciones").upsert(row).select(COLS).single()
  if (error) throw error
  return data as RolFunciones
}

export async function eliminarRolFunciones(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("roles_funciones").delete().eq("id", id)
  if (error) throw error
}
