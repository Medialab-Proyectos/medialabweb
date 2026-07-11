import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listSolicitudesCesantias, crearSolicitudCesantias } from "@/lib/empleados/cesantias-solicitud-queries"
import { CAUSAL_CESANTIAS_LABEL } from "@/lib/empleados/cesantias-solicitud"
import { notificarCEO } from "@/lib/empleados/notificar"

export const runtime = "nodejs"

function fallaEsquema(msg: string) {
  return /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    const [solicitudes, emp] = await Promise.all([listSolicitudesCesantias(s.sub), getEmpleadoById(s.sub)])
    return NextResponse.json({
      solicitudes,
      fondo: emp?.fondo_cesantias ?? null,
      tieneLider: !!emp?.lider_id,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase41-retiro-cesantias.sql en Supabase." : msg, solicitudes: [] },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}

const schema = z.object({
  causal: z.enum(["compra_vivienda", "mejoras_vivienda", "obligacion_hipotecaria", "educacion"]),
  valor: z.number().positive().max(500_000_000),
  detalle: z.string().max(500).optional().nullable(),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    const emp = await getEmpleadoById(s.sub)
    if (!emp) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })
    if (emp.estado !== "activo") {
      return NextResponse.json({ error: "El retiro parcial de cesantías es solo para empleados activos. Al terminar el contrato se tramita el retiro total." }, { status: 400 })
    }
    if (!emp.lider_id && s.rol !== "ceo") {
      return NextResponse.json({ error: "No tienes un líder asignado para aprobar la solicitud. Contacta a RRHH." }, { status: 400 })
    }

    const solicitud = await crearSolicitudCesantias({
      empleado_id: s.sub,
      causal: b.causal,
      valor: b.valor,
      detalle: b.detalle ?? null,
    })
    await notificarCEO(
      `Solicitud de retiro de cesantías de ${emp.nombre}`,
      `${emp.nombre} solicitó un retiro parcial de cesantías por ${CAUSAL_CESANTIAS_LABEL[b.causal]}.\n\nApruébala en el portal: /empleados/aprobaciones`,
    )
    return NextResponse.json({ solicitud })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase41-retiro-cesantias.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}
