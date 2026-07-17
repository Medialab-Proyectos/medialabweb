import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listEmpleados, listReportes } from "@/lib/empleados/queries"
import { listSolicitudesDeEmpleados } from "@/lib/empleados/ausencia-queries"
import { listHorasExtrasDeEmpleados } from "@/lib/empleados/horas-extras-queries"
import { listSolicitudesCesantiasDeEmpleados } from "@/lib/empleados/cesantias-solicitud-queries"
import { listHorariosDeEmpleados } from "@/lib/empleados/horario-queries"

export const runtime = "nodejs"

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  try {
    let ids: string[]
    if (s.rol === "ceo") {
      ids = (await listEmpleados()).filter((e) => e.id !== s.sub).map((e) => e.id)
    } else {
      ids = (await listReportes(s.sub)).map((e) => e.id)
    }
    // El horario del propio CEO también debe aprobarlo el CEO (no tiene un superior). Se incluye
    // en SU cola de horarios (los demás módulos siguen excluyendo lo propio).
    const idsHorario = s.rol === "ceo" ? [...ids, s.sub] : ids
    if (ids.length === 0 && idsHorario.length === 0) return NextResponse.json({ solicitudes: [], horasExtras: [], cesantias: [], horarios: [] })
    const solicitudes = ids.length ? await listSolicitudesDeEmpleados(ids, false) : []
    // Módulos opcionales (fases 40/41): si falta la migración, no rompemos el resto.
    let horasExtras: Awaited<ReturnType<typeof listHorasExtrasDeEmpleados>> = []
    try { horasExtras = ids.length ? await listHorasExtrasDeEmpleados(ids, false) : [] } catch { horasExtras = [] }
    let cesantias: Awaited<ReturnType<typeof listSolicitudesCesantiasDeEmpleados>> = []
    try { cesantias = ids.length ? await listSolicitudesCesantiasDeEmpleados(ids, false) : [] } catch { cesantias = [] }
    let horarios: Awaited<ReturnType<typeof listHorariosDeEmpleados>> = []
    try { horarios = await listHorariosDeEmpleados(idsHorario, false) } catch { horarios = [] }
    return NextResponse.json({ solicitudes, horasExtras, cesantias, horarios })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr schema-fase4-ausencias.sql en Supabase." : msg, solicitudes: [], horasExtras: [], cesantias: [], horarios: [] },
      { status: falta ? 409 : 500 },
    )
  }
}
