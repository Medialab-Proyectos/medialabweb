import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById, actualizarEmpleado } from "@/lib/empleados/queries"
import {
  getLiquidacionDeEmpleado,
  upsertLiquidacion,
  marcarGenerada,
} from "@/lib/empleados/liquidacion-queries"
import { totalLiquidacion } from "@/lib/empleados/liquidacion"
import { upsertMovimiento, getCuenta } from "@/lib/empleados/contabilidad-queries"
import { getEmpleadoVacacion, listSolicitudes } from "@/lib/empleados/ausencia-queries"
import { calcularSaldoVacaciones } from "@/lib/empleados/ausencia"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

function errFaltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /does not exist|column|schema cache|relation|PGRST205/i.test(msg)
  return {
    body: {
      error: falta
        ? "Falta correr la migración schema-fase8-liquidaciones.sql en Supabase (o NOTIFY pgrst, 'reload schema';)."
        : msg,
    },
    status: falta ? 409 : 500,
  }
}

/** Días hábiles de vacaciones pendientes (todo lo causado y no tomado) a hoy. */
async function vacacionesPendientes(empleadoId: string): Promise<number> {
  try {
    const [emp, solicitudes] = await Promise.all([getEmpleadoVacacion(empleadoId), listSolicitudes(empleadoId)])
    if (!emp) return 0
    const corte = emp.vacaciones_corte ?? emp.fecha_ingreso ?? null
    const saldo = calcularSaldoVacaciones(Number(emp.vacaciones_saldo_inicial) || 0, corte, solicitudes)
    return Math.max(0, Math.round((saldo.saldoInicial + saldo.acumulado - saldo.tomado) * 10) / 10)
  } catch {
    return 0
  }
}

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const empleadoId = new URL(req.url).searchParams.get("empleado_id")
  if (!empleadoId) return NextResponse.json({ error: "Indica empleado_id." }, { status: 400 })
  try {
    const [liquidacion, vacPendientes] = await Promise.all([
      getLiquidacionDeEmpleado(empleadoId),
      vacacionesPendientes(empleadoId),
    ])
    return NextResponse.json({ liquidacion, vacacionesPendientes: vacPendientes })
  } catch (e) {
    const r = errFaltaTabla(e)
    return NextResponse.json({ ...r.body, liquidacion: null, vacacionesPendientes: 0 }, { status: r.status })
  }
}

const linea = z.object({ concepto: z.string().min(1).max(120), valor: z.number() })

const schema = z.object({
  empleado_id: z.string().uuid(),
  generar: z.boolean().default(false),
  cuenta_id: z.string().uuid().nullable().optional(), // si viene al generar, registra el egreso en Contabilidad
  tipo_terminacion: z.enum(["justa_causa", "sin_justa_causa"]),
  motivo: z.string().max(1000).nullable().optional(),
  fecha_ingreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  fecha_egreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  salario_basico: z.number().min(0).default(0),
  auxilio_transporte: z.number().min(0).default(0),
  base: z.number().min(0).default(0),
  tipo_contrato: z.string().max(60).nullable().optional(),
  fecha_fin_contrato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  cesantias_dias: z.number().min(0).default(0),
  cesantias: z.number().min(0).default(0),
  intereses_cesantias: z.number().min(0).default(0),
  prima_dias: z.number().min(0).default(0),
  prima: z.number().min(0).default(0),
  vacaciones_dias: z.number().min(0).default(0),
  vacaciones: z.number().min(0).default(0),
  indemnizacion_dias: z.number().min(0).default(0),
  indemnizacion: z.number().min(0).default(0),
  otros_conceptos: z.array(linea).default([]),
  seguridad_social_pagada: z.boolean().default(false),
  seguridad_social_saldo: z.number().min(0).default(0),
  observaciones: z.string().max(1000).nullable().optional(),
})

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

  if (b.fecha_ingreso && b.fecha_egreso < b.fecha_ingreso) {
    return NextResponse.json({ error: "La fecha de egreso no puede ser anterior a la de ingreso." }, { status: 400 })
  }

  const empleado = await getEmpleadoById(b.empleado_id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  // Estado previo de la liquidación. Una liquidación ya generada es un acto final:
  // no se puede modificar ni regenerar (evita revertir estado y duplicar egresos).
  let yaGenerada = false
  try { yaGenerada = (await getLiquidacionDeEmpleado(b.empleado_id))?.estado === "generada" } catch { yaGenerada = false }
  if (yaGenerada) {
    return NextResponse.json({ error: "La liquidación ya fue generada y no puede modificarse." }, { status: 409 })
  }

  // El total lo recalcula el servidor (fuente de verdad), no el cliente.
  const total = totalLiquidacion({
    cesantias: b.cesantias,
    intereses_cesantias: b.intereses_cesantias,
    prima: b.prima,
    vacaciones: b.vacaciones,
    indemnizacion: b.indemnizacion,
    otros_conceptos: b.otros_conceptos,
  })

  try {
    let liquidacion = await upsertLiquidacion({
      empleado_id: b.empleado_id,
      tipo_terminacion: b.tipo_terminacion,
      motivo: b.motivo ?? null,
      fecha_ingreso: b.fecha_ingreso ?? empleado.fecha_ingreso ?? null,
      fecha_egreso: b.fecha_egreso,
      salario_basico: b.salario_basico,
      auxilio_transporte: b.auxilio_transporte,
      base: b.base,
      tipo_contrato: b.tipo_contrato ?? null,
      fecha_fin_contrato: b.fecha_fin_contrato ?? null,
      cesantias_dias: b.cesantias_dias,
      cesantias: b.cesantias,
      intereses_cesantias: b.intereses_cesantias,
      prima_dias: b.prima_dias,
      prima: b.prima,
      vacaciones_dias: b.vacaciones_dias,
      vacaciones: b.vacaciones,
      indemnizacion_dias: b.indemnizacion_dias,
      indemnizacion: b.indemnizacion,
      otros_conceptos: b.otros_conceptos,
      seguridad_social_pagada: b.seguridad_social_pagada,
      seguridad_social_saldo: b.seguridad_social_saldo,
      total,
      observaciones: b.observaciones ?? null,
      estado: "borrador",
    })

    let empleadoActualizado = null
    let contabilidad: { ok: boolean; aviso?: string } | undefined
    if (b.generar) {
      // Acto final: se marca la liquidación como generada y se cierra el vínculo
      // (estado 'terminado' → el empleado pierde el acceso). La liquidación NO es
      // visible para el empleado en ningún caso.
      liquidacion = await marcarGenerada(liquidacion.id, g.session!.sub)
      if (empleado.estado !== "terminado") {
        empleadoActualizado = await actualizarEmpleado(b.empleado_id, {
          estado: "terminado",
          fecha_egreso: b.fecha_egreso,
        })
      }

      // Auto-registro del egreso en Contabilidad (la liquidación se paga en COP).
      if (b.cuenta_id) {
        try {
          const cuenta = await getCuenta(b.cuenta_id)
          if (!cuenta) {
            contabilidad = { ok: false, aviso: "La liquidación se generó, pero la cuenta indicada no existe." }
          } else if (cuenta.moneda !== "COP") {
            contabilidad = { ok: false, aviso: "La liquidación se generó, pero la cuenta debe estar en COP: no se registró el egreso." }
          } else {
            await upsertMovimiento({
              cuenta_id: b.cuenta_id,
              cuenta_destino_id: null,
              fecha: b.fecha_egreso,
              tipo: "egreso",
              categoria: "liquidacion",
              concepto: `Liquidación de contrato · ${empleado.nombre}`,
              contraparte: empleado.nombre,
              empresa_id: null,
              valor: total,
              tasa: null,
              costo: 0,
              valor_destino: null,
              estado: "realizado",
              referencia: null,
              creado_por: g.session!.sub,
            })
            contabilidad = { ok: true }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error"
          const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
          contabilidad = { ok: false, aviso: falta ? "La liquidación se generó, pero falta correr schema-fase11-contabilidad.sql para registrar el egreso." : "La liquidación se generó, pero no se pudo registrar el egreso en contabilidad." }
        }
      }
    }

    return NextResponse.json({ liquidacion, empleado: empleadoActualizado, contabilidad })
  } catch (e) {
    const r = errFaltaTabla(e)
    return NextResponse.json(r.body, { status: r.status })
  }
}
