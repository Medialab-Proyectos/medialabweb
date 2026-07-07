import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { Contrato } from "./contrato"
import { contratoEsPorFactura, totalMensualContrato } from "./contrato"
import { formatCOP } from "./desprendible"
import { formatMoneda } from "./freelance"
import { fechaLarga, formatCedula } from "./certificado"

const EMISOR = { nombre: "MEDIALAB INGENIERÍA", nit: "901.575.423-8", ciudad: "Bogotá D.C." }
const REP_LEGAL = "CHRISTIAN BENAVIDES"

let logoCache: Buffer | null = null
function logoBytes(): Buffer {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public/images/logo-medialab-400.png"))
  return logoCache
}

/**
 * Sanea texto para la fuente Helvetica estándar (codificación WinAnsi / Windows-1252),
 * que SÍ soporta acentos y ñ. Conserva tildes; solo normaliza la puntuación tipográfica
 * (comillas curvas, guiones largos, viñetas, elipsis) y elimina cualquier carácter fuera
 * de ASCII imprimible + Latin-1 (emoji, CJK, etc.) que vendría de texto libre y rompería.
 */
function safe(s: string | null | undefined): string {
  return (s ?? "")
    .normalize("NFC")
    .replace(/[‘’‚‛]/g, "'").replace(/[“”„]/g, '"')
    .replace(/[–—−]/g, "-").replace(/[•]/g, "-").replace(/…/g, "...")
    .replace(/ /g, " ")
    // Fuera de ASCII imprimible (0x20-0x7E) y Latin-1 (U+00A1-U+00FF) → se descarta.
    .replace(/[^\t\n\r\x20-\x7E¡-ÿ]/g, "")
}

const dark = rgb(0.09, 0.10, 0.12)
const gray = rgb(0.42, 0.44, 0.5)
const cyan = rgb(0.13, 0.5, 0.55)
const soft = rgb(0.95, 0.96, 0.97)
const linec = rgb(0.8, 0.82, 0.85)

export type EmpleadoContrato = {
  nombre: string
  cedula: string
  direccion?: string | null
  telefono?: string | null
  email?: string | null
  modalidad?: string | null
}
export type OpcionesContrato = {
  arl?: string | null
  caja?: string | null
  funciones?: string[]          // funciones del cargo (catálogo)
  fechaOriginal?: string | null // fecha del contrato original (para otrosí)
}

function tituloLaboral(c: Contrato): string {
  const t = (c.tipo_contrato || "").toLowerCase()
  if (t.includes("fijo")) return "a Término Fijo"
  if (t.includes("obra")) return "por Obra o Labor"
  return "a Término Indefinido"
}

export async function generarContratoPDF(
  empleado: EmpleadoContrato,
  contrato: Contrato,
  opts: OpcionesContrato = {},
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(logoBytes())

  const W = 595.28, H = 841.89
  const M = 56
  const contentW = W - 2 * M

  let page: PDFPage = pdf.addPage([W, H])
  let y = 56

  const footer = (p: PDFPage) => {
    p.drawText(safe("https://medialab.design/  ·  +57 305 4009505  ·  hello@medialab.design"), { x: M, y: 32, size: 7, font, color: gray })
  }
  const nueva = () => { footer(page); page = pdf.addPage([W, H]); y = 56 }
  const espacio = (h: number) => { if (y + h > H - 56) nueva() }

  function wrap(text: string, f: PDFFont, size: number, maxWidth: number): string[] {
    const out: string[] = []
    for (const raw of safe(text).split("\n")) {
      const words = raw.split(/\s+/)
      let line = ""
      for (const w of words) {
        const test = line ? `${line} ${w}` : w
        if (f.widthOfTextAtSize(test, size) > maxWidth && line) { out.push(line); line = w }
        else line = test
      }
      out.push(line)
    }
    return out
  }
  const parrafo = (s: string, size = 9.5, f: PDFFont = font, color = dark, x = M, maxW = contentW, lh = 13.5) => {
    for (const linea of wrap(s, f, size, maxW)) {
      espacio(lh)
      page.drawText(linea, { x, y: H - y, size, font: f, color })
      y += lh
    }
  }
  const centro = (s: string, size: number, f: PDFFont, color = dark) => {
    espacio(size + 8)
    const str = safe(s)
    page.drawText(str, { x: (W - f.widthOfTextAtSize(str, size)) / 2, y: H - y, size, font: f, color })
    y += size + 8
  }
  // Cláusula: título en negrita seguido del cuerpo; sub-items con sangría.
  const clausula = (titulo: string, cuerpo?: string, items?: string[]) => {
    espacio(24); y += 5
    parrafo(titulo, 9.5, bold, dark)
    if (cuerpo) parrafo(cuerpo, 9.5, font, dark)
    if (items) for (const it of items) parrafo(`-  ${it}`, 9.5, font, dark, M + 12, contentW - 12)
  }
  // Tabla clave-valor con borde.
  const tabla = (titulo: string, filas: [string, string][]) => {
    const rowH = 16, labelW = 150
    espacio(rowH * (filas.length + 1) + 8)
    page.drawRectangle({ x: M, y: H - y - rowH, width: contentW, height: rowH, color: rgb(0.90, 0.91, 0.93) })
    page.drawText(safe(titulo), { x: M + 6, y: H - y - 11, size: 8.5, font: bold, color: dark })
    y += rowH
    for (const [k, v] of filas) {
      page.drawRectangle({ x: M, y: H - y - rowH, width: contentW, height: rowH, color: soft, borderColor: linec, borderWidth: 0.4 })
      page.drawLine({ start: { x: M + labelW, y: H - y - rowH }, end: { x: M + labelW, y: H - y }, thickness: 0.4, color: linec })
      page.drawText(safe(k), { x: M + 6, y: H - y - 11, size: 8.5, font, color: dark })
      page.drawText(safe(v || "—"), { x: M + labelW + 6, y: H - y - 11, size: 8.5, font: bold, color: dark })
      y += rowH
    }
    y += 8
  }

  // ── Encabezado con logo ───────────────────────────────────────────────────
  const logoW = 44
  const logoH = (logo.height / logo.width) * logoW
  page.drawImage(logo, { x: M, y: H - 40 - logoH, width: logoW, height: logoH })
  y = 40 + logoH + 6

  const porFactura = contratoEsPorFactura(contrato)
  const esOtrosi = contrato.tipo === "otrosi"
  const inicio = contrato.fecha_ingreso || contrato.vigente_desde
  const cargo = contrato.cargo || "colaborador"
  const funciones = (opts.funciones ?? []).filter((f) => f && f.trim())

  if (esOtrosi) {
    return generarOtrosi()
  }

  // ── CONTRATO INICIAL ──────────────────────────────────────────────────────
  if (porFactura) {
    // Freelance y prestación comparten el cuerpo de servicios, pero difieren en
    // título, etiqueta de la parte, tabla de datos y cláusula de vigencia.
    const esFree = contrato.tipo_vinculacion === "freelance"
    const P = esFree ? "EL PROVEEDOR" : "EL CONTRATISTA"
    const tarifa = formatMoneda(Number(contrato.freelance_tarifa) || 0, contrato.freelance_moneda ?? "COP")
    const modo = contrato.freelance_modo

    centro("Contrato de Prestación de Servicios", 13, bold)
    if (esFree) centro("Acuerdo de Prestación de Servicios Freelance", 10.5, bold, gray)
    else centro("para Persona Física", 10.5, bold, gray)
    y += 6
    tabla(esFree ? "DATOS DEL PROVEEDOR" : "DATOS DEL CONTRATISTA", [
      ["Nombre completo", empleado.nombre],
      ["Cédula de ciudadanía", formatCedula(empleado.cedula)],
      ["Dirección", empleado.direccion ?? ""],
      ["Teléfono", empleado.telefono ?? ""],
      ["Correo electrónico", empleado.email ?? ""],
      ["Cargo", cargo],
      ["Modalidad", empleado.modalidad || "Trabajo Remoto"],
      ["Remuneración", `${tarifa}${modo === "por_hora" ? " por hora" : modo === "por_mes" ? " mensuales" : ""}`],
    ])
    y += 10
    parrafo(`Entre los suscritos, por una parte, la Empresa ${EMISOR.nombre}, quien se identifica con el NIT número ${EMISOR.nit}, en adelante LA EMPRESA, y por la otra ${empleado.nombre}, quien se identifica con cédula de ciudadanía número ${formatCedula(empleado.cedula)}, en adelante ${P}, hemos decidido celebrar el presente contrato de prestación de servicios que se regirá por las siguientes cláusulas:`)
    y += 4
    centro("CLÁUSULAS", 11, bold, cyan)

    let contrap = `LA EMPRESA pagará a ${P} como contraprestación del servicio contratado la cantidad de ${tarifa}`
    if (modo === "por_hora") contrap += " por hora efectivamente prestada, facturada mensualmente."
    else if (modo === "por_mes") contrap += " al mes de servicios prestados."
    else if (modo === "por_proyecto") contrap += (contrato.freelance_meses && contrato.freelance_meses > 1) ? ` como valor total del proyecto, pagadero en ${contrato.freelance_meses} cuotas mensuales.` : " como valor total del proyecto (pago único)."
    else contrap += " conforme a lo pactado."
    contrap += ` El pago se realizará a la cuenta bancaria que señale ${P}, dentro de los primeros cinco (5) días naturales siguientes al envío de la factura correspondiente, la cual deberá cumplir los requisitos fiscales vigentes.`

    clausula("1. OBJETO.", `Mediante la celebración del presente contrato, ${P} prestará a LA EMPRESA los servicios de ${cargo}${contrato.descripcion ? ` — ${contrato.descripcion}` : ", de consultoría y diseño de prototipos, aplicaciones y programas de cómputo"}, bajo demanda. Para la correcta prestación de los servicios, ${P} podrá tener una cuenta de correo electrónico de LA EMPRESA, sin que ello implique relación laboral alguna.`)
    clausula("2. CONTRAPRESTACIÓN Y FORMA DE PAGO.", contrap, [
      `Que exista una solicitud expresa y por escrito de LA EMPRESA en la que se soliciten los servicios de ${P}, por cualquier medio, incluidos electrónicos.`,
      `Que ${P}, junto con la factura correspondiente, envíe de manera mensual un reporte de las horas trabajadas y, si LA EMPRESA lo solicita, adjunte evidencia de los servicios.`,
      `LA EMPRESA no tiene la obligación de solicitar de manera continua o permanente los servicios; no existe cantidad mínima ni fija de horas.`,
    ])
    if (esFree) {
      clausula("3. VIGENCIA Y TERMINACIÓN.", `La vigencia del presente contrato correrá a partir del ${fechaLarga(inicio)}${contrato.fecha_fin_probable ? ` al ${fechaLarga(contrato.fecha_fin_probable)}` : ""}, y se renovará de manera automática por periodos, salvo que las partes acuerden lo contrario. LA EMPRESA podrá darlo por terminado de forma anticipada, con efectos inmediatos y sin responsabilidad, por incumplimiento de ${P} o por así convenir a sus intereses mediante aviso escrito con al menos cuarenta y ocho (48) horas de anticipación. ${P} podrá terminarlo con al menos treinta (30) días naturales de anticipación. Al terminar, ${P} devolverá en un máximo de veinticuatro (24) horas todos los desarrollos, usuarios, contraseñas y documentos elaborados o proporcionados.`)
    } else {
      clausula("3. VIGENCIA.", `El presente contrato regirá desde el ${fechaLarga(inicio)}${contrato.fecha_fin_probable ? ` hasta el ${fechaLarga(contrato.fecha_fin_probable)}` : ", por el tiempo que dure el objeto contratado"}, y podrá terminar por cumplimiento del objeto, mutuo acuerdo o incumplimiento de cualquiera de las partes.`)
    }
    if (funciones.length) clausula("ALCANCE DE LOS SERVICIOS.", `${P} desarrollará, entre otras, las siguientes actividades:`, funciones)
    clausula("4. OBLIGACIONES DEL PROVEEDOR.", `Prestar los servicios con la mejor técnica disponible asegurando su calidad; enviar reportes de horas y actividades; conocer y utilizar la metodología necesaria; cumplir los tiempos pactados; e informar del estado de su labor cuantas veces sea requerido y rendir un informe general al término del contrato.`)
    clausula("5. OBLIGACIONES DE LA EMPRESA.", `Realizar los pagos que correspondan; dar a ${P} las facilidades e información necesarias para el desarrollo del objeto; y respetar las fechas de ejecución pactadas.`)
    clausula("6. LUGAR DE PRESTACIÓN DE LOS SERVICIOS.", `${P} prestará sus servicios de manera virtual, a través de los medios tecnológicos que para tal fin acuerden las partes.`)
    clausula("7. NO EXCLUSIVIDAD.", `${P} no actúa de forma exclusiva para LA EMPRESA y tendrá libertad de actuación; no obstante, se obliga a no realizar desarrollos iguales o similares a los elaborados en virtud de este contrato en favor de un tercero.`)
    clausula("8. AUSENCIA DE RELACIÓN LABORAL.", `Las partes reconocen que no existe relación laboral alguna entre ellas; la relación es meramente contractual. Cada parte, como patrón del personal que ocupe, es la única responsable de sus obligaciones en materia de trabajo y seguridad social. ${P} asume por su cuenta sus aportes a seguridad social (salud, pensión y riesgos).`)
    clausula("9. INDEPENDENCIA MERCANTIL.", "El contrato no crea asociación, sociedad ni entidad entre las partes, que permanecen independientes. Ninguna podrá asumir compromisos, ofrecer garantías ni vincular a la otra frente a terceros. Cada parte es responsable de sus propios actos ante cualquier autoridad.")
    clausula("10. ESTÁNDAR DE CONDUCTA.", `${P} desarrollará sus obligaciones como contratante independiente, observando el cuidado, habilidad y diligencia de una empresa de reconocido prestigio en la prestación de servicios.`)
    clausula("11. CALIDAD DE LOS SERVICIOS.", `${P} asegurará servicios de la más alta calidad, eficiencia y profesionalismo, que cumplan los KPIs, requerimientos y políticas de LA EMPRESA.`)
    clausula("12. CARÁCTER PERSONAL DEL SERVICIO.", `La prestación tiene carácter personal y no será transferida a un tercero, total ni parcialmente, sin consentimiento expreso y escrito de LA EMPRESA.`)
    clausula("13. GARANTÍA Y RESPONSABILIDAD.", `${P} garantiza la ejecución cabal, idónea y calificada de los servicios, y responderá por los daños y perjuicios causados a LA EMPRESA o a terceros por incumplimiento, inobservancia de recomendaciones escritas o actos con dolo, mala fe o negligencia, indemnizando y manteniendo indemne a LA EMPRESA.`)
    clausula("14. USO DE LA INFORMACIÓN.", `LA EMPRESA podrá utilizar libremente toda la información desarrollada o proporcionada por ${P}, quien es el único responsable de dicha información y mantendrá indemne a LA EMPRESA frente a reclamaciones de terceros.`)
    clausula("15. PROPIEDAD INTELECTUAL.", `Todo material e información desarrollados con ocasión de los servicios (datos, código, software, diseños, prototipos, textos, marcas, y cualquier obra sujeta a propiedad intelectual, industrial o derechos de autor) son y serán propiedad exclusiva de LA EMPRESA, entendiéndose cedidos en este acto como obra por encargo. Esta cláusula subsiste a la terminación del contrato.`)
    clausula("16. CONFIDENCIALIDAD Y NO COMPETENCIA.", `Las partes mantendrán en reserva la información confidencial a la que accedan y no la usarán ni revelarán a terceros sin autorización escrita. La confidencialidad se mantendrá hasta por cinco (5) años posteriores a la terminación. Durante la vigencia y hasta diez (10) años posteriores, ${P} no persuadirá a clientes o proveedores de LA EMPRESA para cesar negocios, no empleará a su personal ni procurará negocios similares, sin consentimiento previo y escrito.`)
    clausula("17. PROTECCIÓN DE DATOS PERSONALES.", "Cada parte autoriza el tratamiento de sus datos personales para fines administrativos relacionados con el objeto del contrato, conforme a la Ley 1581 de 2012 y demás normas aplicables, con las medidas de seguridad correspondientes.")
    clausula("18. LICITUD DE RECURSOS Y ANTI-CORRUPCIÓN.", "Las partes declaran que los recursos objeto de los servicios provienen de fuentes lícitas y que no mantienen vínculo con organizaciones criminales, narcotráfico o lavado de dinero. Ninguna efectúa pagos indebidos para influenciar decisiones de terceros o del gobierno.")
    clausula("19. FUERZA MAYOR.", "El incumplimiento derivado de un evento de fuerza mayor o caso fortuito, no previsible ni evitable con precauciones razonables, excusará a la parte afectada mientras dure la causa. Si el evento excede noventa (90) días, cualquiera de las partes podrá dar por terminado el contrato.")
    clausula("20. NOTIFICACIONES Y MODIFICACIONES.", "Las notificaciones constarán por escrito, en español, a los correos señalados por las partes. Cualquier modificación deberá constar por escrito y estar firmada por las partes.")
    clausula("21. CESIÓN, DIVISIBILIDAD Y ACUERDO TOTAL.", `${P} no podrá ceder sus derechos u obligaciones sin autorización escrita de LA EMPRESA. La invalidez de una cláusula no afecta a las demás. Este contrato constituye el acuerdo total entre las partes y deja sin efecto acuerdos previos. Los títulos de las cláusulas son solo de referencia.`)
    parrafo(`Las partes firman el presente contrato expresando su plena conformidad y declarando que, después de haberlo leído, entienden su alcance y contenido legal, en ${EMISOR.ciudad}, el ${fechaLarga(contrato.vigente_desde)}.`, 9.5)
    firmas("LA EMPRESA", "MediaLab Ingeniería", esFree ? "EL PROVEEDOR" : "EL CONTRATISTA", true)
  } else {
    // ── LABORAL ──────────────────────────────────────────────────────────────
    centro(`Contrato de Trabajo ${tituloLaboral(contrato)}`, 13, bold)
    y += 4
    tabla("DATOS DEL TRABAJADOR", [
      ["Nombre completo", empleado.nombre],
      ["Cédula de ciudadanía", formatCedula(empleado.cedula)],
      ["Dirección", empleado.direccion ?? ""],
      ["Teléfono", empleado.telefono ?? ""],
      ["Correo electrónico", empleado.email ?? ""],
      ["Cargo", cargo],
      ["Modalidad", empleado.modalidad || "Trabajo Remoto"],
      ["Fecha de inicio", fechaLarga(inicio)],
    ])
    const filasRem: [string, string][] = [["Salario base", formatCOP(Number(contrato.salario_basico) || 0)]]
    if ((Number(contrato.auxilio_transporte) || 0) > 0) filasRem.push(["Auxilio de transporte / conectividad", formatCOP(Number(contrato.auxilio_transporte) || 0)])
    for (const l of contrato.otros_devengos ?? []) if (Number(l.valor) > 0) filasRem.push([l.concepto, formatCOP(Number(l.valor) || 0)])
    filasRem.push(["Total (sin deducciones)", formatCOP(totalMensualContrato(contrato))])
    tabla("REMUNERACIÓN (SIN DEDUCCIONES)", filasRem)
    y += 10

    parrafo(`Entre los suscritos, por una parte, la Empresa ${EMISOR.nombre}, identificada con NIT No. ${EMISOR.nit}, en adelante EL EMPLEADOR, y por la otra ${empleado.nombre}, identificado(a) con cédula de ciudadanía No. ${formatCedula(empleado.cedula)}, en adelante EL TRABAJADOR, hemos convenido celebrar el presente contrato de trabajo ${tituloLaboral(contrato).toLowerCase()} que se regirá por las siguientes cláusulas:`)
    y += 4
    centro("CLÁUSULAS", 11, bold, cyan)

    clausula("1. OBJETO.", `Mediante el presente contrato EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñar las funciones inherentes al cargo de ${cargo}, obligándose a la ejecución de las tareas ordinarias y anexas de conformidad con los reglamentos, órdenes e instrucciones que le imparta EL EMPLEADOR.`)
    if (funciones.length) clausula("2. FUNCIONES Y RESPONSABILIDADES DEL CARGO.", "En su calidad, EL TRABAJADOR tendrá, entre otras, las siguientes funciones, todas ejecutadas dentro de la jornada laboral pactada:", funciones)
    clausula("CESIÓN DE DERECHOS.", "Las invenciones, diseños, desarrollos, software, bases de datos y demás obras realizadas por EL TRABAJADOR durante la vigencia del contrato serán propiedad exclusiva del EMPLEADOR, conforme al artículo 539 del Código de Comercio, la Decisión 486 de la CAN y la Ley 23 de 1982 (art. 20, modificado por la Ley 1450 de 2011).")
    clausula("LUGAR Y CAMBIO DE LUGAR DE TRABAJO.", "EL TRABAJADOR prestará sus servicios de manera virtual a través de los medios que indique EL EMPLEADOR, sin perjuicio de que este ordene el cambio de lugar de trabajo, temporal o permanente, sin desmejorar las condiciones laborales del TRABAJADOR (art. 23 CST, modificado por el art. 1 de la Ley 50 de 1990).")
    clausula("REMUNERACIÓN.", "EL EMPLEADOR reconocerá la remuneración indicada en la tabla inicial de este documento, la cual incluye la remuneración de descansos dominicales y festivos. De común acuerdo, no constituyen salario los pagos del artículo 128 del C.S.T. (auxilios, beneficios, bonificaciones, transporte, alimentación, etc.).")
    clausula("FORMA DE PAGO.", "La remuneración mensual será pagada mediante consignación en la cuenta bancaria de titularidad del TRABAJADOR dentro de los primeros cinco (5) días de cada mes.")
    clausula("RÉGIMEN APLICABLE.", "EL EMPLEADOR pagará al TRABAJADOR las prestaciones legales y derechos mínimos reconocidos por el Código Sustantivo del Trabajo.")
    clausula("JORNADA LABORAL.", `${contrato.jornada || "El TRABAJADOR laborará la jornada ordinaria de lunes a viernes, en el horario acordado con EL EMPLEADOR"}, pudiendo implementarse jornadas flexibles conforme al art. 51 de la Ley 789 de 2002.`)
    clausula("TRABAJO SUPLEMENTARIO.", "Todo trabajo nocturno, suplementario, dominical o festivo deberá ser autorizado previamente y por escrito por EL EMPLEADOR; sin dicha autorización no será reconocido.")
    clausula("OBLIGACIONES DEL EMPLEADOR.", "Proveer las herramientas necesarias; pagar la remuneración pactada; respetar la dignidad del TRABAJADOR; conceder permisos y licencias legales; y expedir la certificación laboral cuando se solicite.")
    clausula("OBLIGACIONES DEL TRABAJADOR.", "Poner su capacidad de trabajo al servicio del EMPLEADOR; realizar las labores del cargo; guardar reserva de la información; cumplir los reglamentos internos y de seguridad; comunicar conflictos de interés; y usar y conservar los elementos entregados.")
    clausula("CONFIDENCIALIDAD.", "EL TRABAJADOR se obliga, durante el contrato y después de su terminación, a no revelar ni utilizar la información confidencial o propiedad intelectual del EMPLEADOR a la que tenga acceso. Su incumplimiento se considera falta grave (num. 6 art. 7 del Decreto 2351 de 1965).")
    clausula("TERMINACIÓN DEL CONTRATO.", `El contrato terminará ${(contrato.tipo_contrato || "").toLowerCase().includes("obra") ? "por finalización de la obra o labor contratada, " : ""}por mutuo acuerdo o por las justas causas de los artículos 62 y 63 del C.S.T. EL EMPLEADOR podrá terminarlo unilateralmente y sin indemnización por las causales legales (engaño con documentos falsos, indisciplina, daño a bienes, revelación de secretos, bajo rendimiento prolongado, prestación de servicios a terceros sin autorización, entre otras).`)
    clausula("NO EXCLUSIVIDAD.", "EL TRABAJADOR podrá prestar servicios de forma simultánea por instrucción del EMPLEADOR a sociedades relacionadas, sin que ello implique coexistencia de contratos; el único empleador es MediaLab Ingeniería.")
    clausula("AUTORIZACIÓN DE DESCUENTO Y AJUSTE DE PAGOS.", "EL TRABAJADOR autoriza al EMPLEADOR a descontar de sus salarios y prestaciones los faltantes de elementos a su cargo y las sumas pagadas en exceso (arts. 59 y 149 C.S.T.).")
    clausula("AUTORIZACIÓN DE GRABACIONES Y POLÍTICAS.", "EL TRABAJADOR conoce y acepta los sistemas de control, rastreo y grabación instalados por EL EMPLEADOR con fines de calidad, y se obliga a conocer y cumplir las políticas y procedimientos internos.")
    clausula("HABEAS DATA.", "EL TRABAJADOR autoriza de manera previa, expresa e informada el tratamiento de sus datos personales conforme a la Ley 1581 de 2012, para los fines propios de la relación laboral, y conoce los derechos que le asisten como titular.")
    clausula("VACACIONES.", "EL TRABAJADOR gozará de quince (15) días hábiles de vacaciones por cada año laborado, o su fracción, dentro del año siguiente a su causación.")
    const t = (contrato.tipo_contrato || "").toLowerCase()
    let plazo = "El presente contrato será de término indefinido y continuará mientras subsistan las causas que le dieron origen."
    if (t.includes("fijo")) plazo = `El presente contrato es a término fijo${contrato.fecha_fin_probable ? `, hasta el ${fechaLarga(contrato.fecha_fin_probable)}` : ""}, y podrá prorrogarse conforme a la ley.`
    else if (t.includes("obra")) plazo = `El presente contrato es por la duración de la obra o labor contratada${contrato.fecha_fin_probable ? ` (estimada al ${fechaLarga(contrato.fecha_fin_probable)})` : ""}, y terminará junto con aquella, sin que haya lugar a renovación o prórroga alguna.`
    clausula("PLAZO DEL CONTRATO.", plazo)
    clausula("MODIFICACIÓN DE CONDICIONES.", "EL TRABAJADOR acepta las modificaciones de sus condiciones laborales que determine EL EMPLEADOR en ejercicio de su poder subordinante (jornada, lugar, cargo o funciones y forma de remuneración), siempre que no afecten su honor, dignidad o derechos mínimos ni impliquen desmejora (art. 23 C.S.T.). Las modificaciones se anotarán a continuación mediante otrosíes.")
    parrafo(`Para constancia se firma en dos o más ejemplares del mismo tenor, en la ciudad de ${EMISOR.ciudad}, el ${fechaLarga(contrato.vigente_desde)}.`, 9.5)
    firmas("EL TRABAJADOR", empleado.nombre, "EL EMPLEADOR")
  }

  footer(page)
  return pdf.save()

  // ── OTRO SÍ ─────────────────────────────────────────────────────────────────
  async function generarOtrosi(): Promise<Uint8Array> {
    const tipoTxt = porFactura ? "CONTRATO DE PRESTACIÓN DE SERVICIOS" : `CONTRATO DE TRABAJO ${tituloLaboral(contrato).toUpperCase()}`
    centro(`OTRO SÍ AL ${tipoTxt}`, 12.5, bold, cyan)
    y += 6
    const trabajadorLbl = porFactura ? "EL CONTRATISTA" : "EL TRABAJADOR"
    const empleadorLbl = porFactura ? "LA EMPRESA" : "EL EMPLEADOR"
    parrafo(
      `Entre ${EMISOR.nombre}, identificada con NIT No. ${EMISOR.nit}, representada por ${REP_LEGAL}, en adelante ${empleadorLbl}, y ${empleado.nombre}, identificado(a) con C.C. No. ${formatCedula(empleado.cedula)}, en adelante ${trabajadorLbl}, acuerdan suscribir el presente OTRO SÍ al contrato suscrito el ${opts.fechaOriginal ? fechaLarga(opts.fechaOriginal) : fechaLarga(inicio)}, bajo las siguientes cláusulas:`,
    )

    const objeto = contrato.motivo || contrato.descripcion || `actualizar las condiciones de ${trabajadorLbl}`
    clausula("PRIMERA - OBJETO.", `El presente documento tiene como propósito ${objeto}. Las partes acuerdan que la vigencia de este OTRO SÍ es a partir del ${fechaLarga(contrato.vigente_desde)}, aunque la firma se realice en fecha posterior.`)

    if (!porFactura && totalMensualContrato(contrato) > 0) {
      const items: string[] = [`Nuevo salario base: ${formatCOP(Number(contrato.salario_basico) || 0)}`]
      if ((Number(contrato.auxilio_transporte) || 0) > 0) items.push(`Auxilio de transporte / conectividad: ${formatCOP(Number(contrato.auxilio_transporte) || 0)}`)
      for (const l of contrato.otros_devengos ?? []) if (Number(l.valor) > 0) items.push(`${l.concepto}: ${formatCOP(Number(l.valor) || 0)}`)
      items.push(`Total, compensación mensual: ${formatCOP(totalMensualContrato(contrato))}`)
      clausula("SEGUNDA - MODIFICACIÓN SALARIAL.", `A partir del ${fechaLarga(contrato.vigente_desde)}, la remuneración de ${trabajadorLbl} será:`, items)
      parrafo("Las bonificaciones y otros conceptos que se establezcan no constituyen factor salarial para efectos de liquidación de prestaciones ni aportes a seguridad social, conforme al artículo 128 del Código Sustantivo del Trabajo.", 8, font, gray)
    }
    if (porFactura && (Number(contrato.freelance_tarifa) || 0) > 0) {
      clausula("SEGUNDA - MODIFICACIÓN DE LA CONTRAPRESTACIÓN.", `A partir del ${fechaLarga(contrato.vigente_desde)}, la contraprestación de ${trabajadorLbl} será de ${formatMoneda(Number(contrato.freelance_tarifa) || 0, contrato.freelance_moneda ?? "COP")}${contrato.freelance_modo === "por_hora" ? " por hora" : contrato.freelance_modo === "por_mes" ? " mensuales" : ""}.`)
    }
    if (funciones.length) {
      clausula(`FUNCIONES Y RESPONSABILIDADES DEL CARGO${cargo ? ` (${cargo})` : ""}.`, "En su nuevo cargo, y dentro de la jornada pactada, tendrá entre otras las siguientes funciones:", funciones)
    }
    if (contrato.condiciones_adicionales && contrato.condiciones_adicionales.trim()) {
      clausula("CONDICIONES ADICIONALES.", contrato.condiciones_adicionales)
    }

    clausula("PERMANENCIA DE LAS DEMÁS CONDICIONES.", "Las demás cláusulas del contrato suscrito entre las partes permanecen vigentes y sin modificación alguna, salvo lo dispuesto en el presente OTRO SÍ.")
    clausula("RATIFICACIÓN.", `Las partes acuerdan que este OTRO SÍ hace parte integral del contrato original, tiene vigencia desde el ${fechaLarga(contrato.vigente_desde)} y manifiestan su conformidad firmando en dos ejemplares en ${EMISOR.ciudad}.`)
    firmas(porFactura ? "El Contratista" : "El empleado", empleado.nombre, "MediaLab Ingeniería")

    footer(page)
    return pdf.save()
  }

  // ── Bloque de firmas (dos columnas) ─────────────────────────────────────────
  // empresaIzq=true → la empresa (rep. legal) va a la izquierda y el empleado a la derecha.
  function firmas(izqTitulo: string, izqNombre: string, derTitulo: string, empresaIzq = false) {
    y += 46
    espacio(70)
    const colW = (contentW - 40) / 2
    const yLine = H - y
    page.drawLine({ start: { x: M, y: yLine }, end: { x: M + colW, y: yLine }, thickness: 0.8, color: dark })
    page.drawLine({ start: { x: M + colW + 40, y: yLine }, end: { x: W - M, y: yLine }, thickness: 0.8, color: dark })
    const empSub = `C.C. ${formatCedula(empleado.cedula)}`
    const repSub = "Representante Legal"
    const izqNom = empresaIzq ? REP_LEGAL : izqNombre
    const izqSub = empresaIzq ? repSub : empSub
    const derNom = empresaIzq ? empleado.nombre : REP_LEGAL
    const derSub = empresaIzq ? empSub : repSub
    y += 13
    page.drawText(safe(izqTitulo), { x: M, y: H - y, size: 9, font: bold, color: dark })
    page.drawText(safe(derTitulo), { x: M + colW + 40, y: H - y, size: 9, font: bold, color: dark })
    y += 12
    page.drawText(safe(izqNom), { x: M, y: H - y, size: 8.5, font, color: dark })
    page.drawText(safe(derNom), { x: M + colW + 40, y: H - y, size: 8.5, font, color: dark })
    y += 11
    page.drawText(safe(izqSub), { x: M, y: H - y, size: 7.5, font, color: gray })
    page.drawText(safe(derSub), { x: M + colW + 40, y: H - y, size: 7.5, font, color: gray })
  }
}
