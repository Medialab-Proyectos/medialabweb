import {
  hasProhibitedContent,
  makeId,
  sanitizeText,
  sourceUsage,
  THREE_SIXTY_FIVE_SCORES_URLS,
} from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

function configuredUrls(): string[] {
  const raw = process.env.RADAR_365SCORES_URLS?.trim()
  if (!raw) return THREE_SIXTY_FIVE_SCORES_URLS
  return raw.split(",").map((value) => value.trim()).filter(Boolean)
}

async function fetchText(url: string, timeoutMs = 8000): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "MediaLabExperienceRadar/1.0",
      },
      cache: "no-store",
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`365Scores HTTP ${response.status}`)
    return response.text()
  } finally {
    clearTimeout(timeout)
  }
}

function meta(html: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const propertyFirst = html.match(
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
  )
  if (propertyFirst?.[1]) return propertyFirst[1]
  return html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
  )?.[1] ?? ""
}

function absoluteUrl(value: string): string {
  return new URL(value.replaceAll("&amp;", "&"), "https://www.365scores.com/").toString()
}

function isRelevant(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  const footballTerms = ["world cup", "mundial", "fifa", "football", "fútbol", "soccer", "goal", "gol", "shots", "tiros", "shotmap"]
  return [...terms, ...footballTerms].some((term) => lower.includes(term.toLowerCase()))
}

function articleLinks(html: string): string[] {
  const links = Array.from(
    html.matchAll(/href=["']([^"']*(?:\/es(?:-[a-z]{2})?\/news\/|\/football\/match\/)[^"'#?]+)["']/gi),
    (match) => absoluteUrl(match[1]),
  )
  return [...new Set(links)].slice(0, 16)
}

function extractStatHints(text: string): string[] {
  const hints = [
    ["tiros al arco", "tiros al arco mencionados"],
    ["shotmap", "mapa de tiros disponible"],
    ["posesión", "posesión mencionada"],
    ["corners", "corners mencionados"],
    ["tarjetas", "tarjetas mencionadas"],
    ["goles", "goles y eventos destacados"],
  ]
  const lower = text.toLowerCase()
  return hints.filter(([needle]) => lower.includes(needle)).map(([, label]) => label)
}

export async function fetch365Scores(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  const terms = (context.terms ?? []).map((term) => term.toLowerCase())

  try {
    const pages = await Promise.allSettled(
      configuredUrls().map(async (url) => ({ url, html: await fetchText(url) })),
    )

    const signals: ExperienceSignal[] = []

    for (const page of pages) {
      if (page.status !== "fulfilled") continue
      const { url, html } = page.value
      const title = sanitizeText(meta(html, "og:title") || meta(html, "title"), 180)
      const summary = sanitizeText(meta(html, "og:description") || meta(html, "description"), 320)
      const haystack = `${title} ${summary}`
      if (title && isRelevant(haystack, terms) && !hasProhibitedContent(haystack)) {
        signals.push({
          id: makeId("365scores", [url]),
          sourceType: "365scores",
          sourceName: "365Scores",
          sourceUrl: url,
          title,
          summary,
          url,
          publishedAt: detectedAt,
          detectedAt,
          category: "Estadísticas de partido",
          players: [],
          teams: [],
          tags: ["365Scores", ...extractStatHints(haystack)],
          classifications: [],
        })
      }

      const childUrls = articleLinks(html)
      const childPages = await Promise.allSettled(
        childUrls.map(async (childUrl) => ({ childUrl, childHtml: await fetchText(childUrl, 6000) })),
      )

      for (const childPage of childPages) {
        if (childPage.status !== "fulfilled") continue
        const { childUrl, childHtml } = childPage.value
        const childTitle = sanitizeText(meta(childHtml, "og:title") || meta(childHtml, "title"), 180)
        const childSummary = sanitizeText(meta(childHtml, "og:description") || meta(childHtml, "description"), 320)
        const childHaystack = `${childTitle} ${childSummary}`
        if (!childTitle || !isRelevant(childHaystack, terms) || hasProhibitedContent(childHaystack)) continue
        signals.push({
          id: makeId("365scores-child", [childUrl]),
          sourceType: "365scores",
          sourceName: "365Scores",
          sourceUrl: url,
          title: childTitle,
          summary: childSummary,
          url: childUrl,
          publishedAt: detectedAt,
          detectedAt,
          category: childUrl.includes("/news/") ? "Análisis de partido" : "Estadísticas de partido",
          players: [],
          teams: [],
          tags: ["365Scores", ...extractStatHints(childHaystack)],
          classifications: [],
        })
      }
    }

    const unique = Array.from(new Map(signals.map((signal) => [signal.url, signal])).values()).slice(0, 24)

    return {
      signals: unique,
      source: sourceUsage({
        id: "365scores-public",
        name: "365Scores",
        type: "365scores",
        url: configuredUrls()[0] ?? "https://www.365scores.com/",
        ok: unique.length > 0,
        itemCount: unique.length,
        note: "Se usan solo páginas públicas de marcador, estadísticas y noticias. Las secciones de cuotas se excluyen por filtro editorial.",
      }),
    }
  } catch (error) {
    return {
      signals: [],
      source: sourceUsage({
        id: "365scores-unavailable",
        name: "365Scores",
        type: "365scores",
        url: configuredUrls()[0] ?? "https://www.365scores.com/",
        ok: false,
        itemCount: 0,
        note: `365Scores no estuvo disponible: ${String(error)}`,
      }),
    }
  }
}
