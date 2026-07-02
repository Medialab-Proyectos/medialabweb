import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession, hashPassword, verifyPassword } from "@/lib/empleados/auth"
import { getEmpleadoByCedula, actualizarEmpleado } from "@/lib/empleados/queries"

export const runtime = "nodejs"

const schema = z.object({
  actual: z.string().min(1),
  nueva: z.string().min(8, "Mínimo 8 caracteres").max(200),
})

export async function POST(req: Request) {
  const sesion = await getSession()
  if (!sesion) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const emp = await getEmpleadoByCedula(sesion.cedula)
  if (!emp || !verifyPassword(body.actual, emp.password_hash)) {
    return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 400 })
  }

  await actualizarEmpleado(emp.id, {
    password_hash: hashPassword(body.nueva),
    must_change_password: false,
  })
  return NextResponse.json({ ok: true })
}
