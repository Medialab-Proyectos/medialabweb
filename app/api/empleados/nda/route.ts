import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getNdaEstado } from "@/lib/empleados/nda-queries"

export const runtime = "nodejs"

/** Estado del NDA del empleado en sesión. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  return NextResponse.json(await getNdaEstado(s.sub))
}
