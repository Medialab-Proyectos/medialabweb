// Tipos y cálculo de saldo de vacaciones (puro, cliente y servidor).

export type TipoAusencia =
  | "vacaciones"
  | "adelanto_vacaciones"
  | "permiso_no_remunerado"
  | "licencia_maternidad"
  | "licencia_paternidad"
  | "licencia_luto"
  | "dia_familia"
  | "dia_votacion"
  | "media_jornada_cumpleanos"
  | "media_jornada_evento"
  | "otra"

export type EstadoAusencia = "pendiente" | "aprobada" | "rechazada"

export const TIPO_AUSENCIA_LABEL: Record<TipoAusencia, string> = {
  vacaciones: "Vacaciones",
  adelanto_vacaciones: "Adelanto de vacaciones",
  permiso_no_remunerado: "Permiso no remunerado",
  licencia_maternidad: "Licencia de maternidad",
  licencia_paternidad: "Licencia de paternidad",
  licencia_luto: "Licencia de luto",
  dia_familia: "Día de la familia",
  dia_votacion: "Día de votación",
  media_jornada_cumpleanos: "Media jornada de cumpleaños (beneficio)",
  media_jornada_evento: "Media jornada por evento (beneficio)",
  otra: "Otra",
}

/** Tipos que descuentan del saldo de vacaciones. */
export const TIPOS_VACACIONALES: TipoAusencia[] = ["vacaciones", "adelanto_vacaciones"]

/**
 * Permisos-beneficio de MEDIA JORNADA (0.5 día hábil): política interna, no de ley.
 * No descuentan del saldo de vacaciones y se piden sobre un solo día.
 */
export const TIPOS_MEDIA_JORNADA: TipoAusencia[] = ["media_jornada_cumpleanos", "media_jornada_evento"]
export const DIAS_MEDIA_JORNADA = 0.5

export function esMediaJornada(tipo: TipoAusencia): boolean {
  return TIPOS_MEDIA_JORNADA.includes(tipo)
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
// Adelanto de vacaciones: máximo 2 días hábiles.
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

/**
 * Separa el acumulado por AÑO CALENDARIO:
 *  - `vencido`: lo causado en años anteriores (hasta el 31/dic del año pasado) →
 *    ya disponible para tomar.
 *  - `enCurso`: lo causado en el año calendario actual → aún se va causando y se
 *    libera al cerrar el año.
 * Ej: a mitad de 2026, todo lo de 2025 y antes está vigente; lo de 2026 va "en curso".
 */
export function desgloseAcumulado(
  corteISO: string | null,
  hoyISO = todayISO(),
): { vencido: number; enCurso: number } {
  if (!corteISO) return { vencido: 0, enCurso: 0 }
  const porDia = DIAS_VACACIONES_ANIO / 365.25
  // Inicio del año calendario actual (frontera entre "vencido" y "en curso").
  const inicioAnio = `${hoyISO.slice(0, 4)}-01-01`
  // Vencido: desde el corte hasta el 1 de enero de este año (si el corte es anterior).
  const diasVencido = Math.max(0, diasEntre(corteISO, inicioAnio))
  // En curso: desde el 1 de enero (o el corte, si ingresó este año) hasta hoy.
  const inicioCurso = corteISO > inicioAnio ? corteISO : inicioAnio
  const diasCurso = Math.max(0, diasEntre(inicioCurso, hoyISO))
  return {
    vencido: diasVencido * porDia,
    enCurso: diasCurso * porDia,
  }
}

export type SaldoVacaciones = {
  saldoInicial: number
  acumulado: number
  /** Días ya causados (años cumplidos) — disponibles. */
  vencido: number
  /** Proporcional del año en curso — todavía no disponible. */
  enCurso: number
  tomado: number
  pendiente: number
  /** Disponible real = saldo inicial + vencido - tomado - pendiente. */
  disponible: number
  /** Del año en curso, aún no exigible (informativo). */
  noDisponible: number
  /** Máximo solicitable = disponible + adelanto permitido. */
  maxSolicitable: number
}

export function calcularSaldoVacaciones(
  saldoInicial: number,
  corteISO: string | null,
  solicitudes: SolicitudAusencia[],
  hoyISO = todayISO(),
): SaldoVacaciones {
  const { vencido, enCurso } = desgloseAcumulado(corteISO, hoyISO)
  // Vacaciones y adelantos de vacaciones descuentan del saldo.
  const vac = solicitudes.filter((s) => TIPOS_VACACIONALES.includes(s.tipo))
  const tomado = vac.filter((s) => s.estado === "aprobada").reduce((a, s) => a + Number(s.dias_habiles || 0), 0)
  const pendiente = vac.filter((s) => s.estado === "pendiente").reduce((a, s) => a + Number(s.dias_habiles || 0), 0)
  const disponible = saldoInicial + vencido - tomado - pendiente
  return {
    saldoInicial,
    acumulado: round1(vencido + enCurso),
    vencido: round1(vencido),
    enCurso: round1(enCurso),
    tomado,
    pendiente,
    disponible: round1(disponible),
    noDisponible: round1(enCurso),
    // Vacaciones normales: solo lo disponible (vencido). El adelanto (máx 2) va por su propio tipo.
    maxSolicitable: round1(Math.max(0, disponible)),
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
