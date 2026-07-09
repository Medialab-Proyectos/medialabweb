import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { Liquidacion } from "./liquidacion"
import { CAUSA_TERMINACION_LABEL, dias360 } from "./liquidacion"
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
  return `${Number(d)}/${Number(m)}/${y}`
}

const dark = rgb(0.08, 0.09, 0.11)
const gray = rgb(0.42, 0.44, 0.5)
const soft = rgb(0.96, 0.97, 0.98)
const linec = rgb(0.82, 0.84, 0.87)

export type EmpleadoLiquidacion = {
  nombre: string
  cedula: string
  cargo?: string | null
  eps?: string | null
  fondo_pension?: string | null
  fondo_cesantias?: string | null
}

export async function generarLiquidacionPDF(l: Liquidacion, empleado: EmpleadoLiquidacion): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  let page: PDFPage = pdf.addPage([595.28, 841.89]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())

  const H = page.getHeight(), W = page.getWidth(), M = 42
  let y = 44

  const T = (x: number, s: string, size = 9, f: PDFFont = font, color = dark) => page.drawText(safe(s), { x, y: H - y, size, font: f, color })
  const Tat = (x: number, top: number, s: string, size = 9, f: PDFFont = font, color = dark) => page.drawText(safe(s), { x, y: H - top, size, font: f, color })
  const TR = (xRight: number, top: number, s: string, size = 9, f: PDFFont = font, color = dark) => {
    const str = safe(s); page.drawText(str, { x: xRight - f.widthOfTextAtSize(str, size), y: H - top, size, font: f, color })
  }
  const hline = (top: number, x1 = M, x2 = W - M, color = linec, th = 0.6) => page.drawLine({ start: { x: x1, y: H - top }, end: { x: x2, y: H - top }, thickness: th, color })
  const nueva = () => { page = pdf.addPage([595.28, 841.89]); y = 48 }
  function wrap(text: string, f: PDFFont, size: number, maxW: number): string[] {
    const out: string[] = []
    for (const w of safe(text).split(/\s+/)) {
      const last = out[out.length - 1]
      if (last && f.widthOfTextAtSize(`${last} ${w}`, size) <= maxW) out[out.length - 1] = `${last} ${w}`
      else out.push(w)
    }
    return out
  }

  // ── Encabezado ──────────────────────────────────────────────────────────────
  const logoW = 44, logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: (W - logoW) / 2, y: H - 36 - logoH, width: logoW, height: logoH })
  y = 36 + logoH + 12
  const centro = (s: string, size: number, f: PDFFont, color = dark) => { const str = safe(s); page.drawText(str, { x: (W - f.widthOfTextAtSize(str, size)) / 2, y: H - y, size, font: f, color }); y += size + 5 }
  centro("MEDIALAB INGENIERÍA E.U.", 12, bold)
  centro("NIT 901.575.423-8", 8.5, font, gray)
  centro("LIQUIDACIÓN DE CONTRATO", 11, bold)
  y += 6

  // ── Datos del empleado y del contrato ───────────────────────────────────────
  const colL = M, valL = M + 92, colR = W / 2 + 4, valR = W / 2 + 96
  const lbl = (x: number, top: number, s: string) => Tat(x, top, s, 8, bold, gray)
  const val = (x: number, top: number, s: string) => Tat(x, top, s || "-", 8.5, font, dark)
  const filaKV = (izqL: string, izqV: string, derL?: string, derV?: string) => {
    lbl(colL, y, izqL); val(valL, y, izqV)
    if (derL) { lbl(colR, y, derL); val(valR, y, derV ?? "") }
    y += 14
  }
  hline(y - 8)
  y += 6
  filaKV("EMPLEADO", empleado.nombre, "IDENTIF.", `C.C. ${empleado.cedula}`)
  filaKV("CARGO", empleado.cargo || "-", "TIPO CONTRATO", l.tipo_contrato || "Término indefinido")
  filaKV("RÉGIMEN CESANTÍAS", "Ley 50 de 1990", "CAUSA TERMINACIÓN", l.causa_terminacion ? CAUSA_TERMINACION_LABEL[l.causa_terminacion] : "-")
  filaKV("SALUD (EPS)", empleado.eps || "-", "PENSIÓN", empleado.fondo_pension || "-")
  filaKV("FONDO CESANTÍAS", empleado.fondo_cesantias || "-", "", "")
  y += 2
  const diasTotales = l.fecha_ingreso ? dias360(l.fecha_ingreso, l.fecha_egreso) : 0
  filaKV("FECHA INGRESO", fechaLarga(l.fecha_ingreso), "FECHA RETIRO", fechaLarga(l.fecha_egreso))
  filaKV("DÍAS TOTALES", String(diasTotales), "DÍAS NETOS", String(diasTotales))
  filaKV("BASE CESANTÍAS", formatCOP(l.base), "ÚLTIMO SUELDO", formatCOP(l.salario_basico))
  filaKV("BASE PRIMA", formatCOP(l.base), "BASE VACACIONES", formatCOP(l.salario_basico))
  y += 4
  hline(y - 6)

  // ── Tabla de conceptos (devengados / deducidos) ─────────────────────────────
  y += 12
  const cantR = W * 0.52, devR = W * 0.72, dedR = W - M
  // Barra que envuelve por completo el texto (baseline centrado dentro de los 16 px).
  page.drawRectangle({ x: M, y: H - y - 16, width: W - 2 * M, height: 16, color: rgb(0.10, 0.11, 0.14) })
  Tat(colL + 4, y + 11, "DESCRIPCIÓN", 8, bold, rgb(1, 1, 1))
  TR(cantR, y + 11, "CANT.", 8, bold, rgb(1, 1, 1))
  TR(devR, y + 11, "DEVENGADOS", 8, bold, rgb(1, 1, 1))
  TR(dedR, y + 11, "DEDUCIDOS", 8, bold, rgb(1, 1, 1))
  y += 26

  type Fila = { desc: string; cant?: number; dev?: number; ded?: number }
  const filas: Fila[] = []
  if (Number(l.salario) > 0) filas.push({ desc: "Salario del periodo", cant: l.salario_dias, dev: l.salario })
  filas.push(
    { desc: "Vacaciones compensadas", cant: l.vacaciones_dias, dev: l.vacaciones },
    { desc: "Prima de servicios proporcional", cant: l.prima_dias, dev: l.prima },
    { desc: "Cesantías", cant: l.cesantias_dias, dev: l.cesantias },
    { desc: "Intereses sobre cesantías (12% anual)", cant: l.cesantias_dias, dev: l.intereses_cesantias },
  )
  if (Number(l.indemnizacion) > 0) filas.push({ desc: "Indemnización por despido (art. 64 CST)", cant: l.indemnizacion_dias, dev: l.indemnizacion })
  for (const o of l.otros_conceptos || []) {
    const v = Number(o.valor) || 0
    filas.push(v >= 0 ? { desc: o.concepto || "Otro concepto", dev: v } : { desc: o.concepto || "Deducción", ded: -v })
  }
  if (Number(l.salud_empleado) > 0) filas.push({ desc: "Salud empleado (4%)", ded: Number(l.salud_empleado) })
  if (Number(l.pension_empleado) > 0) filas.push({ desc: "Pensión empleado (4%)", ded: Number(l.pension_empleado) })
  if (Number(l.retencion_fuente) > 0) filas.push({ desc: "Retención en la fuente", ded: Number(l.retencion_fuente) })

  let totDev = 0, totDed = 0
  for (const f of filas) {
    if (y > H - 120) { nueva(); y += 8 }
    Tat(colL + 4, y, f.desc, 8.5, font, dark)
    if (f.cant != null) TR(cantR, y, String(f.cant), 8.5)
    if (f.dev != null) { TR(devR, y, formatCOP(f.dev), 8.5); totDev += f.dev }
    if (f.ded != null) { TR(dedR, y, formatCOP(f.ded), 8.5); totDed += f.ded }
    hline(y + 4, M, W - M, rgb(0.92, 0.93, 0.95), 0.4)
    y += 17
  }

  // Totales
  hline(y - 6, M, W - M, dark, 0.8)
  y += 4
  Tat(colL + 4, y, "TOTALES", 9, bold, dark)
  TR(devR, y, formatCOP(totDev), 9, bold)
  TR(dedR, y, formatCOP(totDed), 9, bold)
  y += 22

  // Neto a pagar — barra de 26 px con los textos centrados verticalmente dentro de ella.
  page.drawRectangle({ x: M, y: H - y - 26, width: W - 2 * M, height: 26, color: rgb(0.06, 0.16, 0.17) })
  Tat(colL + 8, y + 17, "NETO A PAGAR", 10.5, bold, rgb(1, 1, 1))
  TR(W - M - 8, y + 18, formatCOP(l.total), 14, bold, rgb(0.55, 0.9, 0.93))
  y += 38
  T(M, `SON: ${numeroALetras(l.total).toUpperCase()}`, 8.5, font, gray)
  y += 22

  // ── Constancia legal ────────────────────────────────────────────────────────
  if (y > H - 220) nueva()
  T(M, "CONSTANCIA DE RECIBO DE PRESTACIONES SOCIALES E INDEMNIZACIÓN", 9, bold)
  y += 16
  const constancia = `YO, ${empleado.nombre} identificado(a) como aparece al pie de mi firma, declaro que he recibido a satisfacción de MEDIALAB INGENIERÍA E.U. la cantidad de ${formatCOP(l.total)} que corresponde al saldo total del sueldo y de las prestaciones sociales que devengué en esta institución hasta la fecha. Así mismo hago constar que con el pago anteriormente mencionado, MEDIALAB INGENIERÍA E.U. ha quedado totalmente a paz y salvo para conmigo por concepto de sueldos, cesantías, subsidio de transporte, intereses, vacaciones, prima de servicios, horas extras, dominicales y festivos, recargo nocturno, descansos, compensatorios, indemnizaciones y en general por todo concepto emanado de la relación laboral.`
  for (const linea of wrap(constancia, font, 8.5, W - 2 * M)) { if (y > H - 90) nueva(); T(M, linea, 8.5, font, dark); y += 12 }
  y += 8
  for (const linea of wrap(`Para constancia se firma en la ciudad de Bogotá D.C., el ${fechaLarga(l.fecha_egreso)}.`, font, 8.5, W - 2 * M)) { T(M, linea, 8.5, font, dark); y += 12 }

  // ── Firmas ──────────────────────────────────────────────────────────────────
  if (y > H - 120) nueva()
  y += 50
  const colW = (W - 2 * M - 40) / 2
  hline(y, M, M + colW, dark, 0.8)
  hline(y, M + colW + 40, W - M, dark, 0.8)
  y += 12
  Tat(M, y, "EMPLEADOR", 8.5, bold); Tat(M + colW + 40, y, "TRABAJADOR", 8.5, bold)
  y += 12
  Tat(M, y, "MEDIALAB INGENIERÍA E.U.", 8, font); Tat(M + colW + 40, y, empleado.nombre, 8, font)
  y += 11
  Tat(M, y, "NIT 901.575.423-8", 7.5, font, gray); Tat(M + colW + 40, y, `C.C. ${empleado.cedula}`, 7.5, font, gray)

  return pdf.save()
}
