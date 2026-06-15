import { RADAR_SEARCH_TERMS, makeId, sanitizeText, sourceUsage } from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"
import { XMLParser } from "fast-xml-parser"

const SUBREDDITS = ["worldcup", "soccer", "football", "CanadaSoccer", "Aleague"]

type RedditListing = {
  data?: {
    children?: Array<{
      data?: {
        title?: string
        permalink?: string
        subreddit?: string
        score?: number
        created_utc?: number
        selftext?: string
        num_comments?: number
      }
    }>
  }
}

export async function fetchReddit(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  const token = await getRedditToken()

  if (!token) {
    const signals = await fetchRedditRss(context, detectedAt)
    return {
      signals,
      source: sourceUsage({
        id: "reddit-rss",
        name: "Reddit RSS público",
        type: "reddit",
        url: "https://www.reddit.com/r/soccer/new.rss",
        ok: signals.length > 0,
        itemCount: signals.length,
        note: signals.length
          ? "Respaldo RSS sin credenciales; la API OAuth oficial sigue siendo la fuente preferida."
          : "Reddit limitó temporalmente el RSS. Configura OAuth para mayor estabilidad.",
      }),
    }
  }

  const terms = [...RADAR_SEARCH_TERMS, ...(context.terms ?? [])]
  const signals: ExperienceSignal[] = []

  for (const subreddit of SUBREDDITS) {
    for (const term of terms.slice(0, 8)) {
      const url = `https://oauth.reddit.com/r/${subreddit}/search?q=${encodeURIComponent(term)}&restrict_sr=1&sort=new&t=day&limit=5`
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": process.env.REDDIT_USER_AGENT ?? "MediaLabExperienceRadar/1.0",
          },
        })
        if (!response.ok) continue
        const listing = (await response.json()) as RedditListing

        for (const child of listing.data?.children ?? []) {
          const post = child.data
          if (!post?.title || !post.permalink) continue
          const fullUrl = `https://www.reddit.com${post.permalink}`
          const text = `${post.title} ${post.selftext ?? ""}`

          signals.push({
            id: makeId("reddit", [subreddit, post.permalink]),
            sourceType: "reddit",
            sourceName: "Reddit API oficial",
            sourceUrl: url,
            title: sanitizeText(post.title, 180),
            summary: sanitizeText(post.selftext || post.title, 320),
            url: fullUrl,
            publishedAt: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : detectedAt,
            detectedAt,
            category: "Conversacion de usuarios",
            players: [],
            teams: detectTeams(text),
            tags: [term, subreddit],
            subreddit,
            score: post.score ?? 0,
            highlightedComments: await fetchHighlightedComments(token, fullUrl),
            repeatedComplaints: detectComplaints(text),
            frequentQuestions: detectQuestions(text),
            sentiment: inferSentiment(text),
            classifications: [],
          })
        }
      } catch {
        continue
      }
    }
  }

  const unique = Array.from(new Map(signals.map((signal) => [signal.url, signal])).values())

  return {
    signals: unique,
    source: sourceUsage({
      id: "reddit-api",
      name: "Reddit API oficial",
      type: "reddit",
      url: "https://www.reddit.com/dev/api/",
      ok: true,
      itemCount: unique.length,
    }),
  }
}

type RedditRssEntry = {
  id?: string
  title?: string
  updated?: string
  content?: string
  link?: Array<{ "@_href"?: string }> | { "@_href"?: string }
}

async function fetchRedditRss(context: FetchContext, detectedAt: string): Promise<ExperienceSignal[]> {
  const terms = [...RADAR_SEARCH_TERMS, ...(context.terms ?? [])]
  const parser = new XMLParser({ ignoreAttributes: false })
  const signals: ExperienceSignal[] = []
  const relevantSignals: ExperienceSignal[] = []
  const searchTerms = (context.terms?.length ? context.terms : ["Mundial 2026", "World Cup 2026"])
    .filter(Boolean)
    .slice(0, 4)

  for (const subreddit of SUBREDDITS) {
    const feedUrls = [
      ...searchTerms.map(
        (term) => `https://www.reddit.com/r/${subreddit}/search.rss?q=${encodeURIComponent(term)}&restrict_sr=on&sort=new&t=week`,
      ),
      `https://www.reddit.com/r/${subreddit}/new.rss`,
    ]

    for (const feedUrl of feedUrls) try {
      const response = await fetch(feedUrl, {
        headers: { "User-Agent": process.env.REDDIT_USER_AGENT ?? "MediaLabExperienceRadar/1.0" },
        next: { revalidate: 60 * 15 },
      })
      if (!response.ok) continue
      const parsed = parser.parse(await response.text()) as { feed?: { entry?: RedditRssEntry | RedditRssEntry[] } }
      const entries = parsed.feed?.entry
      const list = Array.isArray(entries) ? entries : entries ? [entries] : []

      for (const entry of list) {
        const title = sanitizeText(entry.title, 180)
        const summary = sanitizeText(entry.content || entry.title, 320)
        const text = `${title} ${summary}`
        const links = Array.isArray(entry.link) ? entry.link : entry.link ? [entry.link] : []
        const url = links.find((link) => link["@_href"]?.includes("/comments/"))?.["@_href"]
        if (!title || !url) continue

        const signal: ExperienceSignal = {
          id: makeId("reddit-rss", [subreddit, entry.id ?? url]),
          sourceType: "reddit",
          sourceName: "Reddit RSS público",
          sourceUrl: feedUrl,
          title,
          summary,
          url,
          publishedAt: entry.updated ?? detectedAt,
          detectedAt,
          category: "Conversación de usuarios",
          players: [],
          teams: detectTeams(text),
          tags: [subreddit, "Reddit RSS"],
          subreddit,
          score: 0,
          highlightedComments: [],
          repeatedComplaints: detectComplaints(text),
          frequentQuestions: detectQuestions(text),
          sentiment: inferSentiment(text),
          classifications: [],
        }
        signals.push(signal)
        if (isRelevantRedditPost(text, terms)) relevantSignals.push(signal)
      }
    } catch {
      continue
    }
  }

  const selected = relevantSignals.length ? relevantSignals : signals
  return Array.from(new Map(selected.map((signal) => [signal.url, signal])).values()).slice(0, 30)
}

function isRelevantRedditPost(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  const footballTerms = ["world cup", "mundial", "fifa", "match", "soccer", "football", "stream", "ticket"]
  return [...terms, ...footballTerms].some((term) => lower.includes(term.toLowerCase()))
}

async function fetchHighlightedComments(token: string, postUrl: string): Promise<string[]> {
  try {
    const apiPath = postUrl.replace("https://www.reddit.com", "https://oauth.reddit.com").replace(/\/$/, "")
    const response = await fetch(`${apiPath}.json?limit=5&sort=top`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": process.env.REDDIT_USER_AGENT ?? "MediaLabExperienceRadar/1.0",
      },
    })
    if (!response.ok) return []
    const data = (await response.json()) as Array<{
      data?: { children?: Array<{ data?: { body?: string; score?: number } }> }
    }>
    const comments = data[1]?.data?.children ?? []
    return comments
      .map((comment) => comment.data?.body)
      .filter((body): body is string => Boolean(body && body !== "[deleted]" && body !== "[removed]"))
      .slice(0, 3)
      .map((body) => sanitizeText(body, 220))
  } catch {
    return []
  }
}

async function getRedditToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  try {
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": process.env.REDDIT_USER_AGENT ?? "MediaLabExperienceRadar/1.0",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })
    if (!response.ok) return null
    const data = (await response.json()) as { access_token?: string }
    return data.access_token ?? null
  } catch {
    return null
  }
}

function detectComplaints(text: string): string[] {
  const lower = text.toLowerCase()
  return [
    ["streaming", "problemas de streaming"],
    ["buffer", "buffering o carga lenta"],
    ["ticket", "friccion en ticketing"],
    ["app", "problemas con app movil"],
    ["login", "problemas de login"],
  ]
    .filter(([needle]) => lower.includes(needle))
    .map(([, label]) => label)
}

function detectQuestions(text: string): string[] {
  const lower = text.toLowerCase()
  return [
    ["how to watch", "Como ver el partido"],
    ["where to watch", "Donde verlo"],
    ["tickets", "Como comprar entradas"],
    ["app", "Como usar la app"],
  ]
    .filter(([needle]) => lower.includes(needle))
    .map(([, label]) => label)
}

function detectTeams(text: string): string[] {
  const teams = [
    "Argentina", "Brasil", "Colombia", "Mexico", "Canada", "USA", "France", "Spain",
    "Bosnia", "Qatar", "Switzerland", "Scotland", "Haiti", "Australia", "Türkiye",
    "Germany", "Curaçao", "Netherlands", "Japan", "Ecuador", "Tunisia", "Sweden",
    "Ivory Coast", "Côte d'Ivoire", "Iran", "New Zealand",
  ]
  const lower = text.toLowerCase()
  return teams.filter((team) => lower.includes(team.toLowerCase()))
}

function inferSentiment(text: string): ExperienceSignal["sentiment"] {
  const lower = text.toLowerCase()
  const negative = ["problem", "issue", "broken", "can't", "error", "scam", "bad", "slow"]
  const positive = ["great", "good", "love", "works", "easy"]
  const n = negative.filter((word) => lower.includes(word)).length
  const p = positive.filter((word) => lower.includes(word)).length
  if (n > p) return "negativo"
  if (p > n) return "positivo"
  return n || p ? "mixto" : "neutral"
}
