import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { getHorarioVigente, getHorarioPendiente, getUltimoHorario, crearHorario } from "@/lib/empleados/horario-queries"
import { validarHorario, horasSemana, capSemanalHoras, DIAS_SEMANA, type Horario } from "@/lib/empleados/horario"
import { esVinculacionPorFactura } from "@/lib/empleados/types"
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
    const [vigente, pendiente, ultimo, emp] = await Promise.all([
      getHorarioVigente(s.sub), getHorarioPendiente(s.sub), getUltimoHorario(s.sub), getEmpleadoById(s.sub),
    ])
    const esLaboral = !esVinculacionPorFactura(emp?.tipo_vinculacion ?? "empleado")
    const permitido = esLaboral || emp?.horario_habilitado === true
    // Si la última propuesta fue rechazada (y no hay otra pendiente), se muestra el motivo del líder.
    const rechazado = !pendiente && ultimo?.estado === "rechazado" ? ultimo : null
    return NextResponse.json({ vigente, pendiente, rechazado, cap: capSemanalHoras(), tieneLider: !!emp?.lider_id, esLaboral, permitido })
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
const semana = z.object({ lun: dia, mar: dia, mie: dia, jue: dia, vie: dia })
const schema = z.object({
  horario: semana,
  alterna: z.boolean().optional().default(false),
  horario_b: semana.nullable().optional(),
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

  const empActual = await getEmpleadoById(s.sub)
  if (!empActual) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })
  const esLaboral = !esVinculacionPorFactura(empActual.tipo_vinculacion ?? "empleado")
  // Freelance/prestación solo registran horario si el CEO lo habilitó en su contrato.
  if (!esLaboral && empActual.horario_habilitado !== true) {
    return NextResponse.json({ error: "El registro de horario no está habilitado para tu vínculo. El CEO lo activa desde tu contrato." }, { status: 403 })
  }
  // El horario alternado (2 semanas) es beneficio SOLO de contratos laborales (fijo/indefinido/obra).
  const alterna = esLaboral && b.alterna

  const horario = b.horario as Horario
  if (!DIAS_SEMANA.some((d) => horario[d].activo)) {
    return NextResponse.json({ error: "Debes marcar al menos un día laborable." }, { status: 400 })
  }
  const val = validarHorario(horario, { conNorma: esLaboral })
  if (!val.ok) return NextResponse.json({ error: `${alterna ? "Semana A · " : ""}${val.error}` }, { status: 400 })

  const horarioB = alterna ? ((b.horario_b ?? null) as Horario | null) : null
  if (alterna) {
    if (!horarioB || !DIAS_SEMANA.some((d) => horarioB[d].activo)) {
      return NextResponse.json({ error: "El horario alternado necesita también la Semana B con al menos un día." }, { status: 400 })
    }
    const valB = validarHorario(horarioB, { conNorma: true })
    if (!valB.ok) return NextResponse.json({ error: `Semana B · ${valB.error}` }, { status: 400 })
  }

  try {
    // El CEO no tiene un superior: su horario se auto-aprueba y entra en vigencia de inmediato.
    const autoAprobar = s.rol === "ceo"
    // Ya hay una propuesta esperando decisión del líder: no se puede enviar otra hasta que se resuelva
    // (no aplica al CEO, cuyo horario se aprueba solo).
    if (!autoAprobar) {
      const pendiente = await getHorarioPendiente(s.sub)
      if (pendiente) {
        return NextResponse.json({ error: "Ya tienes un horario pendiente de aprobación. Espera a que tu líder lo apruebe o lo rechace antes de enviar otro." }, { status: 409 })
      }
    }
    const row = await crearHorario(s.sub, horario, horasSemana(horario), { alterna, horarioB, aprobadoPor: autoAprobar ? s.sub : null })
    if (!autoAprobar) {
      await notificarCEO(
        `Horario enviado por ${empActual.nombre}`,
        `${empActual.nombre} envió su horario (${horasSemana(horario)} h/semana) para aprobación.\n\nApruébalo en el portal: /empleados/aprobaciones`,
      )
    }
    return NextResponse.json({ horario: row })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase42-horarios.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}
