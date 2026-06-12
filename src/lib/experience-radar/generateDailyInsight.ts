import { isAutoPublishEnabled, makeId } from "./sources"
import { scoreExperienceIndex, scoreInsightImpact } from "./scoreExperienceIndex"
import type {
  DailyRadarReport,
  ExperienceInsight,
  ExperienceSignal,
  ExperienceSignalCategory,
  SourceUsage,
} from "./types"
import { ExperienceRadarDailyAgent } from "./types"

const CATEGORY_COPY: Record<
  ExperienceSignalCategory,
  { insight: string; risk: string; opportunity: string; recommendation: string }
> = {
  UX: {
    insight: "La demanda de informacion en tiempo real revela que la claridad supera a cualquier capa visual cuando el usuario esta ansioso.",
    risk: "Confusion, busquedas repetidas y abandono temprano.",
    opportunity: "Priorizar caminos cortos hacia informacion critica y estados de sistema legibles.",
    recommendation: "Reducir pasos, etiquetar claramente la fuente de cada dato y probar comprension en escenarios de urgencia.",
  },
  IA: {
    insight: "La IA solo suma valor cuando comunica fuentes, limites y nivel de certeza.",
    risk: "Respuestas confiadas pero imprecisas pueden erosionar confianza.",
    opportunity: "Disenar asistentes con citas visibles, fallback humano y estados de incertidumbre.",
    recommendation: "Anclar respuestas a fuentes verificadas y separar datos oficiales de interpretaciones.",
  },
  Accesibilidad: {
    insight: "En eventos masivos, accesibilidad significa participacion: subtitulos, contraste y navegacion asistida no son extras.",
    risk: "Exclusion de usuarios y mayor carga de soporte.",
    opportunity: "Auditar flujos criticos con usuarios, lectores de pantalla y condiciones de red reales.",
    recommendation: "Incluir accesibilidad en la definicion de listo para cada release del evento.",
  },
  Streaming: {
    insight: "La experiencia de streaming se decide en espera, carga, error y reconexion, no solo durante la reproduccion.",
    risk: "Frustracion, perdida de confianza y migracion a canales no deseados.",
    opportunity: "Disenar colas, mensajes de estado y recuperacion de sesion con transparencia.",
    recommendation: "Tratar buffering, fallback y reconexion como flujos principales.",
  },
  Ticketing: {
    insight: "La fila virtual define la percepcion de justicia; el usuario tolera esperar si entiende que conserva su lugar.",
    risk: "Ansiedad, abandono de compra y percepcion de arbitrariedad.",
    opportunity: "Mostrar posicion, tiempo estimado, reglas y continuidad de sesion.",
    recommendation: "Probar ticketing con picos simulados y mensajes de error accionables.",
  },
  "Fan Experience": {
    insight: "La conversacion social muestra necesidades emocionales: pertenencia, certeza y control de la atencion.",
    risk: "Saturacion de notificaciones y fatiga durante momentos de alta expectativa.",
    opportunity: "Personalizar alertas por intencion y reducir ruido informativo.",
    recommendation: "Medir utilidad percibida de notificaciones, no solo apertura.",
  },
  "Mobile Experience": {
    insight: "El movil concentra sesiones cortas, redes variables y multitarea; la continuidad pesa mas que la completitud.",
    risk: "Perdida de contexto, recargas y abandono.",
    opportunity: "Persistir estado, optimizar peso y simplificar interacciones tactiles.",
    recommendation: "Validar los flujos criticos en dispositivos de gama media y redes inestables.",
  },
  Trust: {
    insight: "La confianza se construye con consistencia: fuente, estado, confirmacion y recuperacion deben decir lo mismo.",
    risk: "Desconfianza, soporte saturado y dano reputacional.",
    opportunity: "Hacer visibles fuentes, confirmaciones y rutas de soporte.",
    recommendation: "Crear una matriz de mensajes confiables para estados normales, pico y fallo.",
  },
  "High Traffic": {
    insight: "El alto trafico convierte el UX en arquitectura visible: latencia, espera y degradacion definen la marca.",
    risk: "Caidas percibidas, frustracion masiva y abandono.",
    opportunity: "Planear la experiencia de pico como escenario principal.",
    recommendation: "Combinar pruebas de carga con pruebas de comprension de mensajes bajo espera.",
  },
  "Error Recovery": {
    insight: "Los errores no destruyen la experiencia por existir; la destruyen cuando no explican como recuperarse.",
    risk: "Reintentos inseguros, pagos duplicados, perdida de sesion y soporte reactivo.",
    opportunity: "Disenar errores accionables, reintentos idempotentes y continuidad.",
    recommendation: "Definir mensajes por tipo de error con proximo paso claro y trazabilidad.",
  },
}

export function generateDailyInsight(signals: ExperienceSignal[], sources: SourceUsage[]): DailyRadarReport {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const insights = buildInsights(signals).slice(0, 10)
  const worldExperienceIndex = scoreExperienceIndex(insights)
  const autoPublished = isAutoPublishEnabled()
  const editorialSignals = buildEditorialSignals(signals, insights)

  const risks = unique(
    insights.map((insight) => insight.risk),
    5,
  )
  const opportunities = unique(
    insights.map((insight) => insight.opportunity),
    5,
  )
  const recommendations = unique(
    insights.map((insight) => insight.recommendation),
    5,
  )

  const findingOfTheDay =
    insights[0]?.insight ??
    "No hubo suficientes senales verificadas para generar un hallazgo automatizado del dia."
  const article = buildArticle(editorialSignals, findingOfTheDay, insights, worldExperienceIndex)
  const seo = buildSeo(date, editorialSignals, article, sources)

  return {
    id: `experience-radar-${date}`,
    agentName: ExperienceRadarDailyAgent,
    date,
    generatedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: autoPublished ? "published" : "draft",
    reviewed: false,
    autoPublished,
    title: "No seguimos el marcador. Analizamos la experiencia.",
    subtitle:
      "Lo que el dia inaugural del Mundial revela sobre comportamiento digital, ansiedad de usuarios y experiencias de alto trafico.",
    seo,
    editorialSignals,
    article,
    findingOfTheDay,
    topInsights: insights,
    risks,
    opportunities,
    recommendations,
    worldExperienceIndex,
    note: {
      executiveSummary:
        "MediaLab convierte senales verificables del ecosistema Mundial en aprendizajes de UX, producto e IA. Esta nota no narra partidos: observa friccion, ansiedad, confianza y recuperacion en experiencias digitales de alta demanda.",
      analyzedSignals: summarizeSignals(signals),
      mainFinding: findingOfTheDay,
      uxInsights: insights.map((insight) => insight.insight),
      detectedRisks: risks,
      designOpportunities: opportunities,
      productRecommendations: recommendations,
      sources,
    },
    signals,
    sources,
  }
}

function buildEditorialSignals(
  signals: ExperienceSignal[],
  insights: ExperienceInsight[],
): DailyRadarReport["editorialSignals"] {
  const newsSignals = signals.filter((signal) => signal.sourceType === "latingoles" || signal.sourceType === "fifa")
  const socialSignals = signals.filter((signal) => signal.sourceType === "reddit" || signal.sourceType === "app-review")
  const trendSignals = signals.filter((signal) => signal.sourceType === "google-trends" || signal.rising)
  const primary = selectPrimaryNewsSignal(newsSignals) ?? signals[0]
  const teams = unique(signals.flatMap((signal) => signal.teams), 2)
  const matchName = teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : primary?.title ?? "Mundial 2026"
  const highlight = findByWords(signals, ["polemica", "var", "controversia", "reclamo", "duda", "error"]) ?? primary
  const dominantConversation = dominantConversationFromSignals(socialSignals, insights)
  const mainTrend =
    trendSignals[0]?.term ??
    trendSignals[0]?.title ??
    primary?.tags.find((tag) => tag.toLowerCase().includes("mundial")) ??
    "Mundial 2026"

  return {
    resultOrMainFact:
      primary?.title ??
      "Hecho principal del dia: el interes digital se concentra en informacion inmediata del Mundial.",
    matchSummary:
      primary?.summary ||
      `La cobertura del dia se toma como punto de entrada para entender como usuarios buscan contexto, certeza y acceso durante ${matchName}.`,
    controversyOrHighlight:
      highlight?.summary ||
      "El momento destacado no se trata como relato deportivo, sino como senal de ansiedad, friccion o necesidad de informacion clara.",
    statements: extractStatements(signals),
    mainTrend,
    dominantConversation,
    fanConversation:
      socialSignals.length > 0
        ? dominantConversation
        : "La conversacion disponible proviene de senales verificadas y reviews recientes; Reddit queda listo para activarse con credenciales oficiales.",
  }
}

function buildArticle(
  editorialSignals: DailyRadarReport["editorialSignals"],
  findingOfTheDay: string,
  insights: ExperienceInsight[],
  worldExperienceIndex: number,
): DailyRadarReport["article"] {
  const topInsight = insights[0]

  return {
    resultOrMainFact: editorialSignals.resultOrMainFact,
    matchSummary: editorialSignals.matchSummary,
    controversyOrHighlight: editorialSignals.controversyOrHighlight,
    whatFansSay: editorialSignals.fanConversation,
    medialabInsight:
      topInsight?.insight ??
      findingOfTheDay,
    productDesignApplication:
      topInsight?.recommendation ??
      "Convertir el evento en un test de claridad: que debe saber el usuario, que puede hacer si algo falla y como recupera el control.",
    experienceRadarScore: `${worldExperienceIndex}/100. El score resume la salud de la experiencia digital observada: claridad, confianza, continuidad, carga cognitiva y recuperacion.`,
    ctaCourseUx: {
      title: "⚽ Aprende UX observando el Mundial",
      body: "Los eventos deportivos mas grandes del mundo son laboratorios de comportamiento humano.",
      discount: "15% de descuento durante el Mundial.",
      code: "MUNDIAL15",
      buttonLabel: "Inscribirme ahora",
      href: "/curso",
    },
    aiSummary:
      `Resumen para IA: ${editorialSignals.resultOrMainFact} La nota usa la noticia como entrada SEO y dedica el analisis principal a UX, producto, comportamiento digital y experiencia de alto trafico. Insight clave: ${findingOfTheDay}`,
  }
}

function buildSeo(
  date: string,
  editorialSignals: DailyRadarReport["editorialSignals"],
  article: DailyRadarReport["article"],
  sources: SourceUsage[],
): DailyRadarReport["seo"] {
  const title = `${shortenTitle(editorialSignals.resultOrMainFact)}: resultado, resumen y polemica desde Experience Radar`
  const description =
    `Resultado o hecho principal, resumen, conversacion de aficionados e insight UX de MediaLab. ${article.experienceRadarScore}`
  const faq = [
    {
      question: "Que analiza Experience Radar sobre el Mundial?",
      answer:
        "Analiza senales verificadas del Mundial para convertir noticias, busquedas y conversaciones en aprendizajes de UX, producto, IA y experiencia digital.",
    },
    {
      question: "Experience Radar narra partidos como un medio deportivo?",
      answer:
        "No. La noticia es la entrada SEO, pero el producto es el insight: 30% contexto noticioso y 70% analisis de experiencia.",
    },
    {
      question: "Que significa Experience Radar Score?",
      answer:
        "Es un indice 0 a 100 que resume la salud de la experiencia digital observada, considerando claridad, confianza, continuidad y recuperacion.",
    },
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Organization",
      name: "MediaLab",
    },
    publisher: {
      "@type": "Organization",
      name: "MediaLab",
      url: "https://medialab.design",
    },
    mainEntityOfPage: "https://medialab.design/experience-radar",
    citation: sources.filter((source) => source.url).map((source) => source.url),
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: "https://medialab.design/experience-radar",
    },
    faq,
    schema,
  }
}

function buildInsights(signals: ExperienceSignal[]): ExperienceInsight[] {
  const grouped = new Map<ExperienceSignalCategory, ExperienceSignal[]>()
  for (const signal of signals) {
    for (const category of signal.classifications) {
      grouped.set(category, [...(grouped.get(category) ?? []), signal])
    }
  }

  return Array.from(grouped.entries())
    .map(([category, evidence]) => {
      const copy = CATEGORY_COPY[category]
      return {
        id: makeId("insight", [category]),
        title: titleForCategory(category),
        category,
        insight: copy.insight,
        risk: copy.risk,
        opportunity: copy.opportunity,
        recommendation: copy.recommendation,
        evidence: evidence.slice(0, 5).map((signal) => ({
          title: signal.title,
          url: signal.url,
          sourceName: signal.sourceName,
        })),
        impactScore: scoreInsightImpact(category, evidence.length),
      }
    })
    .sort((a, b) => b.impactScore - a.impactScore)
}

function titleForCategory(category: ExperienceSignalCategory): string {
  const titles: Record<ExperienceSignalCategory, string> = {
    UX: "Claridad bajo ansiedad informativa",
    IA: "IA con trazabilidad, no con exceso de confianza",
    Accesibilidad: "Participacion accesible en eventos masivos",
    Streaming: "Streaming como experiencia de recuperacion",
    Ticketing: "Ticketing y percepcion de justicia",
    "Fan Experience": "Atencion del fan y fatiga digital",
    "Mobile Experience": "Continuidad movil en sesiones fragmentadas",
    Trust: "Confianza operacional visible",
    "High Traffic": "Alto trafico como escenario de producto",
    "Error Recovery": "Recuperacion de errores bajo presion",
  }
  return titles[category]
}

function unique(values: string[], limit: number): string[] {
  return Array.from(new Set(values.filter(Boolean))).slice(0, limit)
}

function summarizeSignals(signals: ExperienceSignal[]): string[] {
  const bySource = new Map<string, number>()
  for (const signal of signals) bySource.set(signal.sourceName, (bySource.get(signal.sourceName) ?? 0) + 1)
  return Array.from(bySource.entries()).map(([source, count]) => `${source}: ${count} senales`)
}

function findByWords(signals: ExperienceSignal[], words: string[]): ExperienceSignal | undefined {
  return signals.find((signal) => {
    const haystack = `${signal.title} ${signal.summary} ${signal.tags.join(" ")}`.toLowerCase()
    return words.some((word) => haystack.includes(word))
  })
}

function selectPrimaryNewsSignal(signals: ExperienceSignal[]): ExperienceSignal | undefined {
  const priority = [
    "partido inaugural",
    "resultado",
    "resumen",
    "vs",
    " vence ",
    " gano ",
    " gana ",
    " empate ",
    "marcador",
    "mundial 2026",
  ]

  return [...signals].sort((a, b) => scoreNewsSignal(b, priority) - scoreNewsSignal(a, priority))[0]
}

function scoreNewsSignal(signal: ExperienceSignal, priority: string[]): number {
  const title = signal.title.toLowerCase()
  const body = `${signal.summary} ${signal.tags.join(" ")}`.toLowerCase()

  return priority.reduce((score, word, index) => {
    const value = priority.length - index
    const titleScore = title.includes(word) ? value * 5 : 0
    const bodyScore = body.includes(word) ? value : 0
    return score + titleScore + bodyScore
  }, 0)
}

function extractStatements(signals: ExperienceSignal[]): string[] {
  return signals
    .filter((signal) => /afirma|declara|dice|asegura|statement|said/i.test(`${signal.title} ${signal.summary}`))
    .map((signal) => signal.title)
    .slice(0, 3)
}

function dominantConversationFromSignals(
  socialSignals: ExperienceSignal[],
  insights: ExperienceInsight[],
): string {
  const complaints = socialSignals.flatMap((signal) => signal.repeatedComplaints ?? [])
  const questions = socialSignals.flatMap((signal) => signal.frequentQuestions ?? [])
  const comments = socialSignals.flatMap((signal) => signal.highlightedComments ?? [])
  const first = complaints[0] ?? questions[0] ?? comments[0]

  if (first) return `La conversacion dominante gira alrededor de ${first}, con senales de friccion y necesidad de recuperacion clara.`
  if (insights[0]) return `La conversacion dominante se lee desde ${insights[0].category}: ${insights[0].risk}`
  return "La conversacion dominante aun no tiene volumen suficiente; el agente conserva la nota en draft hasta tener mas senales."
}

function shortenTitle(value: string): string {
  const title = value.replace(/\s+/g, " ").trim()
  return title.length > 72 ? `${title.slice(0, 69).trim()}...` : title
}
