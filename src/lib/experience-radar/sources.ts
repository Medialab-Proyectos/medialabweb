import type { SourceUsage } from "./types"

export const RADAR_SEARCH_TERMS = [
  "world cup",
  "fifa world cup",
  "opening match",
  "match thread",
  "streaming problem",
  "ticket problem",
  "fifa app",
  "Mundial 2026",
  "partido inaugural",
  "como ver el mundial",
  "entradas mundial",
  "app fifa",
  "streaming mundial",
]

export const FIFA_CONTEXT_URLS = [
  "https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026",
  "https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  "https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/standings",
]

export const APP_REVIEW_TARGETS = [
  { app: "FIFA App", appleId: "756904853", googlePackage: "com.fifa.fifaapp.android" },
  { app: "DAZN", appleId: "1129523589", googlePackage: "com.dazn" },
  { app: "ESPN", appleId: "317469184", googlePackage: "com.espn.score_center" },
  { app: "Disney+", appleId: "1446075923", googlePackage: "com.disney.disneyplus" },
  { app: "DirecTV", appleId: "1136238277", googlePackage: "com.directv.dvrscheduler" },
]

export const THREE_SIXTY_FIVE_SCORES_URLS = [
  "https://www.365scores.com/es/football/league/fifa-world-cup-5930",
  "https://www.365scores.com/es/football/league/fifa-world-cup-5930/matches",
  "https://www.365scores.com/es/football/league/fifa-world-cup-5930/standings",
]

export const ANALYST_PAGE_URLS = [
  "https://www.theguardian.com/profile/jonathanwilson",
]

export function sourceUsage(
  input: Omit<SourceUsage, "checkedAt"> & { checkedAt?: string },
): SourceUsage {
  return {
    ...input,
    checkedAt: input.checkedAt ?? new Date().toISOString(),
  }
}

export function isAutoPublishEnabled(): boolean {
  return process.env.AUTO_PUBLISH === "true"
}

export function sanitizeText(value: unknown, maxLength = 280): string {
  const text = decodeHtml(String(value ?? ""))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trim()}...`
}

export function hasProhibitedContent(value: string): boolean {
  const lower = value.toLowerCase()
  return [
    "apuesta",
    "apuestas",
    "betting",
    "casino",
    "bookmaker",
    "odd ",
    "odds",
    "gambling",
  ].some((term) => lower.includes(term))
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

export function makeId(prefix: string, parts: unknown[]): string {
  const body = parts
    .map((part) => String(part ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-"))
    .join("-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)

  return `${prefix}-${body || Date.now()}`
}
