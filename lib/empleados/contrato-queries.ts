import "server-only"
import { getServiceClient } from "./db"
import type { Contrato, PrimaDoc } from "./contrato"

const BUCKET = "contratos"

// ── Contratos ────────────────────────────────────────────────────────────────
const COLS =
  "id,empleado_id,tipo,vigente_desde,salario_basico,auxilio_transporte,otros_devengos,tipo_contrato,jornada,cargo,motivo,archivo_path,creado_por,creado_en"

/** Historial completo de condiciones de un empleado (más reciente primero). */
export async function listContratos(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("contratos")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .order("vigente_desde", { ascending: false })
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as Contrato[]
}

export async function getContrato(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contratos").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Contrato | null
}

export type ContratoInput = Omit<Contrato, "id" | "creado_en">

export async function crearContrato(input: ContratoInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contratos").insert(input).select(COLS).single()
  if (error) throw error
  return data as Contrato
}

export async function eliminarContrato(id: string) {
  const sb = getServiceClient()
  const actual = await getContrato(id)
  if (actual?.archivo_path) {
    await sb.storage.from(BUCKET).remove([actual.archivo_path]).catch(() => {})
  }
  const { error } = await sb.from("contratos").delete().eq("id", id)
  if (error) throw error
}

/** ¿El empleado ya tiene al menos una versión de contrato? */
export async function tieneContrato(empleadoId: string) {
  const sb = getServiceClient()
  const { count, error } = await sb
    .from("contratos")
    .select("id", { count: "exact", head: true })
    .eq("empleado_id", empleadoId)
  if (error) throw error
  return (count ?? 0) > 0
}

// ── Adjuntos (Supabase Storage, bucket privado 'contratos') ───────────────────
/** Sube el PDF del contrato/otrosí y guarda su ruta en la fila. Devuelve el contrato actualizado. */
export async function subirArchivoContrato(contrato: Contrato, bytes: Uint8Array, mime: string) {
  const sb = getServiceClient()
  const ext = mime.includes("pdf") ? "pdf" : "bin"
  const path = `${contrato.empleado_id}/${contrato.id}.${ext}`
  const { error: upErr } = await sb.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: mime, upsert: true })
  if (upErr) throw upErr
  const { data, error } = await sb
    .from("contratos")
    .update({ archivo_path: path })
    .eq("id", contrato.id)
    .select(COLS)
    .single()
  if (error) throw error
  return data as Contrato
}

/** Descarga el adjunto de un contrato (bytes + mime). */
export async function getArchivoContrato(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET).download(path)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  return { bytes: buf, mime: data.type || "application/pdf" }
}

// ── Primas ───────────────────────────────────────────────────────────────────
const PRIMA_COLS =
  "id,empleado_id,anio,semestre,dias,base,valor,observaciones,publicado,creado_en,actualizado_en"

export async function listPrimasEmpleado(empleadoId: string, soloPublicadas = true) {
  const sb = getServiceClient()
  let q = sb.from("primas").select(PRIMA_COLS).eq("empleado_id", empleadoId)
  if (soloPublicadas) q = q.eq("publicado", true)
  const { data, error } = await q.order("anio", { ascending: false }).order("semestre", { ascending: false })
  if (error) throw error
  return (data ?? []) as PrimaDoc[]
}

export async function getPrima(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("primas").select(PRIMA_COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as PrimaDoc | null
}

export type PrimaInput = Omit<PrimaDoc, "id" | "creado_en" | "actualizado_en">

/** Crea o actualiza la prima de un empleado para un (año, semestre). */
export async function upsertPrima(input: PrimaInput) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("primas")
    .upsert(input, { onConflict: "empleado_id,anio,semestre" })
    .select(PRIMA_COLS)
    .single()
  if (error) throw error
  return data as PrimaDoc
}

export async function eliminarPrima(id: string) {
  const sb = getServiceClient()
  const { error } = await sb.from("primas").delete().eq("id", id)
  if (error) throw error
}
