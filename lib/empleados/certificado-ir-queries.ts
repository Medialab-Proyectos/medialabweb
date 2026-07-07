import "server-only"
import { getServiceClient } from "./db"
import type { CertificadoIR, CertificadoIRConEmpleado } from "./certificado-ir"

const BUCKET = "contratos" // se reutiliza el bucket privado de contratos
const COLS = "id,empleado_id,anio,archivo_path,publicado,creado_en,actualizado_en"

/** Certificados de un empleado (para su portal: solo los publicados). */
export async function listCertificadosIREmpleado(empleadoId: string, soloPublicados = true) {
  const sb = getServiceClient()
  let q = sb.from("certificados_ir").select(COLS).eq("empleado_id", empleadoId)
  if (soloPublicados) q = q.eq("publicado", true)
  const { data, error } = await q.order("anio", { ascending: false })
  if (error) throw error
  return (data ?? []) as CertificadoIR[]
}

/** Todos los certificados (para el CEO), con el empleado embebido. */
export async function listCertificadosIR() {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("certificados_ir")
    .select(`${COLS}, empleado:empleados!empleado_id(nombre,cedula)`)
    .order("anio", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as CertificadoIRConEmpleado[]
}

export async function getCertificadoIR(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("certificados_ir").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as CertificadoIR | null
}

/** Crea/actualiza el certificado de un empleado para un año (unique empleado+año). */
export async function upsertCertificadoIR(input: { empleado_id: string; anio: number; publicado?: boolean }) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("certificados_ir")
    .upsert({ empleado_id: input.empleado_id, anio: input.anio, ...(input.publicado !== undefined ? { publicado: input.publicado } : {}) }, { onConflict: "empleado_id,anio" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as CertificadoIR
}

export async function setPublicadoCertificadoIR(id: string, publicado: boolean) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("certificados_ir").update({ publicado }).eq("id", id).select(COLS).single()
  if (error) throw error
  return data as CertificadoIR
}

export async function eliminarCertificadoIR(id: string) {
  const sb = getServiceClient()
  const actual = await getCertificadoIR(id)
  if (actual?.archivo_path) await sb.storage.from(BUCKET).remove([actual.archivo_path]).catch(() => {})
  const { error } = await sb.from("certificados_ir").delete().eq("id", id)
  if (error) throw error
}

/** Sube el PDF del certificado y guarda su ruta. */
export async function subirArchivoIR(cert: CertificadoIR, bytes: Uint8Array, mime: string) {
  const sb = getServiceClient()
  const path = `ingresos-retenciones/${cert.empleado_id}/${cert.anio}.pdf`
  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, { contentType: mime || "application/pdf", upsert: true })
  if (upErr) throw upErr
  const { data, error } = await sb.from("certificados_ir").update({ archivo_path: path }).eq("id", cert.id).select(COLS).single()
  if (error) throw error
  return data as CertificadoIR
}

export async function getArchivoIR(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET).download(path)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  return { bytes: buf, mime: data.type || "application/pdf" }
}
