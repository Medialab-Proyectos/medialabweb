import type { ExperienceSignal, ExperienceSignalCategory } from "./types"

const CATEGORY_KEYWORDS: Array<{ category: ExperienceSignalCategory; words: string[] }> = [
  { category: "Streaming", words: ["stream", "streaming", "buffer", "video", "watch", "ver", "transmision"] },
  { category: "Ticketing", words: ["ticket", "entrada", "boleto", "queue", "fila", "pago", "compra"] },
  { category: "Accesibilidad", words: ["accessibility", "accesibilidad", "caption", "subtitulo", "screen reader"] },
  { category: "Mobile Experience", words: ["app", "mobile", "movil", "iphone", "android", "phone"] },
  { category: "Trust", words: ["trust", "confianza", "fraud", "scam", "security", "oficial"] },
  { category: "High Traffic", words: ["traffic", "alta demanda", "slow", "loading", "latency", "saturado", "pico"] },
  { category: "Error Recovery", words: ["error", "crash", "broken", "login", "retry", "fallo", "caida"] },
  { category: "Fan Experience", words: ["fan", "match thread", "notification", "community", "duda", "comentario"] },
  { category: "IA", words: ["ai", "ia", "asistente", "bot", "modelo"] },
  { category: "UX", words: ["ux", "experience", "experiencia", "claridad", "usabilidad"] },
]

export function classifySignal(signal: ExperienceSignal): ExperienceSignal {
  const haystack = [
    signal.title,
    signal.summary,
    signal.category,
    signal.reportedProblem,
    ...(signal.tags ?? []),
    ...(signal.repeatedComplaints ?? []),
    ...(signal.frequentQuestions ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  const classifications = CATEGORY_KEYWORDS.filter(({ words }) =>
    words.some((word) => haystack.includes(word)),
  ).map(({ category }) => category)

  return {
    ...signal,
    classifications: Array.from(new Set(classifications.length ? classifications : ["UX"])),
  }
}

export function classifySignals(signals: ExperienceSignal[]): ExperienceSignal[] {
  return signals.map(classifySignal)
}
