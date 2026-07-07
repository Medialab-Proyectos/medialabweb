import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { CuentaCobro } from "./cuenta-cobro"
import { MEDIALAB_EMISOR, MODO_LABEL, totalCuentaCobro } from "./cuenta-cobro"
import { formatMoneda } from "./freelance"
import { numeroALetrasBase } from "./desprendible"

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

export type DatosCuentaCobroPDF = {
  empresa: { nombre: string; nit: string | null } | null
  cuenta: { nombre: string; plataforma: string | null; banco: string | null; moneda: string } | null
  emisorPersonal: { nombre: string; cedula: string } | null
}

export async function generarCuentaCobroPDF(cc: CuentaCobro, datos: DatosCuentaCobroPDF): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page: PDFPage = pdf.addPage([595.28, 841.89]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

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

  const esEmpresa = cc.emisor === "empresa"

  // ── Encabezado del emisor ─────────────────────────────────────────────────
  if (esEmpresa) {
    const logo = await pdf.embedPng(logoBytes())
    const logoW = 54
    const logoH = (logo.height / logo.width) * logoW
    page.drawImage(logo, { x: M, y: H - 44 - logoH, width: logoW, height: logoH })
    const hx = M + logoW + 16
    T(hx, 58, MEDIALAB_EMISOR.nombre, 12, bold)
    T(hx, 72, `NIT ${MEDIALAB_EMISOR.nit}`, 8.5, font, gray)
  } else {
    T(M, 58, datos.emisorPersonal?.nombre || "-", 12, bold)
    if (datos.emisorPersonal?.cedula) T(M, 72, `C.C. ${datos.emisorPersonal.cedula}`, 8.5, font, gray)
  }
  TR(W - M, 56, "CUENTA DE COBRO", 12, bold)
  if (cc.numero) TR(W - M, 71, `N.º ${cc.numero}`, 9, font, gray)
  TR(W - M, 85, fechaLarga(cc.fecha_emision), 8.5, font, gray)

  hline(100)

  // ── Destinatario ──────────────────────────────────────────────────────────
  box(M, 108, W - 2 * M, 40)
  const colL = M + 14, valL = M + 92
  const lbl = (x: number, top: number, s: string) => T(x, top, s, 7.5, bold, gray)
  const val = (x: number, top: number, s: string) => T(x, top, s || "-", 9.5, bold, dark)
  lbl(colL, 126, "COBRAR A"); val(valL, 126, datos.empresa?.nombre || "-")
  lbl(colL, 143, "NIT"); val(valL, 143, datos.empresa?.nit || "-")

  // ── Detalle ───────────────────────────────────────────────────────────────
  const total = totalCuentaCobro(cc)
  const headTop = 182
  box(M, headTop - 12, W - 2 * M, 16, rgb(0.10, 0.11, 0.14))
  T(colL, headTop, "CONCEPTO", 8.5, bold, rgb(1, 1, 1))
  T(W / 2 + 30, headTop, MODO_LABEL[cc.modo].toUpperCase(), 8.5, bold, rgb(1, 1, 1))
  TR(W - M - 12, headTop, "VALOR", 8.5, bold, rgb(1, 1, 1))

  const unidad = cc.modo === "por_hora" ? "hora(s)" : "mes(es)"
  const filas: [string, string, string][] = [
    [cc.concepto || "Servicios profesionales", `${cc.cantidad} ${unidad}`, formatMoneda(total, cc.moneda)],
    [`Tarifa por ${cc.modo === "por_hora" ? "hora" : "mes"}`, "", formatMoneda(Number(cc.tarifa) || 0, cc.moneda)],
  ]
  if (cc.mes_servicio) filas.push([`Periodo de servicio: ${cc.mes_servicio}`, "", ""])
  let top = headTop + 22
  for (const [c, cant, v] of filas) {
    T(colL, top, c, 9, font, dark)
    if (cant) T(W / 2 + 30, top, cant, 9)
    if (v) TR(W - M - 12, top, v, 9)
    hline(top + 5, M, W - M, rgb(0.92, 0.93, 0.95), 0.4)
    top += 18
  }

  // ── Total ─────────────────────────────────────────────────────────────────
  const netoTop = top + 12
  box(M, netoTop - 13, W - 2 * M, 34, rgb(0.06, 0.16, 0.17))
  T(colL, netoTop + 7, "TOTAL A PAGAR", 11, bold, rgb(1, 1, 1))
  TR(W - M - 12, netoTop + 8, formatMoneda(total, cc.moneda), 15, bold, rgb(0.55, 0.9, 0.93))

  const monedaPalabra = cc.moneda === "USD" ? "DOLARES" : "PESOS"
  T(M, netoTop + 40, `Son: ${numeroALetrasBase(total)} ${monedaPalabra} M/CTE.`, 8.5, font, gray)
  if (cc.iva_tipo === "incluido") T(M, netoTop + 52, `IVA incluido: ${formatMoneda(Number(cc.iva_valor) || 0, cc.moneda)}.`, 8, font, gray)
  else if (cc.iva_tipo === "exento") T(M, netoTop + 52, "Operacion exenta de IVA (servicio internacional).", 8, font, gray)

  // ── Cuenta para consignar ─────────────────────────────────────────────────
  let y = netoTop + 66
  T(M, y, "Favor consignar a:", 9, bold, cyan)
  y += 15
  if (datos.cuenta) {
    const partes = [datos.cuenta.plataforma, datos.cuenta.banco].filter(Boolean).join(" - ")
    T(M, y, `${datos.cuenta.nombre}${partes ? ` (${partes})` : ""} - ${datos.cuenta.moneda}`, 9, font, dark)
  } else {
    T(M, y, "(cuenta por definir)", 9, font, gray)
  }
  if (cc.fecha_pago) { y += 15; T(M, y, `Fecha de pago: ${fechaLarga(cc.fecha_pago)}`, 8.5, font, gray) }
  if (cc.observaciones) { y += 15; T(M, y, `Observaciones: ${cc.observaciones}`, 8, font, gray) }

  // ── Firma ─────────────────────────────────────────────────────────────────
  const firmaTop = y + 74
  hline(firmaTop, M, M + 200, dark, 0.8)
  if (esEmpresa) {
    T(M, firmaTop + 14, MEDIALAB_EMISOR.nombre, 9, bold)
    T(M, firmaTop + 27, `NIT ${MEDIALAB_EMISOR.nit}`, 8, font, gray)
  } else {
    T(M, firmaTop + 14, datos.emisorPersonal?.nombre || "-", 9, bold)
    if (datos.emisorPersonal?.cedula) T(M, firmaTop + 27, `C.C. ${datos.emisorPersonal.cedula}`, 8, font, gray)
  }

  T(M, H - 26, "https://medialab.design/ · +57 305 4009505 · hello@medialab.design", 7, font, gray)

  return pdf.save()
}
