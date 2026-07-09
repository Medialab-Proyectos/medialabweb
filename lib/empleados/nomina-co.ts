// Reglas de nómina Colombia — aportes del empleado (vigentes 2026).
// SMMLV 2026 = $1.750.905 · Auxilio de transporte 2026 = $249.095
// (Decretos 1469 y 1470 del 29-dic-2025). El auxilio de transporte solo aplica
// a salarios ≤ 2 SMMLV y para trabajo presencial (en remoto no se causa).

export const SMMLV_2026 = 1_750_905
export const AUXILIO_TRANSPORTE_2026 = 249_095

/**
 * Salario mínimo legal (SMMLV) y auxilio de transporte por año en Colombia.
 * Para reconstruir la historia salarial: cada otrosí de "incremento al mínimo"
 * usa el valor del año correspondiente. Verifica cifras contra el decreto vigente.
 */
export const SMMLV_HISTORICO: Record<number, { smmlv: number; auxilio: number }> = {
  2020: { smmlv: 877_803, auxilio: 102_854 },
  2021: { smmlv: 908_526, auxilio: 106_454 },
  2022: { smmlv: 1_000_000, auxilio: 117_172 },
  2023: { smmlv: 1_160_000, auxilio: 140_606 },
  2024: { smmlv: 1_300_000, auxilio: 162_000 },
  2025: { smmlv: 1_423_500, auxilio: 200_000 },
  2026: { smmlv: SMMLV_2026, auxilio: AUXILIO_TRANSPORTE_2026 },
}

/** Salario mínimo + auxilio del año dado (usa el más reciente conocido si falta). */
export function salarioMinimoAnio(anio: number): { smmlv: number; auxilio: number } {
  if (SMMLV_HISTORICO[anio]) return SMMLV_HISTORICO[anio]
  const anios = Object.keys(SMMLV_HISTORICO).map(Number).sort((a, b) => a - b)
  const usar = anios.filter((a) => a <= anio).at(-1) ?? anios.at(-1)!
  return SMMLV_HISTORICO[usar]
}

/** Tope del IBC: 25 SMMLV. */
export const IBC_TOPE = 25 * SMMLV_2026

/**
 * Tasa del Fondo de Solidaridad Pensional (aporte ADICIONAL del empleado),
 * progresiva según múltiplos de SMMLV. Aplica desde 4 SMMLV.
 *   4–16: 1% · 16–17: 1.2% · 17–18: 1.4% · 18–19: 1.6% · 19–20: 1.8% · >20: 2%
 */
export function tasaFSP(ibc: number, smmlv = SMMLV_2026): number {
  const m = ibc / smmlv
  if (m < 4) return 0
  if (m < 16) return 0.01
  if (m < 17) return 0.012
  if (m < 18) return 0.014
  if (m < 19) return 0.016
  if (m < 20) return 0.018
  return 0.02
}

/** Aportes del empleado sobre el IBC: salud 4%, pensión 4% y FSP progresivo. */
export function aportesEmpleado(ibcRaw: number, smmlv = SMMLV_2026) {
  const ibc = Math.min(Math.max(ibcRaw, 0), IBC_TOPE)
  const salud = Math.round(ibc * 0.04)
  const pension = Math.round(ibc * 0.04)
  const tFsp = tasaFSP(ibc, smmlv)
  const fsp = Math.round(ibc * tFsp)
  return { salud, pension, fsp, tasaFsp: tFsp, topeAplicado: ibcRaw > IBC_TOPE }
}
