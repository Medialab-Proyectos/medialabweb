// Tipos y cálculo de liquidaciones (puros, usables en cliente y servidor).
// Reutiliza las fórmulas ya existentes de cesantías/intereses/prima (contrato.ts)
// y añade vacaciones e indemnización por despido (CST art. 64).
import type { LineaNomina } from "./desprendible"
import { calcularCesantias, calcularInteresesCesantias, calcularPrima } from "./contrato"
import { SMMLV_2026 } from "./nomina-co"

export type TipoTerminacion = "justa_causa" | "sin_justa_causa"
export type EstadoLiquidacion = "borrador" | "generada"

/** Causa de terminación del contrato (para el documento legal). */
export type CausaTerminacion = "renuncia" | "despido_sin_justa" | "despido_justa" | "mutuo_acuerdo" | "fin_plazo_obra"

export const CAUSA_TERMINACION_LABEL: Record<CausaTerminacion, string> = {
  renuncia: "Renuncia del empleado",
  despido_sin_justa: "Despido sin justa causa (con indemnización)",
  despido_justa: "Despido con justa causa",
  mutuo_acuerdo: "Terminación por mutuo acuerdo",
  fin_plazo_obra: "Terminación del plazo / obra o labor",
}

/** Solo el despido SIN justa causa genera indemnización (art. 64 CST). */
export function causaConIndemnizacion(c: CausaTerminacion): boolean {
  return c === "despido_sin_justa"
}

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
  causa_terminacion: CausaTerminacion | null
  motivo: string | null
  fecha_ingreso: string | null
  fecha_egreso: string
  salario_basico: number
  auxilio_transporte: number
  base: number
  tipo_contrato: string | null
  fecha_fin_contrato: string | null
  // Salario del último periodo no pagado (devengado).
  salario_dias: number
  salario: number
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
  // Deducciones de ley (se restan del neto).
  salud_empleado: number
  pension_empleado: number
  retencion_fuente: number
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

/**
 * Días laborados según el AÑO COMERCIAL de 360 días (Colombia): cada mes = 30 días.
 * Cuenta el día de retiro (el día trabajado se cuenta hasta el final del día), por eso el +1.
 * Ej.: 2022-10-01 → 2026-07-03 = 1.353 días; 2026-01-01 → 2026-07-03 = 183 días.
 */
export function dias360(inicioISO: string, finISO: string): number {
  const [ay, am, ad] = inicioISO.split("-").map(Number)
  const [by, bm, bd] = finISO.split("-").map(Number)
  const d1 = Math.min(ad || 1, 30)
  const d2 = Math.min(bd || 1, 30)
  const dias = (by - ay) * 360 + (bm - am) * 30 + (d2 - d1)
  return Math.max(0, dias + 1)
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

/** Salario del último periodo aún no pagado: días × salario básico ÷ 30. */
export function calcularSalarioPeriodo(salarioBasico: number, dias: number): number {
  return Math.round(((Number(salarioBasico) || 0) * (Number(dias) || 0)) / 30)
}

/** Aporte del empleado (4% salud o 4% pensión) sobre la base salarial del periodo. */
export function aporteEmpleado4(baseSalarial: number): number {
  return Math.round((Number(baseSalarial) || 0) * 0.04)
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
  diasVacacionesPendientes?: number   // opcional: días ya tomados a restar del acumulado
  diasSalarioPendiente?: number       // días del último periodo de nómina no pagados
  smmlv?: number
}) {
  const base = (Number(input.salarioBasico) || 0) + (Number(input.auxilioTransporte) || 0)
  // Todo se cuenta con el año comercial de 360 días (norma laboral colombiana).
  const diasTotales = dias360(input.fechaIngreso, input.fechaEgreso)

  // Salario del último periodo no pagado + aportes del empleado (4% salud / 4% pensión)
  // sobre esa base salarial. La retención en la fuente la ajusta el CEO (empieza en 0).
  const salarioDias = Number(input.diasSalarioPendiente) || 0
  const salario = calcularSalarioPeriodo(input.salarioBasico, salarioDias)
  const saludEmpleado = aporteEmpleado4(salario)
  const pensionEmpleado = aporteEmpleado4(salario)

  // Cesantías e intereses: desde el 1 de enero del año de egreso (o el ingreso, si
  // ingresó ese mismo año) hasta el egreso, en días 360.
  const corteCesantias = input.fechaIngreso > inicioAnio(input.fechaEgreso) ? input.fechaIngreso : inicioAnio(input.fechaEgreso)
  const cesantiasDias = dias360(corteCesantias, input.fechaEgreso)
  const cesantias = calcularCesantias(base, cesantiasDias)
  const interesesCesantias = calcularInteresesCesantias(cesantias, cesantiasDias)

  // Prima proporcional del semestre en curso (base = básico + auxilio), en días 360.
  const corteSemestre = input.fechaIngreso > inicioSemestre(input.fechaEgreso) ? input.fechaIngreso : inicioSemestre(input.fechaEgreso)
  const primaDias = dias360(corteSemestre, input.fechaEgreso)
  const prima = calcularPrima({ basico: input.salarioBasico, auxilio: input.auxilioTransporte, dias: primaDias })

  // Vacaciones: 15 días por año trabajado (proporción sobre 360). Cada día = salario básico ÷ 30.
  // Es el acumulado; si el empleado ya tomó vacaciones, el CEO resta esos días al revisar.
  const vacacionesDias = Math.round((15 * diasTotales / 360) * 100) / 100
  const vacaciones = calcularVacaciones(input.salarioBasico, vacacionesDias)

  // Indemnización solo si es sin justa causa.
  let indemnizacionDias = 0
  let indemnizacion = 0
  if (input.tipoTerminacion === "sin_justa_causa") {
    const cat = categoriaContrato(input.tipoContrato)
    const diasFaltantes = input.fechaFinContrato ? diasEntre(input.fechaEgreso, input.fechaFinContrato) : 0
    const ind = calcularIndemnizacion({
      categoria: cat,
      salarioBasico: input.salarioBasico,
      diasTrabajados: diasTotales,
      diasFaltantes,
      smmlv: input.smmlv,
    })
    indemnizacionDias = ind.dias
    indemnizacion = ind.valor
  }

  return {
    base, diasTotales,
    salarioDias, salario,
    cesantiasDias, cesantias, interesesCesantias,
    primaDias, prima,
    vacacionesDias, vacaciones,
    indemnizacionDias, indemnizacion,
    saludEmpleado, pensionEmpleado, retencionFuente: 0,
  }
}

/** Suma de los conceptos extra (bonos positivos, deducciones negativas). */
export function sumaOtros(otros: LineaNomina[] | null | undefined): number {
  return (otros || []).reduce((a, l) => a + (Number(l.valor) || 0), 0)
}

/**
 * Neto a pagar al empleado = devengados − deducciones de ley.
 * Devengados: salario del periodo + cesantías + intereses + prima + vacaciones +
 * indemnización + otros conceptos. Deducciones: salud, pensión y retención en la fuente.
 */
export function totalLiquidacion(l: {
  salario?: number; cesantias: number; intereses_cesantias: number; prima: number
  vacaciones: number; indemnizacion: number; otros_conceptos: LineaNomina[]
  salud_empleado?: number; pension_empleado?: number; retencion_fuente?: number
}): number {
  const devengado =
    (Number(l.salario) || 0) +
    (Number(l.cesantias) || 0) +
    (Number(l.intereses_cesantias) || 0) +
    (Number(l.prima) || 0) +
    (Number(l.vacaciones) || 0) +
    (Number(l.indemnizacion) || 0) +
    sumaOtros(l.otros_conceptos)
  const deducido =
    (Number(l.salud_empleado) || 0) +
    (Number(l.pension_empleado) || 0) +
    (Number(l.retencion_fuente) || 0)
  return devengado - deducido
}
