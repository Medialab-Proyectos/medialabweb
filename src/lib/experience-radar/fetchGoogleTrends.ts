import { RADAR_SEARCH_TERMS, makeId, sanitizeText, sourceUsage } from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

const TRENDGETTER_BASE_URL = process.env.TRENDGETTER_URL ?? "https://trendgetter.vercel.app"
const TREND_REGIONS = ["US", "MX", "CA"]

type TrendgetterItem = {
  title?: string
  link?: string
  date?: string
  description?: string
  approximate_traffic?: string
  image_url?: string
}

type TrendgetterResponse = { data?: TrendgetterItem[] }

type ManualTrendItem = {
  title?: string
  traffic?: string
  link?: string
  pubDate?: string
  relatedQueries?: string[]
}

export async function fetchGoogleTrends(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  const terms = [...RADAR_SEARCH_TERMS, ...(context.terms ?? [])]
  const responses = await Promise.all(TREND_REGIONS.map((region) => fetchRegion(region)))
  const liveItems = responses.flatMap(({ region, items }) => items.map((item) => ({ ...item, region })))
  const relevant = liveItems.filter((item) => isRelevant(item, terms))
  const selected = (relevant.length ? relevant : liveItems).slice(0, 30)

  if (selected.length) {
    const signals = selected.map((item, index) => toSignal(item, detectedAt, index))
    return {
      signals,
      source: sourceUsage({
        id: "google-trends-trendgetter",
        name: "Google Trends vía Trendgetter",
        type: "google-trends",
        url: `${TRENDGETTER_BASE_URL}/api/google/topics`,
        ok: true,
        itemCount: signals.length,
        note: "Integración basada en Zivsteve/trendgetter (MIT) y el RSS público de Google Trends.",
      }),
    }
  }

  if (process.env.GOOGLE_TRENDS_JSON) {
    const manual = parseManualTrends(process.env.GOOGLE_TRENDS_JSON, detectedAt)
    return {
      signals: manual,
      source: sourceUsage({
        id: "google-trends-manual",
        name: "Google Trends manual/equivalente",
        type: "google-trends",
        url: "GOOGLE_TRENDS_JSON",
        ok: manual.length > 0,
        itemCount: manual.length,
      }),
    }
  }

  return {
    signals: [],
    source: sourceUsage({
      id: "google-trends-trendgetter",
      name: "Google Trends vía Trendgetter",
      type: "google-trends",
      url: `${TRENDGETTER_BASE_URL}/api/google/topics`,
      ok: false,
      itemCount: 0,
      note: "Trendgetter no respondió y no existe GOOGLE_TRENDS_JSON como respaldo.",
    }),
  }
}

async function fetchRegion(region: string): Promise<{ region: string; items: TrendgetterItem[] }> {
  try {
    const url = `${TRENDGETTER_BASE_URL}/api/google/topics?hl=es&geo=${region}&cat=ALL`
    const response = await fetch(url, { next: { revalidate: 60 * 30 } })
    if (!response.ok) return { region, items: [] }
    const data = (await response.json()) as TrendgetterResponse
    return { region, items: Array.isArray(data.data) ? data.data : [] }
  } catch {
    return { region, items: [] }
  }
}

function isRelevant(item: TrendgetterItem, terms: string[]): boolean {
  const text = `${item.title ?? ""} ${item.description ?? ""}`.toLowerCase()
  const footballTerms = ["world cup", "mundial", "fifa", "soccer", "football", "fútbol", "stadium", "estadio"]
  return [...terms, ...footballTerms].some((term) => text.includes(term.toLowerCase()))
}

function toSignal(
  item: TrendgetterItem & { region: string },
  detectedAt: string,
  index: number,
): ExperienceSignal {
  const title = sanitizeText(item.title ?? "World Cup", 160)
  return {
    id: makeId("trend", [item.region, title, index]),
    sourceType: "google-trends",
    sourceName: "Google Trends vía Trendgetter",
    sourceUrl: `${TRENDGETTER_BASE_URL}/api/google/topics`,
    title: `Tendencia creciente: ${title}`,
    summary: sanitizeText(
      item.description || `Interés de búsqueda aproximado: ${item.approximate_traffic ?? "no informado"}.`,
      320,
    ),
    url: item.link ?? `https://trends.google.com/trending/rss?geo=${item.region}`,
    imageUrl: item.image_url,
    publishedAt: item.date ?? detectedAt,
    detectedAt,
    category: "Tendencia de búsqueda",
    country: item.region,
    players: [],
    teams: [],
    tags: [title, "Google Trends", item.region],
    term: title,
    relativeVolume: parseTraffic(item.approximate_traffic),
    rising: true,
    relatedQueries: [],
    classifications: [],
  }
}

function parseManualTrends(raw: string, detectedAt: string): ExperienceSignal[] {
  try {
    const items = JSON.parse(raw) as ManualTrendItem[]
    return items.map((item, index) => {
      const title = sanitizeText(item.title ?? RADAR_SEARCH_TERMS[index] ?? "World Cup", 160)
      return {
        id: makeId("trend", [title, index]),
        sourceType: "google-trends",
        sourceName: "Google Trends",
        sourceUrl: "https://trends.google.com/",
        title: `Tendencia creciente: ${title}`,
        summary: `Consulta de tendencia detectada con volumen relativo ${item.traffic ?? "no informado"}.`,
        url: item.link ?? "https://trends.google.com/",
        publishedAt: item.pubDate ?? detectedAt,
        detectedAt,
        category: "Tendencia de búsqueda",
        country: "GLOBAL",
        players: [],
        teams: [],
        tags: [title, "Google Trends"],
        term: title,
        relativeVolume: parseTraffic(item.traffic),
        rising: true,
        relatedQueries: item.relatedQueries ?? [],
        classifications: [],
      }
    })
  } catch {
    return []
  }
}

function parseTraffic(value: string | undefined): number | undefined {
  if (!value) return undefined
  const number = Number(value.replace(/[^0-9.]/g, ""))
  if (!Number.isFinite(number)) return undefined
  if (value.toLowerCase().includes("m")) return 100
  if (value.toLowerCase().includes("k") || number >= 100_000) return 90
  if (number >= 10_000) return 75
  if (number >= 1_000) return 60
  return Math.min(100, number)
}
