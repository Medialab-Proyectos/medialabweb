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

/** Frase de respaldo desde la vinculación cuando no hay tipo de contrato (freelance). */
export function fraseVinculacion(vinc: string | null): string {
  if (vinc === "freelance" || vinc === "prestacion_servicios") return "de prestación de servicios"
  return "laboral"
}

/**
 * Último contrato (otrosí o inicial) que fijó un CARGO real, buscando hacia atrás:
 * si el último otrosí solo cambió el salario y dejó el cargo vacío, el cargo vigente
 * es el del otrosí anterior que sí lo definió. Sirve para tomar el último rol + su descripción.
 */
export function ultimoContratoConCargo(contratos: Contrato[]): Contrato | null {
  const hist = [...contratos]
    .filter((c) => c.vigente_desde && (c.cargo ?? "").trim())
    .sort((a, b) => b.vigente_desde.localeCompare(a.vigente_desde))
  return hist[0] ?? null
}

/**
 * Narrativa del RECORRIDO de cargos con sus fechas: "el cargo de X desde el {f1} y de Y
 * desde el {f2}". Solo cuenta los CAMBIOS reales de cargo (ignora otrosíes de solo salario).
 * El primer cargo arranca en la fecha de ingreso; los siguientes, en la vigencia del otrosí.
 * Devuelve además la descripción del último rol (si algún otrosí la trae).
 */
export function narrativaCargos(
  contratos: Contrato[],
  fechaIngreso: string | null,
): { texto: string; descripcion: string; ultimoCargo: string; cambios: number } {
  const inicio = (c: Contrato): string => (c.tipo === "inicial" && fechaIngreso ? fechaIngreso : c.vigente_desde)
  // Orden por fecha de vigencia; dentro del MISMO día, por orden de creación (el último creado
  // representa la decisión final de ese día).
  const hist = [...contratos]
    .filter((c) => c.vigente_desde)
    .map((c) => ({ ...c, _inicio: inicio(c) }))
    .sort((a, b) =>
      a._inicio.localeCompare(b._inicio) ||
      (a.creado_en ?? "").localeCompare(b.creado_en ?? "") ||
      (a.id ?? "").localeCompare(b.id ?? ""),
    )

  // Timeline de cargos: si varias versiones caen el MISMO día, gana el estado final de ese día
  // (evita "de X desde el 9 y de Y desde el 9" cuando los otrosíes quedaron con fecha = hoy).
  const entries: { cargo: string; fechaISO: string }[] = []
  for (const c of hist) {
    const cargo = (c.cargo ?? "").trim()
    if (!cargo) continue
    const last = entries[entries.length - 1]
    if (last && last.fechaISO === c._inicio) last.cargo = cargo
    else if (!last || last.cargo !== cargo) entries.push({ cargo, fechaISO: c._inicio })
  }
  // Colapsa cargos iguales consecutivos (p.ej. A→B→A el mismo día queda en A).
  const cambios = entries.filter((e, i) => i === 0 || e.cargo !== entries[i - 1].cargo)
  if (cambios.length === 0) return { texto: "", descripcion: "", ultimoCargo: "", cambios: 0 }

  const ultimoCargo = cambios[cambios.length - 1].cargo
  const descripcion =
    [...hist].reverse().find((c) => (c.cargo ?? "").trim() === ultimoCargo && (c.descripcion ?? "").trim())?.descripcion?.trim() || ""

  // "el cargo de X desde el {f1} y como Y desde el {f2} y como Z desde el {f3}".
  const partes = cambios.map((x, i) => `${i === 0 ? "el cargo de" : "como"} ${x.cargo} desde el ${fechaLarga(x.fechaISO)}`)
  const texto = partes.length === 1
    ? partes[0]
    : `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`
  return { texto, descripcion, ultimoCargo, cambios: cambios.length }
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
      ? `vinculado(a) a MediaLab Ingeniería desde el ${fechaLarga(fechaIngreso)}`
      : "vinculado(a) a MediaLab Ingeniería"
  }

  const raw = hist.map((c) => ({ frase: fraseTipoContrato(c.tipo_contrato) || fraseVinculacion(c.tipo_vinculacion), fecha: fechaLarga(c._inicio) }))
  // Colapsa versiones consecutivas del MISMO tipo de contrato: un otrosí que solo ajusta el
  // salario NO cambia el tipo, así que cada tipo se menciona una vez con la fecha en que empezó.
  // (Evita "a término indefinido desde X, a término indefinido desde Y, …" cuando nunca cambió.)
  const items = raw.filter((x, i) => i === 0 || x.frase !== raw[i - 1].frase)
  let texto: string
  if (items.length === 1) {
    texto = `con contrato ${items[0].frase} desde el ${items[0].fecha}`
  } else {
    const primeros = items.slice(0, -1).map((x) => `con contrato ${x.frase} desde el ${x.fecha}`).join(", ")
    const ultimo = items[items.length - 1]
    texto = `${primeros} y desde el ${ultimo.fecha} con contrato ${ultimo.frase}`
  }
  return `vinculado(a) a MediaLab Ingeniería ${texto}`.replace(/\s{2,}/g, " ")
}
