// Tipos y utilidades de desprendibles (puras, usables en cliente y servidor).

export type LineaNomina = { codigo?: string; concepto: string; cantidad?: number; valor: number }

export type Desprendible = {
  id: string
  empleado_id: string
  anio: number
  mes: number
  fecha_nomina: string | null
  cargo: string | null
  dias: number
  salario_basico: number
  fondo_pension: string | null
  eps_salud: string | null
  banco: string | null
  cuenta: string | null
  devengos: LineaNomina[]
  deducciones: LineaNomina[]
  base_salarial: number | null
  base_pension: number | null
  base_retencion: number | null
  porc_retencion: number | null
  dias_vac_pend: number | null
  observaciones: string | null
  publicado: boolean
  creado_en: string
  actualizado_en: string
}

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

export function totales(d: Pick<Desprendible, "salario_basico" | "devengos" | "deducciones">) {
  const sum = (arr: LineaNomina[]) => arr.reduce((a, l) => a + (Number(l.valor) || 0), 0)
  const totalDevengos = (Number(d.salario_basico) || 0) + sum(d.devengos || [])
  const totalDeducciones = sum(d.deducciones || [])
  return { totalDevengos, totalDeducciones, neto: totalDevengos - totalDeducciones }
}

/** "$2.350.308" — formato colombiano (punto de miles). */
export function formatCOP(n: number): string {
  const neg = n < 0
  const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${neg ? "-" : ""}$${s}`
}

// ── Número a letras (español, pesos colombianos) ─────────────────────────────
const UNIDADES = [
  "", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ",
  "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE",
]
const DECENAS = ["", "", "VEINTI", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"]
const CENTENAS = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"]

function centenaEnLetras(n: number): string {
  if (n === 0) return ""
  if (n === 100) return "CIEN"
  const c = Math.floor(n / 100)
  const resto = n % 100
  let out = CENTENAS[c]
  if (resto > 0) {
    let dec = ""
    if (resto <= 20) dec = UNIDADES[resto]
    else if (resto < 30) dec = "VEINTI" + UNIDADES[resto - 20]
    else {
      const d = Math.floor(resto / 10)
      const u = resto % 10
      dec = DECENAS[d] + (u ? " Y " + UNIDADES[u] : "")
    }
    out = out ? `${out} ${dec}` : dec
  }
  return out
}

export function numeroALetras(valor: number): string {
  const n = Math.round(Math.abs(valor))
  if (n === 0) return "CERO PESOS M/CTE."
  const millones = Math.floor(n / 1_000_000)
  const miles = Math.floor((n % 1_000_000) / 1000)
  const cientos = n % 1000
  const partes: string[] = []
  if (millones > 0) partes.push(millones === 1 ? "UN MILLON" : `${centenaEnLetras(millones)} MILLONES`)
  if (miles > 0) partes.push(miles === 1 ? "MIL" : `${centenaEnLetras(miles)} MIL`)
  if (cientos > 0) partes.push(centenaEnLetras(cientos))
  return `${partes.join(" ").trim()} PESOS CON CERO CVS M/CTE.`
}
