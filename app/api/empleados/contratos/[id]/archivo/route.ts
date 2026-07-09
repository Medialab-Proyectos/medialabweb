import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getContrato, getArchivoContrato } from "@/lib/empleados/contrato-queries"

export const runtime = "nodejs"

/** GET: descarga el documento del contrato/otrosí. SOLO el CEO (el empleado no descarga). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO puede descargar el documento del contrato." }, { status: 403 })

  const { id } = await params
  const contrato = await getContrato(id)
  if (!contrato) return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 })
  if (!contrato.archivo_path) return NextResponse.json({ error: "Sin adjunto." }, { status: 404 })

  const { bytes, mime } = await getArchivoContrato(contrato.archivo_path)
  const ext = mime.includes("pdf") ? "pdf" : mime.split("/")[1] || "bin"
  const nombre = `contrato-${contrato.tipo}-${contrato.vigente_desde}.${ext}`
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${nombre}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
