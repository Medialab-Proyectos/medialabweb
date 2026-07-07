import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { FacturaFreelance } from "./freelance"
import { formatMoneda } from "./freelance"
import { numeroALetrasBase, MESES } from "./desprendible"
import { MEDIALAB_EMISOR } from "./cuenta-cobro"

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}

function safe(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[•]/g, "-").replace(/…/g, "...")
    .replace(/[áÁ]/g, (m) => (m === "á" ? "a" : "A")).replace(/[éÉ]/g, (m) => (m === "é" ? "e" : "E"))
    .replace(/[íÍ]/g, (m) => (m === "í" ? "i" : "I")).replace(/[óÓ]/g, (m) => (m === "ó" ? "o" : "O"))
    .replace(/[úÚ]/g, (m) => (m === "ú" ? "u" : "U")).replace(/[ñÑ]/g, (m) => (m === "ñ" ? "n" : "N"))
}

function fechaCorta(iso: string | null): string {
  if (!iso) return "-"
  return iso.slice(0, 10)
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.42, 0.44, 0.5)
const cyan = rgb(0.164, 0.667, 0.702)
const soft = rgb(0.96, 0.97, 0.98)
const linec = rgb(0.85, 0.86, 0.88)

/** Genera la factura / cuenta de cobro del freelance (emitida por él a MediaLab). */
export async function generarFacturaFreelancePDF(
  f: FacturaFreelance,
  emisor: { nombre: string; cedula: string; telefono?: string | null; email?: string | null },
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page: PDFPage = pdf.addPage([595.28, 841.89]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const H = page.getHeight()
  const W = page.getWidth()
  const M = 42

  const T = (x: number, top: number, s: string, size = 9, ft: PDFFont = font, color = dark) =>
    page.drawText(safe(s), { x, y: H - top, size, font: ft, color })
  const TR = (xRight: number, top: number, s: string, size = 9, ft: PDFFont = font, color = dark) => {
    const str = safe(s)
    page.drawText(str, { x: xRight - ft.widthOfTextAtSize(str, size), y: H - top, size, font: ft, color })
  }
  const box = (x: number, top: number, w: number, h: number, color = soft) =>
    page.drawRectangle({ x, y: H - top - h, width: w, height: h, color })
  const hline = (top: number, x1 = M, x2 = W - M, color = linec, thickness = 0.6) =>
    page.drawLine({ start: { x: x1, y: H - top }, end: { x: x2, y: H - top }, thickness, color })

  // ── Encabezado con logo de MediaLab ───────────────────────────────────────
  const logo = await pdf.embedPng(logoBytes())
  const logoW = 54
  const logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: M, y: H - 44 - logoH, width: logoW, height: logoH })
  const hx = M + logoW + 16
  T(hx, 58, MEDIALAB_EMISOR.nombre, 12, bold)
  T(hx, 72, `NIT ${MEDIALAB_EMISOR.nit}`, 8.5, font, gray)
  TR(W - M, 56, "CUENTA DE COBRO", 12, bold)
  if (f.numero) TR(W - M, 71, `N.º ${f.numero}`, 9, font, gray)
  TR(W - M, 85, `${MESES[f.mes - 1]} ${f.anio}`, 8.5, font, gray)

  hline(100)

  // ── Emisor (quien cobra) y destinatario (quien paga) ──────────────────────
  box(M, 108, W - 2 * M, 40)
  const colL = M + 14, valL = M + 70
  const lbl = (x: number, top: number, s: string) => T(x, top, s, 7.5, bold, gray)
  const val = (x: number, top: number, s: string) => T(x, top, s || "-", 9.5, bold, dark)
  lbl(colL, 126, "DE"); val(valL, 126, `${emisor.nombre}  -  C.C. ${emisor.cedula}`)
  lbl(colL, 143, "PARA"); val(valL, 143, `${MEDIALAB_EMISOR.nombre}  -  NIT ${MEDIALAB_EMISOR.nit}`)

  // ── Detalle ───────────────────────────────────────────────────────────────
  const headTop = 182
  box(M, headTop - 12, W - 2 * M, 16, rgb(0.10, 0.11, 0.14))
  T(colL, headTop, "CONCEPTO", 8.5, bold, rgb(1, 1, 1))
  TR(W - M - 12, headTop, "VALOR", 8.5, bold, rgb(1, 1, 1))

  // Concepto puede ser largo: se parte en líneas simples.
  const concepto = safe(f.concepto || "Servicios prestados")
  const maxW = W - 2 * M - 90
  const palabras = concepto.split(/\s+/)
  const lineas: string[] = []
  let linea = ""
  for (const p of palabras) {
    const test = linea ? `${linea} ${p}` : p
    if (font.widthOfTextAtSize(test, 9) > maxW && linea) { lineas.push(linea); linea = p }
    else linea = test
  }
  if (linea) lineas.push(linea)

  let top = headTop + 22
  lineas.forEach((ln, i) => {
    T(colL, top, ln, 9, font, dark)
    if (i === 0) TR(W - M - 12, top, formatMoneda(f.valor, f.moneda), 9)
    top += 15
  })
  if (f.horas != null && Number(f.horas) > 0) {
    T(colL, top, `${Number(f.horas)} horas trabajadas`, 8.5, font, gray)
    top += 13
  }
  T(colL, top, `Periodo de servicio: ${MESES[f.mes - 1]} ${f.anio}`, 8.5, font, gray)
  top += 6
  hline(top, M, W - M, rgb(0.92, 0.93, 0.95), 0.4)

  // ── Total ─────────────────────────────────────────────────────────────────
  const netoTop = top + 14
  box(M, netoTop - 13, W - 2 * M, 34, rgb(0.06, 0.16, 0.17))
  T(colL, netoTop + 7, "TOTAL A PAGAR", 11, bold, rgb(1, 1, 1))
  TR(W - M - 12, netoTop + 8, formatMoneda(f.valor, f.moneda), 15, bold, rgb(0.55, 0.9, 0.93))

  const monedaPalabra = f.moneda === "USD" ? "DOLARES" : "PESOS"
  T(M, netoTop + 40, `Son: ${numeroALetrasBase(f.valor)} ${monedaPalabra} M/CTE.`, 8.5, font, gray)

  // ── Datos de pago ─────────────────────────────────────────────────────────
  let y = netoTop + 66
  T(M, y, "Consignar / transferir a:", 9, bold, cyan)
  y += 15
  const partes = [f.banco, f.cuenta && `Cuenta ${f.cuenta}`, f.tipo_cuenta].filter(Boolean).join(" - ")
  T(M, y, partes || "(datos de pago por definir)", 9, font, dark)
  if (f.titular) { y += 14; T(M, y, `Titular: ${f.titular}`, 8.5, font, gray) }

  // ── Firma ─────────────────────────────────────────────────────────────────
  const firmaTop = y + 76
  hline(firmaTop, M, M + 200, dark, 0.8)
  T(M, firmaTop + 14, emisor.nombre, 9, bold)
  T(M, firmaTop + 27, `C.C. ${emisor.cedula}`, 8, font, gray)
  let sy = firmaTop + 40
  const contacto = [emisor.email, emisor.telefono].filter(Boolean).join("   -   ")
  if (contacto) { T(M, sy, contacto, 7.5, font, gray); sy += 12 }
  if (f.firmado) T(M, sy, `Firmada digitalmente el ${fechaCorta(f.firmado_en)}.`, 7.5, font, gray)

  T(M, H - 26, "https://medialab.design/ · +57 305 4009505 · hello@medialab.design", 7, font, gray)

  return pdf.save()
}
