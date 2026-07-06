import "server-only"
import { getServiceClient } from "./db"
import type { FacturaFreelance, PerfilFreelance } from "./freelance"

const BUCKET = "facturas"

const PERFIL_COLS = "empleado_id,moneda,banco,cuenta,tipo_cuenta,titular,documento,notas,actualizado_en"
const FACT_COLS =
  "id,empleado_id,anio,mes,numero,concepto,moneda,valor,banco,cuenta,tipo_cuenta,titular,archivo_path,firmado,firmante,firmado_en,estado,pagado_en,observaciones,creado_en,actualizado_en"

// ── Perfil de pago ────────────────────────────────────────────────────────────
export async function getPerfilFreelance(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("freelance_perfil").select(PERFIL_COLS).eq("empleado_id", empleadoId).maybeSingle()
  if (error) throw error
  return data as PerfilFreelance | null
}

export type PerfilInput = Omit<PerfilFreelance, "actualizado_en">

export async function upsertPerfilFreelance(input: PerfilInput) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("freelance_perfil")
    .upsert(input, { onConflict: "empleado_id" })
    .select(PERFIL_COLS)
    .single()
  if (error) throw error
  return data as PerfilFreelance
}

// ── Facturas ──────────────────────────────────────────────────────────────────
export async function listFacturasEmpleado(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("freelance_facturas")
    .select(FACT_COLS)
    .eq("empleado_id", empleadoId)
    .order("anio", { ascending: false })
    .order("mes", { ascending: false })
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as FacturaFreelance[]
}

export type FacturaConEmpleado = FacturaFreelance & { empleado: { nombre: string; cedula: string } | null }

/** Todas las facturas (para el CEO), con el empleado embebido. */
export async function listFacturas() {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("freelance_facturas")
    .select(`${FACT_COLS}, empleado:empleados!empleado_id(nombre,cedula)`)
    .order("creado_en", { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as FacturaConEmpleado[]
}

export async function getFactura(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("freelance_facturas").select(FACT_COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as FacturaFreelance | null
}

export type FacturaInput = Omit<
  FacturaFreelance,
  "id" | "archivo_path" | "estado" | "pagado_en" | "observaciones" | "creado_en" | "actualizado_en"
>

export async function crearFactura(input: FacturaInput) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("freelance_facturas").insert({ ...input, estado: "enviada" }).select(FACT_COLS).single()
  if (error) throw error
  return data as FacturaFreelance
}

/** El CEO cambia el estado (pagada / rechazada / vuelve a enviada). */
export async function setEstadoFactura(
  id: string,
  cambios: { estado: FacturaFreelance["estado"]; observaciones?: string | null },
) {
  const sb = getServiceClient()
  const patch: Record<string, unknown> = { estado: cambios.estado }
  patch.pagado_en = cambios.estado === "pagada" ? new Date().toISOString() : null
  if (cambios.observaciones !== undefined) patch.observaciones = cambios.observaciones
  const { data, error } = await sb.from("freelance_facturas").update(patch).eq("id", id).select(FACT_COLS).single()
  if (error) throw error
  return data as FacturaFreelance
}

// ── Adjunto (bucket privado 'facturas') ───────────────────────────────────────
export async function subirArchivoFactura(f: FacturaFreelance, bytes: Uint8Array, mime: string) {
  const sb = getServiceClient()
  const ext = mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : mime.includes("jpeg") ? "jpg" : "bin"
  const path = `${f.empleado_id}/${f.id}.${ext}`
  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, { contentType: mime, upsert: true })
  if (upErr) throw upErr
  const { data, error } = await sb.from("freelance_facturas").update({ archivo_path: path }).eq("id", f.id).select(FACT_COLS).single()
  if (error) throw error
  return data as FacturaFreelance
}

export async function getArchivoFactura(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET).download(path)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  return { bytes: buf, mime: data.type || "application/octet-stream" }
}
