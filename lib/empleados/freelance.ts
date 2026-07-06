// Tipos y utilidades de freelance (puros, cliente y servidor).
import { formatCOP } from "./desprendible"

export type Moneda = "COP" | "USD"
export type EstadoFactura = "enviada" | "pagada" | "rechazada"

export type PerfilFreelance = {
  empleado_id: string
  moneda: Moneda
  banco: string | null
  cuenta: string | null
  tipo_cuenta: string | null
  titular: string | null
  documento: string | null
  notas: string | null
  actualizado_en: string
}

export type FacturaFreelance = {
  id: string
  empleado_id: string
  anio: number
  mes: number
  numero: string | null
  concepto: string | null
  moneda: Moneda
  valor: number
  banco: string | null
  cuenta: string | null
  tipo_cuenta: string | null
  titular: string | null
  archivo_path: string | null
  firmado: boolean
  firmante: string | null
  firmado_en: string | null
  estado: EstadoFactura
  pagado_en: string | null
  observaciones: string | null
  creado_en: string
  actualizado_en: string
}

export const ESTADO_FACTURA_LABEL: Record<EstadoFactura, string> = {
  enviada: "Enviada",
  pagada: "Pagada",
  rechazada: "Rechazada",
}

export const MONEDAS: Moneda[] = ["COP", "USD"]

/** Formatea un valor según la moneda: COP con puntos de miles, USD con 2 decimales. */
export function formatMoneda(valor: number, moneda: Moneda): string {
  const n = Number(valor) || 0
  if (moneda === "USD") {
    return `US$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return formatCOP(n)
}
