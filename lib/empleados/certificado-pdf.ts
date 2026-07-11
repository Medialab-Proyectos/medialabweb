import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib"
import type { Contrato } from "./contrato"
import { condicionesVigentes, totalMensualContrato } from "./contrato"
import { formatCOP } from "./desprendible"
import { narrativaVinculacion, montoEnLetras, formatCedula, clausulaExpedicion, fechaLarga, fraseTipoContrato, fraseVinculacion, narrativaCargos } from "./certificado"

/** Une frases con comas y "y" final: [a,b,c] → "a, b y c". */
function unirConY(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ""
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`
}

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}

let firmaCache: Buffer | null = null
function firmaBytes(): Buffer | null {
  if (firmaCache) return firmaCache
  try {
    firmaCache = readFileSync(path.join(process.cwd(), "public/images/firma-ceo.png"))
    return firmaCache
  } catch {
    return null // sin firma escaneada: se deja solo la línea
  }
}

function safe(s: string): string {
  return (s ?? "")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[•]/g, "-").replace(/…/g, "...")
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.4, 0.42, 0.48)
const cyan = rgb(0.164, 0.667, 0.702)
const linec = rgb(0.82, 0.84, 0.87)

type EmpleadoCert = {
  nombre: string
  cedula: string
  cargo: string | null
  fecha_ingreso: string | null
  fecha_egreso: string | null
  estado: "activo" | "terminado" | "suspendido"
}

export type CertOpciones = { conValor: boolean; ciudad?: string }

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = safe(text).split(/\s+/)
  const lines: string[] = []
  let line = ""
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function generarCertificadoPDF(
  empleado: EmpleadoCert,
  contratos: Contrato[],
  opciones: CertOpciones,
): Promise<Uint8Array> {
  const ciudad = opciones.ciudad || "Bogotá D.C."
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())
  const firmaData = firmaBytes()
  const firma = firmaData ? await pdf.embedPng(firmaData) : null

  const H = page.getHeight()
  const W = page.getWidth()
  const M = 64
  const contentW = W - 2 * M

  const T = (x: number, top: number, s: string, size = 11, f: PDFFont = font, color = dark) =>
    page.drawText(safe(s), { x, y: H - top, size, font: f, color })
  const TC = (top: number, s: string, size: number, f: PDFFont, color = dark) => {
    const str = safe(s)
    page.drawText(str, { x: (W - f.widthOfTextAtSize(str, size)) / 2, y: H - top, size, font: f, color })
  }

  // ── Encabezado ──────────────────────────────────────────────────────────────
  const logoW = 46
  const logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: (W - logoW) / 2, y: H - 56 - logoH, width: logoW, height: logoH })
  TC(120, "MediaLab Ingeniería", 15, bold)
  TC(136, "NIT 901.575.423-8", 9.5, font, gray)
  page.drawLine({ start: { x: M, y: H - 150 }, end: { x: W - M, y: H - 150 }, thickness: 0.8, color: linec })

  // ── Título ──────────────────────────────────────────────────────────────────
  TC(210, "CERTIFICA", 14, bold, cyan)

  // ── Cuerpo ──────────────────────────────────────────────────────────────────
  const vigente = condicionesVigentes(contratos)
  const cargo = vigente?.cargo || empleado.cargo || "colaborador"
  // Asignación mensual = TOTAL a pagar (básico + auxilio de transporte + otros devengos fijos = bonificaciones).
  const monto = vigente ? totalMensualContrato(vigente) : 0
  const activo = empleado.estado !== "terminado"

  let cuerpo: string
  if (!activo) {
    // Certificación de FINALIZACIÓN: periodo + tipo de vinculación + ÚLTIMO cargo real (puede
    // venir de un otrosí anterior si el último solo cambió salario) con su descripción, y el
    // desglose del pago: salario básico + cada auxilio/bonificación nombrado con su valor.
    const tipoVinc = vigente ? (fraseTipoContrato(vigente.tipo_contrato) || fraseVinculacion(vigente.tipo_vinculacion)) : ""
    const cargos = narrativaCargos(contratos, empleado.fecha_ingreso)

    const basico = Number(vigente?.salario_basico) || 0
    const extras: string[] = []
    if (Number(vigente?.auxilio_transporte) > 0) extras.push(`un auxilio de transporte de ${formatCOP(Number(vigente!.auxilio_transporte))}`)
    for (const l of vigente?.otros_devengos ?? []) {
      const v = Number(l.valor) || 0
      if (v > 0) extras.push(`${l.concepto?.trim() || "una bonificación"} de ${formatCOP(v)}`)
    }

    cuerpo = `Que ${empleado.nombre}, identificado(a) con la cédula de ciudadanía No. ${formatCedula(empleado.cedula)} de ${ciudad}, estuvo vinculado(a) a MediaLab Ingeniería`
    if (tipoVinc) cuerpo += ` mediante contrato ${tipoVinc}`
    if (empleado.fecha_ingreso) cuerpo += ` desde el ${fechaLarga(empleado.fecha_ingreso)}`
    if (empleado.fecha_egreso) cuerpo += ` hasta el ${fechaLarga(empleado.fecha_egreso)}`
    // Recorrido de cargos con fechas (o el cargo único si no hubo cambios).
    // La descripción/motivo del otrosí NO va en la certificación: solo interesan cargo y fecha.
    cuerpo += `, con ${cargos.texto || `el cargo de ${empleado.cargo || "colaborador"}`}`
    if (basico > 0) {
      cuerpo += `, con un salario mensual de ${montoEnLetras(basico)} (${formatCOP(basico)})`
      if (extras.length) cuerpo += `, más ${unirConY(extras)}`
    }
    cuerpo += "."
  } else {
    const narrativa = narrativaVinculacion(contratos, empleado.fecha_ingreso)
    cuerpo = `Que ${empleado.nombre}, identificado(a) con la cédula de ciudadanía No. ${formatCedula(empleado.cedula)} de ${ciudad}, está ${narrativa}`
    cuerpo += `, desempeñando el cargo de ${cargo}`
    if (opciones.conValor && monto > 0) {
      cuerpo += `, con una asignación mensual de ${montoEnLetras(monto)} (${formatCOP(monto)})`
    }
    cuerpo += "."
  }

  const bodySize = 11.5
  const lineH = 19
  let top = 250
  for (const linea of wrap(cuerpo, font, bodySize, contentW)) {
    T(M, top, linea, bodySize)
    top += lineH
  }

  // ── Cláusula de expedición ──────────────────────────────────────────────────
  top += 14
  for (const linea of wrap(clausulaExpedicion(ciudad), font, bodySize, contentW)) {
    T(M, top, linea, bodySize)
    top += lineH
  }

  // ── Firma ───────────────────────────────────────────────────────────────────
  top += 84
  T(M, top, "Cordialmente,", 11, font, dark)
  top += 78
  // Firma manuscrita del representante legal, apoyada sobre la línea.
  if (firma) {
    const firmaW = 120
    const firmaH = (firma.height / firma.width) * firmaW
    page.drawImage(firma, { x: M + 6, y: H - top + 3, width: firmaW, height: firmaH })
  }
  page.drawLine({ start: { x: M, y: H - top }, end: { x: M + 230, y: H - top }, thickness: 0.8, color: dark })
  top += 15
  T(M, top, "CHRISTIAN ORLANDO BENAVIDES", 11, bold)
  top += 14
  T(M, top, "Representante legal — MediaLab Ingeniería", 9.5, font, gray)

  // ── Pie ─────────────────────────────────────────────────────────────────────
  T(M, H - 46, "MediaLab Ingeniería · NIT 901.575.423-8 · Bogotá, Colombia", 8, font, gray)
  T(M, H - 34, "Documento generado por el Portal de Empleados. Válido sin firma manuscrita.", 8, font, gray)
  T(M, H - 22, "https://medialab.design/ · +57 305 4009505 · hello@medialab.design", 7.5, font, gray)

  return pdf.save()
}
