/**
 * Experience Radar — capa de ARTÍCULOS SEO/GEO/AI.
 *
 * Convierte una señal/evento del Mundial en un artículo con estructura fija de 10
 * secciones. El artículo ARRANCA con lo que el usuario busca (resultado, goles,
 * polémica) para capturar intención de búsqueda, y luego convierte la noticia en
 * un aprendizaje de experiencia, comportamiento humano, producto e IA.
 *
 * Cumplimiento (igual que el resto del módulo):
 *  - No copia noticias completas: solo resumen propio + enlaces de referencia.
 *  - No usa logos oficiales de FIFA ni afirma patrocinio oficial.
 *  - Sin contenido de apuestas (hasProhibitedContent).
 *  - Modo seguro: status "draft" y reviewed:false hasta revisión humana
 *    (salvo AUTO_PUBLISH, igual que publishInsight).
 *
 * Archivo autónomo: para revertir basta eliminarlo (y las rutas que lo usan).
 */

import { hasProhibitedContent, isAutoPublishEnabled, makeId, sanitizeText } from "./sources"
import type { EditorialStatus, ExperienceSignalCategory } from "./types"

/** Cupón de la promoción especial Mundial (sección 10 — CTA). */
export const RADAR_PROMO = {
  code: "MUNDIAL15",
  percent: 15,
  href: "/curso",
} as const

/** Factores del Experience Radar Score (sección 7), cada uno 0–100. */
export interface RadarScoreFactors {
  /** Impacto emocional del evento. */
  emotionalImpact: number
  /** Volumen de conversación digital. */
  digitalConversation: number
  /** Viralidad / velocidad de propagación. */
  virality: number
  /** Interés de usuarios (búsquedas, demanda informativa). */
  userInterest: number
}

export interface RadarScore extends RadarScoreFactors {
  /** Score total 0–100. */
  total: number
}

/** Valores 0–100 de las 6 emociones del radar de la nota. */
export interface EmotionalRadarValues {
  euforia: number
  confianza: number
  ansiedad: number
  frustracion: number
  incertidumbre: number
  optimismo: number
}

/** Estado del radar de un equipo en un momento dado: score total + las 6 emociones. */
export interface TeamRadarState {
  /** Experience Radar Score 0–100 de ESTA selección en este momento. */
  score: number
  emotional: EmotionalRadarValues
}

/**
 * Radar emocional de UNA selección, con dos estados:
 *  - `current`: cómo quedó la afición tras el partido actual.
 *  - `predicted`: proyección editorial de cómo se vería el radar de cara al próximo
 *    partido (NO es pronóstico de marcador ni de resultado: es comportamiento/emoción).
 */
export interface TeamRadar {
  team: string
  current: TeamRadarState
  predicted: TeamRadarState
}

/** Una referencia de fuente (enlace), nunca contenido completo de terceros. */
export interface ArticleSourceRef {
  name: string
  url: string
  /** Qué aporta: dato oficial, conversación, tendencia, reseña… */
  kind: "oficial" | "conversacion" | "tendencia" | "reseña" | "referencia"
}

/** Aplicación del aprendizaje en un sector/producto digital (sección 6). */
export interface ProductApplication {
  sector: string
  application: string
}

/** Pregunta/respuesta para el bloque FAQ (GEO + rich results). */
export interface ArticleFaq {
  q: string
  a: string
}

/** Artículo completo del Experience Radar (las 10 secciones obligatorias). */
export interface RadarArticle {
  id: string
  slug: string
  category: ExperienceSignalCategory
  status: EditorialStatus
  reviewed: boolean
  date: string
  publishedAt: string
  updatedAt: string

  // 1 · Título SEO (equipo + resultado/polémica + evento)
  seoTitle: string
  teams: string[]
  event: string
  hook: string // resultado o polémica que la gente busca
  metaDescription: string
  /** Imagen del partido (de la fuente, p. ej. Latingoles). Fallback genérico en UI. */
  imageUrl?: string
  imageAlt?: string
  imageCredit?: string
  imageSourceUrl?: string

  /**
   * Estado de la nota viva. "previa" = disponible 2–3 h antes (expectativa,
   * narrativa, conversación, radar previo). "finalizado" = 1–3 h después
   * (resultado, radar actualizado, hallazgos, simulador). Por defecto la UI
   * asume "finalizado".
   */
  matchState?: "previa" | "en_vivo" | "finalizado"

  /** Bloquea temporalmente una nota mientras se completa su actualizacion. */
  updateState?: "ready" | "updating"

  /**
   * Marcador de calendario SIN análisis real todavía: el partido se muestra en el
   * listado (para no perder el calendario), pero la nota NO se abre. Mejor no abrir una
   * nota vacía: cuando el equipo/agente la analiza, deja de ser placeholder.
   */
  placeholder?: boolean

  /**
   * Marcas de idempotencia del agente: ISO del momento en que se completó el análisis
   * de CADA fase. Si una fase ya tiene marca, el agente NO la vuelve a analizar (solo
   * procesa previas y finales aún sin completar). Independiente de `matchState`, que
   * en los seeds ya viene como "previa" sin análisis real.
   */
  analyzedPreviaAt?: string
  analyzedFinalAt?: string

  /**
   * Hora oficial de inicio en ISO 8601. Permite decidir si la nota sigue en previa,
   * si está en vivo o si ya puede pasar a fase posterior sin depender solo de la fecha.
   */
  kickoffAt?: string

  /**
   * Marcador del partido. Se usa en la nota para mostrar el resultado de forma
   * destacada. Formato: `{ home: string; away: string; homeGoals: number; awayGoals: number }`.
   * Opcional en previa; obligatorio cuando matchState === "finalizado".
   */
  matchScore?: {
    /** Equipo local (nombre, debe coincidir con `teams[0]`). */
    home: string
    /** Equipo visitante (nombre, debe coincidir con `teams[1]`). */
    away: string
    homeGoals: number
    awayGoals: number
    /** Texto libre opcional, p. ej. "Goles: Lozano 23', Mvala 90+4'". */
    detail?: string
  }

  /**
   * Bloque 1 — resumen del PARTIDO (no del radar): qué pasó / cómo se dio.
   * Legible en ~30 s. Si falta, la UI usa `quickSummary`.
   */
  matchSummary?: string

  /**
   * Selecciones que ya NO tienen más partidos (eliminadas del torneo). Para esas
   * hinchadas no se habilita el pronóstico del próximo partido: la nota indica que
   * el equipo está eliminado. El agente lo llena al cerrar la fase de grupos/llaves.
   */
  eliminatedTeams?: string[]

  /**
   * Bloque 2 — radar de fases (telaraña de 6 emociones, 3 polígonos):
   *  - `expectativa`: antes del partido (siempre presente).
   *  - `realidad`: durante el partido (solo cuando finalizó).
   *  - `percepcion`: después del partido (solo cuando finalizó).
   * Si falta, la UI lo deriva de `emotionalRadar` / `radarScore`.
   */
  matchPhases?: {
    expectativa: EmotionalRadarValues
    realidad?: EmotionalRadarValues
    percepcion?: EmotionalRadarValues
  }

  /**
   * Interpretación editorial por fase y categoría emocional (la ESCRIBE el agente con
   * datos REALES del partido: resultado, jugadas, polémicas y lo que dice la gente).
   * Debe ser específica, no genérica. Si falta una entrada, la UI usa un texto de
   * respaldo derivado del valor numérico. Estructura: fase → categoría → texto.
   *   matchInterpretations.realidad.frustracion = "La bronca no fue por el 2-1 sino por…"
   */
  matchInterpretations?: Partial<
    Record<"expectativa" | "realidad" | "percepcion", Partial<Record<keyof EmotionalRadarValues, string>>>
  >

  /**
   * Bloque 3 — cómo llegaban los equipos. Cambia según el estado: en "previa" se
   * muestran los campos ANTES; en "finalizado", los campos DESPUÉS. Si falta, la
   * UI deriva un respaldo de `collectiveByTeam` / `teams`.
   */
  teamApproach?: Array<{
    team: string
    // ANTES (estado previa)
    expectedEmotion: string
    dominantConversation: string
    fanConfidence: string
    mainNarrative: string
    // DESPUÉS (estado finalizado)
    howTheyArrived?: string
    whatHappened?: string
    expectationVsReality?: string
    /**
     * "Experiencia de usuario vivida" ESPECÍFICA de esta hinchada, por etapa (cómo
     * consume y reacciona en digital ESE país). Debe ser propia de cada selección, no
     * un texto genérico: si no hay dato real, se omite (no se inventa ni se duplica).
     */
    userExperience?: {
      expectativa?: string
      realidad?: string
      percepcion?: string
    }
  }>

  /**
   * Bloque 4 — exactamente 3 hallazgos (término + explicación corta). Si falta,
   * la UI los deriva de `mediaLabInsight.cognitiveBiases` (formato "Término: …").
   */
  lessons?: Array<{ term: string; explanation: string; phase?: "antes" | "despues" }>

  // 2 · Resumen rápido (<100 palabras)
  quickSummary: string

  // 3 · Lo que ocurrió (≤300 palabras)
  whatHappened: string
  keyPlays: string[]
  controversies: string[]
  statements: string[]

  // 4 · Lo que opinan los aficionados
  fanPulse: {
    concerns: string[]
    emotions: string[]
    frustrations: string[]
    enthusiasm: string[]
    sources: ArticleSourceRef[]
  }

  // 5 · Insight MediaLab — ¿Qué nos enseña este caso?
  mediaLabInsight: {
    humanBehavior: string
    cognitiveBiases: string[]
    emotionalReaction: string
    digitalPatterns: string
  }

  // 6 · Aplicación en productos digitales
  productApplications: ProductApplication[]

  // 7 · Experience Radar Score (0–100)
  radarScore: RadarScore

  /**
   * Radar emocional (0–100 por emoción) para la telaraña de la nota. Si falta, la
   * UI lo deriva del Experience Radar Score.
   */
  emotionalRadar?: EmotionalRadarValues

  /**
   * Radar emocional POR selección (Experience Radar Score de cada equipo), con
   * estado actual y predicción para el próximo partido. Es lo que alimenta el radar
   * interactivo de la nota. Si falta, la UI deriva un radar por equipo a partir de
   * `teams` + `emotionalRadar`.
   */
  teamRadars?: TeamRadar[]

  /**
   * Conciencia colectiva por equipo: cómo queda el ánimo de cada hinchada y cómo
   * eso afecta su comportamiento (uso de medios digitales, participación/votaciones,
   * conversación) de cara al próximo partido. Si falta, se deriva de `teams`.
   */
  collectiveByTeam?: Array<{
    team: string
    mood: string
    behaviorEffect: string
  }>

  /**
   * Qué mirar en el próximo partido (opcional). Análisis prospectivo: qué emoción
   * puede dominar, quién genera conversación, qué sesgo observar, qué dato revisar
   * y cómo la conciencia colectiva moldea el comportamiento del fan. Si falta, la
   * UI muestra un bloque de respaldo derivado del resto de la nota.
   */
  nextMatchWatch?: {
    dominantEmotion: string
    playerOrTeamToWatch: string
    biasToWatch: string
    dataToCheck: string
    questionToFollow: string
    collectiveBehaviorNote: string
  }

  // 8 · Hallazgo UX (aprendizaje concreto)
  uxFinding: string

  // 9 · Resumen para IA (≈100 palabras, ChatGPT/Gemini/Claude/Perplexity)
  aiSummary: string

  // 10 · CTA
  cta: {
    title: string
    text: string
    promoLabel: string
    discountCode: string
    discountPercent: number
    buttonLabel: string
    href: string
  }

  sources: ArticleSourceRef[]
}

/** Pesos del Experience Radar Score (suman 1). */
const SCORE_WEIGHTS: Record<keyof RadarScoreFactors, number> = {
  emotionalImpact: 0.3,
  digitalConversation: 0.25,
  virality: 0.2,
  userInterest: 0.25,
}

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)))

/** Calcula el Experience Radar Score 0–100 a partir de sus 4 factores. */
export function scoreArticleRadar(factors: RadarScoreFactors): RadarScore {
  const total = clamp(
    factors.emotionalImpact * SCORE_WEIGHTS.emotionalImpact +
      factors.digitalConversation * SCORE_WEIGHTS.digitalConversation +
      factors.virality * SCORE_WEIGHTS.virality +
      factors.userInterest * SCORE_WEIGHTS.userInterest,
  )
  return {
    emotionalImpact: clamp(factors.emotionalImpact),
    digitalConversation: clamp(factors.digitalConversation),
    virality: clamp(factors.virality),
    userInterest: clamp(factors.userInterest),
    total,
  }
}

/** Entrada editorial cruda para generar un artículo (lo que aporta el editor/agente). */
export type RadarArticleInput = Omit<
  RadarArticle,
  | "id"
  | "slug"
  | "status"
  | "reviewed"
  | "publishedAt"
  | "updatedAt"
  | "radarScore"
  | "cta"
  | "metaDescription"
> & {
  scoreFactors: RadarScoreFactors
  /** Slug SEO explícito. Si no se da, se deriva (sin acentos) de equipos + hook. */
  slug?: string
  /** Opcional: si no se da, se deriva del quickSummary. */
  metaDescription?: string
  /** Opcional: override del CTA por defecto. */
  cta?: Partial<RadarArticle["cta"]>
}

/** Slug SEO: minúsculas, sin acentos, separado por guiones. */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos (marcas diacríticas)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

const DEFAULT_CTA: RadarArticle["cta"] = {
  title: "⚽ Aprende UX observando el Mundial",
  text:
    "Los eventos deportivos más grandes del mundo son laboratorios de comportamiento humano. Aprende UX Research, Diseño de Producto e IA aplicada con MediaLab.",
  promoLabel: "Promoción especial Mundial",
  discountCode: RADAR_PROMO.code,
  discountPercent: RADAR_PROMO.percent,
  buttonLabel: "Quiero aprender UX",
  href: RADAR_PROMO.href,
}

/**
 * Genera un artículo a partir de la entrada editorial: calcula el score, el slug,
 * ids y fechas, aplica el CTA por defecto y fuerza el modo seguro (draft / sin
 * revisar). Rechaza contenido prohibido (apuestas).
 */
export function generateRadarArticle(input: RadarArticleInput): RadarArticle {
  const complianceProbe = `${input.seoTitle} ${input.hook} ${input.quickSummary}`
  if (hasProhibitedContent(complianceProbe)) {
    throw new Error("radar_article_prohibited_content")
  }

  const now = new Date()
  const date = input.date || now.toISOString().slice(0, 10)
  const editorialTimestamp = input.kickoffAt ?? `${date}T12:00:00.000Z`
  // Slug ESTABLE por partido (equipos + evento, sin el hook/estado): así la nota
  // conserva una sola URL al pasar de previa a finalizado (una nota por partido).
  const slug = input.slug ? slugify(input.slug) : slugify([...input.teams, input.event].join(" "))
  const autoPublished = isAutoPublishEnabled()

  return {
    ...input,
    id: makeId("article", [...input.teams, date]),
    slug,
    category: input.category,
    status: autoPublished ? "published" : "draft",
    reviewed: false,
    date,
    publishedAt: editorialTimestamp,
    updatedAt: editorialTimestamp,
    metaDescription: sanitizeText(input.metaDescription ?? input.quickSummary, 160),
    radarScore: scoreArticleRadar(input.scoreFactors),
    cta: { ...DEFAULT_CTA, ...input.cta },
  }
}
