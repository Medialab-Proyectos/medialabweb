// Horario laboral por empleado (lun–vie) — dominio puro (cliente y servidor).
// Norma: Ley 2101 de 2021 reduce la jornada ordinaria máxima semanal de 48h a 42h de forma
// gradual; el tiempo de alimentación (almuerzo) NO cuenta dentro de la jornada.

export type DiaSemana = "lun" | "mar" | "mie" | "jue" | "vie"
export const DIAS_SEMANA: DiaSemana[] = ["lun", "mar", "mie", "jue", "vie"]
export const DIA_LABEL: Record<DiaSemana, string> = {
  lun: "Lunes", mar: "Martes", mie: "Miércoles", jue: "Jueves", vie: "Viernes",
}

export type DiaHorario = {
  activo: boolean          // ¿trabaja ese día?
  entrada: string          // "08:00"
  salida: string           // "18:00"
  almuerzoInicio: string   // "12:00" ("" = sin almuerzo)
  almuerzoFin: string      // "13:00"
}
export type Horario = Record<DiaSemana, DiaHorario>

export type EstadoHorario = "pendiente" | "aprobado" | "rechazado"
export const ESTADO_HORARIO_LABEL: Record<EstadoHorario, string> = {
  pendiente: "Pendiente de aprobación",
  aprobado: "Aprobado (vigente)",
  rechazado: "Rechazado",
}

/** Jornada diaria ordinaria máxima (horas). */
export const MAX_DIARIO_HORAS = 9

const diaVacio = (): DiaHorario => ({ activo: false, entrada: "08:00", salida: "17:00", almuerzoInicio: "12:00", almuerzoFin: "13:00" })
export function horarioVacio(): Horario {
  return { lun: { ...diaVacio(), activo: true }, mar: { ...diaVacio(), activo: true }, mie: { ...diaVacio(), activo: true }, jue: { ...diaVacio(), activo: true }, vie: { ...diaVacio(), activo: true } }
}

/** "08:30" → 510 (minutos desde medianoche). Vacío/ inválido → 0. */
export function hhmmAMin(s: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec((s || "").trim())
  if (!m) return 0
  return Math.min(23, Number(m[1])) * 60 + Math.min(59, Number(m[2]))
}

/**
 * Tope semanal de la jornada ordinaria según Ley 2101 de 2021 (reducción gradual).
 * Cambia solo con la fecha: 47h (2023) → 46h (2024) → 44h (2025) → 42h (16-jul-2026).
 */
export function capSemanalHoras(fechaISO?: string): number {
  const hoy = fechaISO ? `${fechaISO}` : new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
  if (hoy >= "2026-07-16") return 42
  if (hoy >= "2025-07-16") return 44
  if (hoy >= "2024-07-16") return 46
  if (hoy >= "2023-07-16") return 47
  return 48
}

/** Texto de la norma para mostrar al pie del formulario. */
export function normaJornada(fechaISO?: string): string {
  const cap = capSemanalHoras(fechaISO)
  return `Ley 2101 de 2021: la jornada ordinaria máxima es de ${cap} horas semanales${cap > 42 ? " (baja a 42 h desde el 16 de julio de 2026)" : ""}. El tiempo de almuerzo no cuenta dentro de la jornada.`
}

/** Minutos trabajados en un día = (salida − entrada) − almuerzo. */
export function minutosDia(d: DiaHorario): number {
  if (!d || !d.activo) return 0
  const trabajo = hhmmAMin(d.salida) - hhmmAMin(d.entrada)
  const almuerzo = d.almuerzoInicio && d.almuerzoFin ? Math.max(0, hhmmAMin(d.almuerzoFin) - hhmmAMin(d.almuerzoInicio)) : 0
  return Math.max(0, trabajo - almuerzo)
}
export function minutosSemana(h: Horario): number {
  return DIAS_SEMANA.reduce((a, d) => a + minutosDia(h[d]), 0)
}
export function horasSemana(h: Horario): number {
  return Math.round((minutosSemana(h) / 60) * 100) / 100
}

/** Valida el horario contra la norma (semanal por fecha + máximo diario). */
export function validarHorario(h: Horario, fechaISO?: string): { ok: boolean; error?: string; horasSemana: number; cap: number } {
  const cap = capSemanalHoras(fechaISO)
  for (const dia of DIAS_SEMANA) {
    const d = h[dia]
    if (!d || !d.activo) continue
    if (hhmmAMin(d.salida) <= hhmmAMin(d.entrada)) {
      return { ok: false, error: `${DIA_LABEL[dia]}: la hora de salida debe ser posterior a la de entrada.`, horasSemana: horasSemana(h), cap }
    }
    if (d.almuerzoInicio && d.almuerzoFin) {
      if (hhmmAMin(d.almuerzoFin) <= hhmmAMin(d.almuerzoInicio)) {
        return { ok: false, error: `${DIA_LABEL[dia]}: el fin del almuerzo debe ser posterior al inicio.`, horasSemana: horasSemana(h), cap }
      }
      if (hhmmAMin(d.almuerzoInicio) < hhmmAMin(d.entrada) || hhmmAMin(d.almuerzoFin) > hhmmAMin(d.salida)) {
        return { ok: false, error: `${DIA_LABEL[dia]}: el almuerzo debe quedar dentro de la jornada (entrada–salida).`, horasSemana: horasSemana(h), cap }
      }
    }
    if (minutosDia(d) > MAX_DIARIO_HORAS * 60) {
      return { ok: false, error: `${DIA_LABEL[dia]}: ${(minutosDia(d) / 60).toFixed(1)} h excede el máximo diario de ${MAX_DIARIO_HORAS} h.`, horasSemana: horasSemana(h), cap }
    }
  }
  const hs = horasSemana(h)
  if (hs > cap) {
    return { ok: false, error: `La jornada semanal (${hs.toFixed(1)} h) supera el máximo legal de ${cap} h (Ley 2101 de 2021). El almuerzo no cuenta.`, horasSemana: hs, cap }
  }
  return { ok: true, horasSemana: hs, cap }
}

// ─── Estado actual (¿quién está activo ahora?) ──────────────────────────────
export type EstadoActual = "activo" | "almorzando" | "fuera_horario" | "permiso" | "vacaciones" | "no_configurado"
export const ESTADO_ACTUAL_LABEL: Record<EstadoActual, string> = {
  activo: "Activo",
  almorzando: "Almorzando",
  fuera_horario: "Fuera de horario",
  permiso: "En permiso",
  vacaciones: "En vacaciones",
  no_configurado: "Sin horario",
}

/** Día (lun–vie o null si fin de semana) y minutos del día, en hora de Bogotá. */
export function ahoraBogota(now: Date = new Date()): { dia: DiaSemana | null; minutos: number; hhmm: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value || ""
  const map: Record<string, DiaSemana> = { Mon: "lun", Tue: "mar", Wed: "mie", Thu: "jue", Fri: "vie" }
  const dia = map[get("weekday")] ?? null
  let hh = parseInt(get("hour"), 10) || 0
  if (hh === 24) hh = 0
  const mm = parseInt(get("minute"), 10) || 0
  return { dia, minutos: hh * 60 + mm, hhmm: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}` }
}

/**
 * Estado actual del empleado cruzando su horario vigente con los permisos aprobados.
 * `cobertura`: "vacaciones" | "permiso" si un ausentismo aprobado cubre este momento (tiene prioridad).
 */
export function estadoActual(
  horario: Horario | null,
  dia: DiaSemana | null,
  minutos: number,
  cobertura?: "vacaciones" | "permiso" | null,
): EstadoActual {
  if (cobertura === "vacaciones") return "vacaciones"
  if (cobertura === "permiso") return "permiso"
  if (!horario) return "no_configurado"
  if (!dia) return "fuera_horario"
  const d = horario[dia]
  if (!d || !d.activo) return "fuera_horario"
  if (minutos < hhmmAMin(d.entrada) || minutos >= hhmmAMin(d.salida)) return "fuera_horario"
  if (d.almuerzoInicio && d.almuerzoFin && minutos >= hhmmAMin(d.almuerzoInicio) && minutos < hhmmAMin(d.almuerzoFin)) return "almorzando"
  return "activo"
}
