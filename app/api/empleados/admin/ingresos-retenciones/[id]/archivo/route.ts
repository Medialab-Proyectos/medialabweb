import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getCertificadoIR, subirArchivoIR } from "@/lib/empleados/certificado-ir-queries"

export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

/** POST multipart (campo "archivo"): el CEO sube el PDF de ingresos y retenciones. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })

  const { id } = await params
  const cert = await getCertificadoIR(id)
  if (!cert) return NextResponse.json({ error: "Certificado no encontrado." }, { status: 404 })

  const form = await req.formData()
  const file = form.get("archivo")
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo." }, { status: 400 })
  if (file.size === 0) return NextResponse.json({ error: "El archivo está vacío." }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "El archivo supera 10 MB." }, { status: 400 })

  const mime = file.type || "application/pdf"
  if (!/pdf/.test(mime)) return NextResponse.json({ error: "Solo PDF." }, { status: 400 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  try {
    const actualizado = await subirArchivoIR(cert, bytes, mime)
    return NextResponse.json({ certificado: actualizado })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al subir."
    const falta = /bucket|not found/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta crear el bucket privado 'contratos' en Supabase → Storage." : msg },
      { status: falta ? 409 : 500 },
    )
  }
}
