import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listContratos } from "@/lib/empleados/contrato-queries"
import { condicionesVigentes } from "@/lib/empleados/contrato"
import { listHorasExtras, crearHoraExtra } from "@/lib/empleados/horas-extras-queries"
import { valorHoraOrdinaria, valorHorasExtra, RECARGO } from "@/lib/empleados/horas-extras"
import { notificarCEO } from "@/lib/empleados/notificar"

export const runtime = "nodejs"

function fallaEsquema(msg: string) {
  return /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
}

/** Salario básico vigente del empleado (para valorar la hora). */
async function salarioBasicoDe(empleadoId: string): Promise<number> {
  try {
    const vigente = condicionesVigentes(await listContratos(empleadoId))
    return Number(vigente?.salario_basico) || 0
  } catch {
    return 0
  }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    const [horas, basico, emp] = await Promise.all([
      listHorasExtras(s.sub),
      salarioBasicoDe(s.sub),
      getEmpleadoById(s.sub),
    ])
    return NextResponse.json({ horas, valorHora: Math.round(valorHoraOrdinaria(basico)), tieneLider: !!emp?.lider_id })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase40-horas-extras.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}

const schema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tipo: z.enum(["diurna", "nocturna", "recargo_nocturno"]),
  horas: z.number().positive().max(24),
  motivo: z.string().max(500).optional().nullable(),
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

  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
  if (b.fecha > hoy) return NextResponse.json({ error: "No puedes reportar horas de una fecha futura." }, { status: 400 })

  try {
    const emp = await getEmpleadoById(s.sub)
    if (!emp?.lider_id && s.rol !== "ceo") {
      return NextResponse.json({ error: "No tienes un líder asignado para aprobar el reporte. Contacta a RRHH." }, { status: 400 })
    }
    const basico = await salarioBasicoDe(s.sub)
    if (basico <= 0) return NextResponse.json({ error: "No tienes un contrato con salario registrado; no se puede valorar la hora." }, { status: 400 })

    const hora = await crearHoraExtra({
      empleado_id: s.sub,
      fecha: b.fecha,
      tipo: b.tipo,
      horas: b.horas,
      valor_hora: Math.round(valorHoraOrdinaria(basico)),
      valor: valorHorasExtra(basico, b.tipo, b.horas),
      motivo: b.motivo ?? null,
    })
    await notificarCEO(
      `Horas extra reportadas por ${emp?.nombre ?? "un empleado"}`,
      `${emp?.nombre ?? "Un empleado"} reportó ${b.horas} h de ${RECARGO[b.tipo].label} el ${b.fecha}.\n\nApruébalas en el portal: /empleados/aprobaciones`,
    )
    return NextResponse.json({ hora })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase40-horas-extras.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}
