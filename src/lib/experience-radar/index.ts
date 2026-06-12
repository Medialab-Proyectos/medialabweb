import { classifySignals } from "./classifySignals"
import { enrichDailyRadarReportWithAI } from "./aiAnalysis"
import { fetchAppReviews } from "./fetchAppReviews"
import { fetchFifa } from "./fetchFifa"
import { fetchGoogleTrends } from "./fetchGoogleTrends"
import { fetchLatingoles } from "./fetchLatingoles"
import { fetchReddit } from "./fetchReddit"
import { generateDailyInsight } from "./generateDailyInsight"
import { publishInsight } from "./publishInsight"
import { hasProhibitedContent } from "./sources"
import type { DailyRadarReport, FetchContext, SourceUsage } from "./types"

export * from "./types"
export * from "./i18n"
export * from "./sources"
export * from "./fetchLatingoles"
export * from "./fetchFifa"
export * from "./fetchReddit"
export * from "./fetchGoogleTrends"
export * from "./fetchAppReviews"
export * from "./classifySignals"
export * from "./aiAnalysis"
export * from "./generateDailyInsight"
export * from "./scoreExperienceIndex"
export * from "./publishInsight"

export async function runExperienceRadarDailyAgent(
  context: FetchContext = {},
): Promise<DailyRadarReport> {
  const [latingoles, fifa, reddit, trends, appReviews] = await Promise.all([
    fetchLatingoles(context),
    fetchFifa(context),
    fetchReddit(context),
    fetchGoogleTrends(context),
    fetchAppReviews(context),
  ])

  const sources: SourceUsage[] = [
    latingoles.source,
    ...fifa.sources,
    reddit.source,
    trends.source,
    ...appReviews.sources,
  ]

  const filteredSignals = [
    ...latingoles.signals,
    ...fifa.signals,
    ...reddit.signals,
    ...trends.signals,
    ...appReviews.signals,
  ].filter((signal) => !hasProhibitedContent(`${signal.title} ${signal.summary} ${signal.tags.join(" ")}`))

  const classifiedSignals = classifySignals(filteredSignals)

  const baseReport = generateDailyInsight(classifiedSignals, sources)
  const report = await enrichDailyRadarReportWithAI(baseReport)
  return publishInsight(report)
}
