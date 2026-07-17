// Tipos y utilidades de contratos y primas (puros, usables en cliente y servidor).
import type { LineaNomina } from "./desprendible"
import type { Rol, TipoVinculacion, FreelanceModo } from "./types"
import type { Moneda } from "./freelance"

export type TipoContratoVersion = "inicial" | "otrosi"

/** Conceptos que un otrosí puede ajustar (para decir qué cambia y qué no). */
export type ConceptoAjuste = "salario" | "cargo" | "tipo_contrato" | "jornada" | "lider" | "rol" | "funciones" | "condiciones"

export const CONCEPTO_AJUSTE_LABEL: Record<ConceptoAjuste, string> = {
  salario: "Salario",
  cargo: "Cargo",
  tipo_contrato: "Tipo de contrato",
  jornada: "Jornada",
  lider: "Líder (a quién reporta)",
  rol: "Rol",
  funciones: "Funciones",
  condiciones: "Condiciones adicionales",
}

export type Contrato = {
  id: string
  empleado_id: string
  tipo: TipoContratoVersion
  vigente_desde: string           // ISO date (YYYY-MM-DD)
  // El contrato es la fuente de verdad de estos campos (se sincronizan a la ficha).
  rol: Rol | null                 // rol de acceso; el login usa el del contrato vigente
  tipo_vinculacion: TipoVinculacion | null   // laboral / freelance / prestación
  salario_basico: number
  auxilio_transporte: number
  otros_devengos: LineaNomina[]   // conceptos fijos adicionales { concepto, valor }
  // Pago acordado (freelance / prestación de servicios): reemplaza al salario.
  freelance_modo: FreelanceModo | null
  freelance_tarifa: number | null
  freelance_moneda: Moneda | null
  freelance_meses: number | null  // pago por proyecto: nº de meses (1 = pago único)
  freelance_max_horas_mes?: number | null  // máximo de horas al mes pactado (freelance)
  tipo_contrato: string | null    // término fijo / indefinido / obra o labor
  jornada: string | null
  cargo: string | null
  descripcion: string | null      // descripción / objeto del contrato
  condiciones_adicionales: string | null // cláusulas adicionales (texto libre, otrosí)
  rol_funciones_id: string | null // perfil de funciones (catálogo roles_funciones)
  lider_id: string | null         // a quién reporta (se sincroniza a empleados.lider_id)
  fecha_ingreso: string | null    // fecha de ingreso (contrato inicial → empleados.fecha_ingreso)
  fecha_fin_probable: string | null // fecha probable de finalización (freelance / término fijo)
  fecha_fin: string | null        // finalización real del contrato (contrato finalizado)
  motivo: string | null
  ajustes: ConceptoAjuste[] | null  // otrosí: conceptos que este ajuste modifica
  archivo_path: string | null     // documento FIRMADO en Storage (contrato / otrosí)
  estado: EstadoContrato | null   // 'pendiente_firma' hasta subir el firmado; luego 'firmado'
  enviado_en: string | null       // null = borrador (aún no enviado al empleado)
  firmado_por: "empleado" | "ceo" | null
  firmado_en: string | null
  creado_por: string | null
  creado_en: string
}

export type EstadoContrato = "pendiente_firma" | "firmado"

export const ESTADO_CONTRATO_LABEL: Record<EstadoContrato, string> = {
  pendiente_firma: "Pendiente de firma",
  firmado: "Firmado",
}

/**
 * ¿La versión está firmada (válida)? Los contratos antiguos sin `estado` (null) se
 * consideran firmados para no bloquear a quien ya tenía contrato.
 */
/** Firmado (válido/activo) ⟺ tiene el documento firmado subido. Sin documento no está firmado. */
export function esFirmado(c: Pick<Contrato, "archivo_path">): boolean {
  return !!c.archivo_path
}

/** Borrador: generado pero aún NO enviado al empleado (el CEO lo previsualiza/ajusta). */
export function esBorrador(c: Pick<Contrato, "archivo_path" | "enviado_en">): boolean {
  return !c.archivo_path && !c.enviado_en
}

/** Enviado y esperando la firma del empleado (no tiene aún el documento firmado). */
export function esEnviadoPendiente(c: Pick<Contrato, "archivo_path" | "enviado_en">): boolean {
  return !c.archivo_path && !!c.enviado_en
}

/** ¿La vinculación del contrato cobra por factura (freelance / prestación)? */
export function contratoEsPorFactura(c: Pick<Contrato, "tipo_vinculacion">): boolean {
  return c.tipo_vinculacion === "freelance" || c.tipo_vinculacion === "prestacion_servicios"
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
 * Condiciones vigentes considerando SOLO versiones firmadas. Las versiones
 * 'pendiente_firma' no se hacen vigentes (no cambian rol/pago/estado) hasta que se
 * suba el documento firmado. Es la fuente de verdad para login, pago y beneficios.
 */
export function condicionesVigentesFirmadas(contratos: Contrato[], fechaISO?: string): Contrato | null {
  return condicionesVigentes(contratos.filter(esFirmado), fechaISO)
}

/** ¿Hay al menos una versión firmada? (Si hay contratos pero ninguno firmado → bloqueo). */
export function tieneContratoFirmado(contratos: Contrato[]): boolean {
  return contratos.some(esFirmado)
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
