// Reglas de nómina Colombia — aportes del empleado (vigentes 2026).
// SMMLV 2026 = $1.750.905 · Auxilio de transporte 2026 = $249.095
// (Decretos 1469 y 1470 del 29-dic-2025). El auxilio de transporte solo aplica
// a salarios ≤ 2 SMMLV y para trabajo presencial (en remoto no se causa).

export const SMMLV_2026 = 1_750_905
export const AUXILIO_TRANSPORTE_2026 = 249_095

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
