import type { RadarArticle } from "./articles"

export const MATCH_NOTE_ACCESS_WINDOW_MS = 24 * 60 * 60 * 1000
const ESTIMATED_MATCH_DURATION_MS = 3 * 60 * 60 * 1000

export interface ArticleAvailability {
  visible: boolean
  accessible: boolean
  availableAt?: string
  reason?: "scheduled" | "updating"
}

/**
 * Una nota solo existe publicamente desde 24 horas antes del inicio. Si el
 * partido ya termino y el analisis final sigue pendiente, vuelve a ocultarse
 * hasta que el agente complete la actualizacion.
 */
export function getArticleAvailability(
  article: RadarArticle,
  now: Date = new Date(),
): ArticleAvailability {
  if (article.updateState === "updating") {
    return { visible: false, accessible: false, reason: "updating" }
  }

  if (!article.kickoffAt) return { visible: false, accessible: false }

  const kickoff = new Date(article.kickoffAt).getTime()
  if (!Number.isFinite(kickoff)) return { visible: false, accessible: false }

  const availableAt = new Date(kickoff - MATCH_NOTE_ACCESS_WINDOW_MS)
  if (now.getTime() < availableAt.getTime()) {
    return {
      visible: false,
      accessible: false,
      availableAt: availableAt.toISOString(),
      reason: "scheduled",
    }
  }

  const analysisDue = now.getTime() >= kickoff + ESTIMATED_MATCH_DURATION_MS
  if (analysisDue && article.matchState !== "finalizado") {
    return { visible: false, accessible: false, reason: "updating" }
  }

  return { visible: true, accessible: true, availableAt: availableAt.toISOString() }
}
