import "server-only"
import { getServiceClient } from "./db"
import type { Empleado, Rol, EstadoEmpleado, TipoVinculacion, FreelanceModo } from "./types"

const COLS =
  "id,cedula,nombre,email,must_change_password,rol,lider_id,cargo,caja_compensacion,telefono,direccion,eps,fondo_cesantias,fondo_pension,fecha_ingreso,fecha_egreso,particularidades,estado,tipo_vinculacion,tipo_contrato,convenio_path,fecha_fin_probable,freelance_modo,freelance_tarifa,freelance_moneda,creado_en,actualizado_en"

export async function getEmpleadoByCedula(cedula: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("empleados")
    .select(`${COLS},password_hash`)
    .eq("cedula", cedula.trim())
    .maybeSingle()
  if (error) throw error
  return data as (Empleado & { password_hash: string }) | null
}

export async function getEmpleadoById(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empleados").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Empleado | null
}

export async function listEmpleados() {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empleados").select(COLS).order("nombre")
  if (error) throw error
  return (data ?? []) as Empleado[]
}

/** Empleados a cargo de un líder (para su evaluación / equipo). */
export async function listReportes(liderId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empleados").select(COLS).eq("lider_id", liderId).order("nombre")
  if (error) throw error
  return (data ?? []) as Empleado[]
}

export type NuevoEmpleado = {
  cedula: string
  nombre: string
  email: string
  password_hash: string
  rol: Rol
  lider_id: string | null
  cargo: string | null
  caja_compensacion: string | null
  telefono?: string | null
  direccion?: string | null
  eps?: string | null
  fondo_cesantias?: string | null
  fondo_pension?: string | null
  fecha_ingreso: string | null
  particularidades: string | null
  tipo_vinculacion?: TipoVinculacion
  tipo_contrato?: string | null
  freelance_modo?: FreelanceModo | null
  freelance_tarifa?: number | null
  freelance_moneda?: "COP" | "USD" | null
}

export async function crearEmpleado(e: NuevoEmpleado) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("empleados")
    .insert({ ...e, must_change_password: true, estado: "activo" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as Empleado
}

export type CambiosEmpleado = Partial<{
  nombre: string
  email: string
  rol: Rol
  lider_id: string | null
  cargo: string | null
  caja_compensacion: string | null
  telefono: string | null
  direccion: string | null
  eps: string | null
  fondo_cesantias: string | null
  fondo_pension: string | null
  fecha_ingreso: string | null
  fecha_egreso: string | null
  particularidades: string | null
  estado: EstadoEmpleado
  tipo_vinculacion: TipoVinculacion
  tipo_contrato: string | null
  fecha_fin_probable: string | null
  convenio_path: string | null
  freelance_modo: FreelanceModo | null
  freelance_tarifa: number | null
  freelance_moneda: "COP" | "USD" | null
  password_hash: string
  must_change_password: boolean
}>

export async function actualizarEmpleado(id: string, cambios: CambiosEmpleado) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empleados").update(cambios).eq("id", id).select(COLS).single()
  if (error) throw error
  return data as Empleado
}

// ── Convenio / contrato adjunto (bucket privado 'contratos') ──────────────────
const BUCKET_CONVENIO = "contratos"

export async function subirConvenioEmpleado(empleadoId: string, bytes: Uint8Array, mime: string) {
  const sb = getServiceClient()
  const ext = mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : mime.includes("jpeg") ? "jpg" : "bin"
  const path = `convenios/${empleadoId}.${ext}`
  const { error: upErr } = await sb.storage.from(BUCKET_CONVENIO).upload(path, bytes, { contentType: mime, upsert: true })
  if (upErr) throw upErr
  const { data, error } = await sb.from("empleados").update({ convenio_path: path }).eq("id", empleadoId).select(COLS).single()
  if (error) throw error
  return data as Empleado
}

// ── Configuración de empresa (fila única) ─────────────────────────────────────
export type ConfigEmpresa = { caja_compensacion: string | null }

export async function getConfigEmpresa(): Promise<ConfigEmpresa> {
  const sb = getServiceClient()
  const { data, error } = await sb.from("empresa_config").select("caja_compensacion").eq("id", 1).maybeSingle()
  if (error) throw error
  return (data as ConfigEmpresa) ?? { caja_compensacion: null }
}

export async function setConfigEmpresa(cambios: ConfigEmpresa) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("empresa_config")
    .upsert({ id: 1, ...cambios })
    .select("caja_compensacion")
    .single()
  if (error) throw error
  return data as ConfigEmpresa
}

export async function getConvenioEmpleado(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET_CONVENIO).download(path)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  return { bytes: buf, mime: data.type || "application/octet-stream" }
}
