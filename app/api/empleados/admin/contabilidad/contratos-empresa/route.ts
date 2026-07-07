import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listContratosEmpresa, upsertContratoEmpresa, eliminarContratoEmpresa } from "@/lib/empleados/contabilidad-queries"

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
  return { msg: falta ? "Falta correr schema-fase22-contratos-empresa.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ contratos: await listContratosEmpresa() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, contratos: [] }, { status: f.status })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  empresa_id: z.string().uuid(),
  nombre: z.string().max(160).nullable().optional(),
  modo: z.enum(["por_hora", "por_mes"]).default("por_mes"),
  tarifa: z.number().min(0).default(0),
  moneda: z.enum(["COP", "USD"]).default("COP"),
  activo: z.boolean().default(true),
  notas: z.string().max(1000).nullable().optional(),
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
    const contrato = await upsertContratoEmpresa({
      ...(b.id ? { id: b.id } : {}),
      empresa_id: b.empresa_id, nombre: b.nombre ?? null, modo: b.modo, tarifa: b.tarifa,
      moneda: b.moneda, activo: b.activo, notas: b.notas ?? null,
    })
    return NextResponse.json({ contrato })
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
    await eliminarContratoEmpresa(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
