import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getPanelActividad } from "@/lib/empleados/actividad-queries"

export const runtime = "nodejs"
// Estado en tiempo real: nunca se cachea del lado del servidor (Next no debe reutilizar respuestas).
export const dynamic = "force-dynamic"
export const revalidate = 0

/** Panel "quién está activo ahora". Solo el CEO. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })
  try {
    const panel = await getPanelActividad()
    // Estado en tiempo real: nunca se cachea (si no, el navegador muestra un estado viejo).
    return NextResponse.json(panel, { headers: { "Cache-Control": "no-store, max-age=0" } })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: msg, empleados: [], resumen: {}, ahora: "" }, { status: 500 })
  }
}
