import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { CesantiasDoc } from "./contrato"
import { formatCOP, numeroALetras } from "./desprendible"

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}

function safe(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[•]/g, "-").replace(/…/g, "...")
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.42, 0.44, 0.5)
const cyan = rgb(0.164, 0.667, 0.702)
const soft = rgb(0.96, 0.97, 0.98)
const linec = rgb(0.85, 0.86, 0.88)

export async function generarCesantiasPDF(
  c: CesantiasDoc,
  empleado: { nombre: string; cedula: string; cargo?: string | null },
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page: PDFPage = pdf.addPage([595.28, 841.89]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())

  const H = page.getHeight()
  const W = page.getWidth()
  const M = 50

  const T = (x: number, top: number, s: string, size = 9, f: PDFFont = font, color = dark) =>
    page.drawText(safe(s), { x, y: H - top, size, font: f, color })
  const TR = (xRight: number, top: number, s: string, size = 9, f: PDFFont = font, color = dark) => {
    const str = safe(s)
    page.drawText(str, { x: xRight - f.widthOfTextAtSize(str, size), y: H - top, size, font: f, color })
  }
  const box = (x: number, top: number, w: number, h: number, color = soft) =>
    page.drawRectangle({ x, y: H - top - h, width: w, height: h, color })
  const hline = (top: number, x1 = M, x2 = W - M, color = linec, thickness = 0.6) =>
    page.drawLine({ start: { x: x1, y: H - top }, end: { x: x2, y: H - top }, thickness, color })

  const total = (Number(c.cesantias) || 0) + (Number(c.intereses) || 0)

  // ── Encabezado ──────────────────────────────────────────────────────────────
  const logoW = 54
  const logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: M, y: H - 44 - logoH, width: logoW, height: logoH })
  const hx = M + logoW + 16
  T(hx, 58, "MEDIALAB INGENIERIA E.U.", 12, bold)
  T(hx, 72, "NIT 901.575.423-8", 8.5, font, gray)
  T(hx, 85, "Comprobante de cesantias", 9, bold, cyan)

  TR(W - M, 58, `Liquidacion ${c.anio}`, 12, bold)
  TR(W - M, 72, `Año ${c.anio}`, 9, font, gray)
  TR(W - M, 85, `Fondo: ${c.fondo || "-"}`, 9, font, gray)

  hline(100)

  // ── Datos del empleado ──────────────────────────────────────────────────────
  box(M, 108, W - 2 * M, 54)
  const colL = M + 14, valL = M + 92
  const colR = W / 2 + 6, valR = W / 2 + 78
  const lbl = (x: number, top: number, s: string) => T(x, top, s, 7.5, bold, gray)
  const val = (x: number, top: number, s: string) => T(x, top, s || "-", 9.5, bold, dark)
  lbl(colL, 126, "EMPLEADO"); val(valL, 126, empleado.nombre)
  lbl(colL, 145, "CEDULA"); val(valL, 145, `C.C. ${empleado.cedula}`)
  lbl(colR, 126, "CARGO"); val(valR, 126, empleado.cargo || "-")
  lbl(colR, 145, "DIAS LIQUIDADOS"); val(valR, 145, String(c.dias))

  // ── Liquidación ─────────────────────────────────────────────────────────────
  const headTop = 190
  box(M, headTop - 12, W - 2 * M, 16, rgb(0.10, 0.11, 0.14))
  T(colL, headTop, "CONCEPTO", 8.5, bold, rgb(1, 1, 1))
  TR(W - M - 12, headTop, "VALOR", 8.5, bold, rgb(1, 1, 1))

  const filas: [string, string][] = [
    ["Base de liquidacion (salario basico + auxilio de transporte)", formatCOP(c.base)],
    ["Dias trabajados en el año", String(c.dias)],
    [`Cesantias (base x dias / 360) - consignadas al fondo`, formatCOP(c.cesantias)],
    ["Intereses a las cesantias (12% anual)", formatCOP(c.intereses)],
  ]
  let top = headTop + 22
  for (const [concepto, v] of filas) {
    T(colL, top, concepto, 9, font, dark)
    if (v) TR(W - M - 12, top, v, 9)
    top += 16
  }

  // ── Total ───────────────────────────────────────────────────────────────────
  const netoTop = top + 12
  box(M, netoTop - 13, W - 2 * M, 34, rgb(0.06, 0.16, 0.17))
  T(colL, netoTop + 7, "TOTAL (CESANTIAS + INTERESES)", 11, bold, rgb(1, 1, 1))
  TR(W - M - 12, netoTop + 8, formatCOP(total), 15, bold, rgb(0.55, 0.9, 0.93))

  const letrasTop = netoTop + 40
  T(M, letrasTop, `Son: ${numeroALetras(total)}`, 7.5, font, gray)
  T(M, letrasTop + 14, "Las cesantias se consignan al fondo; los intereses se pagan directamente al trabajador.", 8, font, gray)
  if (c.observaciones) T(M, letrasTop + 28, `Observaciones: ${c.observaciones}`, 8, font, gray)

  // ── Firma ───────────────────────────────────────────────────────────────────
  const firmaTop = letrasTop + 90
  hline(firmaTop, M, M + 200, dark, 0.8)
  T(M, firmaTop + 14, empleado.nombre, 9, bold)
  T(M, firmaTop + 27, `C.C. ${empleado.cedula}`, 8, font, gray)

  // ── Pie ─────────────────────────────────────────────────────────────────────
  const generado = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })
  T(M, H - 40, `Documento generado por el Portal de Empleados de MediaLab Ingenieria el ${generado}.`, 7, font, gray)
  T(M, H - 30, "Este comprobante no requiere firma manuscrita para su validez.", 7, font, gray)

  return pdf.save()
}
