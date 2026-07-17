import "server-only"
import { getServiceClient } from "./db"
import { condicionesVigentesFirmadas, esFirmado, type Contrato, type PrimaDoc, type CesantiasDoc } from "./contrato"
import { actualizarEmpleado } from "./queries"

const BUCKET = "contratos"

// ── Contratos ────────────────────────────────────────────────────────────────
const COLS =
  "id,empleado_id,tipo,vigente_desde,rol,tipo_vinculacion,salario_basico,auxilio_transporte,otros_devengos,freelance_modo,freelance_tarifa,freelance_moneda,freelance_meses,tipo_contrato,jornada,cargo,descripcion,condiciones_adicionales,rol_funciones_id,lider_id,fecha_ingreso,fecha_fin_probable,fecha_fin,motivo,ajustes,archivo_path,estado,enviado_en,firmado_por,firmado_en,creado_por,creado_en"
// Columna de fase 42; se lee con fallback por si la migración aún no está.
const COLS_EXT = `${COLS},freelance_max_horas_mes`

/** Historial completo de condiciones de un empleado (más reciente primero). */
export async function listContratos(empleadoId: string) {
  const sb = getServiceClient()
  const q = (cols: string) => sb.from("contratos").select(cols).eq("empleado_id", empleadoId).order("vigente_desde", { ascending: false }).order("creado_en", { ascending: false })
  let { data, error } = await q(COLS_EXT)
  if (error) ({ data, error } = await q(COLS))
  if (error) throw error
  return (data ?? []) as unknown as Contrato[]
}

export async function getContrato(id: string) {
  const sb = getServiceClient()
  let { data, error } = await sb.from("contratos").select(COLS_EXT).eq("id", id).maybeSingle()
  if (error) ({ data, error } = await sb.from("contratos").select(COLS).eq("id", id).maybeSingle())
  if (error) throw error
  return data as unknown as Contrato | null
}

export type ContratoInput = Omit<Contrato, "id" | "creado_en">

export async function crearContrato(input: ContratoInput) {
  const sb = getServiceClient()
  // Inserta con la columna de fase 42; si aún no existe, reintenta sin ella.
  let { data, error } = await sb.from("contratos").insert(input).select(COLS).single()
  if (error && /freelance_max_horas_mes|column/i.test(String((error as { message?: string })?.message ?? ""))) {
    const rest = { ...input } as Record<string, unknown>; delete rest.freelance_max_horas_mes
    ;({ data, error } = await sb.from("contratos").insert(rest).select(COLS).single())
  }
  if (error) throw error
  return data as Contrato
}

/** Marca un contrato como enviado al empleado para firma (sale del estado borrador). */
export async function marcarEnviadoParaFirma(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contratos").update({ enviado_en: new Date().toISOString() }).eq("id", id).select(COLS).single()
  if (error) throw error
  return data as Contrato
}

/** Edita una versión existente del contrato (corregir el inicial o un otrosí). */
export async function actualizarContrato(id: string, cambios: Partial<ContratoInput>) {
  const sb = getServiceClient()
  let { data, error } = await sb.from("contratos").update(cambios).eq("id", id).select(COLS).single()
  // Si la columna opcional freelance_max_horas_mes aún no existe, reintenta sin ella.
  if (error && /freelance_max_horas_mes|column/i.test(String((error as { message?: string })?.message ?? ""))) {
    const rest = { ...cambios } as Record<string, unknown>; delete rest.freelance_max_horas_mes
    ;({ data, error } = await sb.from("contratos").update(rest).eq("id", id).select(COLS).single())
  }
  if (error) throw error
  return data as Contrato
}

/** Marca un contrato como finalizado en una fecha (o lo reabre con fecha_fin = null). */
export async function finalizarContrato(id: string, fechaFin: string | null) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("contratos").update({ fecha_fin: fechaFin }).eq("id", id).select(COLS).single()
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

/**
 * Sincroniza a la ficha del empleado los datos que ahora manda el contrato: rol,
 * vinculación, líder, fecha de ingreso, cargo y pago (salario/pago acordado). Toma
 * el contrato VIGENTE. El login usa empleados.rol, por eso se mantiene denormalizado.
 * Sin contratos → el empleado vuelve a "empleado" básico.
 */
export async function sincronizarEmpleadoDesdeContratos(empleadoId: string) {
  const contratos = await listContratos(empleadoId)
  // Solo los contratos FIRMADOS mandan sobre rol/pago/estado. Un 'pendiente_firma'
  // no cambia nada hasta que se suba el documento firmado.
  const vigente = condicionesVigentesFirmadas(contratos)
  if (!vigente) {
    await actualizarEmpleado(empleadoId, {
      rol: "empleado", tipo_vinculacion: "empleado",
      freelance_modo: null, freelance_tarifa: null, freelance_moneda: null, freelance_meses: null,
    }).catch(() => {})
    return
  }
  const porFactura = vigente.tipo_vinculacion === "freelance" || vigente.tipo_vinculacion === "prestacion_servicios"
  // La fecha de ingreso la fija el contrato inicial FIRMADO (un otrosí no la trae).
  const firmados = contratos.filter(esFirmado)
  const inicial = firmados.find((c) => c.tipo === "inicial") ?? firmados[firmados.length - 1]
  await actualizarEmpleado(empleadoId, {
    rol: vigente.rol ?? "empleado",
    tipo_vinculacion: vigente.tipo_vinculacion ?? "empleado",
    cargo: vigente.cargo ?? null,
    tipo_contrato: vigente.tipo_contrato ?? null,
    lider_id: vigente.lider_id ?? null,
    fecha_ingreso: inicial?.fecha_ingreso ?? vigente.fecha_ingreso ?? null,
    fecha_fin_probable: vigente.fecha_fin_probable ?? null,
    freelance_modo: porFactura ? vigente.freelance_modo ?? null : null,
    freelance_tarifa: porFactura ? vigente.freelance_tarifa ?? null : null,
    freelance_moneda: porFactura ? vigente.freelance_moneda ?? null : null,
    freelance_meses: porFactura ? vigente.freelance_meses ?? null : null,
  }).catch(() => {})
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
/**
 * Sube el documento FIRMADO del contrato/otrosí. Al subirlo, la versión pasa a
 * 'firmado' (queda válida/vigente). `firmadoPor` = quién lo subió (empleado o CEO).
 */
export async function subirArchivoContrato(contrato: Contrato, bytes: Uint8Array, mime: string, firmadoPor: "empleado" | "ceo" = "ceo") {
  const sb = getServiceClient()
  const ext = mime.includes("pdf") ? "pdf" : "bin"
  const path = `${contrato.empleado_id}/${contrato.id}.${ext}`
  const { error: upErr } = await sb.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: mime, upsert: true })
  if (upErr) throw upErr
  const { data, error } = await sb
    .from("contratos")
    .update({ archivo_path: path, estado: "firmado", firmado_por: firmadoPor, firmado_en: new Date().toISOString() })
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

// ── Cesantías ────────────────────────────────────────────────────────────────
const CESANTIAS_COLS =
  "id,empleado_id,anio,dias,base,cesantias,intereses,fondo,observaciones,publicado,creado_en,actualizado_en"

export async function listCesantiasEmpleado(empleadoId: string, soloPublicadas = true) {
  const sb = getServiceClient()
  let q = sb.from("cesantias").select(CESANTIAS_COLS).eq("empleado_id", empleadoId)
  if (soloPublicadas) q = q.eq("publicado", true)
  const { data, error } = await q.order("anio", { ascending: false })
  if (error) throw error
  return (data ?? []) as CesantiasDoc[]
}

export async function getCesantias(id: string) {
  const sb = getServiceClient()
  const { data, error } = await sb.from("cesantias").select(CESANTIAS_COLS).eq("id", id).maybeSingle()
  if (error) throw error
  return data as CesantiasDoc | null
}

export type CesantiasInput = Omit<CesantiasDoc, "id" | "creado_en" | "actualizado_en">

export async function upsertCesantias(input: CesantiasInput) {
  const sb = getServiceClient()
  const { data, error } = await sb
    .from("cesantias")
    .upsert(input, { onConflict: "empleado_id,anio" })
    .select(CESANTIAS_COLS)
    .single()
  if (error) throw error
  return data as CesantiasDoc
}
