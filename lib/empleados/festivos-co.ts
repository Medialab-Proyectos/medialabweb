// Festivos de Colombia (Ley 51/1983 "Emiliani" + festivos de Pascua) y conteo de
// días hábiles. Puro (cliente y servidor).

function iso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function parse(s: string): Date {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

/** Domingo de Pascua (algoritmo de Butcher, calendario gregoriano). */
function domingoPascua(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const mes = Math.floor((h + l - 7 * m + 114) / 31)
  const dia = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, mes - 1, dia)
}

function suma(date: Date, dias: number): Date {
  const r = new Date(date)
  r.setDate(r.getDate() + dias)
  return r
}

/** Traslada al lunes siguiente si no cae en lunes (Ley Emiliani). */
function trasladarLunes(date: Date): Date {
  const dow = date.getDay() // 0=Dom … 6=Sáb
  const add = (8 - dow) % 7 // 0 si ya es lunes
  return suma(date, add)
}

/** Set de fechas ISO (YYYY-MM-DD) de los festivos colombianos del año. */
export function festivosColombia(year: number): Set<string> {
  const f = new Set<string>()
  const fijos = [ [1, 1], [5, 1], [7, 20], [8, 7], [12, 8], [12, 25] ] // no se trasladan
  for (const [m, d] of fijos) f.add(iso(new Date(year, m - 1, d)))

  const emiliani = [ [1, 6], [3, 19], [6, 29], [8, 15], [10, 12], [11, 1], [11, 11] ]
  for (const [m, d] of emiliani) f.add(iso(trasladarLunes(new Date(year, m - 1, d))))

  const pascua = domingoPascua(year)
  f.add(iso(suma(pascua, -3))) // Jueves Santo
  f.add(iso(suma(pascua, -2))) // Viernes Santo
  f.add(iso(trasladarLunes(suma(pascua, 39)))) // Ascensión → lunes
  f.add(iso(trasladarLunes(suma(pascua, 60)))) // Corpus Christi → lunes
  f.add(iso(trasladarLunes(suma(pascua, 68)))) // Sagrado Corazón → lunes
  return f
}

const cache: Record<number, Set<string>> = {}
function festivosDe(year: number): Set<string> {
  if (!cache[year]) cache[year] = festivosColombia(year)
  return cache[year]
}

export function esFestivo(fechaISO: string): boolean {
  const d = parse(fechaISO)
  return festivosDe(d.getFullYear()).has(fechaISO)
}

/** True si es día hábil (no sábado, domingo ni festivo). */
export function esHabil(fechaISO: string): boolean {
  const d = parse(fechaISO)
  const dow = d.getDay()
  if (dow === 0 || dow === 6) return false
  return !festivosDe(d.getFullYear()).has(fechaISO)
}

/**
 * Fecha (ISO) hasta la que llegan los próximos N días HÁBILES contados desde hoy
 * (hoy incluido si es hábil). Sirve para "qué viene en los próximos 3 días hábiles"
 * respetando fines de semana y festivos colombianos.
 */
export function horizonteDiasHabiles(desdeISO: string, habiles: number): string {
  const d = parse(desdeISO)
  let contados = esHabil(desdeISO) ? 1 : 0
  let guard = 0
  while (contados < habiles && guard < 60) {
    d.setDate(d.getDate() + 1)
    guard++
    const iso = d.toISOString().slice(0, 10)
    if (esHabil(iso)) contados++
  }
  return d.toISOString().slice(0, 10)
}

/** Días de calendario entre hoy y el horizonte de N días hábiles (para filtrar listas por "dias"). */
export function diasHastaHorizonteHabil(desdeISO: string, habiles: number): number {
  const fin = horizonteDiasHabiles(desdeISO, habiles)
  return Math.round((Date.parse(`${fin}T00:00:00Z`) - Date.parse(`${desdeISO}T00:00:00Z`)) / 86_400_000)
}

/** Cuenta días hábiles entre dos fechas ISO (ambas inclusive). */
export function contarDiasHabiles(inicioISO: string, finISO: string): number {
  const start = parse(inicioISO)
  const end = parse(finISO)
  if (end < start) return 0
  let count = 0
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue
    if (festivosDe(d.getFullYear()).has(iso(d))) continue
    count++
  }
  return count
}

/** Cuenta días calendario entre dos fechas ISO (ambas inclusive). */
export function contarDiasCalendario(inicioISO: string, finISO: string): number {
  const start = parse(inicioISO)
  const end = parse(finISO)
  if (end < start) return 0
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
}
