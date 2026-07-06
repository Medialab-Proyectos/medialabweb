import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById, subirConvenioEmpleado, getConvenioEmpleado } from "@/lib/empleados/queries"

export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

/** POST multipart (campo "archivo"): sube el contrato/convenio del empleado. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const { id } = await params
  const empleado = await getEmpleadoById(id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const form = await req.formData()
  const file = form.get("archivo")
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo." }, { status: 400 })
  if (file.size === 0) return NextResponse.json({ error: "El archivo está vacío." }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "El archivo supera 10 MB." }, { status: 400 })

  const mime = file.type || "application/pdf"
  if (!/pdf|image\//.test(mime)) return NextResponse.json({ error: "Solo PDF o imagen." }, { status: 400 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  try {
    const actualizado = await subirConvenioEmpleado(id, bytes, mime)
    return NextResponse.json({ empleado: actualizado })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al subir."
    const falta = /bucket|not found/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta el bucket privado 'contratos' en Supabase → Storage." : msg },
      { status: falta ? 409 : 500 },
    )
  }
}

/** GET: descarga el convenio del empleado. Solo el CEO. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const { id } = await params
  const empleado = await getEmpleadoById(id)
  if (!empleado?.convenio_path) return NextResponse.json({ error: "Sin convenio adjunto." }, { status: 404 })

  const { bytes, mime } = await getConvenioEmpleado(empleado.convenio_path)
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `inline; filename="convenio-${empleado.cedula}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
