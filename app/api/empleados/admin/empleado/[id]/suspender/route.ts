import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado, getServiceClient } from "@/lib/empleados/db"
import { getEmpleadoById, actualizarEmpleado } from "@/lib/empleados/queries"
import { listContratos, crearContrato } from "@/lib/empleados/contrato-queries"
import { condicionesVigentes } from "@/lib/empleados/contrato"

export const runtime = "nodejs"

function hoyISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
}

/**
 * Suspende el contrato de un empleado: sube la carta del empleado, deja constancia como OTROSÍ
 * (la causa) y marca al empleado como 'suspendido' (con o sin fecha estimada de retorno).
 * Durante la suspensión solo se paga seguridad social (pensión). Solo el CEO.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })
  const { id } = await params

  const empleado = await getEmpleadoById(id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })
  if (empleado.estado !== "activo") return NextResponse.json({ error: "Solo se puede suspender un contrato activo." }, { status: 400 })

  let motivo = "", hasta: string | null = null, file: File | null = null
  try {
    const form = await req.formData()
    motivo = String(form.get("motivo") ?? "").trim()
    const h = String(form.get("hasta") ?? "").trim()
    hasta = /^\d{4}-\d{2}-\d{2}$/.test(h) ? h : null
    const f = form.get("file")
    if (f instanceof File && f.size > 0) file = f
  } catch { /* body inválido */ }

  if (!motivo) return NextResponse.json({ error: "Indica el motivo de la suspensión." }, { status: 400 })
  if (file && file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "La carta supera los 8 MB." }, { status: 400 })

  try {
    // 1) Carta del empleado (opcional pero recomendada).
    let cartaPath: string | null = null
    if (file) {
      const mime = file.type || "application/octet-stream"
      const ext = mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : mime.includes("jpeg") ? "jpg" : "bin"
      cartaPath = `suspensiones/${id}.${ext}`
      const sb = getServiceClient()
      const { error } = await sb.storage.from("contratos").upload(cartaPath, new Uint8Array(await file.arrayBuffer()), { contentType: mime, upsert: true })
      if (error) throw error
    }

    // 2) Otrosí que documenta la causa de la suspensión (arrastra las condiciones vigentes).
    try {
      const vigente = condicionesVigentes(await listContratos(id))
      if (vigente) {
        const { id: _id, creado_en: _c, ...cond } = vigente as Record<string, unknown> & { id: string; creado_en: string }
        void _id; void _c
        await crearContrato({
          ...(cond as Parameters<typeof crearContrato>[0]),
          empleado_id: id,
          tipo: "otrosi",
          vigente_desde: hoyISO(),
          motivo: `Suspensión de contrato: ${motivo}${hasta ? ` (estimada hasta ${hasta})` : " (sin fecha estimada)"}`,
          ajustes: ["condiciones"],
          archivo_path: cartaPath,
          estado: cartaPath ? "firmado" : "pendiente_firma",
          firmado_por: cartaPath ? "empleado" : null,
          firmado_en: cartaPath ? new Date().toISOString() : null,
          enviado_en: null,
          creado_por: s.sub,
        })
      }
    } catch { /* si falla el otrosí, igual se suspende (best-effort) */ }

    // 3) Estado del empleado.
    const actualizado = await actualizarEmpleado(id, {
      estado: "suspendido",
      suspension_motivo: motivo,
      suspension_hasta: hasta,
      suspension_carta_path: cartaPath,
    })
    return NextResponse.json({ empleado: actualizado })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json({ error: falta ? "Falta correr schema-fase42-horarios.sql en Supabase." : msg }, { status: falta ? 409 : 500 })
  }
}
