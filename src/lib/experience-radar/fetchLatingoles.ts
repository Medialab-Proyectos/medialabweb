import { hasProhibitedContent, makeId, sanitizeText, sourceUsage } from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

const LATINGOLES_POSTS =
  "https://latingoles.com/wp-json/wp/v2/posts?per_page=20&_embed=1"

type WordpressPost = {
  id: number
  date_gmt?: string
  date?: string
  link?: string
  title?: { rendered?: string }
  excerpt?: { rendered?: string }
  categories?: number[]
  tags?: number[]
  _embedded?: {
    "wp:term"?: Array<Array<{ name?: string; taxonomy?: string }>>
    "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string }>
  }
}

export async function fetchLatingoles(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const detectedAt = (context.now ?? new Date()).toISOString()

  try {
    const response = await fetch(LATINGOLES_POSTS, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 30 },
    })

    if (!response.ok) throw new Error(`Latingoles WP API ${response.status}`)
    const posts = (await response.json()) as WordpressPost[]

    const signals = posts.flatMap((post) => {
      const terms = post._embedded?.["wp:term"]?.flat() ?? []
      const tags = terms.map((term) => term.name).filter(Boolean) as string[]
      const title = sanitizeText(post.title?.rendered, 160)
      const summary = sanitizeText(post.excerpt?.rendered, 320)
      const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
      const imageAlt = sanitizeText(post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || title, 180)

      if (hasProhibitedContent(`${title} ${summary} ${tags.join(" ")}`)) return []

      return [{
        id: makeId("lat", [post.id, post.link]),
        sourceType: "latingoles",
        sourceName: "Latingoles",
        sourceUrl: LATINGOLES_POSTS,
        title,
        summary,
        url: post.link ?? "https://latingoles.com/",
        imageUrl,
        imageAlt,
        imageCredit: "Latingoles",
        imageSourceUrl: post.link,
        publishedAt: post.date_gmt ?? post.date ?? detectedAt,
        detectedAt,
        category: tags[0] ?? "Mundial",
        country: detectCountry(tags.join(" ")),
        players: detectEntities(tags, PLAYER_HINTS),
        teams: detectTeams(post.title?.rendered),
        tags,
        classifications: [],
      } satisfies ExperienceSignal]
    })

    return {
      signals,
      source: sourceUsage({
        id: "latingoles-wp",
        name: "Latingoles WP REST",
        type: "latingoles",
        url: LATINGOLES_POSTS,
        ok: true,
        itemCount: signals.length,
      }),
    }
  } catch (error) {
    const privateApi = await loadPrivateLatingoles(detectedAt)
    if (privateApi.length > 0) {
      return {
        signals: privateApi,
        source: sourceUsage({
          id: "latingoles-private-api",
          name: "Latingoles API privada autorizada",
          type: "latingoles",
          url: process.env.LATINGOLES_PRIVATE_API_URL ?? "",
          ok: true,
          itemCount: privateApi.length,
          note: "WP REST no disponible; se uso API privada autorizada.",
        }),
      }
    }

    const rss = await loadLatingolesRss(detectedAt)
    if (rss.length > 0) {
      return {
        signals: rss,
        source: sourceUsage({
          id: "latingoles-rss",
          name: "Latingoles RSS autorizado",
          type: "latingoles",
          url: process.env.LATINGOLES_RSS_URL ?? "",
          ok: true,
          itemCount: rss.length,
          note: "WP REST no disponible; se uso RSS autorizado.",
        }),
      }
    }

    const manual = await loadManualLatingoles(detectedAt)
    return {
      signals: manual,
      source: sourceUsage({
        id: "latingoles-fallback",
        name: "Latingoles fallback",
        type: manual.length ? "manual" : "latingoles",
        url: process.env.LATINGOLES_PRIVATE_API_URL || LATINGOLES_POSTS,
        ok: manual.length > 0,
        itemCount: manual.length,
        note:
          manual.length > 0
            ? "WP REST no disponible; se uso carga manual JSON autorizada."
            : `WP REST no disponible. Adaptadores listos: LATINGOLES_PRIVATE_API_URL, LATINGOLES_MANUAL_JSON o RSS autorizado. ${String(error)}`,
      }),
    }
  }
}

async function loadPrivateLatingoles(detectedAt: string): Promise<ExperienceSignal[]> {
  if (!process.env.LATINGOLES_PRIVATE_API_URL) return []
  try {
    const response = await fetch(process.env.LATINGOLES_PRIVATE_API_URL, {
      headers: {
        Accept: "application/json",
        ...(process.env.LATINGOLES_PRIVATE_API_TOKEN
          ? { Authorization: `Bearer ${process.env.LATINGOLES_PRIVATE_API_TOKEN}` }
          : {}),
      },
      cache: "no-store",
    })
    if (!response.ok) return []
    const items = (await response.json()) as Partial<ExperienceSignal>[]
    return mapManualItems(items, detectedAt, "Latingoles API privada")
  } catch {
    return []
  }
}

async function loadLatingolesRss(detectedAt: string): Promise<ExperienceSignal[]> {
  if (!process.env.LATINGOLES_RSS_URL) return []
  try {
    const response = await fetch(process.env.LATINGOLES_RSS_URL, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      cache: "no-store",
    })
    if (!response.ok) return []
    const xml = await response.text()
    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).slice(0, 20)

    return items.flatMap((match, index) => {
      const item = match[1]
      const title = sanitizeText(readXml(item, "title"), 160)
      const summary = sanitizeText(readXml(item, "description"), 320)
      const link = sanitizeText(readXml(item, "link"), 300)
      if (hasProhibitedContent(`${title} ${summary}`)) return []

      return [{
        id: makeId("lat-rss", [index, link, title]),
        sourceType: "latingoles",
        sourceName: "Latingoles RSS",
        sourceUrl: process.env.LATINGOLES_RSS_URL ?? "",
        title,
        summary,
        url: link || "https://latingoles.com/",
        publishedAt: sanitizeText(readXml(item, "pubDate"), 80) || detectedAt,
        detectedAt,
        category: "Mundial",
        players: [],
        teams: detectTeams(title),
        tags: ["Latingoles", "RSS"],
        classifications: [],
      } satisfies ExperienceSignal]
    })
  } catch {
    return []
  }
}

async function loadManualLatingoles(detectedAt: string): Promise<ExperienceSignal[]> {
  if (!process.env.LATINGOLES_MANUAL_JSON) return []
  try {
    const raw = JSON.parse(process.env.LATINGOLES_MANUAL_JSON) as Partial<ExperienceSignal>[]
    return mapManualItems(raw, detectedAt, "Latingoles manual")
  } catch {
    return []
  }
}

function mapManualItems(
  raw: Partial<ExperienceSignal>[],
  detectedAt: string,
  sourceName: string,
): ExperienceSignal[] {
  return raw.flatMap((item, index) => {
    const title = sanitizeText(item.title, 160)
    const summary = sanitizeText(item.summary, 320)
    if (hasProhibitedContent(`${title} ${summary} ${(item.tags ?? []).join(" ")}`)) return []

    return [{
      id: item.id ?? makeId("lat-manual", [index, item.url, item.title]),
      sourceType: "manual",
      sourceName: item.sourceName ?? sourceName,
      sourceUrl: item.sourceUrl ?? "https://latingoles.com/",
      title,
      summary,
      url: item.url ?? "https://latingoles.com/",
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt ?? detectedAt,
      detectedAt,
      category: item.category,
      country: item.country,
      players: item.players ?? [],
      teams: item.teams ?? [],
      tags: item.tags ?? [],
      classifications: [],
    } satisfies ExperienceSignal]
  })
}

function readXml(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))
  return match?.[1]?.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "") ?? ""
}

const PLAYER_HINTS = ["messi", "mbappe", "haaland", "vinicius", "bellingham"]
const TEAM_ALIASES: Array<[string, string[]]> = [
  ["argentina", ["argentina"]],
  ["brasil", ["brasil", "brazil"]],
  ["colombia", ["colombia"]],
  ["méxico", ["mexico", "méxico"]],
  ["canadá", ["canada", "canadá"]],
  ["estados unidos", ["usa", "estados unidos", "united states"]],
  ["españa", ["espana", "españa", "spain"]],
  ["francia", ["francia", "france"]],
  ["sudáfrica", ["sudafrica", "sudáfrica", "south africa"]],
  ["marruecos", ["marruecos", "morocco"]],
  ["japón", ["japon", "japón", "japan"]],
  ["corea del sur", ["corea del sur", "south korea"]],
]

function detectEntities(values: unknown[], hints: string[]): string[] {
  const haystack = values.join(" ").toLowerCase()
  return hints.filter((hint) => haystack.includes(hint))
}

function detectTeams(value: unknown): string[] {
  const title = String(value ?? "").toLowerCase()
  return TEAM_ALIASES.filter(([, aliases]) => aliases.some((alias) => containsWholePhrase(title, alias))).map(([team]) => team)
}

function containsWholePhrase(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`(^|[^a-záéíóúñ])${escaped}([^a-záéíóúñ]|$)`, "i").test(text)
}

function detectCountry(text: string): string | undefined {
  const lower = text.toLowerCase()
  if (lower.includes("colombia")) return "CO"
  if (lower.includes("mexico") || lower.includes("méxico")) return "MX"
  if (lower.includes("argentina")) return "AR"
  if (lower.includes("usa") || lower.includes("estados unidos")) return "US"
  return undefined
}
