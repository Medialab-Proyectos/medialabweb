/**
 * Experience Radar — señales de X (Twitter).
 *
 * La voz del fan vive mucho en X (memes, chistes, polémica, quejas en vivo). Este módulo
 * trae publicaciones recientes por término de búsqueda usando la API v2 de X.
 *
 * Conexión: requiere un Bearer Token de X (plan con acceso a "recent search").
 *   - Variable de entorno: `X_BEARER_TOKEN`.
 *   - Sin token devuelve [] (best-effort, no rompe el cron).
 * Proyecto/librería recomendada para una integración más rica (hilos, conteos, stream):
 *   `twitter-api-v2` (npm). Aquí usamos fetch directo para no añadir dependencias.
 *
 * Cumplimiento: solo se usan como SEÑAL de conversación (no se reproduce el contenido
 * completo); el agente parafrasea y enlaza como referencia.
 */

import { makeId, sanitizeText, sourceUsage } from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

export interface XSignal {
  id: string
  text: string
  url: string
  source: "x"
  /** Métricas si la API las entrega (para medir viralidad/conversación). */
  likes?: number
  reposts?: number
}

const RECENT_SEARCH = "https://api.x.com/2/tweets/search/recent"

async function fetchWithTimeout(url: string, token: string, ms: number): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

/**
 * Publicaciones recientes para una consulta (p. ej. "Brasil Marruecos" o un hashtag).
 * Excluye retweets para reducir ruido. Devuelve [] si no hay token o falla.
 */
export async function fetchXSignals(query: string, maxResults = 10): Promise<XSignal[]> {
  const token = process.env.X_BEARER_TOKEN?.trim()
  if (!token) return []

  const params = new URLSearchParams({
    query: `${query} -is:retweet lang:es`,
    max_results: String(Math.min(Math.max(maxResults, 10), 100)),
    "tweet.fields": "public_metrics,lang",
  })

  try {
    const res = await fetchWithTimeout(`${RECENT_SEARCH}?${params}`, token, 4000)
    if (!res.ok) {
      console.warn(`Experience Radar X search failed (HTTP ${res.status}).`)
      return []
    }
    const data = (await res.json()) as {
      data?: Array<{ id: string; text: string; public_metrics?: { like_count?: number; retweet_count?: number } }>
    }
    return (data.data ?? []).map((t) => ({
      id: t.id,
      text: t.text,
      url: `https://x.com/i/web/status/${t.id}`,
      source: "x" as const,
      likes: t.public_metrics?.like_count,
      reposts: t.public_metrics?.retweet_count,
    }))
  } catch (error) {
    console.warn("Experience Radar X search unavailable.", error)
    return []
  }
}

export async function fetchX(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  const token = process.env.X_BEARER_TOKEN?.trim()
  if (!token) {
    return {
      signals: [],
      source: sourceUsage({
        id: "x-api-missing",
        name: "X API v2",
        type: "x",
        url: "https://developer.x.com/en/docs/x-api",
        ok: false,
        itemCount: 0,
        note: "X no fue consultado: falta X_BEARER_TOKEN.",
      }),
    }
  }

  const queries = (context.terms?.length ? context.terms : ["Mundial 2026", "World Cup 2026"])
    .filter(Boolean)
    .slice(0, 4)
  const collected: ExperienceSignal[] = []

  for (const query of queries) {
    const posts = await fetchXSignals(query, 20)
    for (const post of posts) {
      collected.push({
        id: makeId("x", [post.id]),
        sourceType: "x",
        sourceName: "X API v2",
        sourceUrl: `https://x.com/search?q=${encodeURIComponent(query)}`,
        title: sanitizeText(post.text, 180),
        summary: sanitizeText(post.text, 320),
        url: post.url,
        publishedAt: detectedAt,
        detectedAt,
        category: "Conversación de usuarios",
        players: [],
        teams: [],
        tags: [query, "X", `likes:${post.likes ?? 0}`, `reposts:${post.reposts ?? 0}`],
        score: (post.likes ?? 0) + (post.reposts ?? 0) * 2,
        classifications: [],
      })
    }
  }

  const signals = Array.from(new Map(collected.map((signal) => [signal.url, signal])).values())
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 40)

  return {
    signals,
    source: sourceUsage({
      id: "x-api",
      name: "X API v2",
      type: "x",
      url: "https://api.x.com/2/tweets/search/recent",
      ok: true,
      itemCount: signals.length,
    }),
  }
}
