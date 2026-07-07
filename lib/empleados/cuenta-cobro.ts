// Tipos y utilidades de cuentas de cobro (puros, cliente y servidor).
import type { Moneda } from "./freelance"

export type EmisorCuentaCobro = "empresa" | "personal"
export type ModoCuentaCobro = "por_hora" | "por_mes"
export type EstadoCuentaCobro = "borrador" | "emitida" | "pagada"

export type CuentaCobro = {
  id: string
  numero: string | null
  emisor: EmisorCuentaCobro
  empresa_id: string | null
  contrato_empresa_id: string | null
  modo: ModoCuentaCobro
  cantidad: number
  tarifa: number
  moneda: Moneda
  mes_servicio: string | null
  concepto: string | null
  cuenta_id: string | null
  fecha_emision: string | null
  fecha_pago: string | null
  observaciones: string | null
  estado: EstadoCuentaCobro
  creado_por: string | null
  creado_en: string
  actualizado_en: string
}

export const EMISOR_LABEL: Record<EmisorCuentaCobro, string> = {
  empresa: "A nombre de la empresa (con logo)",
  personal: "A nombre personal del CEO",
}

export const MODO_LABEL: Record<ModoCuentaCobro, string> = {
  por_hora: "Por hora",
  por_mes: "Por mes",
}

export const ESTADO_CC_LABEL: Record<EstadoCuentaCobro, string> = {
  borrador: "Borrador",
  emitida: "Emitida",
  pagada: "Pagada",
}

/** Datos de la empresa emisora (MediaLab). */
export const MEDIALAB_EMISOR = { nombre: "MEDIALAB INGENIERIA E.U.", nit: "901.575.423-8" }

/** Total = cantidad × tarifa. */
export function totalCuentaCobro(cc: Pick<CuentaCobro, "cantidad" | "tarifa">): number {
  return (Number(cc.cantidad) || 0) * (Number(cc.tarifa) || 0)
}
