import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getCertificadoIR, getArchivoIR } from "@/lib/empleados/certificado-ir-queries"

export const runtime = "nodejs"

/** Descarga el PDF: el dueño solo si está publicado; el CEO siempre. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const { id } = await params
  const cert = await getCertificadoIR(id)
  if (!cert || !cert.archivo_path) return NextResponse.json({ error: "Sin documento." }, { status: 404 })

  const esCEO = s.rol === "ceo"
  const esDueno = cert.empleado_id === s.sub && cert.publicado
  if (!esCEO && !esDueno) return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  try {
    const { bytes, mime } = await getArchivoIR(cert.archivo_path)
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `inline; filename="ingresos-retenciones-${cert.anio}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
