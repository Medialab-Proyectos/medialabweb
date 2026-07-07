import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listContratos, crearContrato, eliminarContrato, getContrato, sincronizarEmpleadoDesdeContratos } from "@/lib/empleados/contrato-queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

const linea = z.object({
  concepto: z.string().min(1).max(120),
  valor: z.number(),
})

const schema = z.object({
  empleado_id: z.string().uuid(),
  tipo: z.enum(["inicial", "otrosi"]),
  vigente_desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rol: z.enum(["ceo", "lider", "empleado"]).default("empleado"),
  tipo_vinculacion: z.enum(["empleado", "freelance", "prestacion_servicios"]).default("empleado"),
  salario_basico: z.number().min(0).default(0),
  auxilio_transporte: z.number().min(0).default(0),
  otros_devengos: z.array(linea).default([]),
  freelance_modo: z.enum(["por_hora", "por_mes", "fijo"]).nullable().optional(),
  freelance_tarifa: z.number().min(0).nullable().optional(),
  freelance_moneda: z.enum(["COP", "USD"]).nullable().optional(),
  tipo_contrato: z.string().max(60).nullable().optional(),
  jornada: z.string().max(60).nullable().optional(),
  cargo: z.string().max(120).nullable().optional(),
  lider_id: z.string().uuid().nullable().optional(),
  fecha_ingreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  motivo: z.string().max(500).nullable().optional(),
})

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const empleadoId = new URL(req.url).searchParams.get("empleado_id")
  if (!empleadoId) return NextResponse.json({ error: "Indica empleado_id." }, { status: 400 })
  try {
    const contratos = await listContratos(empleadoId)
    return NextResponse.json({ contratos })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /does not exist|column|schema cache|relation/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr la migración schema-fase3-contratos.sql en Supabase." : msg, contratos: [] },
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

  try {
    const porFactura = b.tipo_vinculacion === "freelance" || b.tipo_vinculacion === "prestacion_servicios"
    const contrato = await crearContrato({
      empleado_id: b.empleado_id,
      tipo: b.tipo,
      vigente_desde: b.vigente_desde,
      rol: b.rol,
      tipo_vinculacion: b.tipo_vinculacion,
      // Laboral: salario. Freelance/prestación: pago acordado (el salario va en 0).
      salario_basico: porFactura ? 0 : b.salario_basico,
      auxilio_transporte: porFactura ? 0 : b.auxilio_transporte,
      otros_devengos: porFactura ? [] : b.otros_devengos,
      freelance_modo: porFactura ? b.freelance_modo ?? null : null,
      freelance_tarifa: porFactura ? b.freelance_tarifa ?? null : null,
      freelance_moneda: porFactura ? b.freelance_moneda ?? null : null,
      tipo_contrato: b.tipo_contrato ?? null,
      jornada: b.jornada ?? null,
      cargo: b.cargo ?? null,
      lider_id: b.lider_id ?? null,
      fecha_ingreso: b.fecha_ingreso ?? null,
      motivo: b.motivo ?? null,
      archivo_path: null,
      creado_por: g.session!.sub,
    })
    // El contrato manda: se sincronizan rol, vinculación, líder, fecha de ingreso,
    // cargo y pago a la ficha (para login, tabla, certificado, vacaciones, liquidación…).
    await sincronizarEmpleadoDesdeContratos(b.empleado_id)
    return NextResponse.json({ contrato })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      {
        error: falta
          ? "La API de Supabase no ve la tabla 'contratos'. Corre en el SQL Editor: NOTIFY pgrst, 'reload schema'; (o re-ejecuta schema-fase3-contratos.sql)."
          : msg,
      },
      { status: falta ? 409 : 500 },
    )
  }
}

export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  const contrato = await getContrato(id)
  await eliminarContrato(id)
  // Reevaluar el contrato vigente y resincronizar la ficha.
  if (contrato) await sincronizarEmpleadoDesdeContratos(contrato.empleado_id)
  return NextResponse.json({ ok: true })
}
