import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { Desprendible, LineaNomina } from "./desprendible"
import { formatCOP, numeroALetras, totales, MESES } from "./desprendible"

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}

/** Reemplaza caracteres que WinAnsi (fuente estándar) no soporta, para no romper el render. */
function safe(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[•]/g, "-")
    .replace(/…/g, "...")
}

function fechaCorta(iso: string | null): string {
  if (!iso) return "-"
  const [y, m, d] = iso.split("-")
  return d && m && y ? `${d}/${m}/${y}` : iso
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.42, 0.44, 0.5)
const cyan = rgb(0.164, 0.667, 0.702)
const soft = rgb(0.96, 0.97, 0.98)
const linec = rgb(0.85, 0.86, 0.88)

export async function generarDesprendiblePDF(
  d: Desprendible,
  empleado: { nombre: string; cedula: string },
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

  // ── Encabezado: logo + empresa + periodo ───────────────────────────────────
  const logoW = 54
  const logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: M, y: H - 44 - logoH, width: logoW, height: logoH })
  const hx = M + logoW + 16
  T(hx, 58, "MEDIALAB INGENIERIA E.U.", 12, bold)
  T(hx, 72, "NIT 901.575.423-8", 8.5, font, gray)
  T(hx, 85, "Comprobante de pago de nomina", 9, bold, cyan)

  TR(W - M, 56, `${MESES[(d.mes || 1) - 1]} ${d.anio}`, 13, bold)
  TR(W - M, 71, `Pago a: ${fechaCorta(d.fecha_nomina)}`, 9, font, gray)
  TR(W - M, 85, `Dias laborados: ${d.dias}`, 9, font, gray)

  hline(100)

  // ── Datos del empleado ──────────────────────────────────────────────────────
  box(M, 108, W - 2 * M, 70)
  const colL = M + 14, valL = M + 92
  const colR = W / 2 + 6, valR = W / 2 + 78
  const lbl = (x: number, top: number, s: string) => T(x, top, s, 7.5, bold, gray)
  const val = (x: number, top: number, s: string) => T(x, top, s || "-", 9.5, bold, dark)
  lbl(colL, 126, "EMPLEADO"); val(valL, 126, empleado.nombre)
  lbl(colL, 145, "CEDULA"); val(valL, 145, `C.C. ${empleado.cedula}`)
  lbl(colL, 164, "CARGO"); val(valL, 164, d.cargo || "-")
  lbl(colR, 126, "PENSION"); val(valR, 126, d.fondo_pension || "-")
  lbl(colR, 145, "SALUD (EPS)"); val(valR, 145, d.eps_salud || "-")
  lbl(colR, 164, "BANCO / CUENTA"); val(valR, 164, `${d.banco || "-"} ${d.cuenta || ""}`.trim())

  // ── Tabla: Devengos | Deducciones ───────────────────────────────────────────
  const { totalDevengos, totalDeducciones, neto } = totales(d)
  const midX = W / 2
  const leftValR = midX - 14
  const rightX = midX + 10
  const rightValR = W - M

  const headTop = 200
  box(M, headTop - 12, W - 2 * M, 16, rgb(0.10, 0.11, 0.14))
  T(colL, headTop, "DEVENGOS", 8.5, bold, rgb(1, 1, 1))
  TR(leftValR, headTop, "VALOR", 8.5, bold, rgb(1, 1, 1))
  T(rightX + 4, headTop, "DEDUCCIONES", 8.5, bold, rgb(1, 1, 1))
  TR(rightValR, headTop, "VALOR", 8.5, bold, rgb(1, 1, 1))
  // divisor vertical
  page.drawLine({ start: { x: midX, y: H - (headTop - 12) }, end: { x: midX, y: H - (headTop + 4) - 16 * 0 }, thickness: 0.5, color: linec })

  const filaTop0 = headTop + 22
  const step = 16
  const izq: LineaNomina[] = [{ concepto: "Salario basico", valor: d.salario_basico }, ...(d.devengos || [])]
  const der: LineaNomina[] = d.deducciones || []
  const filas = Math.max(izq.length, der.length)

  for (let i = 0; i < filas; i++) {
    const top = filaTop0 + i * step
    if (izq[i]) {
      const c = izq[i].codigo ? `${izq[i].codigo}  ${izq[i].concepto}` : izq[i].concepto
      T(colL, top, c, 9, font, dark)
      TR(leftValR, top, formatCOP(izq[i].valor), 9)
    }
    if (der[i]) {
      const c = der[i].codigo ? `${der[i].codigo}  ${der[i].concepto}` : der[i].concepto
      T(rightX + 4, top, c, 9, font, dark)
      TR(rightValR, top, formatCOP(der[i].valor), 9)
    }
  }
  // divisor vertical hasta el final de filas
  const filasFin = filaTop0 + filas * step
  page.drawLine({ start: { x: midX, y: H - (headTop - 12) }, end: { x: midX, y: H - filasFin - 20 }, thickness: 0.5, color: linec })

  // Subtotales
  const subTop = filasFin + 6
  hline(subTop - 12, M, leftValR)
  hline(subTop - 12, rightX, rightValR)
  T(colL, subTop, "Subtotal devengado", 9, bold, gray); TR(leftValR, subTop, formatCOP(totalDevengos), 9.5, bold)
  T(rightX + 4, subTop, "Subtotal deducciones", 9, bold, gray); TR(rightValR, subTop, formatCOP(totalDeducciones), 9.5, bold)

  // ── Neto a pagar ────────────────────────────────────────────────────────────
  const netoTop = subTop + 22
  box(M, netoTop - 13, W - 2 * M, 34, rgb(0.06, 0.16, 0.17))
  T(colL, netoTop + 7, "NETO A PAGAR", 11, bold, rgb(1, 1, 1))
  TR(W - M - 12, netoTop + 8, formatCOP(neto), 15, bold, rgb(0.55, 0.9, 0.93))

  const letrasTop = netoTop + 40
  T(M, letrasTop, `Son: ${numeroALetras(neto)}`, 7.5, font, gray)

  // ── Bases / retención ───────────────────────────────────────────────────────
  const basesTop = letrasTop + 22
  // Dos líneas cortas para que NUNCA se salga del ancho de página.
  const bases1 = [
    `Base salarial: ${formatCOP(d.base_salarial ?? d.salario_basico)}`,
    `Base pension: ${formatCOP(d.base_pension ?? d.salario_basico)}`,
    `Base retencion: ${d.base_retencion != null ? formatCOP(d.base_retencion) : "-"}`,
  ].join("   ·   ")
  const bases2 = [
    `% Retencion: ${d.porc_retencion ?? 0}`,
    `Dias de vacaciones pendientes: ${d.dias_vac_pend ?? 0}`,
  ].join("   ·   ")
  T(M, basesTop, bases1, 8, font, gray)
  T(M, basesTop + 13, bases2, 8, font, gray)
  if (d.observaciones) T(M, basesTop + 28, `Observaciones: ${d.observaciones}`, 8, font, gray)

  // ── Firma ───────────────────────────────────────────────────────────────────
  const firmaTop = basesTop + 80
  hline(firmaTop, M, M + 200, dark, 0.8)
  T(M, firmaTop + 14, empleado.nombre, 9, bold)
  T(M, firmaTop + 27, `C.C. ${empleado.cedula}`, 8, font, gray)

  // ── Pie ─────────────────────────────────────────────────────────────────────
  const generado = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })
  T(M, H - 40, `Documento generado por el Portal de Empleados de MediaLab Ingenieria el ${generado}.`, 7, font, gray)
  T(M, H - 30, "Este comprobante no requiere firma manuscrita para su validez.", 7, font, gray)

  return pdf.save()
}
