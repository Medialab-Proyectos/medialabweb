import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getFactura, subirArchivoFactura, getArchivoFactura } from "@/lib/empleados/freelance-queries"

export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

/** Dueño (freelancer) o CEO. */
async function autorizar(id: string) {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  const factura = await getFactura(id)
  if (!factura) return { error: NextResponse.json({ error: "Factura no encontrada." }, { status: 404 }) }
  if (s.rol !== "ceo" && factura.empleado_id !== s.sub) {
    return { error: NextResponse.json({ error: "No autorizado." }, { status: 403 }) }
  }
  return { session: s, factura }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const { id } = await params
  const a = await autorizar(id)
  if (a.error) return a.error

  const form = await req.formData()
  const file = form.get("archivo")
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo." }, { status: 400 })
  if (file.size === 0) return NextResponse.json({ error: "El archivo está vacío." }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "El archivo supera 10 MB." }, { status: 400 })

  const mime = file.type || "application/pdf"
  if (!/pdf|image\//.test(mime)) return NextResponse.json({ error: "Solo PDF o imagen." }, { status: 400 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  try {
    const factura = await subirArchivoFactura(a.factura!, bytes, mime)
    return NextResponse.json({ factura })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al subir."
    const falta = /bucket|not found/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta crear el bucket privado 'facturas' en Supabase → Storage." : msg },
      { status: falta ? 409 : 500 },
    )
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const { id } = await params
  const a = await autorizar(id)
  if (a.error) return a.error
  if (!a.factura!.archivo_path) return NextResponse.json({ error: "Sin adjunto." }, { status: 404 })

  const { bytes, mime } = await getArchivoFactura(a.factura!.archivo_path)
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `inline; filename="factura-${a.factura!.id}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
