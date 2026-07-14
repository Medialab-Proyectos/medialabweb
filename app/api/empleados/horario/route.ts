import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { getHorarioVigente, getHorarioPendiente, crearHorario } from "@/lib/empleados/horario-queries"
import { validarHorario, horasSemana, capSemanalHoras, DIAS_SEMANA, type Horario } from "@/lib/empleados/horario"
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
    const [vigente, pendiente, emp] = await Promise.all([
      getHorarioVigente(s.sub), getHorarioPendiente(s.sub), getEmpleadoById(s.sub),
    ])
    return NextResponse.json({ vigente, pendiente, cap: capSemanalHoras(), tieneLider: !!emp?.lider_id })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase42-horarios.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}

const dia = z.object({
  activo: z.boolean(),
  entrada: z.string().regex(/^\d{1,2}:\d{2}$/),
  salida: z.string().regex(/^\d{1,2}:\d{2}$/),
  almuerzoInicio: z.string().regex(/^\d{1,2}:\d{2}$/).or(z.literal("")),
  almuerzoFin: z.string().regex(/^\d{1,2}:\d{2}$/).or(z.literal("")),
})
const schema = z.object({ horario: z.object({ lun: dia, mar: dia, mie: dia, jue: dia, vie: dia }) })

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

  const horario = b.horario as Horario
  if (!DIAS_SEMANA.some((d) => horario[d].activo)) {
    return NextResponse.json({ error: "Debes marcar al menos un día laborable." }, { status: 400 })
  }
  const val = validarHorario(horario)
  if (!val.ok) return NextResponse.json({ error: val.error }, { status: 400 })

  try {
    const emp = await getEmpleadoById(s.sub)
    if (!emp?.lider_id && s.rol !== "ceo") {
      return NextResponse.json({ error: "No tienes un líder asignado para aprobar el horario. Contacta a RRHH." }, { status: 400 })
    }
    const row = await crearHorario(s.sub, horario, horasSemana(horario))
    await notificarCEO(
      `Horario enviado por ${emp?.nombre ?? "un empleado"}`,
      `${emp?.nombre ?? "Un empleado"} envió su horario (${horasSemana(horario)} h/semana) para aprobación.\n\nApruébalo en el portal: /empleados/aprobaciones`,
    )
    return NextResponse.json({ horario: row })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase42-horarios.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}
