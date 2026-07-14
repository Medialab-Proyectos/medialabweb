import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getPanelActividad } from "@/lib/empleados/actividad-queries"

export const runtime = "nodejs"

/** Panel "quién está activo ahora". Solo el CEO. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })
  try {
    const panel = await getPanelActividad()
    return NextResponse.json(panel)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: msg, empleados: [], resumen: {}, ahora: "" }, { status: 500 })
  }
}
