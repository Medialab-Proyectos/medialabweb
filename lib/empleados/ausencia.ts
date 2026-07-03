// Tipos y cálculo de saldo de vacaciones (puro, cliente y servidor).

export type TipoAusencia =
  | "vacaciones"
  | "permiso_no_remunerado"
  | "licencia_maternidad"
  | "licencia_paternidad"
  | "licencia_luto"
  | "dia_familia"
  | "dia_votacion"
  | "otra"

export type EstadoAusencia = "pendiente" | "aprobada" | "rechazada"

export const TIPO_AUSENCIA_LABEL: Record<TipoAusencia, string> = {
  vacaciones: "Vacaciones",
  permiso_no_remunerado: "Permiso no remunerado",
  licencia_maternidad: "Licencia de maternidad",
  licencia_paternidad: "Licencia de paternidad",
  licencia_luto: "Licencia de luto",
  dia_familia: "Día de la familia",
  dia_votacion: "Día de votación",
  otra: "Otra",
}

export const ESTADO_AUSENCIA_LABEL: Record<EstadoAusencia, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
}

export type SolicitudAusencia = {
  id: string
  empleado_id: string
  tipo: TipoAusencia
  fecha_inicio: string
  fecha_fin: string
  dias_habiles: number
  dias_calendario: number
  motivo: string | null
  estado: EstadoAusencia
  aprobado_por: string | null
  comentario: string | null
  creado_en: string
  decidido_en: string | null
}

// Vacaciones en Colombia: 15 días hábiles por año.
export const DIAS_VACACIONES_ANIO = 15
// Se pueden solicitar hasta 2 días hábiles por adelantado.
export const DIAS_ADELANTO = 2

export function todayISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function diasEntre(aISO: string, bISO: string): number {
  return Math.round((Date.parse(bISO) - Date.parse(aISO)) / 86_400_000)
}

/** Vacaciones acumuladas (proporcional) desde la fecha de corte hasta hoy. */
export function acumuladoVacaciones(corteISO: string | null, hoyISO = todayISO()): number {
  if (!corteISO) return 0
  const dias = Math.max(0, diasEntre(corteISO, hoyISO))
  return (dias / 365.25) * DIAS_VACACIONES_ANIO
}

export type SaldoVacaciones = {
  saldoInicial: number
  acumulado: number
  tomado: number
  pendiente: number
  disponible: number
  /** Máximo solicitable = disponible + adelanto permitido. */
  maxSolicitable: number
}

export function calcularSaldoVacaciones(
  saldoInicial: number,
  corteISO: string | null,
  solicitudes: SolicitudAusencia[],
  hoyISO = todayISO(),
): SaldoVacaciones {
  const acumulado = acumuladoVacaciones(corteISO, hoyISO)
  const vac = solicitudes.filter((s) => s.tipo === "vacaciones")
  const tomado = vac.filter((s) => s.estado === "aprobada").reduce((a, s) => a + Number(s.dias_habiles || 0), 0)
  const pendiente = vac.filter((s) => s.estado === "pendiente").reduce((a, s) => a + Number(s.dias_habiles || 0), 0)
  const disponible = saldoInicial + acumulado - tomado - pendiente
  return {
    saldoInicial,
    acumulado: round1(acumulado),
    tomado,
    pendiente,
    disponible: round1(disponible),
    maxSolicitable: round1(disponible + DIAS_ADELANTO),
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
