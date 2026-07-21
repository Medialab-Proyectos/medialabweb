import "server-only"
import { getServiceClient } from "./db"
import type { Empleado, Rol, EstadoEmpleado, TipoVinculacion, FreelanceModo } from "./types"

const COLS =
  "id,cedula,nombre,email,email_empresarial,must_change_password,rol,lider_id,cargo,caja_compensacion,telefono,direccion,fecha_nacimiento,eps,fondo_cesantias,fondo_pension,cert_eps_path,cert_cesantias_path,cert_pension_path,fecha_ingreso,fecha_egreso,particularidades,estado,tipo_vinculacion,tipo_contrato,convenio_path,fecha_fin_probable,freelance_modo,freelance_tarifa,freelance_moneda,freelance_meses,creado_en,actualizado_en"
// Columnas de fase 42 (nda/horario_habilitado): se leen con fallback por si la migración no está.
const COLS_EXT = `${COLS},nda_path,nda_firmado_en,horario_habilitado,suspension_motivo,suspension_hasta,suspension_carta_path`

/** Select resiliente: intenta con las columnas de fase 42; si no existen, cae a COLS. */
async function selectEmpleados(build: (cols: string) => PromiseLike<{ data: unknown; error: unknown }>) {
  let r = await build(COLS_EXT)
  if (r.error) r = await build(COLS)
  return r
}

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
  const { data, error } = await selectEmpleados((cols) => sb.from("empleados").select(cols).eq("id", id).maybeSingle())
  if (error) throw error
  return data as Empleado | null
}

export async function listEmpleados() {
  const sb = getServiceClient()
  const { data, error } = await selectEmpleados((cols) => sb.from("empleados").select(cols).order("nombre"))
  if (error) throw error
  return (data ?? []) as Empleado[]
}

/** Empleados a cargo de un líder (para su evaluación / equipo). */
export async function listReportes(liderId: string) {
  const sb = getServiceClient()
  const { data, error } = await selectEmpleados((cols) => sb.from("empleados").select(cols).eq("lider_id", liderId).order("nombre"))
  if (error) throw error
  return (data ?? []) as Empleado[]
}

export type NuevoEmpleado = {
  cedula: string
  nombre: string
  email: string
  email_empresarial?: string | null
  password_hash: string
  rol: Rol
  lider_id: string | null
  cargo: string | null
  caja_compensacion: string | null
  telefono?: string | null
  direccion?: string | null
  fecha_nacimiento?: string | null
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
  email_empresarial: string | null
  rol: Rol
  lider_id: string | null
  cargo: string | null
  caja_compensacion: string | null
  telefono: string | null
  direccion: string | null
  fecha_nacimiento: string | null
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
  freelance_meses: number | null
  horario_habilitado: boolean
  nda_path: string | null
  nda_firmado_en: string | null
  suspension_motivo: string | null
  suspension_hasta: string | null
  suspension_carta_path: string | null
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

// ── Certificados de afiliación (EPS, cesantías, pensión) ───────────────────────
export type TipoCertificado = "eps" | "cesantias" | "pension"
const CERT_COL: Record<TipoCertificado, "cert_eps_path" | "cert_cesantias_path" | "cert_pension_path"> = {
  eps: "cert_eps_path", cesantias: "cert_cesantias_path", pension: "cert_pension_path",
}

export async function subirCertificadoEmpleado(empleadoId: string, tipo: TipoCertificado, bytes: Uint8Array, mime: string) {
  const sb = getServiceClient()
  const ext = mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : mime.includes("jpeg") ? "jpg" : "bin"
  const path = `certificados/${empleadoId}-${tipo}.${ext}`
  const { error: upErr } = await sb.storage.from(BUCKET_CONVENIO).upload(path, bytes, { contentType: mime, upsert: true })
  if (upErr) throw upErr
  const { data, error } = await sb.from("empleados").update({ [CERT_COL[tipo]]: path }).eq("id", empleadoId).select(COLS).single()
  if (error) throw error
  return data as Empleado
}

export async function getCertificadoEmpleado(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET_CONVENIO).download(path)
  if (error) throw error
  return { bytes: new Uint8Array(await data.arrayBuffer()), mime: data.type || "application/octet-stream" }
}

// ── Configuración de empresa (fila única) ─────────────────────────────────────
export type ConfigEmpresa = { caja_compensacion: string | null; arl: string | null; fecha_fundacion: string | null; encuesta_habilitada?: boolean; evaluaciones_habilitadas?: boolean }
const CONFIG_COLS = "caja_compensacion,arl,fecha_fundacion,encuesta_habilitada,evaluaciones_habilitadas"
// Columnas que agregan migraciones POSTERIORES a fase19 (pueden faltar): arl (fase24),
// fecha_fundacion (fase35), encuesta_habilitada (fase42), evaluaciones_habilitadas (fase43).
const CONFIG_COLS_OPCIONALES = ["evaluaciones_habilitadas", "encuesta_habilitada", "fecha_fundacion", "arl"]

const quitarCol = (cols: string, bad: string) => cols.split(",").map((c) => c.trim()).filter((c) => c !== bad).join(",")
const colFaltante = (e: unknown) => {
  const msg = String((e as { message?: string })?.message ?? "")
  return /column|schema cache|does not exist|find the/i.test(msg) ? (CONFIG_COLS_OPCIONALES.find((c) => msg.includes(c)) ?? null) : null
}

export async function getConfigEmpresa(): Promise<ConfigEmpresa> {
  const sb = getServiceClient()
  const def: ConfigEmpresa = { caja_compensacion: null, arl: null, fecha_fundacion: null, encuesta_habilitada: false, evaluaciones_habilitadas: false }
  // Va quitando columnas opcionales que aún no existen (migraciones fase24/35/42 pendientes).
  let cols = CONFIG_COLS
  for (let i = 0; i <= CONFIG_COLS_OPCIONALES.length; i++) {
    const r = await sb.from("empresa_config").select(cols).eq("id", 1).maybeSingle()
    if (!r.error) return { ...def, ...(r.data as Partial<ConfigEmpresa> | null) }
    const bad = colFaltante(r.error)
    if (!bad) break
    cols = quitarCol(cols, bad)
  }
  return def
}

export async function setConfigEmpresa(cambios: Partial<ConfigEmpresa>) {
  const sb = getServiceClient()
  // Guarda lo que exista: si una columna opcional aún no está en la BD, la quita del payload y
  // del select y reintenta (así los datos base se guardan aunque falte una migración).
  let payload: Record<string, unknown> = { id: 1, ...cambios }
  let cols = CONFIG_COLS
  for (let i = 0; i <= CONFIG_COLS_OPCIONALES.length; i++) {
    const { data, error } = await sb.from("empresa_config").upsert(payload).select(cols).single()
    if (!error) return data as unknown as ConfigEmpresa
    const bad = colFaltante(error)
    if (!bad) throw error
    const { [bad]: _drop, ...rest } = payload
    void _drop
    payload = rest
    cols = quitarCol(cols, bad)
  }
  throw new Error("No se pudo guardar la configuración de empresa.")
}

export async function getConvenioEmpleado(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET_CONVENIO).download(path)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  return { bytes: buf, mime: data.type || "application/octet-stream" }
}
