import "server-only"
import { getServiceClient } from "./db"

const BUCKET = "contratos"

/** Estado del NDA de un empleado (resiliente si la migración fase42 aún no está). */
export async function getNdaEstado(empleadoId: string): Promise<{ firmado: boolean; path: string | null; firmadoEn: string | null }> {
  const sb = getServiceClient()
  try {
    const { data, error } = await sb.from("empleados").select("nda_path,nda_firmado_en").eq("id", empleadoId).maybeSingle()
    if (error) throw error
    const r = data as { nda_path: string | null; nda_firmado_en: string | null } | null
    return { firmado: !!r?.nda_path, path: r?.nda_path ?? null, firmadoEn: r?.nda_firmado_en ?? null }
  } catch {
    return { firmado: false, path: null, firmadoEn: null } // columna aún no existe
  }
}

/** Sube el NDA firmado del empleado y marca la fecha de firma. */
export async function subirNdaFirmado(empleadoId: string, bytes: Uint8Array, mime: string): Promise<void> {
  const sb = getServiceClient()
  const ext = mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : mime.includes("jpeg") ? "jpg" : "bin"
  const path = `nda/${empleadoId}.${ext}`
  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, { contentType: mime, upsert: true })
  if (upErr) throw upErr
  const { error } = await sb.from("empleados").update({ nda_path: path, nda_firmado_en: new Date().toISOString() }).eq("id", empleadoId)
  if (error) throw error
}

/** Descarga el NDA firmado (bytes + mime). */
export async function getNdaFirmado(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET).download(path)
  if (error) throw error
  return { bytes: new Uint8Array(await data.arrayBuffer()), mime: data.type || "application/octet-stream" }
}
