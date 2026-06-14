import type { RadarArticle } from "./articles"

export const MATCH_NOTE_ACCESS_WINDOW_MS = 24 * 60 * 60 * 1000
// Ventana real "en vivo": 90' + entretiempo + descuento + margen ≈ 2 h 15 min.
// Pasada esta hora el partido ya terminó, aunque el agente aún no lo marque.
const LIVE_WINDOW_MS = 135 * 60 * 1000

export type MatchRuntimeStatus = "previa" | "en_vivo" | "finalizado"

/**
 * Estado en TIEMPO REAL del partido (no el `matchState` editorial, que solo es
 * previa/finalizado): antes del pitazo = "previa"; durante la ventana del partido
 * (~3 h desde el inicio) = "en_vivo"; después = "finalizado". Así el listado puede
 * mostrar "En vivo" mientras se juega, aunque la nota aún esté marcada como previa.
 */
export function resolveMatchStatus(article: RadarArticle, now: Date = new Date()): MatchRuntimeStatus {
  if (article.matchState === "finalizado") return "finalizado"
  // Si ya hay un marcador, el partido terminó (aunque el agente no lo haya marcado aún).
  if (article.matchScore) return "finalizado"
  if (!article.kickoffAt) return article.matchState === "en_vivo" ? "en_vivo" : "previa"

  const kickoff = new Date(article.kickoffAt).getTime()
  if (!Number.isFinite(kickoff)) return "previa"

  const nowMs = now.getTime()
  if (nowMs < kickoff) return "previa"
  // En vivo SOLO durante la ventana real del partido; pasada esa hora → finalizado.
  if (nowMs < kickoff + LIVE_WINDOW_MS) return "en_vivo"
  return "finalizado"
}

/** Marca temporal para ordenar: hora del partido, o mediodía del día editorial. */
function recencyTime(a: RadarArticle): number {
  return new Date(a.kickoffAt || `${a.date}T12:00:00`).getTime()
}

/**
 * Orden del feed de notas: primero los que se juegan AHORA (en vivo), luego lo
 * PRÓXIMO (el más cercano primero) y al final los FINALIZADOS (el más reciente
 * primero). Sirve para el listado por día y para elegir la nota destacada.
 */
export function compareForFeed(a: RadarArticle, b: RadarArticle, now: Date = new Date()): number {
  const tier = (x: RadarArticle) => {
    const s = resolveMatchStatus(x, now)
    return s === "en_vivo" ? 0 : s === "previa" ? 1 : 2
  }
  const ta = tier(a)
  const tb = tier(b)
  if (ta !== tb) return ta - tb
  // Próximos: el más cercano primero (asc). En vivo / finalizados: el más reciente primero (desc).
  return ta === 1 ? recencyTime(a) - recencyTime(b) : recencyTime(b) - recencyTime(a)
}

export interface ArticleAvailability {
  visible: boolean
  accessible: boolean
  availableAt?: string
  reason?: "scheduled" | "updating" | "preparing"
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

  // Placeholder de calendario: el partido se MUESTRA, pero la nota no se abre (sin datos).
  if (article.placeholder) {
    return { visible: true, accessible: false, reason: "preparing" }
  }

  if (!article.kickoffAt) return { visible: false, accessible: false }

  const kickoff = new Date(article.kickoffAt).getTime()
  if (!Number.isFinite(kickoff)) return { visible: false, accessible: false }

  const availableAt = new Date(kickoff - MATCH_NOTE_ACCESS_WINDOW_MS)
  if (now.getTime() < availableAt.getTime()) {
    // El partido se MUESTRA en el calendario, pero la nota aún no es accesible.
    return {
      visible: true,
      accessible: false,
      availableAt: availableAt.toISOString(),
      reason: "scheduled",
    }
  }

  // Dentro de la ventana, en vivo o finalizado: la nota es accesible con el contenido
  // disponible (previa o final). Ya no se oculta un finalizado a la espera del análisis.
  return { visible: true, accessible: true, availableAt: availableAt.toISOString() }
}
