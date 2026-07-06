import "server-only"
import { getServiceClient } from "./db"
import type { Beneficio, TipoBeneficio, EstadoBeneficio } from "./beneficio"

const COLS = "id,empleado_id,tipo,estado,proveedor,datos,observaciones,creado_en,actualizado_en"

/** Beneficios (activaciones) de un empleado. */
export async function listBeneficiosEmpleado(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("beneficios")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as Beneficio[]
}

export type BeneficioConEmpleado = Beneficio & {
  empleado: { nombre: string; cedula: string } | null
}

/** Todos los beneficios (para el CEO), con el empleado embebido. */
export async function listBeneficios() {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("beneficios")
    .select(`${COLS}, empleado:empleados!empleado_id(nombre,cedula)`)
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as BeneficioConEmpleado[]
}

export async function getBeneficio(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("beneficios").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Beneficio | null
}

/**
 * El empleado solicita la activación de un beneficio. Idempotente por
 * (empleado, tipo): si ya existe, no lo degrada (no pisa un 'activo'), pero sí
 * actualiza los datos (plan, beneficiarios) si vienen.
 */
export async function solicitarBeneficio(
  empleadoId: string,
  tipo: TipoBeneficio,
  proveedor: string | null,
  datos?: Record<string, unknown>,
) {
  const sb = getServiceClient()
  const { data: existente } = await sb
    .from("beneficios")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .eq("tipo", tipo)
    .maybeSingle()
  if (existente) {
    const beneficio = existente as Beneficio
    // Si estaba inactivo, se reactiva como 'solicitado'; si no, conserva el estado.
    const patch: Record<string, unknown> = {}
    if (beneficio.estado === "inactivo") patch.estado = "solicitado"
    if (datos) patch.datos = datos
    if (proveedor && !beneficio.proveedor) patch.proveedor = proveedor
    if (Object.keys(patch).length === 0) return beneficio
    const { data, error } = await sb.from("beneficios").update(patch).eq("id", beneficio.id).select(COLS).single()
    if (error) throw error
    return data as Beneficio
  }
  const { data, error } = await sb
    .from("beneficios")
    .insert({ empleado_id: empleadoId, tipo, estado: "solicitado", proveedor, datos: datos ?? {} })
    .select(COLS)
    .single()
  if (error) throw error
  return data as Beneficio
}

/** El CEO cambia el estado de un beneficio (activarlo tras la afiliación, o darlo de baja). */
export async function setEstadoBeneficio(
  id: string,
  cambios: { estado: EstadoBeneficio; proveedor?: string | null; observaciones?: string | null },
) {
  const sb = getServiceClient()
  const patch: Record<string, unknown> = { estado: cambios.estado }
  if (cambios.proveedor !== undefined) patch.proveedor = cambios.proveedor
  if (cambios.observaciones !== undefined) patch.observaciones = cambios.observaciones
  const { data, error } = await sb.from("beneficios").update(patch).eq("id", id).select(COLS).single()
  if (error) throw error
  return data as Beneficio
}
