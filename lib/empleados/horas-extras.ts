// Horas extra y recargos — dominio puro (cliente y servidor).
// Normativa Colombia (CST): la hora ordinaria se valora sobre la jornada mensual y cada
// recargo se paga con su factor de ley. Las horas extra son constitutivas de salario,
// así que su PROMEDIO mensual entra a la base de cesantías, prima y vacaciones.

export type TipoHoraExtra = "diurna" | "nocturna" | "recargo_nocturno"

export type EstadoHoraExtra = "pendiente" | "aprobada" | "rechazada" | "pagada"

/**
 * Factor de pago por hora según el recargo (CST):
 *  - Hora extra diurna:  +25%  → se paga la hora completa × 1.25
 *  - Hora extra nocturna: +75% → se paga la hora completa × 1.75
 *  - Recargo nocturno:    +35% → solo el recargo (la hora ordinaria ya va en el sueldo) × 0.35
 */
export const RECARGO: Record<TipoHoraExtra, { label: string; factor: number; descripcion: string }> = {
  diurna: { label: "Hora extra diurna", factor: 1.25, descripcion: "Trabajo extra en jornada diurna (+25%)" },
  nocturna: { label: "Hora extra nocturna", factor: 1.75, descripcion: "Trabajo extra en jornada nocturna (+75%)" },
  recargo_nocturno: { label: "Recargo nocturno", factor: 0.35, descripcion: "Hora ordinaria trabajada de noche (+35%)" },
}

export const ESTADO_HORA_EXTRA_LABEL: Record<EstadoHoraExtra, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  pagada: "Pagada",
}

/** Jornada mensual convencional para valorar la hora ordinaria: 30 días × 8 h. */
export const HORAS_MES = 240

/** Valor de una hora ordinaria = salario básico mensual ÷ jornada mensual. */
export function valorHoraOrdinaria(salarioBasicoMensual: number): number {
  return (Number(salarioBasicoMensual) || 0) / HORAS_MES
}

/** Valor total a pagar por N horas de un recargo (redondeado al peso). */
export function valorHorasExtra(salarioBasicoMensual: number, tipo: TipoHoraExtra, horas: number): number {
  return Math.round(valorHoraOrdinaria(salarioBasicoMensual) * RECARGO[tipo].factor * (Number(horas) || 0))
}

export type HoraExtra = {
  id: string
  empleado_id: string
  fecha: string
  tipo: TipoHoraExtra
  horas: number
  /** Valor de la hora ordinaria al momento de reportar (para trazabilidad). */
  valor_hora: number
  /** Valor total del recargo. */
  valor: number
  /** Horas extra = siempre constitutivas de salario (suben la base de prestaciones). */
  constitutivo_salario: boolean
  motivo: string | null
  estado: EstadoHoraExtra
  aprobado_por: string | null
  comentario: string | null
  pagada_en: string | null
  creado_en: string
  decidido_en: string | null
}

/** Meses (aprox.) que abarca la ventana [desde, hasta], mínimo 1. */
export function mesesEntre(desdeISO: string, hastaISO: string): number {
  const dias = Math.max(0, (Date.parse(hastaISO) - Date.parse(desdeISO)) / 86_400_000)
  return Math.max(1, Math.round((dias / 30) * 10) / 10)
}

/**
 * Promedio mensual de las novedades CONSTITUTIVAS de salario en una ventana [desde, hasta].
 * Es lo que se suma a la base de cesantías/prima/vacaciones (como hace el contador).
 * Cuenta las aprobadas y las ya pagadas (ambas fueron salario devengado en el periodo).
 */
export function promedioMensualVariables(items: HoraExtra[], desdeISO: string, hastaISO: string): number {
  const total = items
    .filter((h) => h.constitutivo_salario && (h.estado === "aprobada" || h.estado === "pagada"))
    .filter((h) => h.fecha >= desdeISO && h.fecha <= hastaISO)
    .reduce((a, h) => a + (Number(h.valor) || 0), 0)
  if (total === 0) return 0
  return Math.round(total / mesesEntre(desdeISO, hastaISO))
}

/** Horas extra APROBADAS y aún no pagadas dentro de un rango (entran a la liquidación). */
export function extrasPendientesDePago(items: HoraExtra[], desdeISO: string, hastaISO: string): HoraExtra[] {
  return items.filter((h) => h.estado === "aprobada" && h.fecha >= desdeISO && h.fecha <= hastaISO)
}
