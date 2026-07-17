import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { subirNdaFirmado } from "@/lib/empleados/nda-queries"

export const runtime = "nodejs"

/** El empleado sube su NDA firmado. */
export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  let file: File | null = null
  try {
    const form = await req.formData()
    const f = form.get("file")
    if (f instanceof File) file = f
  } catch { /* body inválido */ }
  if (!file) return NextResponse.json({ error: "Adjunta el documento firmado (PDF o imagen)." }, { status: 400 })
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "El archivo supera los 8 MB." }, { status: 400 })

  const mime = file.type || "application/octet-stream"
  if (!/pdf|png|jpe?g/i.test(mime)) return NextResponse.json({ error: "Solo PDF o imagen (PNG/JPG)." }, { status: 400 })

  try {
    await subirNdaFirmado(s.sub, new Uint8Array(await file.arrayBuffer()), mime)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr schema-fase42-horarios.sql en Supabase." : msg },
      { status: falta ? 409 : 500 },
    )
  }
}
