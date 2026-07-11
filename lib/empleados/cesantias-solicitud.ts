// Solicitud de retiro PARCIAL de cesantías (empleado activo) — dominio puro.
// Las cesantías solo se retiran por causales de ley (vivienda, educación). El empleado
// solicita, el líder/CEO aprueba y la empresa emite la carta dirigida al fondo.

export type CausalCesantias =
  | "compra_vivienda"
  | "mejoras_vivienda"
  | "obligacion_hipotecaria"
  | "educacion"

export type EstadoSolicitudCesantias = "pendiente" | "aprobada" | "rechazada"

export const CAUSAL_CESANTIAS_LABEL: Record<CausalCesantias, string> = {
  compra_vivienda: "Compra de vivienda",
  mejoras_vivienda: "Mejoras o remodelación de vivienda",
  obligacion_hipotecaria: "Pago de obligación hipotecaria",
  educacion: "Educación (propia, cónyuge o hijos)",
}

/** Texto que va en el campo "INVERSIÓN" de la carta al fondo. */
export function inversionDeCausal(c: CausalCesantias): string {
  return CAUSAL_CESANTIAS_LABEL[c]
}

export const ESTADO_SOLICITUD_CESANTIAS_LABEL: Record<EstadoSolicitudCesantias, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
}

export type SolicitudCesantias = {
  id: string
  empleado_id: string
  causal: CausalCesantias
  valor: number
  detalle: string | null
  estado: EstadoSolicitudCesantias
  aprobado_por: string | null
  comentario: string | null
  creado_en: string
  decidido_en: string | null
}
