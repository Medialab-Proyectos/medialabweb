import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import {
  listDesprendiblesEmpleado,
  listDesprendiblesMes,
  upsertDesprendible,
  eliminarDesprendible,
} from "@/lib/empleados/desprendible-queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

const linea = z.object({
  codigo: z.string().max(20).optional(),
  concepto: z.string().min(1).max(120),
  cantidad: z.number().optional(),
  valor: z.number(),
})

const schema = z.object({
  empleado_id: z.string().uuid(),
  anio: z.number().int().min(2000).max(2100),
  mes: z.number().int().min(1).max(12),
  fecha_nomina: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  cargo: z.string().max(120).nullable().optional(),
  dias: z.number().min(0).max(31).default(30),
  salario_basico: z.number().min(0).default(0),
  fondo_pension: z.string().max(120).nullable().optional(),
  eps_salud: z.string().max(120).nullable().optional(),
  banco: z.string().max(120).nullable().optional(),
  cuenta: z.string().max(60).nullable().optional(),
  devengos: z.array(linea).default([]),
  deducciones: z.array(linea).default([]),
  base_salarial: z.number().nullable().optional(),
  base_pension: z.number().nullable().optional(),
  base_retencion: z.number().nullable().optional(),
  porc_retencion: z.number().nullable().optional(),
  dias_vac_pend: z.number().nullable().optional(),
  observaciones: z.string().max(1000).nullable().optional(),
  publicado: z.boolean().default(false),
})

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const url = new URL(req.url)
  const empleadoId = url.searchParams.get("empleado_id")
  try {
    if (empleadoId) {
      const desprendibles = await listDesprendiblesEmpleado(empleadoId, false)
      return NextResponse.json({ desprendibles })
    }
    const anio = Number(url.searchParams.get("anio"))
    const mes = Number(url.searchParams.get("mes"))
    if (!anio || !mes) return NextResponse.json({ error: "Indica anio y mes (o empleado_id)." }, { status: 400 })
    const desprendibles = await listDesprendiblesMes(anio, mes)
    return NextResponse.json({ desprendibles })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /does not exist|column|schema cache/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr la migración schema-fase2-desprendibles.sql en Supabase." : msg, desprendibles: [] },
      { status: falta ? 409 : 500 },
    )
  }
}

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

  const desprendible = await upsertDesprendible({
    empleado_id: b.empleado_id,
    anio: b.anio,
    mes: b.mes,
    fecha_nomina: b.fecha_nomina ?? null,
    cargo: b.cargo ?? null,
    dias: b.dias,
    salario_basico: b.salario_basico,
    fondo_pension: b.fondo_pension ?? null,
    eps_salud: b.eps_salud ?? null,
    banco: b.banco ?? null,
    cuenta: b.cuenta ?? null,
    devengos: b.devengos,
    deducciones: b.deducciones,
    base_salarial: b.base_salarial ?? null,
    base_pension: b.base_pension ?? null,
    base_retencion: b.base_retencion ?? null,
    porc_retencion: b.porc_retencion ?? null,
    dias_vac_pend: b.dias_vac_pend ?? null,
    observaciones: b.observaciones ?? null,
    publicado: b.publicado,
  })
  return NextResponse.json({ desprendible })
}

export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  await eliminarDesprendible(id)
  return NextResponse.json({ ok: true })
}
