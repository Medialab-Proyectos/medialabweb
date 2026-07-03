import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listRecibidas } from "@/lib/empleados/evaluacion-queries"

export const runtime = "nodejs"

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    const evaluaciones = await listRecibidas(s.sub, true)
    return NextResponse.json({ evaluaciones })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /does not exist|column|schema cache|relation|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta la tabla evaluaciones. Corre NOTIFY pgrst, 'reload schema'; en Supabase." : msg, evaluaciones: [] },
      { status: falta ? 409 : 500 },
    )
  }
}
