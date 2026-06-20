import {
  ANALYST_PAGE_URLS,
  hasProhibitedContent,
  makeId,
  sanitizeText,
  sourceUsage,
} from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

function configuredUrls(): string[] {
  const raw = process.env.RADAR_ANALYST_URLS?.trim()
  if (!raw) return ANALYST_PAGE_URLS
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
    if (!response.ok) throw new Error(`Analyst page HTTP ${response.status}`)
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

function isRelevant(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  const footballTerms = ["world cup", "mundial", "fifa", "football", "soccer", "match", "partido", "tactics", "analysis", "análisis", "táctica"]
  return [...terms, ...footballTerms].some((term) => lower.includes(term.toLowerCase()))
}

function sourceNameFromUrl(url: string): string {
  if (url.includes("theguardian.com")) return "Jonathan Wilson / The Guardian"
  if (url.includes("theathletic.com")) return "The Athletic"
  if (url.includes("lamediainglesa")) return "La Media Inglesa"
  if (url.includes("elenganche")) return "El Enganche"
  return "Analista reconocido"
}

function pageLinks(html: string, baseUrl: string): string[] {
  const sameHost = new URL(baseUrl).hostname.replace(/\./g, "\\.")
  const direct = Array.from(
    html.matchAll(new RegExp(`href=["'](https?:\\/\\/${sameHost}[^"'#?]+)["']`, "gi")),
    (match) => match[1],
  )
  return [...new Set(direct)].slice(0, 12)
}

export async function fetchAnalystPages(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  const terms = (context.terms ?? []).map((term) => term.toLowerCase())

  try {
    const signals: ExperienceSignal[] = []

    for (const url of configuredUrls()) {
      const html = await fetchText(url)
      const title = sanitizeText(meta(html, "og:title") || meta(html, "title"), 180)
      const summary = sanitizeText(meta(html, "og:description") || meta(html, "description"), 320)
      const haystack = `${title} ${summary}`
      if (title && isRelevant(haystack, terms) && !hasProhibitedContent(haystack)) {
        signals.push({
          id: makeId("analyst", [url]),
          sourceType: "analyst",
          sourceName: sourceNameFromUrl(url),
          sourceUrl: url,
          title,
          summary,
          url,
          publishedAt: detectedAt,
          detectedAt,
          category: "Análisis editorial",
          players: [],
          teams: [],
          tags: ["Analista", "Fútbol"],
          classifications: [],
        })
      }

      const links = pageLinks(html, url)
      for (const link of links) {
        if (signals.length >= 24) break
        try {
          const childHtml = await fetchText(link, 5000)
          const childTitle = sanitizeText(meta(childHtml, "og:title") || meta(childHtml, "title"), 180)
          const childSummary = sanitizeText(meta(childHtml, "og:description") || meta(childHtml, "description"), 320)
          const childHaystack = `${childTitle} ${childSummary}`
          if (!childTitle || !isRelevant(childHaystack, terms) || hasProhibitedContent(childHaystack)) continue
          signals.push({
            id: makeId("analyst-child", [link]),
            sourceType: "analyst",
            sourceName: sourceNameFromUrl(url),
            sourceUrl: url,
            title: childTitle,
            summary: childSummary,
            url: link,
            publishedAt: detectedAt,
            detectedAt,
            category: "Análisis editorial",
            players: [],
            teams: [],
            tags: ["Analista", "Fútbol"],
            classifications: [],
          })
        } catch {
          continue
        }
      }
    }

    const unique = Array.from(new Map(signals.map((signal) => [signal.url, signal])).values()).slice(0, 24)

    return {
      signals: unique,
      source: sourceUsage({
        id: "analyst-pages",
        name: "Páginas de analistas reconocidos",
        type: "analyst",
        url: configuredUrls()[0] ?? "https://www.theguardian.com/profile/jonathanwilson",
        ok: unique.length > 0,
        itemCount: unique.length,
        note: "Señales editoriales desde perfiles o páginas públicas de analistas/comentaristas reconocidos.",
      }),
    }
  } catch (error) {
    return {
      signals: [],
      source: sourceUsage({
        id: "analyst-pages-unavailable",
        name: "Páginas de analistas reconocidos",
        type: "analyst",
        url: configuredUrls()[0] ?? "https://www.theguardian.com/profile/jonathanwilson",
        ok: false,
        itemCount: 0,
        note: `Páginas de analistas no disponibles: ${String(error)}`,
      }),
    }
  }
}
