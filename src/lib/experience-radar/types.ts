export const ExperienceRadarDailyAgent = "ExperienceRadarDailyAgent" as const

export type ExperienceSignalCategory =
  | "UX"
  | "IA"
  | "Accesibilidad"
  | "Streaming"
  | "Ticketing"
  | "Fan Experience"
  | "Mobile Experience"
  | "Trust"
  | "High Traffic"
  | "Error Recovery"

export const EXPERIENCE_SIGNAL_CATEGORIES: ExperienceSignalCategory[] = [
  "UX",
  "IA",
  "Accesibilidad",
  "Streaming",
  "Ticketing",
  "Fan Experience",
  "Mobile Experience",
  "Trust",
  "High Traffic",
  "Error Recovery",
]

export type ExperienceSourceType =
  | "latingoles"
  | "fifa"
  | "reddit"
  | "x"
  | "instagram"
  | "facebook"
  | "youtube"
  | "365scores"
  | "analyst"
  | "winsports"
  | "google-trends"
  | "app-review"
  | "manual"

export type EditorialStatus = "draft" | "published"

export interface SourceUsage {
  id: string
  name: string
  type: ExperienceSourceType
  url: string
  ok: boolean
  checkedAt: string
  itemCount: number
  note?: string
}

export interface ExperienceSignal {
  id: string
  sourceType: ExperienceSourceType
  sourceName: string
  sourceUrl: string
  title: string
  summary: string
  url: string
  /** Imagen destacada de la fuente (p. ej. Latingoles). Solo referencia; fallback genérico en UI. */
  imageUrl?: string
  imageAlt?: string
  imageCredit?: string
  imageSourceUrl?: string
  publishedAt: string
  detectedAt: string
  category?: string
  country?: string
  players: string[]
  teams: string[]
  tags: string[]
  subreddit?: string
  score?: number
  highlightedComments?: string[]
  repeatedComplaints?: string[]
  frequentQuestions?: string[]
  sentiment?: "positivo" | "neutral" | "negativo" | "mixto"
  term?: string
  relativeVolume?: number
  rising?: boolean
  relatedQueries?: string[]
  app?: string
  rating?: number
  reportedProblem?: string
  classifications: ExperienceSignalCategory[]
}

export interface ExperienceInsight {
  id: string
  title: string
  category: ExperienceSignalCategory
  insight: string
  risk: string
  opportunity: string
  recommendation: string
  evidence: {
    title: string
    url: string
    sourceName: string
  }[]
  impactScore: number
}

export interface DailyRadarReport {
  id: string
  agentName: typeof ExperienceRadarDailyAgent
  date: string
  generatedAt: string
  updatedAt: string
  status: EditorialStatus
  reviewed: boolean
  autoPublished: boolean
  aiAnalysis?: {
    status: "used" | "skipped" | "fallback"
    model: string
    reason?: string
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
  }
  title: string
  subtitle: string
  seo: {
    title: string
    description: string
    openGraph: {
      title: string
      description: string
      type: "article"
      url: string
    }
    faq: Array<{
      question: string
      answer: string
    }>
    schema: Record<string, unknown>
  }
  editorialSignals: {
    resultOrMainFact: string
    matchSummary: string
    controversyOrHighlight: string
    statements: string[]
    mainTrend: string
    dominantConversation: string
    fanConversation: string
  }
  article: {
    resultOrMainFact: string
    matchSummary: string
    controversyOrHighlight: string
    whatFansSay: string
    medialabInsight: string
    productDesignApplication: string
    experienceRadarScore: string
    ctaCourseUx: {
      title: string
      body: string
      discount: string
      code: string
      buttonLabel: string
      href: string
    }
    aiSummary: string
  }
  findingOfTheDay: string
  topInsights: ExperienceInsight[]
  risks: string[]
  opportunities: string[]
  recommendations: string[]
  worldExperienceIndex: number
  note: {
    executiveSummary: string
    analyzedSignals: string[]
    mainFinding: string
    uxInsights: string[]
    detectedRisks: string[]
    designOpportunities: string[]
    productRecommendations: string[]
    sources: SourceUsage[]
  }
  signals: ExperienceSignal[]
  sources: SourceUsage[]
}

export interface FetchContext {
  now?: Date
  terms?: string[]
}
