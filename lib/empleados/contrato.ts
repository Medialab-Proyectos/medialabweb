// Tipos y utilidades de contratos y primas (puros, usables en cliente y servidor).
import type { LineaNomina } from "./desprendible"

export type TipoContratoVersion = "inicial" | "otrosi"

export type Contrato = {
  id: string
  empleado_id: string
  tipo: TipoContratoVersion
  vigente_desde: string           // ISO date (YYYY-MM-DD)
  salario_basico: number
  auxilio_transporte: number
  otros_devengos: LineaNomina[]   // conceptos fijos adicionales { concepto, valor }
  tipo_contrato: string | null    // término fijo / indefinido / obra o labor
  jornada: string | null
  cargo: string | null
  motivo: string | null
  archivo_path: string | null     // adjunto en Storage (contrato físico / otrosí)
  creado_por: string | null
  creado_en: string
}

export type PrimaDoc = {
  id: string
  empleado_id: string
  anio: number
  semestre: 1 | 2
  dias: number
  base: number                    // salario básico + auxilio de transporte
  valor: number                   // prima calculada (editable)
  observaciones: string | null
  publicado: boolean
  creado_en: string
  actualizado_en: string
}

export type CesantiasDoc = {
  id: string
  empleado_id: string
  anio: number
  dias: number                    // días trabajados en el año (máx 360)
  base: number                    // salario básico + auxilio de transporte
  cesantias: number               // valor liquidado (editable)
  intereses: number               // intereses 12% anual (editable)
  fondo: string | null            // fondo de cesantías (Porvenir, FNA…)
  observaciones: string | null
  publicado: boolean
  creado_en: string
  actualizado_en: string
}

export const TIPO_VERSION_LABEL: Record<TipoContratoVersion, string> = {
  inicial: "Contrato inicial",
  otrosi: "Otrosí / ajuste",
}

/** Semestre 1 = enero-junio (se paga en junio); semestre 2 = julio-diciembre (se paga en diciembre). */
export const SEMESTRE_LABEL: Record<1 | 2, string> = {
  1: "Primer semestre (junio)",
  2: "Segundo semestre (diciembre)",
}

/**
 * Condiciones vigentes a una fecha dada (por defecto hoy): la versión con mayor
 * `vigente_desde` que ya haya entrado en vigor. Si todas son futuras, toma la más
 * antigua (para no dejar al empleado sin condiciones antes de su primera fecha).
 */
export function condicionesVigentes(contratos: Contrato[], fechaISO?: string): Contrato | null {
  if (!contratos.length) return null
  const hoy = fechaISO ?? new Date().toISOString().slice(0, 10)
  const ordenados = [...contratos].sort((a, b) => a.vigente_desde.localeCompare(b.vigente_desde))
  const vigentes = ordenados.filter((c) => c.vigente_desde <= hoy)
  return vigentes.length ? vigentes[vigentes.length - 1] : ordenados[0]
}

/**
 * Fecha real de inicio de una versión de contrato. El contrato inicial arranca en
 * la fecha de ingreso del empleado, NO en la fecha en que se registró en el sistema
 * (vigente_desde por defecto = hoy). Los otrosíes conservan su propia vigencia.
 */
export function inicioContrato(c: Pick<Contrato, "tipo" | "vigente_desde">, fechaIngreso: string | null): string {
  return c.tipo === "inicial" && fechaIngreso ? fechaIngreso : c.vigente_desde
}

/** Total mensual devengado según el contrato: básico + auxilio de transporte + otros devengos fijos. */
export function totalMensualContrato(
  c: Pick<Contrato, "salario_basico" | "auxilio_transporte" | "otros_devengos">,
): number {
  const otros = (c.otros_devengos || []).reduce((a, l) => a + (Number(l.valor) || 0), 0)
  return (Number(c.salario_basico) || 0) + (Number(c.auxilio_transporte) || 0) + otros
}

/**
 * Prima de servicios (Colombia): (salario básico + auxilio de transporte) × días ÷ 360.
 * En un semestre completo (180 días) equivale a ≈ medio salario base.
 */
export function calcularPrima(input: { basico: number; auxilio: number; dias: number }): number {
  const base = (Number(input.basico) || 0) + (Number(input.auxilio) || 0)
  const dias = Number(input.dias) || 0
  return Math.round((base * dias) / 360)
}

/**
 * Cesantías (Colombia): (salario básico + auxilio de transporte) × días ÷ 360.
 * En un año completo (360 días) equivale a un mes de salario base.
 */
export function calcularCesantias(base: number, dias: number): number {
  return Math.round(((Number(base) || 0) * (Number(dias) || 0)) / 360)
}

/** Intereses a las cesantías: 12% anual proporcional = cesantías × días × 0.12 ÷ 360. */
export function calcularInteresesCesantias(cesantias: number, dias: number): number {
  return Math.round(((Number(cesantias) || 0) * (Number(dias) || 0) * 0.12) / 360)
}
