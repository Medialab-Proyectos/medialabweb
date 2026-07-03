// Helpers para la certificación laboral (formato Certificado_SO.pdf).
import { numeroALetrasBase } from "./desprendible"
import type { Contrato } from "./contrato"

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

/** "2023-09-01" → "1 de septiembre de 2023". */
export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  return `${d} de ${MESES[m - 1]} de ${y}`
}

export function diaEnLetras(n: number): string {
  return numeroALetrasBase(n).toLowerCase()
}

/** "Se expide en la ciudad de Bogotá D.C., a los doce (12) días del mes de … a solicitud del interesado." */
export function clausulaExpedicion(ciudad: string, fecha = new Date()): string {
  const dia = fecha.getDate()
  return `Se expide en la ciudad de ${ciudad}, a los ${diaEnLetras(dia)} (${dia}) días del mes de ${MESES[fecha.getMonth()]} del año ${fecha.getFullYear()}, a solicitud del interesado.`
}

export function montoEnLetras(n: number): string {
  return `${numeroALetrasBase(n).toLowerCase()} pesos m/cte`
}

/** Formatea la cédula con puntos de miles: 1003652248 → 1.003.652.248 */
export function formatCedula(c: string): string {
  return (c || "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

/** Frasea el tipo de contrato para la narrativa. */
export function fraseTipoContrato(tipo: string | null): string {
  const t = (tipo || "").toLowerCase()
  if (t.includes("indefinido")) return "a término indefinido"
  if (t.includes("fijo")) return "a término fijo"
  if (t.includes("obra")) return "de obra o labor"
  if (t.includes("prestaci")) return "de prestación de servicios"
  if (t.includes("aprendiz")) return "de aprendizaje"
  if (t.includes("práctica") || t.includes("practica")) return "de práctica profesional"
  return tipo ? `de ${tipo.toLowerCase()}` : ""
}

/**
 * Narrativa de vinculación desde el historial de contratos (ordenado por fecha).
 * Ej: "vinculado a MediaLab Ingeniería con contrato de prestación de servicios desde el
 *      1 de septiembre de 2023, con contrato de obra o labor desde el 3 de enero de 2024 y
 *      desde el 1 de octubre de 2025 con contrato a término indefinido"
 */
export function narrativaVinculacion(contratos: Contrato[], fechaIngreso: string | null): string {
  // El inicio real del vínculo es la fecha de ingreso del empleado, no la fecha en que
  // se registró el contrato inicial en el sistema (vigente_desde por defecto = hoy).
  // Los otrosíes sí conservan su fecha de vigencia real.
  const inicio = (c: Contrato): string =>
    c.tipo === "inicial" && fechaIngreso ? fechaIngreso : c.vigente_desde

  const hist = [...contratos]
    .filter((c) => c.vigente_desde)
    .map((c) => ({ ...c, _inicio: inicio(c) }))
    .sort((a, b) => a._inicio.localeCompare(b._inicio))

  if (hist.length === 0) {
    return fechaIngreso
      ? `vinculado a MediaLab Ingeniería desde el ${fechaLarga(fechaIngreso)}`
      : "vinculado a MediaLab Ingeniería"
  }

  const items = hist.map((c) => ({ frase: fraseTipoContrato(c.tipo_contrato), fecha: fechaLarga(c._inicio) }))
  let texto: string
  if (items.length === 1) {
    texto = `con contrato ${items[0].frase} desde el ${items[0].fecha}`
  } else {
    const primeros = items.slice(0, -1).map((x) => `con contrato ${x.frase} desde el ${x.fecha}`).join(", ")
    const ultimo = items[items.length - 1]
    texto = `${primeros} y desde el ${ultimo.fecha} con contrato ${ultimo.frase}`
  }
  return `vinculado a MediaLab Ingeniería ${texto}`.replace(/\s{2,}/g, " ")
}
