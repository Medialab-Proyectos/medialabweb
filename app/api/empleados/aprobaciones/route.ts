import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listEmpleados, listReportes } from "@/lib/empleados/queries"
import { listSolicitudesDeEmpleados } from "@/lib/empleados/ausencia-queries"
import { listHorasExtrasDeEmpleados } from "@/lib/empleados/horas-extras-queries"

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
    if (ids.length === 0) return NextResponse.json({ solicitudes: [], horasExtras: [] })
    const solicitudes = await listSolicitudesDeEmpleados(ids, false)
    // Horas extra son opcionales (tabla de fase 40): si falta la migración, no rompemos el resto.
    let horasExtras: Awaited<ReturnType<typeof listHorasExtrasDeEmpleados>> = []
    try { horasExtras = await listHorasExtrasDeEmpleados(ids, false) } catch { horasExtras = [] }
    return NextResponse.json({ solicitudes, horasExtras })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr schema-fase4-ausencias.sql en Supabase." : msg, solicitudes: [], horasExtras: [] },
      { status: falta ? 409 : 500 },
    )
  }
}
