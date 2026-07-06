import "server-only"
import { getServiceClient } from "./db"
import type { Liquidacion } from "./liquidacion"

// Reutilizamos el bucket privado 'contratos' (creado en la fase 3) para el adjunto
// de la carta de renuncia / certificado de finalización.
const BUCKET = "contratos"

const COLS =
  "id,empleado_id,tipo_terminacion,motivo,fecha_ingreso,fecha_egreso,salario_basico,auxilio_transporte,base,tipo_contrato,fecha_fin_contrato,cesantias_dias,cesantias,intereses_cesantias,prima_dias,prima,vacaciones_dias,vacaciones,indemnizacion_dias,indemnizacion,otros_conceptos,seguridad_social_pagada,seguridad_social_saldo,total,carta_path,observaciones,estado,generado_por,generado_en,creado_en,actualizado_en"

/** Liquidación de un empleado (hay como máximo una). */
export async function getLiquidacionDeEmpleado(empleadoId: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("liquidaciones")
    .select(COLS)
    .eq("empleado_id", empleadoId)
    .maybeSingle()
  if (error) throw error
  return data as Liquidacion | null
}

export async function getLiquidacion(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("liquidaciones").select(COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as Liquidacion | null
}

export type LiquidacionInput = Omit<
  Liquidacion,
  "id" | "carta_path" | "generado_por" | "generado_en" | "creado_en" | "actualizado_en"
>

/** Crea o actualiza (upsert por empleado) la liquidación. No toca el adjunto. */
export async function upsertLiquidacion(input: LiquidacionInput) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("liquidaciones")
    .upsert(input, { onConflict: "empleado_id" })
    .select(COLS)
    .single()
  if (error) throw error
  return data as Liquidacion
}

/** Marca la liquidación como generada (acto final; el vínculo se cierra aparte). */
export async function marcarGenerada(id: string, generadoPor: string) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("liquidaciones")
    .update({ estado: "generada", generado_por: generadoPor, generado_en: new Date().toISOString() })
    .eq("id", id)
    .select(COLS)
    .single()
  if (error) throw error
  return data as Liquidacion
}

// ── Adjunto: carta de renuncia / certificado de finalización ──────────────────
export async function subirCartaLiquidacion(l: Liquidacion, bytes: Uint8Array, mime: string) {
  const sb = getServiceClient()
  const ext = mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : mime.includes("jpeg") ? "jpg" : "bin"
  const path = `liquidaciones/${l.empleado_id}/${l.id}.${ext}`
  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, { contentType: mime, upsert: true })
  if (upErr) throw upErr
  const { data, error } = await sb
    .from("liquidaciones")
    .update({ carta_path: path })
    .eq("id", l.id)
    .select(COLS)
    .single()
  if (error) throw error
  return data as Liquidacion
}

/** Descarga el adjunto (bytes + mime). */
export async function getCartaLiquidacion(path: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const sb = getServiceClient()
  const { data, error } = await sb.storage.from(BUCKET).download(path)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  return { bytes: buf, mime: data.type || "application/octet-stream" }
}
