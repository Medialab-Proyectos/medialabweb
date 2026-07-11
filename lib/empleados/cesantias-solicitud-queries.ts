import "server-only"
import { getServiceClient } from "./db"
import type { SolicitudCesantias, CausalCesantias, EstadoSolicitudCesantias } from "./cesantias-solicitud"

const COLS = "id,empleado_id,causal,valor,detalle,estado,aprobado_por,comentario,creado_en,decidido_en"

export async function listSolicitudesCesantias(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("solicitudes_cesantias")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as SolicitudCesantias[]
}

export type SolicitudCesantiasConEmpleado = SolicitudCesantias & {
  empleado: { nombre: string; cedula: string } | null
}

export async function listSolicitudesCesantiasDeEmpleados(ids: string[], soloPendientes = false) {
  if (ids.length === 0) return []
  const sb = getServiceClient()
  let q = sb
    .from("solicitudes_cesantias")
    .select(`${COLS}, empleado:empleados!empleado_id(nombre,cedula)`)
    .in("empleado_id", ids)
  if (soloPendientes) q = q.eq("estado", "pendiente")
  const { data, error } = await q.order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as SolicitudCesantiasConEmpleado[]
}

export async function getSolicitudCesantias(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("solicitudes_cesantias").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as SolicitudCesantias | null
}

export type NuevaSolicitudCesantias = {
  empleado_id: string
  causal: CausalCesantias
  valor: number
  detalle: string | null
}

export async function crearSolicitudCesantias(input: NuevaSolicitudCesantias) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("solicitudes_cesantias")
    .insert({ ...input, estado: "pendiente" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as SolicitudCesantias
}

export async function decidirSolicitudCesantias(
  id: string,
  cambios: { estado: EstadoSolicitudCesantias; aprobado_por: string; comentario: string | null },
) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("solicitudes_cesantias")
    .update({ ...cambios, decidido_en: new Date().toISOString() })
    .eq("id", id)
    .select(COLS)
    .single()
  if (error) throw error
  return data as SolicitudCesantias
}

export async function eliminarSolicitudCesantias(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("solicitudes_cesantias").delete().eq("id", id)
  if (error) throw error
}
