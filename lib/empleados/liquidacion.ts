// Tipos y cálculo de liquidaciones (puros, usables en cliente y servidor).
// Reutiliza las fórmulas ya existentes de cesantías/intereses/prima (contrato.ts)
// y añade vacaciones e indemnización por despido (CST art. 64).
import type { LineaNomina } from "./desprendible"
import { calcularCesantias, calcularInteresesCesantias, calcularPrima } from "./contrato"
import { SMMLV_2026 } from "./nomina-co"

export type TipoTerminacion = "justa_causa" | "sin_justa_causa"
export type EstadoLiquidacion = "borrador" | "generada"

/** Categoría de contrato para el cálculo de la indemnización (art. 64 CST). */
export type CategoriaContrato = "indefinido" | "fijo" | "obra"

export const TIPO_TERMINACION_LABEL: Record<TipoTerminacion, string> = {
  justa_causa: "Con justa causa",
  sin_justa_causa: "Sin justa causa (con indemnización)",
}

export type Liquidacion = {
  id: string
  empleado_id: string
  tipo_terminacion: TipoTerminacion
  motivo: string | null
  fecha_ingreso: string | null
  fecha_egreso: string
  salario_basico: number
  auxilio_transporte: number
  base: number
  tipo_contrato: string | null
  fecha_fin_contrato: string | null
  cesantias_dias: number
  cesantias: number
  intereses_cesantias: number
  prima_dias: number
  prima: number
  vacaciones_dias: number
  vacaciones: number
  indemnizacion_dias: number
  indemnizacion: number
  otros_conceptos: LineaNomina[]
  seguridad_social_pagada: boolean
  seguridad_social_saldo: number
  total: number
  carta_path: string | null
  observaciones: string | null
  estado: EstadoLiquidacion
  generado_por: string | null
  generado_en: string | null
  creado_en: string
  actualizado_en: string
}

/** Días calendario entre dos fechas ISO (b − a). Nunca negativo. */
export function diasEntre(aISO: string, bISO: string): number {
  return Math.max(0, Math.round((Date.parse(bISO) - Date.parse(aISO)) / 86_400_000))
}

/** Inicio del año calendario de una fecha ISO. */
function inicioAnio(iso: string): string {
  return `${iso.slice(0, 4)}-01-01`
}

/** Inicio del semestre (para la prima) que contiene la fecha ISO. */
function inicioSemestre(iso: string): string {
  const mes = Number(iso.slice(5, 7))
  return mes <= 6 ? `${iso.slice(0, 4)}-01-01` : `${iso.slice(0, 4)}-07-01`
}

/**
 * Normaliza el texto de tipo de contrato (del contrato o del formulario) a una
 * categoría para la indemnización. Por defecto 'indefinido'.
 */
export function categoriaContrato(texto: string | null | undefined): CategoriaContrato {
  const t = (texto ?? "").toLowerCase()
  if (t.includes("fijo")) return "fijo"
  if (t.includes("obra") || t.includes("labor")) return "obra"
  return "indefinido"
}

/**
 * Vacaciones compensadas en dinero. Cada día hábil de vacación pendiente equivale
 * a un día de salario básico (15 días hábiles/año ≈ medio salario). Base = salario
 * básico SIN auxilio de transporte.
 */
export function calcularVacaciones(salarioBasico: number, diasHabilesPendientes: number): number {
  return Math.round(((Number(salarioBasico) || 0) * (Number(diasHabilesPendientes) || 0)) / 30)
}

/**
 * Indemnización por despido SIN justa causa (CST art. 64).
 *  • Indefinido, salario < 10 SMMLV: 30 días por el primer año + 20 por cada año
 *    adicional (proporcional por fracción).
 *  • Indefinido, salario ≥ 10 SMMLV: 20 días por el primer año + 15 por año adicional.
 *  • Término fijo: salarios que falten hasta el vencimiento del plazo.
 *  • Obra o labor: salarios que falten para terminar la obra, mínimo 15 días.
 * Devuelve { dias, valor }. El "día" se valora sobre el salario básico (÷30).
 */
export function calcularIndemnizacion(input: {
  categoria: CategoriaContrato
  salarioBasico: number
  diasTrabajados: number       // ingreso → egreso (calendario)
  diasFaltantes?: number       // fijo/obra: días calendario hasta el fin del plazo
  smmlv?: number
}): { dias: number; valor: number } {
  const salario = Number(input.salarioBasico) || 0
  const valorDia = salario / 30

  if (input.categoria === "fijo") {
    const dias = Math.max(0, Number(input.diasFaltantes) || 0)
    return { dias, valor: Math.round(dias * valorDia) }
  }
  if (input.categoria === "obra") {
    const dias = Math.max(15, Number(input.diasFaltantes) || 0)
    return { dias, valor: Math.round(dias * valorDia) }
  }

  // Indefinido
  const smmlv = input.smmlv ?? SMMLV_2026
  const menorA10 = salario < 10 * smmlv
  const base1 = menorA10 ? 30 : 20
  const adic = menorA10 ? 20 : 15
  const anios = (Number(input.diasTrabajados) || 0) / 360
  const dias = anios <= 1 ? base1 : base1 + adic * (anios - 1)
  const diasR = Math.round(dias * 100) / 100
  return { dias: diasR, valor: Math.round(diasR * valorDia) }
}

/**
 * Pre-cálculo completo de la liquidación a partir de las condiciones y fechas.
 * Todos los rubros quedan editables por el CEO antes de generar.
 */
export function precalcularLiquidacion(input: {
  tipoTerminacion: TipoTerminacion
  salarioBasico: number
  auxilioTransporte: number
  fechaIngreso: string
  fechaEgreso: string
  tipoContrato: string | null
  fechaFinContrato: string | null
  diasVacacionesPendientes: number    // días hábiles
  smmlv?: number
}) {
  const base = (Number(input.salarioBasico) || 0) + (Number(input.auxilioTransporte) || 0)

  // Cesantías e intereses: desde el 1 de enero del año de egreso (o el ingreso, si
  // ingresó ese mismo año) hasta el egreso. Lo consignado en años anteriores ya está
  // en el fondo; el CEO puede ajustar los días si aplica otro corte.
  const corteCesantias = input.fechaIngreso > inicioAnio(input.fechaEgreso) ? input.fechaIngreso : inicioAnio(input.fechaEgreso)
  const cesantiasDias = diasEntre(corteCesantias, input.fechaEgreso)
  const cesantias = calcularCesantias(base, cesantiasDias)
  const interesesCesantias = calcularInteresesCesantias(cesantias, cesantiasDias)

  // Prima proporcional del semestre en curso (base = básico + auxilio).
  const corteSemestre = input.fechaIngreso > inicioSemestre(input.fechaEgreso) ? input.fechaIngreso : inicioSemestre(input.fechaEgreso)
  const primaDias = diasEntre(corteSemestre, input.fechaEgreso)
  const prima = calcularPrima({ basico: input.salarioBasico, auxilio: input.auxilioTransporte, dias: primaDias })

  // Vacaciones: días hábiles pendientes × salario básico ÷ 30.
  const vacaciones = calcularVacaciones(input.salarioBasico, input.diasVacacionesPendientes)

  // Indemnización solo si es sin justa causa.
  let indemnizacionDias = 0
  let indemnizacion = 0
  if (input.tipoTerminacion === "sin_justa_causa") {
    const cat = categoriaContrato(input.tipoContrato)
    const diasFaltantes = input.fechaFinContrato ? diasEntre(input.fechaEgreso, input.fechaFinContrato) : 0
    const ind = calcularIndemnizacion({
      categoria: cat,
      salarioBasico: input.salarioBasico,
      diasTrabajados: diasEntre(input.fechaIngreso, input.fechaEgreso),
      diasFaltantes,
      smmlv: input.smmlv,
    })
    indemnizacionDias = ind.dias
    indemnizacion = ind.valor
  }

  return {
    base,
    cesantiasDias, cesantias, interesesCesantias,
    primaDias, prima,
    vacacionesDias: Number(input.diasVacacionesPendientes) || 0, vacaciones,
    indemnizacionDias, indemnizacion,
  }
}

/** Suma de los conceptos extra (bonos positivos, deducciones negativas). */
export function sumaOtros(otros: LineaNomina[] | null | undefined): number {
  return (otros || []).reduce((a, l) => a + (Number(l.valor) || 0), 0)
}

/** Neto a pagar al empleado. La seguridad social es informativa: NO se descuenta aquí. */
export function totalLiquidacion(l: {
  cesantias: number; intereses_cesantias: number; prima: number
  vacaciones: number; indemnizacion: number; otros_conceptos: LineaNomina[]
}): number {
  return (
    (Number(l.cesantias) || 0) +
    (Number(l.intereses_cesantias) || 0) +
    (Number(l.prima) || 0) +
    (Number(l.vacaciones) || 0) +
    (Number(l.indemnizacion) || 0) +
    sumaOtros(l.otros_conceptos)
  )
}
