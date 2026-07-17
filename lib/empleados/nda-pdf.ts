import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import { formatCedula, fechaLarga } from "./certificado"

// Acuerdo de Confidencialidad y No Divulgación (NDA) — documento independiente que todo
// colaborador debe descargar, firmar y subir. Mismas cláusulas que el anexo del contrato.

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}

function safe(s: string): string {
  return (s ?? "").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[•]/g, "-").replace(/…/g, "...")
}

const dark = rgb(0.06, 0.07, 0.09)
const gray = rgb(0.4, 0.42, 0.48)
const cyan = rgb(0.164, 0.667, 0.702)
const linec = rgb(0.82, 0.84, 0.87)

const EMPRESA = "MediaLab Ingeniería"
const NIT = "901.575.423-8"
const REP = "CHRISTIAN ORLANDO BENAVIDES"
const CIUDAD = "Bogotá D.C."

export type EmpleadoNDA = { nombre: string; cedula: string; esColaborador?: boolean }

export async function generarNdaPDF(e: EmpleadoNDA): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  let page: PDFPage = pdf.addPage([595.28, 841.89])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())

  const H = page.getHeight(), W = page.getWidth(), M = 60
  const maxW = W - 2 * M
  let y = 0

  const nueva = () => { page = pdf.addPage([595.28, 841.89]); y = 60 }
  const wrap = (t: string, f: PDFFont, size: number, w: number): string[] => {
    const out: string[] = []
    for (const word of safe(t).split(/\s+/)) {
      const last = out[out.length - 1]
      if (last && f.widthOfTextAtSize(`${last} ${word}`, size) <= w) out[out.length - 1] = `${last} ${word}`
      else out.push(word)
    }
    return out
  }
  const parrafo = (t: string, size = 10, f: PDFFont = font, sangria = 0) => {
    for (const l of wrap(t, f, size, maxW - sangria)) {
      if (y > H - 70) nueva()
      page.drawText(l, { x: M + sangria, y: H - y, size, font: f, color: dark }); y += size + 5
    }
    y += 4
  }
  const centro = (t: string, size: number, f: PDFFont, color = dark) => {
    if (y > H - 70) nueva()
    const s = safe(t); page.drawText(s, { x: (W - f.widthOfTextAtSize(s, size)) / 2, y: H - y, size, font: f, color }); y += size + 8
  }
  const clausula = (titulo: string, cuerpo?: string, items?: string[]) => {
    if (y > H - 90) nueva()
    page.drawText(safe(titulo), { x: M, y: H - y, size: 10, font: bold, color: dark }); y += 15
    if (cuerpo) parrafo(cuerpo)
    for (const it of items ?? []) parrafo(`•  ${it}`, 9.5, font, 10)
  }

  // Encabezado
  const logoW = 44, logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: (W - logoW) / 2, y: H - 44 - logoH, width: logoW, height: logoH })
  y = 44 + logoH + 18
  centro(`${EMPRESA} · NIT ${NIT}`, 9.5, font, gray)
  page.drawLine({ start: { x: M, y: H - y }, end: { x: W - M, y: H - y }, thickness: 0.8, color: linec }); y += 20
  centro("ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN", 13, bold, cyan)
  y += 6

  const receptor = e.esColaborador ? "EL COLABORADOR" : "EL EMPLEADO"
  parrafo(`Celebrado entre las partes, ${EMPRESA}, identificada con NIT No. ${NIT}, representada por ${REP}, en calidad de EMPLEADOR/TITULAR, y ${e.nombre}, identificado(a) con C.C. No. ${formatCedula(e.cedula)}, en calidad de ${receptor}/RECEPTOR; hemos decidido suscribir este acuerdo de confidencialidad y no divulgación para salvaguardar la información intercambiada entre las partes, principalmente la que el empleador entregue al receptor, propia y de los clientes de la compañía.`)

  clausula("DEFINICIONES.", undefined, [
    "Titular: quien entrega la información considerada confidencial, tanto propia como de sus clientes.",
    "Receptor: colaborador que recibe la información considerada confidencial.",
    "Información Confidencial: toda información revelada por el titular al receptor que: (a) no sea de conocimiento público ni de fácil obtención por fuentes externas; (b) trate sobre la operación y proyectos internos de la empresa (comercial, financiera, tecnológica); (c) sea información de los clientes con los que trabaja la empresa; o (d) sea entregada por el titular con marca de confidencial.",
  ])
  clausula("OBJETO.", "El receptor tendrá, entre otras, las siguientes obligaciones:", [
    "Mantener en secreto toda la información confidencial a la que, por el ejercicio de sus funciones, tenga acceso.",
    "No divulgar la información confidencial durante ni después del vínculo con la compañía.",
    "No usar la información confidencial para su beneficio personal, ni para establecer relación con los clientes de la empresa.",
    "Toda información confidencial nueva que el receptor genere dentro del vínculo se entiende propiedad del titular.",
    "Mantener absoluta reserva de los documentos internos y no divulgar información a los clientes sin previa autorización.",
    "No reproducir, copiar, vender, intercambiar, comercializar ni publicar la información confidencial.",
    "Devolver al titular toda información física y digital en su poder, incluidas copias, al finalizar el vínculo.",
    "Informar cualquier evento que pueda poner en riesgo la confidencialidad de la información de la compañía.",
  ])
  clausula("PROPIEDAD DE LA INFORMACIÓN.", "La entrega de la información confidencial del titular al receptor, en ningún caso, transfiere la propiedad de la misma. El titular es y será el dueño de la información suministrada.")
  clausula("DERECHOS PATRIMONIALES SOBRE LOS PRODUCTOS.", "Los productos, entregables y obras que el receptor desarrolle en el marco de su vínculo con la empresa (diseños, código, documentos, prototipos, metodologías y demás resultados) se entienden como CREACIÓN DE LA EMPRESA. En consecuencia, el receptor CEDE al titular, de forma total, exclusiva y sin limitación de tiempo ni territorio, todos los DERECHOS PATRIMONIALES de autor sobre dichos productos y sobre su reproducción, conforme a la Ley 23 de 1982, la Decisión Andina 351 de 1993 y el artículo 28 de la Ley 1450 de 2011. El titular podrá reproducir, adaptar, exhibir, comunicar públicamente, distribuir y comercializar estos productos, incluso en eventos comerciales y para la prestación de servicios a otras empresas con fines comerciales, sin que ello genere pago adicional al receptor.")
  clausula("USO EN PORTAFOLIO Y AUTORIZACIÓN DE DIVULGACIÓN.", "El receptor podrá incluir en su portafolio personal únicamente PARTES de dichos productos (no la obra completa) y siempre que ello NO infrinja los derechos de autor del cliente final de la empresa. Para publicar, distribuir o exhibir cualquier producto, el receptor deberá NOTIFICAR previamente al correo hello@medialab.design indicando qué producto desea utilizar; solo tras la respuesta de aprobación por ese medio podrá divulgar los productos aprobados.")
  clausula("INCUMPLIMIENTO.", "Cuando el titular considere que cualquiera de las cláusulas fue incumplida total o parcialmente, el receptor entiende que ello causa perjuicio continuo e irreparable al titular y se obliga a indemnizarlo por los daños causados; el titular podrá iniciar las acciones que la ley prevea.")
  clausula("VIGENCIA.", "Este acuerdo entra en vigencia a partir de la fecha de firma de ambas partes.")
  parrafo(`Se firma en la ciudad de ${CIUDAD}, el ${fechaLarga(new Date().toISOString().slice(0, 10))}.`, 9.5)

  // Firmas (2 columnas)
  if (y > H - 150) nueva()
  y += 40
  const colW = maxW / 2
  const linea = (x: number, label: string, nombre: string) => {
    page.drawLine({ start: { x, y: H - y }, end: { x: x + colW - 20, y: H - y }, thickness: 0.7, color: dark })
    page.drawText(safe(nombre), { x, y: H - y - 14, size: 9.5, font: bold, color: dark })
    page.drawText(safe(label), { x, y: H - y - 27, size: 8.5, font, color: gray })
  }
  linea(M, `TITULAR · ${EMPRESA}`, REP)
  linea(M + colW, `RECEPTOR · ${receptor}`, e.nombre)

  // Pie
  page.drawText(`${EMPRESA} · NIT ${NIT} · ${CIUDAD}, Colombia`, { x: M, y: 40, size: 8, font, color: gray })
  page.drawText("https://medialab.design/ · +57 305 4009505 · hello@medialab.design", { x: M, y: 28, size: 7.5, font, color: gray })

  return pdf.save()
}
