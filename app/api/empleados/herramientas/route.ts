import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listHerramientasActivas } from "@/lib/empleados/herramienta-queries"

export const runtime = "nodejs"

/** Herramientas activas visibles para cualquier empleado autenticado. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    return NextResponse.json({ herramientas: await listHerramientasActivas() })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr schema-fase14-herramientas.sql en Supabase." : msg, herramientas: [] },
      { status: falta ? 409 : 500 },
    )
  }
}
