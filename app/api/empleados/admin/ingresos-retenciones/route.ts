import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import {
  listCertificadosIR, upsertCertificadoIR, setPublicadoCertificadoIR, eliminarCertificadoIR,
} from "@/lib/empleados/certificado-ir-queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

function faltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
  return { msg: falta ? "Falta correr schema-fase26-contabilidad-nomina-certificados.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ certificados: await listCertificadosIR() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, certificados: [] }, { status: f.status })
  }
}

const schema = z.object({
  accion: z.enum(["crear", "publicar"]).default("crear"),
  id: z.string().uuid().optional(),
  empleado_id: z.string().uuid().optional(),
  anio: z.number().int().min(2000).max(2100).optional(),
  publicado: z.boolean().optional(),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    if (b.accion === "publicar") {
      if (!b.id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
      const cert = await setPublicadoCertificadoIR(b.id, b.publicado ?? true)
      return NextResponse.json({ certificado: cert })
    }
    if (!b.empleado_id || !b.anio) return NextResponse.json({ error: "Indica empleado y año." }, { status: 400 })
    const cert = await upsertCertificadoIR({ empleado_id: b.empleado_id, anio: b.anio, publicado: b.publicado })
    return NextResponse.json({ certificado: cert })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}

export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  try {
    await eliminarCertificadoIR(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
