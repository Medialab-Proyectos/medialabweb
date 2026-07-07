import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getContrato, subirArchivoContrato, sincronizarEmpleadoDesdeContratos } from "@/lib/empleados/contrato-queries"
import { notificarCEO } from "@/lib/empleados/notificar"
import { getEmpleadoById } from "@/lib/empleados/queries"

export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

/** POST multipart (campo "archivo"): el EMPLEADO sube su contrato/otrosí firmado. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const { id } = await params
  const contrato = await getContrato(id)
  if (!contrato) return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 })
  // Solo el dueño puede firmar el suyo (el CEO lo sube desde el panel de contratos).
  if (contrato.empleado_id !== s.sub) return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  const form = await req.formData()
  const file = form.get("archivo")
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo." }, { status: 400 })
  if (file.size === 0) return NextResponse.json({ error: "El archivo está vacío." }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "El archivo supera 10 MB." }, { status: 400 })
  const mime = file.type || "application/pdf"
  if (!/pdf|image\//.test(mime)) return NextResponse.json({ error: "Solo PDF o imagen." }, { status: 400 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  try {
    const actualizado = await subirArchivoContrato(contrato, bytes, mime, "empleado")
    // Al firmar el contrato, se re-sincroniza la ficha (activa rol/pago/beneficios).
    await sincronizarEmpleadoDesdeContratos(contrato.empleado_id)
    const emp = await getEmpleadoById(contrato.empleado_id)
    await notificarCEO(
      `Contrato firmado por ${emp?.nombre ?? "un empleado"}`,
      `${emp?.nombre ?? "Un empleado"} subió su ${contrato.tipo === "inicial" ? "contrato" : "otrosí"} firmado. Ya quedó activo en el portal.`,
    )
    return NextResponse.json({ contrato: actualizado })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al subir."
    const falta = /bucket|not found/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta crear el bucket privado 'contratos' en Supabase → Storage." : msg },
      { status: falta ? 409 : 500 },
    )
  }
}
