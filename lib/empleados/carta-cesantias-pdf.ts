import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import { formatCOP } from "./desprendible"
import { montoEnLetras, formatCedula, fechaLarga } from "./certificado"

// Cartas dirigidas al fondo de cesantías:
//  1) Retiro TOTAL al terminar el contrato (el empleado ya salió).
//  2) Retiro PARCIAL con el empleado activo (causal de ley: vivienda, estudios…).

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}
let firmaCache: Buffer | null = null
function firmaBytes(): Buffer | null {
  if (firmaCache) return firmaCache
  try { firmaCache = readFileSync(path.join(process.cwd(), "public/images/firma-ceo.png")); return firmaCache } catch { return null }
}

function safe(s: string): string {
  return (s ?? "")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[•]/g, "-").replace(/…/g, "...")
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.4, 0.42, 0.48)
const cyan = rgb(0.164, 0.667, 0.702)
const linec = rgb(0.82, 0.84, 0.87)

const EMPRESA = "MediaLab Ingeniería"
const NIT = "901.575.423-8"
const REP = "CHRISTIAN ORLANDO BENAVIDES"

export type EmpleadoCesantias = {
  nombre: string
  cedula: string
  fondo_cesantias: string | null
  fecha_egreso?: string | null
}

/** Andamiaje común: página A4, fuentes, logo, encabezado, y helpers de dibujo. */
async function nuevaCarta() {
  const pdf = await PDFDocument.create()
  const page: PDFPage = pdf.addPage([595.28, 841.89])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())
  const firmaData = firmaBytes()
  const firma = firmaData ? await pdf.embedPng(firmaData) : null

  const H = page.getHeight(), W = page.getWidth(), M = 64
  const contentW = W - 2 * M

  const T = (x: number, top: number, s: string, size = 11, f: PDFFont = font, color = dark) =>
    page.drawText(safe(s), { x, y: H - top, size, font: f, color })
  const TC = (top: number, s: string, size: number, f: PDFFont, color = dark) => {
    const str = safe(s); page.drawText(str, { x: (W - f.widthOfTextAtSize(str, size)) / 2, y: H - top, size, font: f, color })
  }
  const wrap = (text: string, f: PDFFont, size: number, maxW: number): string[] => {
    const out: string[] = []
    for (const w of safe(text).split(/\s+/)) {
      const last = out[out.length - 1]
      if (last && f.widthOfTextAtSize(`${last} ${w}`, size) <= maxW) out[out.length - 1] = `${last} ${w}`
      else out.push(w)
    }
    return out
  }

  // Encabezado
  const logoW = 46, logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: (W - logoW) / 2, y: H - 56 - logoH, width: logoW, height: logoH })
  TC(120, EMPRESA, 15, bold)
  TC(136, `NIT ${NIT}`, 9.5, font, gray)
  page.drawLine({ start: { x: M, y: H - 150 }, end: { x: W - M, y: H - 150 }, thickness: 0.8, color: linec })

  // Firma + pie: se dibujan al final, tras el cuerpo.
  const cerrar = (top: number) => {
    top += 70
    T(M, top, "Atentamente,", 11)
    top += 74
    if (firma) {
      const fw = 120, fh = (firma.height / firma.width) * fw
      page.drawImage(firma, { x: M + 6, y: H - top + 3, width: fw, height: fh })
    }
    page.drawLine({ start: { x: M, y: H - top }, end: { x: M + 230, y: H - top }, thickness: 0.8, color: dark })
    top += 15
    T(M, top, REP, 11, bold)
    top += 14
    T(M, top, `Representante legal — ${EMPRESA}`, 9.5, font, gray)

    T(M, H - 46, `${EMPRESA} · NIT ${NIT} · Bogotá, Colombia`, 8, font, gray)
    T(M, H - 34, "Documento generado por el Portal de Empleados. Válido sin firma manuscrita.", 8, font, gray)
    T(M, H - 22, "https://medialab.design/ · +57 305 4009505 · hello@medialab.design", 7.5, font, gray)
  }

  return { pdf, page, font, bold, H, W, M, contentW, T, TC, wrap, cerrar }
}

/** Carta de retiro TOTAL de cesantías por terminación del contrato (dirigida al fondo). */
export async function generarCartaRetiroCesantiasPDF(e: EmpleadoCesantias, ciudad = "Bogotá D.C."): Promise<Uint8Array> {
  const { pdf, font, bold, M, contentW, T, wrap, cerrar } = await nuevaCarta()
  const fondo = (e.fondo_cesantias || "SU FONDO DE CESANTÍAS").toUpperCase()
  const bodySize = 11.5, lineH = 19
  let top = 190

  T(M, top, `${ciudad}, ${fechaLarga(new Date().toISOString().slice(0, 10))}`, 11); top += 40
  T(M, top, "Señores:", 11); top += 15
  T(M, top, fondo, 11.5, bold); top += 40
  T(M, top, "Estimados Señores:", 11); top += 30

  const cuerpo =
    `Por medio de la presente comunicación solicitamos le sean entregadas las cesantías que se encuentran ` +
    `consignadas en dicho fondo a ${e.nombre}, identificado(a) con la Cédula No. ${formatCedula(e.cedula)}, ` +
    `quien se retiró de nuestra compañía a partir del ${e.fecha_egreso ? fechaLarga(e.fecha_egreso) : "la fecha de terminación del contrato"}.`
  for (const l of wrap(cuerpo, font, bodySize, contentW)) { T(M, top, l, bodySize); top += lineH }
  top += 16
  T(M, top, "Agradecemos la atención prestada.", bodySize)

  cerrar(top)
  return pdf.save()
}

export type RetiroParcialInput = {
  valorSolicitado: number
  inversion: string       // causal: obligación hipotecaria, compra de vivienda, estudios, mejoras…
}

/** Carta de autorización de retiro PARCIAL de cesantías (empleado activo, causal de ley). */
export async function generarCartaRetiroParcialPDF(
  e: EmpleadoCesantias,
  datos: RetiroParcialInput,
  ciudad = "Bogotá D.C.",
): Promise<Uint8Array> {
  const { pdf, page, font, bold, H, M, W, contentW, T, wrap, cerrar } = await nuevaCarta()
  const fondo = (e.fondo_cesantias || "SU FONDO DE CESANTÍAS").toUpperCase()
  const bodySize = 11.5, lineH = 19
  let top = 190

  T(M, top, `${ciudad}, ${fechaLarga(new Date().toISOString().slice(0, 10))}`, 11); top += 34
  T(M, top, "Señores", 11); top += 15
  T(M, top, fondo, 11.5, bold); top += 15
  T(M, top, "Ciudad", 10.5, font, gray); top += 30
  T(M, top, "Asunto: RETIRO PARCIAL DE CESANTÍAS", 11, bold); top += 28
  T(M, top, "Respetados Señores:", 11); top += 26

  const intro =
    `Según lo dispuesto en el artículo 21 de la Ley 1429 de 2010 (modificatoria del Art. 256 del Código ` +
    `Sustantivo del Trabajo) y a la aclaración contenida en la Circular 011 del 7 de febrero de 2011 del ` +
    `Ministerio de la Protección Social, nos permitimos informar que hemos autorizado el retiro parcial de ` +
    `cesantías al trabajador (a) en las siguientes condiciones:`
  for (const l of wrap(intro, font, bodySize, contentW)) { T(M, top, l, bodySize); top += lineH }
  top += 12

  // Tabla de condiciones
  const filas: [string, string][] = [
    ["NOMBRE DEL EMPLEADO:", e.nombre],
    ["IDENTIFICACIÓN:", `C.C. ${formatCedula(e.cedula)}`],
    ["VALOR SOLICITADO:", formatCOP(datos.valorSolicitado)],
    ["INVERSIÓN:", datos.inversion],
  ]
  const rowH = 20, labelW = 178
  for (const [k, v] of filas) {
    page.drawRectangle({ x: M, y: H - top - rowH + 6, width: contentW, height: rowH, borderColor: linec, borderWidth: 0.6 })
    page.drawLine({ start: { x: M + labelW, y: H - top - rowH + 6 }, end: { x: M + labelW, y: H - top + 6 }, thickness: 0.6, color: linec })
    T(M + 6, top, k, 9.5, bold)
    T(M + labelW + 8, top, v, 10)
    top += rowH
  }
  top += 18

  const compromiso =
    `La Empresa se compromete a vigilar la inversión conforme a lo dispuesto por la norma antes citada y según ` +
    `la resolución No. 04250 de 1973, en concordancia con la circular No. 003/74.`
  for (const l of wrap(compromiso, font, bodySize, contentW)) { T(M, top, l, bodySize); top += lineH }

  void W
  cerrar(top)
  return pdf.save()
}
