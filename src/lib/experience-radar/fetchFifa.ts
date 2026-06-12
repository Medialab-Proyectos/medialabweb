import { FIFA_CONTEXT_URLS, makeId, sourceUsage } from "./sources"
import type { ExperienceSignal, FetchContext, SourceUsage } from "./types"

export async function fetchFifa(
  context: FetchContext = {},
): Promise<{ signals: ExperienceSignal[]; sources: SourceUsage[] }> {
  const detectedAt = (context.now ?? new Date()).toISOString()
  const sources: SourceUsage[] = []
  const signals: ExperienceSignal[] = []

  for (const url of FIFA_CONTEXT_URLS) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "text/html" },
        next: { revalidate: 60 * 60 },
      })

      sources.push(
        sourceUsage({
          id: makeId("fifa", [url]),
          name: "FIFA oficial",
          type: "fifa",
          url,
          ok: response.ok,
          itemCount: response.ok ? 1 : 0,
          note:
            "Usado solo para validar calendario, partidos y contexto oficial. No se usan logos ni patrocinio.",
        }),
      )

      if (response.ok) {
        signals.push({
          id: makeId("fifa-context", [url]),
          sourceType: "fifa",
          sourceName: "FIFA oficial",
          sourceUrl: url,
          title: "Contexto oficial del Mundial 2026 validado",
          summary:
            "Fuente oficial consultada para contrastar calendario, fixtures o standings sin convertir el contenido en cobertura deportiva.",
          url,
          publishedAt: detectedAt,
          detectedAt,
          category: "Contexto oficial",
          players: [],
          teams: [],
          tags: ["Mundial 2026", "calendario", "contexto oficial"],
          classifications: ["Trust"],
        })
      }
    } catch (error) {
      sources.push(
        sourceUsage({
          id: makeId("fifa-error", [url]),
          name: "FIFA oficial",
          type: "fifa",
          url,
          ok: false,
          itemCount: 0,
          note: `No se pudo validar esta URL oficial: ${String(error)}`,
        }),
      )
    }
  }

  return { signals, sources }
}
