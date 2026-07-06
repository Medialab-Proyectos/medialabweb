import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession, hashPassword, genPassword } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import {
  listEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  getEmpleadoByCedula,
  getEmpleadoById,
} from "@/lib/empleados/queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO puede gestionar empleados." }, { status: 403 }) }
  return { session: s }
}

/** Envío de credenciales por correo (best-effort, no bloquea la creación). */
async function enviarCredenciales(email: string, nombre: string, cedula: string, password: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.FROM_EMAIL || "MediaLab <no-reply@medialab.design>"
  if (!apiKey) return { sent: false, reason: "sin RESEND_API_KEY" }
  try {
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: email,
      subject: "Tu acceso al Portal de Empleados — MediaLab Ingeniería",
      text: `Hola ${nombre},

Se creó tu cuenta en el Portal de Empleados de MediaLab Ingeniería.

Ingresa en: https://medialab.design/empleados
  • Cédula: ${cedula}
  • Contraseña temporal: ${password}

Por seguridad, cámbiala al iniciar sesión.

— MediaLab Ingeniería`,
    })
    return { sent: true }
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "error" }
  }
}

// ── GET: lista de empleados ───────────────────────────────────────────────────
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const empleados = await listEmpleados()
  return NextResponse.json({ empleados })
}

// ── POST: crear empleado ──────────────────────────────────────────────────────
const crearSchema = z.object({
  cedula: z.string().trim().min(3).max(30),
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  cargo: z.string().trim().max(120).optional().nullable(),
  caja_compensacion: z.string().trim().max(120).optional().nullable(),
  rol: z.enum(["ceo", "lider", "empleado"]).default("empleado"),
  tipo_vinculacion: z.enum(["empleado", "freelance"]).default("empleado"),
  lider_id: z.string().uuid().optional().nullable(),
  fecha_ingreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  particularidades: z.string().trim().max(2000).optional().nullable(),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  let body: z.infer<typeof crearSchema>
  try {
    body = crearSchema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (await getEmpleadoByCedula(body.cedula)) {
    return NextResponse.json({ error: "Ya existe un empleado con esa cédula." }, { status: 409 })
  }

  const password = genPassword(10)
  const empleado = await crearEmpleado({
    cedula: body.cedula,
    nombre: body.nombre,
    email: body.email,
    password_hash: hashPassword(password),
    rol: body.rol,
    lider_id: body.lider_id ?? null,
    cargo: body.cargo ?? null,
    caja_compensacion: body.caja_compensacion ?? null,
    fecha_ingreso: body.fecha_ingreso ?? null,
    particularidades: body.particularidades ?? null,
    tipo_vinculacion: body.tipo_vinculacion,
  })

  const correo = await enviarCredenciales(body.email, body.nombre, body.cedula, password)
  // Devolvemos la contraseña temporal para que el CEO la vea UNA vez (por si el correo falla).
  return NextResponse.json({ empleado, passwordTemporal: password, correoEnviado: correo.sent })
}

// ── PATCH: editar / cerrar contrato / resetear clave ─────────────────────────
const editarSchema = z.object({
  id: z.string().uuid(),
  accion: z.enum(["actualizar", "cerrar_contrato", "suspender", "reactivar", "resetear_clave"]).default("actualizar"),
  nombre: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().optional(),
  cargo: z.string().trim().max(120).nullable().optional(),
  caja_compensacion: z.string().trim().max(120).nullable().optional(),
  rol: z.enum(["ceo", "lider", "empleado"]).optional(),
  tipo_vinculacion: z.enum(["empleado", "freelance"]).optional(),
  lider_id: z.string().uuid().nullable().optional(),
  fecha_ingreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  fecha_egreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  particularidades: z.string().trim().max(2000).nullable().optional(),
})

export async function PATCH(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  let body: z.infer<typeof editarSchema>
  try {
    body = editarSchema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const actual = await getEmpleadoById(body.id)
  if (!actual) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })
  if (actual.lider_id === body.id) return NextResponse.json({ error: "Un empleado no puede ser su propio líder." }, { status: 400 })

  // Resetear contraseña
  if (body.accion === "resetear_clave") {
    const password = genPassword(10)
    await actualizarEmpleado(body.id, { password_hash: hashPassword(password), must_change_password: true })
    const correo = await enviarCredenciales(actual.email, actual.nombre, actual.cedula, password)
    return NextResponse.json({ ok: true, passwordTemporal: password, correoEnviado: correo.sent })
  }

  // Cerrar contrato (fin del vínculo → bloquea el acceso)
  if (body.accion === "cerrar_contrato") {
    const empleado = await actualizarEmpleado(body.id, {
      estado: "terminado",
      fecha_egreso: body.fecha_egreso ?? new Date().toISOString().slice(0, 10),
    })
    return NextResponse.json({ empleado })
  }

  // Suspender (bloqueo temporal → sin fecha de egreso, se puede reactivar)
  if (body.accion === "suspender") {
    const empleado = await actualizarEmpleado(body.id, { estado: "suspendido" })
    return NextResponse.json({ empleado })
  }

  // Reactivar (desde terminado o suspendido)
  if (body.accion === "reactivar") {
    const empleado = await actualizarEmpleado(body.id, { estado: "activo", fecha_egreso: null })
    return NextResponse.json({ empleado })
  }

  // Actualizar datos generales
  const cambios: Record<string, unknown> = {}
  for (const k of ["nombre", "email", "cargo", "caja_compensacion", "rol", "tipo_vinculacion", "lider_id", "fecha_ingreso", "fecha_egreso", "particularidades"] as const) {
    if (body[k] !== undefined) cambios[k] = body[k]
  }
  const ingresoEf = (body.fecha_ingreso !== undefined ? body.fecha_ingreso : actual.fecha_ingreso) as string | null
  const egresoEf = (body.fecha_egreso !== undefined ? body.fecha_egreso : actual.fecha_egreso) as string | null
  if (ingresoEf && egresoEf && egresoEf < ingresoEf) {
    return NextResponse.json({ error: "La fecha de egreso no puede ser anterior a la de ingreso." }, { status: 400 })
  }
  if (Object.keys(cambios).length === 0) return NextResponse.json({ error: "Nada para actualizar." }, { status: 400 })
  const empleado = await actualizarEmpleado(body.id, cambios)
  return NextResponse.json({ empleado })
}
