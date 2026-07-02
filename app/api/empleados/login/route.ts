import { NextResponse } from "next/server"
import { z } from "zod"
import { getEmpleadoByCedula } from "@/lib/empleados/queries"
import { verifyPassword, setSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"

export const runtime = "nodejs"

const schema = z.object({
  cedula: z.string().trim().min(3).max(30),
  password: z.string().min(1).max(200),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) {
    return NextResponse.json({ error: "El portal aún no está configurado." }, { status: 503 })
  }

  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 })
  }

  const emp = await getEmpleadoByCedula(body.cedula).catch(() => null)
  // Mensaje genérico: no revelamos si la cédula existe.
  if (!emp || !verifyPassword(body.password, emp.password_hash)) {
    return NextResponse.json({ error: "Cédula o contraseña incorrecta." }, { status: 401 })
  }

  await setSession({ sub: emp.id, cedula: emp.cedula, rol: emp.rol, nombre: emp.nombre })
  return NextResponse.json({ ok: true, rol: emp.rol, mustChange: emp.must_change_password })
}
