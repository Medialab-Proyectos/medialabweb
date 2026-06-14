import { hasProhibitedContent, makeId, sanitizeText, sourceUsage } from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

const WIN_HOME = "https://www.winsports.co/"
const ARTICLE_LIMIT = 24

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
    if (!response.ok) throw new Error(`Win Sports HTTP ${response.status}`)
    return response.text()
  } finally {
    clearTimeout(timeout)
  }
}

function absoluteUrl(value: string): string {
  return new URL(value.replaceAll("&amp;", "&"), WIN_HOME).toString()
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

function articleLinks(html: string): string[] {
  const links = Array.from(
    html.matchAll(/href=["']([^"']*\/futbol-internacional\/noticias\/[^"'#?]+)["']/gi),
    (match) => absoluteUrl(match[1]),
  )
  return [...new Set(links)].slice(0, ARTICLE_LIMIT)
}

export async function fetchWinSports(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  try {
    const homepage = await fetchText(WIN_HOME)
    const urls = articleLinks(homepage)
    const pages = await Promise.allSettled(urls.map(async (url) => ({ url, html: await fetchText(url) })))
    const terms = (context.terms ?? []).map((term) => term.toLowerCase())

    const signals = pages.flatMap((result) => {
      if (result.status !== "fulfilled") return []
      const { url, html } = result.value
      const title = sanitizeText(meta(html, "og:title"), 180)
      const summary = sanitizeText(meta(html, "og:description") || meta(html, "description"), 320)
      const haystack = `${title} ${summary}`.toLowerCase()
      const isRelevant = /mundial|world cup|copa mundial|fifa/.test(haystack)
        || terms.some((term) => haystack.includes(term))
      if (!title || !isRelevant || hasProhibitedContent(haystack)) return []

      const imageUrl = meta(html, "og:image")
      return [{
        id: makeId("winsports", [url]),
        sourceType: "winsports",
        sourceName: "Win Sports",
        sourceUrl: WIN_HOME,
        title,
        summary,
        url,
        imageUrl: imageUrl ? absoluteUrl(imageUrl) : undefined,
        imageAlt: title,
        imageCredit: "Win Sports",
        imageSourceUrl: url,
        publishedAt: meta(html, "article:published_time") || detectedAt,
        detectedAt,
        category: "Mundial",
        players: [],
        teams: [],
        tags: ["Win Sports", "Mundial 2026"],
        classifications: [],
      } satisfies ExperienceSignal]
    })

    return {
      signals,
      source: sourceUsage({
        id: "winsports-authorized-scrape",
        name: "Win Sports",
        type: "winsports",
        url: WIN_HOME,
        ok: true,
        itemCount: signals.length,
        note: "Scraping autorizado de portada y metadatos; no reproduce notas completas.",
      }),
    }
  } catch (error) {
    return {
      signals: [],
      source: sourceUsage({
        id: "winsports-unavailable",
        name: "Win Sports",
        type: "winsports",
        url: WIN_HOME,
        ok: false,
        itemCount: 0,
        note: `Win Sports no estuvo disponible: ${String(error)}`,
      }),
    }
  }
}
