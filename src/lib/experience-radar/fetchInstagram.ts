import { sourceUsage } from "./sources"
import { runSocialCollector } from "./socialPython"
import type { FetchContext, SourceUsage, ExperienceSignal } from "./types"

export async function fetchInstagram(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; source: SourceUsage }> {
  const terms = (context.terms?.length ? context.terms : ["Mundial 2026", "World Cup 2026"]).filter(Boolean)
  const result = await runSocialCollector("instagram", terms)

  return {
    signals: result.signals,
    source: sourceUsage(result.source),
  }
}
