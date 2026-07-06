import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listBeneficiosEmpleado, solicitarBeneficio } from "@/lib/empleados/beneficio-queries"
import { PROVEEDOR_MEDICINA_PREPAGADA } from "@/lib/empleados/beneficio"

export const runtime = "nodejs"

function faltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
  return { msg: falta ? "Falta correr schema-fase9-beneficios.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    const beneficios = await listBeneficiosEmpleado(s.sub)
    return NextResponse.json({ beneficios })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, beneficios: [] }, { status: f.status })
  }
}

const schema = z.object({
  tipo: z.enum(["medicina_prepagada"]),
  plan: z.string().max(120).nullable().optional(),
  beneficiarios: z.number().int().min(0).max(50).nullable().optional(),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 })
  }

  const proveedor = b.tipo === "medicina_prepagada" ? PROVEEDOR_MEDICINA_PREPAGADA : null
  const datos: Record<string, unknown> = {}
  if (b.plan) datos.plan = b.plan
  if (b.beneficiarios != null) datos.beneficiarios = b.beneficiarios
  try {
    const beneficio = await solicitarBeneficio(s.sub, b.tipo, proveedor, Object.keys(datos).length ? datos : undefined)
    return NextResponse.json({ beneficio })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
