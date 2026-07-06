import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listBeneficios, listBeneficiosEmpleado, setEstadoBeneficio, asignarBeneficio } from "@/lib/empleados/beneficio-queries"
import { PROVEEDOR_MEDICINA_PREPAGADA } from "@/lib/empleados/beneficio"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const empleadoId = new URL(req.url).searchParams.get("empleado_id")
  try {
    const beneficios = empleadoId ? await listBeneficiosEmpleado(empleadoId) : await listBeneficios()
    return NextResponse.json({ beneficios })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr schema-fase9-beneficios.sql en Supabase." : msg, beneficios: [] },
      { status: falta ? 409 : 500 },
    )
  }
}

const asignarSchema = z.object({
  empleado_id: z.string().uuid(),
  tipo: z.enum(["medicina_prepagada"]),
  estado: z.enum(["solicitado", "activo", "inactivo"]).default("activo"),
})

/** El CEO asigna un beneficio a un empleado. */
export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  let b: z.infer<typeof asignarSchema>
  try {
    b = asignarSchema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  const proveedor = b.tipo === "medicina_prepagada" ? PROVEEDOR_MEDICINA_PREPAGADA : null
  try {
    const beneficio = await asignarBeneficio(b.empleado_id, b.tipo, b.estado, proveedor)
    return NextResponse.json({ beneficio })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json({ error: falta ? "Falta correr schema-fase9-beneficios.sql en Supabase." : msg }, { status: falta ? 409 : 500 })
  }
}

const schema = z.object({
  id: z.string().uuid(),
  estado: z.enum(["solicitado", "activo", "inactivo"]),
  proveedor: z.string().max(120).nullable().optional(),
  observaciones: z.string().max(1000).nullable().optional(),
})

export async function PATCH(req: Request) {
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

  const beneficio = await setEstadoBeneficio(b.id, {
    estado: b.estado,
    proveedor: b.proveedor,
    observaciones: b.observaciones,
  })
  return NextResponse.json({ beneficio })
}
