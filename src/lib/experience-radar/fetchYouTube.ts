import { sourceUsage } from "./sources"
import { runSocialCollector } from "./socialPython"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

export async function fetchYouTube(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const terms = (context.terms?.length ? context.terms : ["Mundial 2026", "World Cup 2026"]).filter(Boolean)
  const result = await runSocialCollector("youtube", terms)

  return {
    signals: result.signals,
    source: sourceUsage(result.source),
  }
}
