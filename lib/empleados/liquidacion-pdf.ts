import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { Liquidacion } from "./liquidacion"
import { TIPO_TERMINACION_LABEL } from "./liquidacion"
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

function fechaLarga(iso: string | null): string {
  if (!iso) return "-"
  const [y, m, d] = iso.split("-")
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  return `${Number(d)} de ${meses[Number(m) - 1]} de ${y}`
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.42, 0.44, 0.5)
const cyan = rgb(0.164, 0.667, 0.702)
const soft = rgb(0.96, 0.97, 0.98)
const linec = rgb(0.85, 0.86, 0.88)

export async function generarLiquidacionPDF(
  l: Liquidacion,
  empleado: { nombre: string; cedula: string; cargo?: string | null },
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page: PDFPage = pdf.addPage([595.28, 841.89]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())

  const H = page.getHeight()
  const W = page.getWidth()
  const M = 42

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

  // ── Encabezado ──────────────────────────────────────────────────────────────
  const logoW = 54
  const logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: M, y: H - 44 - logoH, width: logoW, height: logoH })
  const hx = M + logoW + 16
  T(hx, 58, "MEDIALAB INGENIERIA E.U.", 12, bold)
  T(hx, 72, "NIT 901.575.423-8", 8.5, font, gray)
  T(hx, 85, "Liquidacion definitiva de contrato", 9, bold, cyan)

  TR(W - M, 56, "LIQUIDACION", 12, bold)
  TR(W - M, 71, TIPO_TERMINACION_LABEL[l.tipo_terminacion], 8.5, font, gray)
  TR(W - M, 85, `Corte: ${fechaLarga(l.fecha_egreso)}`, 8.5, font, gray)

  hline(100)

  // ── Datos del empleado ──────────────────────────────────────────────────────
  box(M, 108, W - 2 * M, 72)
  const colL = M + 14, valL = M + 96
  const colR = W / 2 + 6, valR = W / 2 + 92
  const lbl = (x: number, top: number, s: string) => T(x, top, s, 7.5, bold, gray)
  const val = (x: number, top: number, s: string) => T(x, top, s || "-", 9.5, bold, dark)
  lbl(colL, 126, "EMPLEADO"); val(valL, 126, empleado.nombre)
  lbl(colL, 145, "CEDULA"); val(valL, 145, `C.C. ${empleado.cedula}`)
  lbl(colL, 164, "CARGO"); val(valL, 164, empleado.cargo || "-")
  lbl(colR, 126, "INGRESO"); val(valR, 126, fechaLarga(l.fecha_ingreso))
  lbl(colR, 145, "RETIRO"); val(valR, 145, fechaLarga(l.fecha_egreso))
  lbl(colR, 164, "SALARIO BASICO"); val(valR, 164, formatCOP(l.salario_basico))

  // ── Rubros de la liquidación ─────────────────────────────────────────────────
  const headTop = 208
  box(M, headTop - 12, W - 2 * M, 16, rgb(0.10, 0.11, 0.14))
  T(colL, headTop, "CONCEPTO", 8.5, bold, rgb(1, 1, 1))
  T(W / 2 + 40, headTop, "DIAS", 8.5, bold, rgb(1, 1, 1))
  TR(W - M - 12, headTop, "VALOR", 8.5, bold, rgb(1, 1, 1))

  type Fila = { concepto: string; dias?: number; valor: number }
  const filas: Fila[] = [
    { concepto: "Cesantias", dias: l.cesantias_dias, valor: l.cesantias },
    { concepto: "Intereses a las cesantias (12% anual)", valor: l.intereses_cesantias },
    { concepto: "Prima de servicios proporcional", dias: l.prima_dias, valor: l.prima },
    { concepto: "Vacaciones compensadas", dias: l.vacaciones_dias, valor: l.vacaciones },
  ]
  if (l.tipo_terminacion === "sin_justa_causa" || l.indemnizacion) {
    filas.push({ concepto: "Indemnizacion por despido (art. 64 CST)", dias: l.indemnizacion_dias, valor: l.indemnizacion })
  }
  for (const o of l.otros_conceptos || []) {
    filas.push({ concepto: o.concepto || "Otro concepto", valor: Number(o.valor) || 0 })
  }

  let top = headTop + 22
  for (const f of filas) {
    T(colL, top, f.concepto, 9, font, dark)
    if (f.dias !== undefined && f.dias !== null) T(W / 2 + 40, top, String(f.dias), 9)
    TR(W - M - 12, top, formatCOP(f.valor), 9)
    hline(top + 5, M, W - M, rgb(0.92, 0.93, 0.95), 0.4)
    top += 18
  }

  // ── Total neto ───────────────────────────────────────────────────────────────
  const netoTop = top + 10
  box(M, netoTop - 13, W - 2 * M, 34, rgb(0.06, 0.16, 0.17))
  T(colL, netoTop + 7, "TOTAL NETO A PAGAR", 11, bold, rgb(1, 1, 1))
  TR(W - M - 12, netoTop + 8, formatCOP(l.total), 15, bold, rgb(0.55, 0.9, 0.93))

  const letrasTop = netoTop + 40
  T(M, letrasTop, `Son: ${numeroALetras(l.total)}`, 8.5, font, gray)

  // ── Seguridad social (informativo) ───────────────────────────────────────────
  let yTop = letrasTop + 22
  const ssTxt = l.seguridad_social_pagada
    ? "Seguridad social del periodo: al dia."
    : `Seguridad social pendiente de aportar por el mes de retiro: ${formatCOP(l.seguridad_social_saldo)}.`
  T(M, yTop, ssTxt, 8, font, gray)
  if (l.motivo) { yTop += 14; T(M, yTop, `Motivo: ${l.motivo}`, 8, font, gray) }
  if (l.observaciones) { yTop += 14; T(M, yTop, `Observaciones: ${l.observaciones}`, 8, font, gray) }

  // ── Firma ───────────────────────────────────────────────────────────────────
  const firmaTop = yTop + 74
  hline(firmaTop, M, M + 200, dark, 0.8)
  T(M, firmaTop + 14, empleado.nombre, 9, bold)
  T(M, firmaTop + 27, `C.C. ${empleado.cedula}`, 8, font, gray)

  // ── Pie ─────────────────────────────────────────────────────────────────────
  const generado = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })
  T(M, H - 40, `Documento generado por el Portal de Empleados de MediaLab Ingenieria el ${generado}.`, 7, font, gray)
  T(M, H - 30, "Liquidacion definitiva de prestaciones sociales.", 7, font, gray)

  return pdf.save()
}
