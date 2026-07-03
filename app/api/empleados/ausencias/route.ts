import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoVacacion, listSolicitudes, crearSolicitud } from "@/lib/empleados/ausencia-queries"
import { calcularSaldoVacaciones, DIAS_ADELANTO } from "@/lib/empleados/ausencia"
import { contarDiasHabiles, contarDiasCalendario } from "@/lib/empleados/festivos-co"

export const runtime = "nodejs"

function fallaEsquema(msg: string) {
  return /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    const [emp, solicitudes] = await Promise.all([getEmpleadoVacacion(s.sub), listSolicitudes(s.sub)])
    const corte = emp?.vacaciones_corte ?? emp?.fecha_ingreso ?? null
    const saldo = calcularSaldoVacaciones(Number(emp?.vacaciones_saldo_inicial) || 0, corte, solicitudes)
    return NextResponse.json({ solicitudes, saldo, tieneLider: !!emp?.lider_id })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase4-ausencias.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}

const schema = z.object({
  tipo: z.enum([
    "vacaciones", "adelanto_vacaciones", "permiso_no_remunerado", "licencia_maternidad", "licencia_paternidad",
    "licencia_luto", "dia_familia", "dia_votacion", "otra",
  ]),
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fecha_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
  if (b.fecha_fin < b.fecha_inicio) return NextResponse.json({ error: "La fecha final no puede ser anterior a la inicial." }, { status: 400 })

  const diasHabiles = contarDiasHabiles(b.fecha_inicio, b.fecha_fin)
  const diasCalendario = contarDiasCalendario(b.fecha_inicio, b.fecha_fin)

  try {
    const emp = await getEmpleadoVacacion(s.sub)
    if (!emp?.lider_id && s.rol !== "ceo") {
      return NextResponse.json({ error: "No tienes un líder asignado para aprobar la solicitud. Contacta a RRHH." }, { status: 400 })
    }

    if (b.tipo === "adelanto_vacaciones") {
      if (diasHabiles <= 0) {
        return NextResponse.json({ error: "El rango elegido no tiene días hábiles (solo fines de semana o festivos)." }, { status: 400 })
      }
      if (diasHabiles > DIAS_ADELANTO) {
        return NextResponse.json({ error: `El adelanto de vacaciones es máximo ${DIAS_ADELANTO} días hábiles.` }, { status: 400 })
      }
    }

    if (b.tipo === "vacaciones") {
      if (diasHabiles <= 0) {
        return NextResponse.json({ error: "El rango elegido no tiene días hábiles (solo fines de semana o festivos)." }, { status: 400 })
      }
      const solicitudes = await listSolicitudes(s.sub)
      const corte = emp?.vacaciones_corte ?? emp?.fecha_ingreso ?? null
      const saldo = calcularSaldoVacaciones(Number(emp?.vacaciones_saldo_inicial) || 0, corte, solicitudes)
      if (diasHabiles > saldo.maxSolicitable) {
        return NextResponse.json(
          { error: `Solicitas ${diasHabiles} días hábiles pero solo tienes ${saldo.disponible} disponibles. Si necesitas hasta ${DIAS_ADELANTO} días extra, usa “Adelanto de vacaciones”.` },
          { status: 400 },
        )
      }
    }

    const solicitud = await crearSolicitud({
      empleado_id: s.sub,
      tipo: b.tipo,
      fecha_inicio: b.fecha_inicio,
      fecha_fin: b.fecha_fin,
      dias_habiles: diasHabiles,
      dias_calendario: diasCalendario,
      motivo: b.motivo ?? null,
    })
    return NextResponse.json({ solicitud })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase4-ausencias.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}
