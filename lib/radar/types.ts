/**
 * Experience Radar — tipos principales.
 *
 * Experience Radar NO es un portal de noticias deportivas. Toma señales externas
 * autorizadas (API, RSS o carga manual) y las convierte en insights de experiencia
 * de usuario: UX, IA, accesibilidad, comportamiento del fan y experiencia digital.
 *
 * Aislado y autocontenido: este módulo no importa nada del resto de la app, por lo
 * que puede eliminarse por completo sin afectar al sitio existente.
 */

/** Categorías de clasificación de un insight. */
export type RadarCategory =
  | "UX"
  | "AI"
  | "Accessibility"
  | "Streaming"
  | "Ticketing"
  | "Fan Experience"
  | "Mobile Experience"
  | "High Traffic"
  | "Trust"
  | "Error Recovery"

export const RADAR_CATEGORIES: RadarCategory[] = [
  "UX",
  "AI",
  "Accessibility",
  "Streaming",
  "Ticketing",
  "Fan Experience",
  "Mobile Experience",
  "High Traffic",
  "Trust",
  "Error Recovery",
]

/**
 * Estado de relevancia que se muestra en la card del insight.
 * (No confundir con el estado editorial `reviewState`, ver más abajo).
 */
export type InsightStatus = "new" | "watching" | "relevant" | "critical"

/**
 * Estado editorial / de revisión humana.
 * Modo seguro: la IA puede generar hallazgos pero NO se publican como definitivos
 * sin revisión humana. Por defecto todo nace en `draft` con `reviewed: false`.
 */
export type ReviewState = "draft" | "reviewed" | "published"

/** Nivel de impacto agregado, derivado del score. */
export type ImpactLevel = "Bajo" | "Medio" | "Alto" | "Crítico"

/** Tipo de origen de una señal — nunca scraping no autorizado. */
export type SourceType = "api" | "rss" | "manual"

/**
 * Señal externa cruda (antes de convertirse en insight).
 * Solo metadatos y un resumen propio/derivado — nunca se copia la noticia completa.
 */
export interface Signal {
  id: string
  title: string
  /** Resumen propio breve de la señal. No es una copia del artículo original. */
  summary: string
  sourceName: string
  sourceUrl: string
  /** ISO 8601 — fecha de publicación reportada por la fuente. */
  publishedAt: string
  /** ISO 8601 — fecha en que el radar detectó la señal. */
  detectedAt: string
  /** Código de país ISO o región ("GLOBAL"). */
  country: string
  tags: string[]
  /** Categoría tentativa que viene de la fuente, antes de clasificar. */
  rawCategory?: string
  /** Confianza de la fuente 0–1 (autorizada / oficial vs. secundaria). */
  sourceConfidence?: number
}

/**
 * Recomendaciones automáticas por rol para un equipo de producto.
 */
export interface InsightRecommendations {
  designer: string
  research: string
  product: string
  tech: string
  business: string
}

/**
 * Insight de experiencia: el producto del radar. Convierte una señal en un
 * aprendizaje accionable de experiencia digital.
 */
export interface ExperienceInsight {
  id: string
  signalId: string
  title: string
  category: RadarCategory
  /** Resumen del evento o señal, en clave de experiencia (no del marcador). */
  eventSummary: string
  /** El aprendizaje de UX detectado. */
  uxInsight: string
  /** Riesgo para el usuario si no se atiende. */
  userRisk: string
  /** Oportunidad de diseño concreta. */
  designOpportunity: string
  /** Recomendaciones por rol. */
  recommendations: InsightRecommendations
  /** Score de impacto 0–100 (ver scoreInsight). */
  impactScore: number
  /** Confianza del insight 0–100. */
  confidenceScore: number
  /** Estado de relevancia mostrado en la card. */
  status: InsightStatus
  /** Estado editorial — modo seguro. */
  reviewState: ReviewState
  /** Revisión humana realizada. */
  reviewed: boolean
  sourceName: string
  sourceUrl: string
  country: string
  /** ISO 8601 — fecha de detección/creación del insight. */
  createdAt: string
}

/** Variables del World Experience Index (índice propio de MediaLab). */
export interface WorldExperienceIndex {
  /** Score general 0–100. */
  overall: number
  variables: {
    clarity: number
    speed: number
    trust: number
    accessibility: number
    continuity: number
    cognitiveLoad: number
    fanEmotion: number
    errorRecovery: number
  }
}

/** Resumen del panel "Hoy en experiencia". */
export interface TodaySummary {
  date: string
  findings: number
  uxRisks: number
  opportunities: number
  behaviorSignals: number
  impactLevel: ImpactLevel
}

/** Respuesta del endpoint de automatización diaria. */
export interface RadarRunResult {
  generatedAt: string
  /** Modo seguro: siempre draft / sin revisar hasta validación humana. */
  reviewState: ReviewState
  reviewed: boolean
  count: number
  insights: ExperienceInsight[]
  index: WorldExperienceIndex
  today: TodaySummary
}
