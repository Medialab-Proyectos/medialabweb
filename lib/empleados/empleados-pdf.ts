import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}

function safe(s: string | null | undefined): string {
  return (s ?? "—")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[•]/g, "-").replace(/…/g, "...")
    .replace(/[áÁ]/g, (m) => (m === "á" ? "a" : "A")).replace(/[éÉ]/g, (m) => (m === "é" ? "e" : "E"))
    .replace(/[íÍ]/g, (m) => (m === "í" ? "i" : "I")).replace(/[óÓ]/g, (m) => (m === "ó" ? "o" : "O"))
    .replace(/[úÚ]/g, (m) => (m === "ú" ? "u" : "U")).replace(/[ñÑ]/g, (m) => (m === "ñ" ? "n" : "N"))
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.42, 0.44, 0.5)

export type EmpleadoExport = { nombre: string; email: string; telefono: string | null; direccion: string | null }

/** PDF con la lista de empleados activos (nombre, correo, celular, dirección). A4 horizontal. */
export async function generarEmpleadosActivosPDF(empleados: EmpleadoExport[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())

  const W = 841.89, H = 595.28 // A4 horizontal
  const M = 40
  // Columnas: Nombre, Correo, Celular, Dirección
  const cols = [
    { x: M, w: 200, label: "NOMBRE" },
    { x: M + 200, w: 220, label: "CORREO" },
    { x: M + 420, w: 110, label: "CELULAR" },
    { x: M + 530, w: W - M - (M + 530), label: "DIRECCIÓN" },
  ]

  let page!: PDFPage
  let y = 0

  const T = (x: number, top: number, s: string, size = 9, ft: PDFFont = font, color = dark) =>
    page.drawText(safe(s), { x, y: H - top, size, font: ft, color })

  function nuevaPagina() {
    page = pdf.addPage([W, H])
    const logoW = 46
    const logoH = (logo.height / logo.width) * logoW
    page.drawImage(logo, { x: M, y: H - 34 - logoH, width: logoW, height: logoH })
    T(M + logoW + 14, 50, "MEDIALAB INGENIERIA E.U.", 12, bold)
    T(M + logoW + 14, 64, "Empleados activos", 9, font, gray)
    const generado = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })
    page.drawText(safe(`Generado el ${generado}`), { x: W - M - font.widthOfTextAtSize(safe(`Generado el ${generado}`), 8), y: H - 40, size: 8, font, color: gray })
    // Encabezado de tabla
    const headTop = 92
    page.drawRectangle({ x: M, y: H - headTop - 14, width: W - 2 * M, height: 18, color: rgb(0.10, 0.11, 0.14) })
    cols.forEach((c) => page.drawText(c.label, { x: c.x + 6, y: H - headTop, size: 8, font: bold, color: rgb(1, 1, 1) }))
    y = headTop + 24
  }

  /** Recorta un texto para que quepa en el ancho de columna. */
  function fit(s: string, w: number, size = 8.5): string {
    let str = safe(s)
    if (font.widthOfTextAtSize(str, size) <= w - 12) return str
    while (str.length > 1 && font.widthOfTextAtSize(str + "…", size) > w - 12) str = str.slice(0, -1)
    return str + "…"
  }

  nuevaPagina()
  for (const e of empleados) {
    if (y > H - 50) nuevaPagina()
    T(cols[0].x + 6, y, fit(e.nombre, cols[0].w), 8.5)
    T(cols[1].x + 6, y, fit(e.email, cols[1].w), 8.5)
    T(cols[2].x + 6, y, fit(e.telefono || "—", cols[2].w), 8.5)
    T(cols[3].x + 6, y, fit(e.direccion || "—", cols[3].w), 8.5)
    page.drawLine({ start: { x: M, y: H - y - 6 }, end: { x: W - M, y: H - y - 6 }, thickness: 0.4, color: rgb(0.9, 0.91, 0.93) })
    y += 20
  }
  if (empleados.length === 0) T(M + 6, y, "No hay empleados activos.", 9, font, gray)

  return pdf.save()
}
