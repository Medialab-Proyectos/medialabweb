import "server-only"
import { getServiceClient } from "./db"
import type { Desprendible } from "./desprendible"

const COLS =
  "id,empleado_id,anio,mes,fecha_nomina,cargo,dias,salario_basico,fondo_pension,eps_salud,banco,cuenta,devengos,deducciones,base_salarial,base_pension,base_retencion,porc_retencion,dias_vac_pend,observaciones,publicado,creado_en,actualizado_en"

export async function listDesprendiblesEmpleado(empleadoId: string, soloPublicados = true) {
  const sb = getServiceClient()
  let q = sb.from("desprendibles").select(COLS).eq("empleado_id", empleadoId)
  if (soloPublicados) q = q.eq("publicado", true)
  const { data, error } = await q.order("anio", { ascending: false }).order("mes", { ascending: false })
  if (error) throw error
  return (data ?? []) as Desprendible[]
}

export async function listDesprendiblesMes(anio: number, mes: number) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("desprendibles").select(COLS).eq("anio", anio).eq("mes", mes)
  if (error) throw error
  return (data ?? []) as Desprendible[]
}

export async function getDesprendible(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("desprendibles").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Desprendible | null
}

export type DesprendibleInput = Omit<
  Desprendible,
  "id" | "creado_en" | "actualizado_en"
>

/** Crea o actualiza el desprendible de un empleado para un (año, mes). */
export async function upsertDesprendible(input: DesprendibleInput) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("desprendibles")
    .upsert(input, { onConflict: "empleado_id,anio,mes" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as Desprendible
}

export async function eliminarDesprendible(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("desprendibles").delete().eq("id", id)
  if (error) throw error
}
