/**
 * Experience Radar — clasificación de señales.
 *
 * Asigna una RadarCategory a una señal a partir de su `rawCategory` y de palabras
 * clave en título/tags. Reglas locales por defecto; si en el futuro existe
 * OPENAI_API_KEY se puede sustituir por clasificación con IA (ver generateInsight).
 */

import type { RadarCategory, Signal } from "./types"

const KEYWORD_MAP: { category: RadarCategory; keywords: string[] }[] = [
  { category: "Streaming", keywords: ["stream", "streaming", "transmis", "video", "directo"] },
  { category: "Ticketing", keywords: ["ticket", "boletería", "boleteria", "entrada", "cola"] },
  { category: "Accessibility", keywords: ["accesib", "subtítulo", "subtitulo", "inclus", "a11y", "lector"] },
  { category: "Error Recovery", keywords: ["error", "pago", "recuper", "fallo", "caída", "caida"] },
  { category: "Mobile Experience", keywords: ["mobile", "móvil", "movil", "app", "dispositivo"] },
  { category: "AI", keywords: ["ia", "ai", "asistente", "modelo", "chatbot", "ml"] },
  { category: "Trust", keywords: ["confianza", "fraude", "seguridad", "trust"] },
  { category: "High Traffic", keywords: ["alta demanda", "pico", "tráfico", "trafico", "simultán", "masiv", "saturac"] },
  { category: "Fan Experience", keywords: ["fan", "notificac", "comunidad", "emoción", "emocion"] },
  { category: "UX", keywords: ["ux", "claridad", "usabilidad", "experiencia", "información", "informacion"] },
]

const RAW_TO_CATEGORY: Record<string, RadarCategory> = {
  streaming: "Streaming",
  ticketing: "Ticketing",
  accessibility: "Accessibility",
  error: "Error Recovery",
  mobile: "Mobile Experience",
  ai: "AI",
  trust: "Trust",
  traffic: "High Traffic",
  fan: "Fan Experience",
  ux: "UX",
}

/**
 * Clasifica una señal en una RadarCategory.
 * Prioriza `rawCategory` declarada por la fuente; si no, infiere por palabras clave;
 * si nada coincide, cae en "UX".
 */
export function classifySignal(signal: Signal): RadarCategory {
  const raw = signal.rawCategory?.toLowerCase().trim()
  if (raw && RAW_TO_CATEGORY[raw]) return RAW_TO_CATEGORY[raw]

  const haystack = [signal.title, ...(signal.tags || [])]
    .join(" ")
    .toLowerCase()

  let best: { category: RadarCategory; score: number } | null = null
  for (const { category, keywords } of KEYWORD_MAP) {
    const score = keywords.reduce(
      (acc, kw) => (haystack.includes(kw) ? acc + 1 : acc),
      0,
    )
    if (score > 0 && (!best || score > best.score)) {
      best = { category, score }
    }
  }

  return best?.category ?? "UX"
}
