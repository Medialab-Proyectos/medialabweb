import { classifySignals } from "./classifySignals"
import { enrichDailyRadarReportWithAI } from "./aiAnalysis"
import { fetch365Scores } from "./fetch365Scores"
import { fetchAppReviews } from "./fetchAppReviews"
import { fetchAnalystPages } from "./fetchAnalystPages"
import { fetchFacebook } from "./fetchFacebook"
import { fetchFifa } from "./fetchFifa"
import { fetchGoogleTrends } from "./fetchGoogleTrends"
import { fetchInstagram } from "./fetchInstagram"
import { fetchLatingoles } from "./fetchLatingoles"
import { fetchReddit } from "./fetchReddit"
import { fetchX } from "./fetchX"
import { fetchWinSports } from "./fetchWinSports"
import { fetchYouTube } from "./fetchYouTube"
import { generateDailyInsight } from "./generateDailyInsight"
import { publishInsight } from "./publishInsight"
import { hasProhibitedContent } from "./sources"
import type { DailyRadarReport, FetchContext, SourceUsage } from "./types"

export * from "./types"
export * from "./i18n"
export * from "./sources"
export * from "./fetch365Scores"
export * from "./fetchAnalystPages"
export * from "./fetchLatingoles"
export * from "./fetchFifa"
export * from "./fetchReddit"
export * from "./fetchX"
export * from "./fetchWinSports"
export * from "./fetchGoogleTrends"
export * from "./fetchAppReviews"
export * from "./fetchInstagram"
export * from "./fetchFacebook"
export * from "./fetchYouTube"
export * from "./classifySignals"
export * from "./aiAnalysis"
export * from "./generateDailyInsight"
export * from "./scoreExperienceIndex"
export * from "./publishInsight"

export async function runExperienceRadarDailyAgent(
  context: FetchContext = {},
): Promise<DailyRadarReport> {
  const [latingoles, winSports, fifa, reddit, x, instagram, facebook, youtube, scores365, analysts, trends, appReviews] = await Promise.all([
    fetchLatingoles(context),
    fetchWinSports(context),
    fetchFifa(context),
    fetchReddit(context),
    fetchX(context),
    fetchInstagram(context),
    fetchFacebook(context),
    fetchYouTube(context),
    fetch365Scores(context),
    fetchAnalystPages(context),
    fetchGoogleTrends(context),
    fetchAppReviews(context),
  ])

  const sources: SourceUsage[] = [
    latingoles.source,
    winSports.source,
    ...fifa.sources,
    reddit.source,
    x.source,
    instagram.source,
    facebook.source,
    youtube.source,
    scores365.source,
    analysts.source,
    trends.source,
    ...appReviews.sources,
  ]

  const filteredSignals = [
    ...latingoles.signals,
    ...winSports.signals,
    ...fifa.signals,
    ...reddit.signals,
    ...x.signals,
    ...instagram.signals,
    ...facebook.signals,
    ...youtube.signals,
    ...scores365.signals,
    ...analysts.signals,
    ...trends.signals,
    ...appReviews.signals,
  ].filter((signal) => !hasProhibitedContent(`${signal.title} ${signal.summary} ${signal.tags.join(" ")}`))

  const classifiedSignals = classifySignals(filteredSignals)

  const baseReport = generateDailyInsight(classifiedSignals, sources)
  const report = await enrichDailyRadarReportWithAI(baseReport)
  return publishInsight(report)
}
