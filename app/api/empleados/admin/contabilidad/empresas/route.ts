import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listEmpresas, upsertEmpresa, eliminarEmpresa } from "@/lib/empleados/contabilidad-queries"

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
  return { msg: falta ? "Falta correr schema-fase13-contabilidad-ampliada.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ empresas: await listEmpresas() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, empresas: [] }, { status: f.status })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().trim().min(1).max(160),
  nit: z.string().max(40).nullable().optional(),
  correo: z.string().max(160).nullable().optional(),
  pais: z.string().max(80).nullable().optional(),
  telefono: z.string().max(60).nullable().optional(),
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
    const empresa = await upsertEmpresa({
      ...(b.id ? { id: b.id } : {}),
      nombre: b.nombre, nit: b.nit ?? null, correo: b.correo ?? null,
      pais: b.pais ?? null, telefono: b.telefono ?? null,
    })
    return NextResponse.json({ empresa })
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
    await eliminarEmpresa(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
