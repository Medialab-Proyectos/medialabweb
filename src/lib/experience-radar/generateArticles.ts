/**
 * Experience Radar — generación de ARTÍCULOS desde el agente diario.
 *
 * Convierte un DailyRadarReport en artículos con la estructura de 10 secciones.
 * Arranca con lo que la gente busca (equipos + el ángulo que disparó la conversación)
 * y lo convierte en aprendizaje de UX, comportamiento, producto e IA.
 *
 * Cumplimiento:
 *  - NUNCA inventa marcadores ni resultados ("Argentina ganó 2-1"). El hook es el
 *    fenómeno de experiencia/conversación, no el resultado deportivo.
 *  - No copia el contenido de las fuentes: parafrasea y enlaza como referencia.
 *  - Modo seguro heredado de generateRadarArticle (draft / reviewed:false).
 */

import {
  generateRadarArticle,
  type EmotionalRadarValues,
  type ProductApplication,
  type RadarArticle,
  type RadarArticleInput,
  type TeamRadar,
} from "./articles"
import { saveRadarArticles } from "./articleStore"
import { getAllRadarArticles } from "./articleData"
import { MATCH_NOTE_ACCESS_WINDOW_MS } from "./articleAvailability"
import { fetchTeamsContext, winSportsReference, type TeamContext } from "./fetchTeamContext"
import { summarizeMatch } from "./summarizeMatch"
import type {
  DailyRadarReport,
  ExperienceSignal,
  ExperienceSignalCategory,
} from "./types"

/* ───────────────── Playbook editorial por categoría ───────────────── */

interface ArticlePlaybook {
  /** Ángulo que la gente busca (sin marcador). */
  hook: string
  /** Cola del título SEO tras "Equipo vs Equipo:". */
  headline: string
  humanBehavior: string
  cognitiveBiases: string[]
  emotionalReaction: string
  digitalPatterns: string
  uxFinding: string
  productApplications: ProductApplication[]
}

const PLAYBOOK: Record<ExperienceSignalCategory, ArticlePlaybook> = {
  Streaming: {
    hook: "la alta demanda en la transmisión en vivo",
    headline: "qué pasó con la transmisión y qué revela sobre la experiencia digital en vivo",
    humanBehavior:
      "Ante un fallo de transmisión, las personas primero intentan diagnosticar la causa; si el sistema no la explica, asumen lo peor y migran a otra opción.",
    cognitiveBiases: [
      "Sesgo de atribución: sin información, el usuario culpa a su conexión o al producto.",
      "Aversión a la pérdida: perderse el momento pesa más que la calidad técnica.",
      "Efecto de recencia: el último fallo define la percepción de toda la plataforma.",
    ],
    emotionalReaction: "La frustración no viene de la caída, sino del silencio: no saber qué pasa multiplica la ansiedad.",
    digitalPatterns: "Concurrencia simultánea, multitarea entre apps y abandono rápido cuando no hay estado visible.",
    uxFinding:
      "Bajo alta demanda el usuario no perdona el silencio: una página de estado honesta y mensajes que distingan el origen del error retienen más que una recuperación rápida sin comunicación.",
    productApplications: [
      { sector: "Banco", application: "Si la app cae en día de nómina, una página de estado honesta retiene más que el silencio." },
      { sector: "Ecommerce", application: "En un flash sale, comunicar la cola y el estado evita que el pico de demanda se vuelva pico de abandono." },
      { sector: "Plataforma educativa", application: "En un examen masivo, guardado automático visible y mensajes de recuperación reducen el pánico ante caídas." },
    ],
  },
  Ticketing: {
    hook: "las filas virtuales en la venta de entradas",
    headline: "las filas virtuales, la frustración de la compra y qué enseña sobre experiencia digital",
    humanBehavior: "El usuario tolera esperar si entiende que conserva su lugar; la incertidumbre, no la espera, dispara el abandono.",
    cognitiveBiases: [
      "Aversión a la ambigüedad: una cola sin información se percibe como injusta.",
      "Sesgo de equidad: lo importante es sentir que el proceso es justo, no solo rápido.",
    ],
    emotionalReaction: "Ansiedad por perder el lugar y enojo cuando la fila se reinicia sin explicación.",
    digitalPatterns: "Recargas compulsivas, múltiples pestañas y reportes sociales inmediatos de errores de compra.",
    uxFinding: "Mostrar posición, tiempo estimado y continuidad de sesión convierte una espera tensa en una espera tolerable.",
    productApplications: [
      { sector: "Banco", application: "En procesos de verificación, mostrar el paso actual y el tiempo estimado reduce el abandono." },
      { sector: "Ecommerce", application: "En lanzamientos, una cola transparente con posición y reglas evita la sensación de arbitrariedad." },
      { sector: "Plataforma educativa", application: "En inscripciones con cupos, comunicar disponibilidad en tiempo real baja la ansiedad." },
    ],
  },
  Trust: {
    hook: "la polémica y la confianza en la información oficial",
    headline: "la polémica, las reacciones y qué nos enseña sobre confianza digital",
    humanBehavior: "Cuando hay incertidumbre, las personas buscan validación inmediata para confirmar lo que vieron antes de reaccionar.",
    cognitiveBiases: [
      "Sesgo de confirmación: cada quien interpreta la jugada a favor de su postura.",
      "Aversión a la ambigüedad: el silencio del sistema se percibe como injusticia.",
      "Sesgo de inmediatez: el valor de la información cae con cada segundo de espera.",
    ],
    emotionalReaction: "La espera sin contexto convierte la expectativa en frustración; la emoción la genera la falta de explicación.",
    digitalPatterns: "Picos simultáneos de búsqueda y demanda de repeticiones y fuentes oficiales en segundos.",
    uxFinding: "Los usuarios buscan validación inmediata ante la incertidumbre: mostrar contexto y evidencia mientras se procesa reduce la frustración.",
    productApplications: [
      { sector: "Banco", application: "En una transacción retenida por antifraude, mostrar estado y motivo reduce la ansiedad." },
      { sector: "Ecommerce", application: "En un pago en verificación, 'estamos confirmando tu compra' con progreso evita el abandono." },
      { sector: "Plataforma educativa", application: "Al validar entregas automáticamente, mostrar el criterio reduce la sensación de arbitrariedad." },
    ],
  },
  "High Traffic": {
    hook: "la saturación por el tráfico en vivo",
    headline: "la saturación de tráfico y qué revela sobre experiencias digitales de alta demanda",
    humanBehavior: "Bajo presión, el usuario juzga la marca por cómo se comporta el sistema en el pico, no en condiciones normales.",
    cognitiveBiases: [
      "Sesgo de disponibilidad: el momento de pico define el recuerdo de toda la experiencia.",
      "Aversión a la pérdida: la espera opaca se siente como una pérdida activa.",
    ],
    emotionalReaction: "Frustración masiva y sensación de exclusión cuando la espera no se explica.",
    digitalPatterns: "Latencia visible, recargas y abandono coordinado cuando falta jerarquía de contenido.",
    uxFinding: "El alto tráfico vuelve el UX una cuestión de arquitectura: prioridad de contenido, mensajes de estado y degradación elegante sostienen la confianza.",
    productApplications: [
      { sector: "Banco", application: "Definir qué se muestra primero cuando el sistema está saturado preserva las operaciones críticas." },
      { sector: "Ecommerce", application: "Planear el pico como escenario principal evita convertir demanda en abandono." },
      { sector: "Plataforma educativa", application: "En cierres de plazo, degradar funciones secundarias mantiene disponible lo esencial." },
    ],
  },
  "Error Recovery": {
    hook: "los errores y la recuperación durante el pico",
    headline: "los errores en vivo y qué enseña sobre recuperación y confianza digital",
    humanBehavior: "Un error no destruye la experiencia por existir, sino cuando no explica cómo recuperarse.",
    cognitiveBiases: [
      "Sesgo de atribución: sin mensaje claro, el usuario culpa a su propio dispositivo.",
      "Efecto de recencia: el último error define la percepción del producto.",
    ],
    emotionalReaction: "Inseguridad y desconfianza cuando el error no indica el próximo paso.",
    digitalPatterns: "Reintentos inseguros, pagos duplicados y soporte reactivo por falta de rutas de recuperación.",
    uxFinding: "Diseñar errores accionables, reintentos idempotentes y continuidad convierte el fallo en una oportunidad de confianza.",
    productApplications: [
      { sector: "Banco", application: "Diferenciar 'error tuyo' de 'error nuestro' con próximos pasos claros sostiene la confianza." },
      { sector: "Ecommerce", application: "Mensajes de error con acción concreta reducen los carritos abandonados por fricción." },
      { sector: "Plataforma educativa", application: "Recuperación de sesión y autoguardado evitan perder el trabajo del estudiante." },
    ],
  },
  "Mobile Experience": {
    hook: "la experiencia móvil durante el partido",
    headline: "la experiencia móvil en vivo y qué enseña sobre continuidad digital",
    humanBehavior: "En móvil, la continuidad pesa más que la completitud: sesiones cortas, redes variables y multitarea son la norma.",
    cognitiveBiases: ["Sesgo de esfuerzo: cada paso extra en móvil multiplica el abandono."],
    emotionalReaction: "Frustración cuando se pierde el contexto y hay que empezar de nuevo.",
    digitalPatterns: "Sesiones fragmentadas, cambios de red y reanudación esperada entre dispositivos.",
    uxFinding: "Persistir estado, optimizar peso y simplificar lo táctil mantiene la experiencia viva en condiciones reales de red.",
    productApplications: [
      { sector: "Banco", application: "Persistir el progreso de un trámite evita reinicios al cambiar de red." },
      { sector: "Ecommerce", application: "Optimizar el checkout móvil y guardar el carrito reduce el abandono." },
      { sector: "Plataforma educativa", application: "Reanudar la lección donde se quedó respeta el uso real en transporte y pausas." },
    ],
  },
  Accesibilidad: {
    hook: "la accesibilidad de la transmisión",
    headline: "la accesibilidad en eventos masivos y por qué define quién participa",
    humanBehavior: "En eventos masivos, accesibilidad significa participación: subtítulos, contraste y navegación asistida no son extras.",
    cognitiveBiases: ["Sesgo del diseñador: asumir que todos perciben e interactúan igual que uno mismo."],
    emotionalReaction: "Exclusión y frustración para quienes no pueden seguir el contenido.",
    digitalPatterns: "Uso creciente de subtítulos y lectura asistida durante transmisiones en vivo.",
    uxFinding: "Tratar la accesibilidad como requisito —no como mejora— amplía la audiencia y reduce la carga de soporte.",
    productApplications: [
      { sector: "Banco", application: "Flujos críticos compatibles con lectores de pantalla evitan excluir clientes." },
      { sector: "Ecommerce", application: "Contraste y navegación por teclado amplían el mercado alcanzable." },
      { sector: "Plataforma educativa", application: "Subtítulos y materiales accesibles son condición de aprendizaje, no un extra." },
    ],
  },
  "Fan Experience": {
    hook: "la conversación y la atención del fan",
    headline: "la conversación social y qué revela sobre atención y fatiga digital",
    humanBehavior: "La conversación muestra necesidades emocionales: pertenencia, certeza y control de la atención.",
    cognitiveBiases: ["Sobrecarga por defecto: más notificaciones se confunde con más cercanía."],
    emotionalReaction: "Fatiga y desconexión cuando el ruido supera al valor.",
    digitalPatterns: "Picos de notificaciones, silenciamiento y migración cuando la atención se satura.",
    uxFinding: "Priorizar y agrupar notificaciones por intención respeta la atención y sostiene el engagement.",
    productApplications: [
      { sector: "Banco", application: "Alertas por valor real (no por volumen) evitan que el usuario silencie avisos críticos." },
      { sector: "Ecommerce", application: "Personalizar notificaciones por intención reduce el ruido y mejora la conversión." },
      { sector: "Plataforma educativa", application: "Recordatorios útiles y dosificados sostienen el hábito sin saturar." },
    ],
  },
  IA: {
    hook: "los asistentes con IA durante el evento",
    headline: "el uso de IA en vivo y qué enseña sobre confianza y trazabilidad",
    humanBehavior: "El usuario confía en la IA cuando comunica fuentes, límites y nivel de certeza; una respuesta confiada pero errónea daña más que la ausencia.",
    cognitiveBiases: ["Sesgo de automatización: confiar de más en la respuesta de la máquina."],
    emotionalReaction: "Desconfianza tras una respuesta segura pero equivocada.",
    digitalPatterns: "Preguntas en tiempo real y verificación cruzada con fuentes oficiales.",
    uxFinding: "Mostrar fuentes y certeza, permitir corrección y separar dato de opinión protege la confianza en la IA.",
    productApplications: [
      { sector: "Banco", application: "Un asistente que cita la fuente del dato evita decisiones financieras equivocadas." },
      { sector: "Ecommerce", application: "Recomendaciones con motivo visible generan más confianza que respuestas opacas." },
      { sector: "Plataforma educativa", application: "Tutores con IA deben mostrar evidencia y límites para no inducir errores." },
    ],
  },
  UX: {
    hook: "la búsqueda de información en tiempo real",
    headline: "la demanda de información en vivo y qué enseña sobre claridad digital",
    humanBehavior: "Cuando todos buscan información a la vez, la claridad y la velocidad pesan más que cualquier capa visual.",
    cognitiveBiases: ["Sesgo de inmediatez: el valor del dato cae con cada segundo de espera."],
    emotionalReaction: "Confusión y abandono cuando la información tarda o es ambigua.",
    digitalPatterns: "Búsquedas repetidas, multitarea y demanda de la fuente oficial del dato.",
    uxFinding: "Priorizar la información crítica y reducir pasos hacia ella mantiene al usuario y baja el soporte.",
    productApplications: [
      { sector: "Banco", application: "Exponer primero el saldo y los movimientos clave reduce búsquedas frustradas." },
      { sector: "Ecommerce", application: "Mostrar estado de pedido y disponibilidad al instante evita tickets de soporte." },
      { sector: "Plataforma educativa", application: "Acceso directo a notas, fechas y tareas reduce la fricción del estudiante." },
    ],
  },
}

/* ───────────────── Utilidades ───────────────── */

const TEAM_DISPLAY: Record<string, string> = {
  argentina: "Argentina",
  brasil: "Brasil",
  colombia: "Colombia",
  mexico: "México",
  "méxico": "México",
  canada: "Canadá",
  usa: "USA",
  "estados unidos": "Estados Unidos",
  paraguay: "Paraguay",
  bosnia: "Bosnia y Herzegovina",
  "bosnia y herzegovina": "Bosnia y Herzegovina",
  espana: "España",
  "españa": "España",
  francia: "Francia",
  sudafrica: "Sudáfrica",
  "sudáfrica": "Sudáfrica",
  japon: "Japón",
  "japón": "Japón",
}

function displayTeam(team: string): string {
  return TEAM_DISPLAY[team.toLowerCase()] ?? team.charAt(0).toUpperCase() + team.slice(1)
}

function teamsLabel(teams: string[]): string {
  const named = Array.from(new Set(teams.map(displayTeam)))
  if (named.length >= 2) return `${named[0]} vs ${named[1]}`
  if (named.length === 1) return named[0]
  return "Mundial 2026"
}

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)))

/** Resumen para IA (~100 palabras) construido desde el aprendizaje. */
function aiSummary(label: string, category: ExperienceSignalCategory, play: ArticlePlaybook): string {
  return `En ${label} del Mundial 2026, Experience Radar de MediaLab analiza ${play.hook} en clave de experiencia digital, no de marcador. ${play.humanBehavior} ${play.emotionalReaction} El aprendizaje clave: ${play.uxFinding} Para productos digitales de alto tráfico —banca, ecommerce, edtech y SaaS— la lección es diseñar para la incertidumbre y el pico: estados transparentes, mensajes claros y recuperación visible que conserven la confianza del usuario.`
}

/** quickSummary (<100 palabras) sin marcador, enfocado en experiencia. */
function quickSummary(label: string, event: string, play: ArticlePlaybook): string {
  return `${label} concentró la atención digital en el Mundial 2026 y disparó búsquedas, reacciones y conversación en torno a ${play.hook}. Más allá del resultado, el episodio funciona como una señal de comportamiento: ${play.emotionalReaction} En este análisis no narramos el marcador: observamos la experiencia, la ansiedad del usuario y los patrones digitales que deja un evento de alta demanda, para convertirlos en aprendizajes de UX, producto e IA.`
}

/** Lo que ocurrió (≤300 palabras), describiendo el fenómeno de experiencia. */
function whatHappened(label: string, play: ArticlePlaybook): string {
  return `${label} fue uno de los focos de conversación digital del día en el Mundial 2026. El interés no se quedó en la cancha: se trasladó a las plataformas, donde miles de personas intentaban seguir el evento al mismo tiempo. Ahí apareció ${play.hook}, el verdadero protagonista desde la mirada de experiencia. ${play.humanBehavior} En cuestión de minutos, la conversación se llenó de preguntas, reportes y reacciones, y la audiencia saltaba entre pantallas buscando claridad. ${play.digitalPatterns} El patrón se repite en todos los eventos de alta demanda: el resultado deportivo importa, pero la experiencia digital se define en la espera, la claridad de la información y la capacidad de recuperarse de un fallo. Este artículo toma esa señal —lo que la gente buscó y sintió— y la convierte en un aprendizaje accionable para quienes diseñan productos digitales.`
}

/**
 * Interpretación por fase y categoría emocional, consciente del FENÓMENO del partido
 * (el `hook` de la categoría) y de las selecciones. Mejor que el texto genérico de
 * respaldo de la UI; cuando se conecte el análisis con IA, este texto se reemplazará
 * por uno con datos aún más específicos (resultado, jugadas, citas reales).
 */
function buildInterpretations(label: string, play: ArticlePlaybook): RadarArticle["matchInterpretations"] {
  const hook = play.hook
  return {
    expectativa: {
      euforia: `Antes del pitazo, la euforia en torno a ${label} se alimenta de la expectativa del evento, todavía sin la tensión de ${hook}.`,
      confianza: `La afición llega confiada en su relato del partido; aún no aparece ${hook} como factor.`,
      ansiedad: `La ansiedad previa es baja: la conversación se centra en cómo y dónde seguir ${label}.`,
      frustracion: `Apenas hay molestia antes del partido; la atención está en la ilusión, no en ${hook}.`,
      incertidumbre: `La incertidumbre previa es la propia del evento: qué pasará, no cómo se vivirá la experiencia.`,
      optimismo: `El optimismo domina la previa: las hinchadas proyectan lo mejor para ${label}.`,
    },
    realidad: {
      euforia: `Mientras se vive ${label}, la euforia compite con ${hook}: la emoción positiva y la tensión digital ocurren a la vez.`,
      confianza: `La confianza se pone a prueba cuando aparece ${hook}. ${play.emotionalReaction}`,
      ansiedad: `La ansiedad se dispara por ${hook}: ${play.humanBehavior}`,
      frustracion: `La frustración del momento nace de ${hook}, más que del marcador. ${play.emotionalReaction}`,
      incertidumbre: `La incertidumbre la marca ${hook}: la audiencia busca una explicación estable en tiempo real.`,
      optimismo: `El optimismo se sostiene en lo deportivo, pero ${hook} condiciona cómo se vive el partido.`,
    },
    percepcion: {
      euforia: `Con las horas, el recuerdo de ${label} retiene la emoción, aunque ${hook} deja huella en la conversación.`,
      confianza: `La confianza posterior depende de si ${hook} se resolvió con claridad o quedó como reclamo.`,
      ansiedad: `Baja la ansiedad: ya hay un relato aceptado de lo que pasó en ${label}.`,
      frustracion: `La frustración por ${hook} persiste como nota de fondo, lista para reactivarse.`,
      incertidumbre: `La lectura se estabiliza; queda la duda de si ${hook} se repetirá en el próximo partido.`,
      optimismo: `El recuerdo proyecta optimismo hacia lo que viene, con ${hook} convertido en aprendizaje.`,
    },
  }
}

/** Construye el pulso de aficionados desde las señales del reporte. */
function buildFanPulse(report: DailyRadarReport): RadarArticleInput["fanPulse"] {
  const all = report.signals
  const take = (arr: (string | undefined)[], n: number) =>
    Array.from(new Set(arr.filter((x): x is string => Boolean(x && x.trim())))).slice(0, n)

  const concerns = take(all.flatMap((s) => s.frequentQuestions ?? []), 4)
  const frustrations = take(all.flatMap((s) => s.repeatedComplaints ?? []), 4)
  const enthusiasm = take(all.flatMap((s) => s.relatedQueries ?? []), 4)
  const negative = all.filter((s) => s.sentiment === "negativo").length
  const positive = all.filter((s) => s.sentiment === "positivo").length

  const emotions: string[] = []
  if (negative >= positive) emotions.push("Frustración", "Ansiedad durante la espera")
  if (positive > 0) emotions.push("Entusiasmo y pertenencia")
  emotions.push("Necesidad de validación inmediata")

  const sources = report.sources
    .filter((s) => ["reddit", "google-trends", "app-review"].includes(s.type) && s.url)
    .slice(0, 4)
    .map((s) => ({
      name: s.name,
      url: s.url,
      kind:
        s.type === "reddit"
          ? ("conversacion" as const)
          : s.type === "google-trends"
            ? ("tendencia" as const)
            : ("reseña" as const),
    }))

  return {
    concerns: concerns.length ? concerns : ["¿Dónde y cómo seguir el partido?", "¿Es mi conexión o la plataforma?"],
    emotions: Array.from(new Set(emotions)).slice(0, 4),
    frustrations: frustrations.length ? frustrations : ["Información fragmentada entre fuentes.", "Falta de mensajes claros de estado."],
    enthusiasm: enthusiasm.length ? enthusiasm : ["Picos de búsqueda sobre cómo ver el evento.", "Conversación masiva en redes."],
    sources,
  }
}

/** Factores del Experience Radar Score derivados de las señales reales. */
function deriveScoreFactors(lead: ExperienceSignal, report: DailyRadarReport) {
  const conversation = report.signals.filter((s) => ["reddit", "google-trends"].includes(s.sourceType)).length
  const complaints = (lead.repeatedComplaints?.length ?? 0) + (lead.frequentQuestions?.length ?? 0)
  const rising = report.signals.some((s) => s.rising)
  const volume = Math.max(...report.signals.map((s) => s.relativeVolume ?? 0), 0)

  return {
    emotionalImpact: clamp(70 + complaints * 6 + (lead.sentiment === "negativo" ? 12 : 0)),
    digitalConversation: clamp(58 + conversation * 6),
    virality: clamp(rising ? 86 : 70 + volume * 0.2),
    userInterest: clamp(72 + volume * 0.25 + (rising ? 6 : 0)),
  }
}

/* ───────────────── Generación ───────────────── */

/**
 * Convierte un reporte diario en artículos. Toma como "lead" las señales con
 * equipos identificados (noticia) y, si no hay, cae a los insights por categoría.
 */
export function generateArticlesFromReport(report: DailyRadarReport): RadarArticle[] {
  const fanPulse = buildFanPulse(report)
  const date = report.date

  // Leads: señales noticiosas con equipos detectados, deduplicadas por par de equipos.
  const seenPairs = new Set<string>()
  const leads = report.signals.filter((s) => {
    if (s.sourceType !== "latingoles" || !s.teams || s.teams.length !== 2) return false
    if (!/\b(vence|venció|derrota|derrotó|empata|empató|gana|ganó|resultado|final|previa|partido|enfrenta|juega|jugará|debut)\b/i.test(s.title)) return false
    const key = Array.from(new Set(s.teams.map((t) => t.toLowerCase()))).sort().join("-")
    if (seenPairs.has(key)) return false
    seenPairs.add(key)
    return true
  })

  const inputs: RadarArticleInput[] = leads.slice(0, 6).map((lead) => {
    const category = (lead.classifications[0] ?? "UX") as ExperienceSignalCategory
    const play = PLAYBOOK[category]
    const label = teamsLabel(lead.teams)
    const event = "Mundial 2026 — Fase de grupos"

    return {
      category,
      date,
      matchState: /\b(vence|venció|derrota|derrotó|empata|empató|gana|ganó|resultado|final)\b/i.test(lead.title)
        ? "finalizado"
        : "previa",
      slug: `${label} ${category} ${date}`,
      seoTitle: `${label}: ${play.headline}`,
      teams: Array.from(new Set(lead.teams.map(displayTeam))),
      event,
      hook: play.hook,
      matchInterpretations: buildInterpretations(label, play),
      quickSummary: quickSummary(label, event, play),
      whatHappened: whatHappened(label, play),
      keyPlays: [],
      controversies: take(lead.repeatedComplaints, 3),
      statements: take(lead.frequentQuestions, 3),
      fanPulse,
      mediaLabInsight: {
        humanBehavior: report.article.medialabInsight || play.humanBehavior,
        cognitiveBiases: play.cognitiveBiases,
        emotionalReaction: play.emotionalReaction,
        digitalPatterns: play.digitalPatterns,
      },
      productApplications: play.productApplications,
      scoreFactors: deriveScoreFactors(lead, report),
      uxFinding: report.findingOfTheDay || play.uxFinding,
      aiSummary: report.article.aiSummary || aiSummary(label, category, play),
      sources: [
        { name: lead.sourceName, url: lead.url, kind: "referencia" as const },
        ...report.sources
          .filter((s) => s.type === "fifa" && s.url)
          .slice(0, 1)
          .map((s) => ({ name: s.name, url: s.url, kind: "oficial" as const })),
      ],
    }
  })

  return inputs.map(generateRadarArticle)
}

function take(arr: string[] | undefined, n: number): string[] {
  return Array.from(new Set((arr ?? []).filter((x) => x && x.trim()))).slice(0, n)
}

/**
 * Genera y persiste los artículos del reporte. Lo llama la route del agente diario.
 * Si no se pueden generar artículos (p. ej. sin señales con equipos), no borra los
 * existentes: simplemente devuelve [].
 */
export async function generateAndStoreArticlesFromReport(
  report: DailyRadarReport,
): Promise<RadarArticle[]> {
  const generated = generateArticlesFromReport(report)
  const existing = await getAllRadarArticles()
  const nowMs = new Date(report.generatedAt).getTime()

  // Idempotencia: solo se analizan PREVIAS y FINALES aún no completadas. La marca
  // analyzedPreviaAt/analyzedFinalAt es independiente de `matchState` (los seeds vienen
  // como "previa" sin análisis real). Si la fase ya está completa, no se re-analiza.
  const candidates = generated.flatMap((article) => {
    const fixture = existing.find((candidate) => sameTeams(candidate.teams, article.teams))
    if (!fixture?.kickoffAt) return []

    const kickoff = new Date(fixture.kickoffAt).getTime()
    if (!Number.isFinite(kickoff)) return []

    const beforeKickoff = nowMs < kickoff
    const insidePreviewWindow = beforeKickoff && kickoff - nowMs <= MATCH_NOTE_ACCESS_WINDOW_MS
    const previaDone = Boolean(fixture.analyzedPreviaAt)
    const finalDone = Boolean(fixture.analyzedFinalAt)

    if (beforeKickoff && (!insidePreviewWindow || previaDone)) return []
    if (!beforeKickoff && (article.matchState !== "finalizado" || finalDone)) return []

    return [{ article, fixture, beforeKickoff }]
  })

  // Enriquecimiento (IA + contexto Wikipedia/WinSports + radar por hinchada) solo de las
  // fases que sí se van a (re)escribir, para no gastar llamadas en partidos ya cubiertos.
  const articles = await Promise.all(
    candidates.map(({ article, fixture, beforeKickoff }) =>
      enrichArticle(article, fixture, beforeKickoff, report),
    ),
  )

  const updates = articles
  if (updates.length === 0) return []
  await saveRadarArticles(updates)
  return updates
}

/**
 * Enriquece una nota antes de persistirla: resumen IA por partido (con respaldo
 * determinista coherente que usa contexto de Wikipedia/WinSports), radar por hinchada
 * (`teamRadars`) y marcas de idempotencia por fase. Tolerante a fallos de red/IA.
 */
async function enrichArticle(
  article: RadarArticle,
  fixture: RadarArticle,
  beforeKickoff: boolean,
  report: DailyRadarReport,
): Promise<RadarArticle> {
  const status = beforeKickoff ? ("previa" as const) : ("finalizado" as const)

  const teamContext = await fetchTeamsContext(article.teams)

  const relSignals = report.signals
    .filter((s) => s.teams?.length && sameTeams(s.teams, article.teams))
    .slice(0, 6)
    .map((s) => ({ title: s.title, summary: (s.summary ?? "").slice(0, 400), source: s.sourceName }))

  const ai = await summarizeMatch({
    label: article.teams.join(" vs "),
    teams: article.teams,
    event: article.event,
    status,
    hook: article.hook,
    category: article.category,
    signals: relSignals,
    teamContext,
  })

  const fallback = deterministicSummaries(article, teamContext)
  const quickSummary = ai?.quickSummary || fallback.quickSummary
  const matchSummary = ai?.matchSummary || fallback.matchSummary

  const contextSources = [
    ...teamContext
      .filter((c) => c.sourceUrl)
      .map((c) => ({ name: `${c.sourceName}: ${c.team}`, url: c.sourceUrl as string, kind: "referencia" as const })),
    { ...winSportsReference(), kind: "referencia" as const },
  ]
  const sources = dedupeSources([...article.sources, ...contextSources])

  return {
    ...article,
    imageUrl: fixture.imageUrl,
    imageAlt: fixture.imageAlt,
    imageCredit: fixture.imageCredit,
    imageSourceUrl: fixture.imageSourceUrl,
    id: fixture.id,
    slug: fixture.slug,
    date: fixture.date,
    kickoffAt: fixture.kickoffAt,
    matchState: status,
    updateState: "ready" as const,
    quickSummary,
    matchSummary,
    teamRadars: buildTeamRadars(article),
    sources,
    analyzedPreviaAt: status === "previa" ? report.generatedAt : fixture.analyzedPreviaAt,
    analyzedFinalAt: status === "finalizado" ? report.generatedAt : fixture.analyzedFinalAt,
    publishedAt: fixture.publishedAt,
    updatedAt: report.generatedAt,
  }
}

/** Primera oración de un texto (para recortar extractos largos de Wikipedia). */
function oneSentence(text: string): string {
  const i = text.indexOf(". ")
  return i > 0 ? text.slice(0, i + 1) : text
}

/** Respaldo determinista coherente cuando no hay IA: incorpora el contexto de equipos. */
function deterministicSummaries(
  article: RadarArticle,
  context: TeamContext[],
): { quickSummary: string; matchSummary: string } {
  const ctxLine = context.length
    ? " " + context.map((c) => `${c.team}: ${oneSentence(c.summary)}`).join(" ")
    : ""
  const label = article.teams.join(" vs ")
  const matchSummary =
    `${label} concentró la atención del Mundial 2026 desde la mirada de experiencia, más allá del marcador.${ctxLine} ` +
    "Aquí leemos cómo reaccionan las hinchadas: su conversación en redes y noticias, su confianza y su frustración digital."
  return { quickSummary: article.quickSummary, matchSummary }
}

function dedupeSources(sources: RadarArticle["sources"]): RadarArticle["sources"] {
  const seen = new Set<string>()
  return sources.filter((s) => {
    if (!s.url || seen.has(s.url)) return false
    seen.add(s.url)
    return true
  })
}

/* ── Radar por hinchada (teamRadars): derivado del score con sesgo por equipo ── */

function emotionalFromScore(rs: RadarArticle["radarScore"]): EmotionalRadarValues {
  return {
    euforia: clamp(rs.userInterest * 0.7),
    confianza: clamp(100 - rs.emotionalImpact * 0.6),
    ansiedad: clamp(rs.emotionalImpact),
    frustracion: clamp(rs.emotionalImpact * 0.9),
    incertidumbre: clamp(rs.digitalConversation),
    optimismo: clamp(100 - rs.virality * 0.5),
  }
}

/** Sesgo determinista [-0.4, 0.4] por nombre de selección (distingue las dos hinchadas). */
function teamLean(team: string): number {
  let h = 0
  for (let i = 0; i < team.length; i++) h = (h * 31 + team.charCodeAt(i)) % 1000
  return (h / 1000) * 0.8 - 0.4
}

function leanEmotional(e: EmotionalRadarValues, lean: number): EmotionalRadarValues {
  return {
    euforia: clamp(e.euforia * (1 + 0.14 * lean)),
    confianza: clamp(e.confianza * (1 + 0.16 * lean)),
    ansiedad: clamp(e.ansiedad * (1 - 0.14 * lean)),
    frustracion: clamp(e.frustracion * (1 - 0.16 * lean)),
    incertidumbre: clamp(e.incertidumbre * (1 - 0.1 * lean)),
    optimismo: clamp(e.optimismo * (1 + 0.15 * lean)),
  }
}

/** Proyección al próximo partido: más ánimo positivo, menos tensión. */
function projectPredicted(e: EmotionalRadarValues): EmotionalRadarValues {
  return {
    euforia: clamp(e.euforia * 1.04),
    confianza: clamp(e.confianza * 1.06),
    ansiedad: clamp(e.ansiedad * 0.88),
    frustracion: clamp(e.frustracion * 0.85),
    incertidumbre: clamp(e.incertidumbre * 0.8),
    optimismo: clamp(e.optimismo * 1.08),
  }
}

function avgEmotional(e: EmotionalRadarValues): number {
  const vals = Object.values(e)
  return clamp(vals.reduce((a, b) => a + b, 0) / vals.length)
}

function buildTeamRadars(article: RadarArticle): TeamRadar[] {
  const combined = article.emotionalRadar ?? emotionalFromScore(article.radarScore)
  return article.teams.map((team) => {
    const current = leanEmotional(combined, teamLean(team))
    const predicted = projectPredicted(current)
    return {
      team,
      current: { score: avgEmotional(current), emotional: current },
      predicted: { score: avgEmotional(predicted), emotional: predicted },
    }
  })
}

function sameTeams(left: string[], right: string[]): boolean {
  const normalize = (teams: string[]) => teams.map((team) => team.trim().toLowerCase()).sort().join("|")
  return normalize(left) === normalize(right)
}
