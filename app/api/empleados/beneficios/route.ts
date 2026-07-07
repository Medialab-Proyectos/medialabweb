import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listBeneficiosEmpleado, listTiposBeneficio } from "@/lib/empleados/beneficio-queries"

export const runtime = "nodejs"

function faltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
  return { msg: falta ? "Falta correr schema-fase9-beneficios.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    const beneficios = await listBeneficiosEmpleado(s.sub)
    // El catálogo da nombre/descripción/proveedor de cada tipo (best-effort).
    const tipos = await listTiposBeneficio(true).catch(() => [])
    return NextResponse.json({ beneficios, tipos })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, beneficios: [], tipos: [] }, { status: f.status })
  }
}

// La medicina prepagada la asigna únicamente el CEO (desde Gestión de empleados).
// El empleado ya no puede auto-activarla desde su portal.
export async function POST() {
  return NextResponse.json(
    { error: "La medicina prepagada la asigna la empresa. Consulta con administración." },
    { status: 403 },
  )
}
