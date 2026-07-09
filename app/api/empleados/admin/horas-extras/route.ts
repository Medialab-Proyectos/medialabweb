import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listHorasExtras } from "@/lib/empleados/horas-extras-queries"

export const runtime = "nodejs"

/** Horas extra de un empleado — para armar la liquidación. Solo el CEO. */
export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })

  const empleadoId = new URL(req.url).searchParams.get("empleado_id")
  if (!empleadoId) return NextResponse.json({ error: "Indica empleado_id." }, { status: 400 })
  try {
    const horas = await listHorasExtras(empleadoId)
    return NextResponse.json({ horas })
  } catch {
    // Tabla opcional (fase 40): si falta la migración, la liquidación sigue sin horas extra.
    return NextResponse.json({ horas: [] })
  }
}
