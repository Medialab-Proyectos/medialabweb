import { APP_REVIEW_TARGETS, makeId, sanitizeText, sourceUsage } from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

type AppleReviewFeed = {
  feed?: {
    entry?: Array<{
      id?: { label?: string }
      title?: { label?: string }
      content?: { label?: string }
      updated?: { label?: string }
      "im:rating"?: { label?: string }
      author?: { name?: { label?: string } }
    }>
  }
}

export async function fetchAppReviews(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; sources: SourceUsage[] }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  const signals: ExperienceSignal[] = []
  const sources: SourceUsage[] = []

  for (const target of APP_REVIEW_TARGETS) {
    const url = `https://itunes.apple.com/us/rss/customerreviews/id=${target.appleId}/sortBy=mostRecent/json`
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 * 60 * 6 },
      })
      if (!response.ok) throw new Error(`Apple reviews ${response.status}`)
      const data = (await response.json()) as AppleReviewFeed
      const entries = data.feed?.entry?.slice(1, 11) ?? []

      for (const entry of entries) {
        const review = sanitizeText(entry.content?.label, 320)
        if (!review) continue
        signals.push({
          id: makeId("review", [target.app, entry.id?.label, entry.updated?.label]),
          sourceType: "app-review",
          sourceName: "Apple App Store reviews",
          sourceUrl: url,
          title: sanitizeText(entry.title?.label || `${target.app} review`, 160),
          summary: review,
          url,
          publishedAt: entry.updated?.label ?? detectedAt,
          detectedAt,
          category: "Review de app",
          country: "US",
          players: [],
          teams: [],
          tags: [target.app, "app review"],
          app: target.app,
          rating: Number(entry["im:rating"]?.label ?? 0) || undefined,
          reportedProblem: detectProblem(review),
          classifications: [],
        })
      }

      sources.push(
        sourceUsage({
          id: makeId("apple-reviews", [target.app]),
          name: `Apple App Store - ${target.app}`,
          type: "app-review",
          url,
          ok: true,
          itemCount: entries.length,
        }),
      )
    } catch (error) {
      sources.push(
        sourceUsage({
          id: makeId("apple-reviews-error", [target.app]),
          name: `Apple App Store - ${target.app}`,
          type: "app-review",
          url,
          ok: false,
          itemCount: 0,
          note: String(error),
        }),
      )
    }
  }

  sources.push(
    sourceUsage({
      id: "google-play-reviews",
      name: "Google Play reviews",
      type: "app-review",
      url: "https://play.google.com/",
      ok: false,
      itemCount: 0,
      note:
        "Google Play no expone una API publica oficial de reviews para este uso. Conectar una libreria/API permitida o carga autorizada antes de activar.",
    }),
  )

  return { signals, sources }
}

function detectProblem(review: string): string | undefined {
  const lower = review.toLowerCase()
  if (lower.includes("buffer") || lower.includes("stream")) return "Streaming"
  if (lower.includes("ticket")) return "Ticketing"
  if (lower.includes("login") || lower.includes("sign in")) return "Login"
  if (lower.includes("crash") || lower.includes("error")) return "Error recovery"
  if (lower.includes("slow") || lower.includes("loading")) return "High traffic"
  return undefined
}
