import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listContratos, crearContrato, actualizarContrato, finalizarContrato, eliminarContrato, getContrato, marcarEnviadoParaFirma, sincronizarEmpleadoDesdeContratos } from "@/lib/empleados/contrato-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { notificarEmpleado } from "@/lib/empleados/notificar"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

const linea = z.object({
  concepto: z.string().min(1).max(120),
  valor: z.number(),
})

const schema = z.object({
  empleado_id: z.string().uuid(),
  tipo: z.enum(["inicial", "otrosi"]),
  vigente_desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rol: z.enum(["ceo", "lider", "empleado"]).default("empleado"),
  tipo_vinculacion: z.enum(["empleado", "freelance", "prestacion_servicios"]).default("empleado"),
  salario_basico: z.number().min(0).default(0),
  auxilio_transporte: z.number().min(0).default(0),
  otros_devengos: z.array(linea).default([]),
  freelance_modo: z.enum(["por_hora", "por_mes", "fijo", "por_proyecto"]).nullable().optional(),
  freelance_tarifa: z.number().min(0).nullable().optional(),
  freelance_moneda: z.enum(["COP", "USD"]).nullable().optional(),
  freelance_meses: z.number().int().min(1).max(120).nullable().optional(),
  tipo_contrato: z.string().max(60).nullable().optional(),
  jornada: z.string().max(60).nullable().optional(),
  cargo: z.string().max(120).nullable().optional(),
  descripcion: z.string().max(2000).nullable().optional(),
  condiciones_adicionales: z.string().max(6000).nullable().optional(),
  rol_funciones_id: z.string().uuid().nullable().optional(),
  lider_id: z.string().uuid().nullable().optional(),
  fecha_ingreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  fecha_fin_probable: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  fecha_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  motivo: z.string().max(500).nullable().optional(),
  ajustes: z.array(z.enum(["salario", "cargo", "tipo_contrato", "jornada", "lider", "rol", "funciones", "condiciones"])).nullable().optional(),
  // Si es true, se avisa al empleado para que descargue, firme y suba el contrato.
  enviar_para_firma: z.boolean().optional(),
})

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const empleadoId = new URL(req.url).searchParams.get("empleado_id")
  if (!empleadoId) return NextResponse.json({ error: "Indica empleado_id." }, { status: 400 })
  try {
    const contratos = await listContratos(empleadoId)
    return NextResponse.json({ contratos })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /does not exist|column|schema cache|relation/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr la migración schema-fase3-contratos.sql en Supabase." : msg, contratos: [] },
      { status: falta ? 409 : 500 },
    )
  }
}

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    const porFactura = b.tipo_vinculacion === "freelance" || b.tipo_vinculacion === "prestacion_servicios"
    const contrato = await crearContrato({
      empleado_id: b.empleado_id,
      tipo: b.tipo,
      vigente_desde: b.vigente_desde,
      rol: b.rol,
      tipo_vinculacion: b.tipo_vinculacion,
      // Laboral: salario. Freelance/prestación: pago acordado (el salario va en 0).
      salario_basico: porFactura ? 0 : b.salario_basico,
      auxilio_transporte: porFactura ? 0 : b.auxilio_transporte,
      otros_devengos: porFactura ? [] : b.otros_devengos,
      freelance_modo: porFactura ? b.freelance_modo ?? null : null,
      freelance_tarifa: porFactura ? b.freelance_tarifa ?? null : null,
      freelance_moneda: porFactura ? b.freelance_moneda ?? null : null,
      freelance_meses: porFactura && b.freelance_modo === "por_proyecto" ? b.freelance_meses ?? null : null,
      tipo_contrato: b.tipo_contrato ?? null,
      jornada: b.jornada ?? null,
      cargo: b.cargo ?? null,
      descripcion: b.descripcion ?? null,
      condiciones_adicionales: b.condiciones_adicionales ?? null,
      rol_funciones_id: b.rol_funciones_id ?? null,
      lider_id: b.lider_id ?? null,
      fecha_ingreso: b.fecha_ingreso ?? null,
      fecha_fin_probable: b.fecha_fin_probable ?? null,
      fecha_fin: b.fecha_fin ?? null,
      motivo: b.motivo ?? null,
      ajustes: b.tipo === "otrosi" ? (b.ajustes ?? null) : null,
      archivo_path: null,
      // Nace pendiente de firma; se activa cuando se sube el documento firmado
      // (por el empleado, o por el CEO al adjuntarlo). No cambia el estado hasta entonces.
      estado: "pendiente_firma",
      enviado_en: null,
      firmado_por: null,
      firmado_en: null,
      creado_por: g.session!.sub,
    })
    // El contrato manda: al firmar se sincronizan rol, vinculación, etc. (aquí aún es
    // pendiente, así que no altera la ficha; la sync se hace efectiva al subir el firmado).
    await sincronizarEmpleadoDesdeContratos(b.empleado_id)
    // Se crea como BORRADOR: el CEO lo previsualiza y luego lo "Envía para firma"
    // (acción PATCH 'enviar'), o sube el documento ya firmado. No se avisa aún.
    return NextResponse.json({ contrato })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      {
        error: falta
          ? "La API de Supabase no ve la tabla 'contratos'. Corre en el SQL Editor: NOTIFY pgrst, 'reload schema'; (o re-ejecuta schema-fase3-contratos.sql)."
          : msg,
      },
      { status: falta ? 409 : 500 },
    )
  }
}

const patchSchema = z.discriminatedUnion("accion", [
  // Editar una versión existente (corregir el contrato inicial o un otrosí).
  schema.partial().extend({ accion: z.literal("editar"), id: z.string().uuid() }),
  // Finalizar (o reabrir) un contrato con una fecha de finalización real.
  z.object({ accion: z.literal("finalizar"), id: z.string().uuid(), fecha_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable() }),
  // Enviar el borrador al empleado para firma (le avisa por correo).
  z.object({ accion: z.literal("enviar"), id: z.string().uuid() }),
])

export async function PATCH(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  let b: z.infer<typeof patchSchema>
  try {
    b = patchSchema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    const previo = await getContrato(b.id)
    if (!previo) return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 })

    if (b.accion === "finalizar") {
      const contrato = await finalizarContrato(b.id, b.fecha_fin)
      return NextResponse.json({ contrato })
    }

    if (b.accion === "enviar") {
      const contrato = await marcarEnviadoParaFirma(b.id)
      const emp = await getEmpleadoById(previo.empleado_id)
      if (emp) {
        await notificarEmpleado(
          emp.email,
          `Tienes un ${previo.tipo === "inicial" ? "contrato" : "otrosí"} por firmar`,
          `Hola ${emp.nombre},\n\nSe generó tu ${previo.tipo === "inicial" ? "contrato" : "otrosí"} en el portal. Ingresa a /empleados/contrato, descárgalo, fírmalo y devuélvelo firmado. Hasta entonces no queda activo.\n\nMediaLab`,
        )
      }
      return NextResponse.json({ contrato })
    }

    // Editar: solo campos de condiciones (no se toca el adjunto ni el creador).
    const porFactura = (b.tipo_vinculacion ?? previo.tipo_vinculacion) === "freelance" || (b.tipo_vinculacion ?? previo.tipo_vinculacion) === "prestacion_servicios"
    const modo = b.freelance_modo ?? previo.freelance_modo
    const contrato = await actualizarContrato(b.id, {
      ...(b.vigente_desde !== undefined ? { vigente_desde: b.vigente_desde } : {}),
      ...(b.rol !== undefined ? { rol: b.rol } : {}),
      ...(b.tipo_vinculacion !== undefined ? { tipo_vinculacion: b.tipo_vinculacion } : {}),
      salario_basico: porFactura ? 0 : b.salario_basico ?? previo.salario_basico,
      auxilio_transporte: porFactura ? 0 : b.auxilio_transporte ?? previo.auxilio_transporte,
      otros_devengos: porFactura ? [] : b.otros_devengos ?? previo.otros_devengos,
      freelance_modo: porFactura ? modo : null,
      freelance_tarifa: porFactura ? b.freelance_tarifa ?? previo.freelance_tarifa : null,
      freelance_moneda: porFactura ? b.freelance_moneda ?? previo.freelance_moneda : null,
      freelance_meses: porFactura && modo === "por_proyecto" ? b.freelance_meses ?? previo.freelance_meses : null,
      ...(b.tipo_contrato !== undefined ? { tipo_contrato: b.tipo_contrato } : {}),
      ...(b.jornada !== undefined ? { jornada: b.jornada } : {}),
      ...(b.cargo !== undefined ? { cargo: b.cargo } : {}),
      ...(b.descripcion !== undefined ? { descripcion: b.descripcion } : {}),
      ...(b.condiciones_adicionales !== undefined ? { condiciones_adicionales: b.condiciones_adicionales } : {}),
      ...(b.rol_funciones_id !== undefined ? { rol_funciones_id: b.rol_funciones_id } : {}),
      ...(b.lider_id !== undefined ? { lider_id: b.lider_id } : {}),
      ...(b.fecha_ingreso !== undefined ? { fecha_ingreso: b.fecha_ingreso } : {}),
      ...(b.fecha_fin_probable !== undefined ? { fecha_fin_probable: b.fecha_fin_probable } : {}),
      ...(b.motivo !== undefined ? { motivo: b.motivo } : {}),
      ...(b.ajustes !== undefined ? { ajustes: b.ajustes } : {}),
    })
    await sincronizarEmpleadoDesdeContratos(previo.empleado_id)
    return NextResponse.json({ contrato })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  const contrato = await getContrato(id)
  await eliminarContrato(id)
  // Reevaluar el contrato vigente y resincronizar la ficha.
  if (contrato) await sincronizarEmpleadoDesdeContratos(contrato.empleado_id)
  return NextResponse.json({ ok: true })
}
