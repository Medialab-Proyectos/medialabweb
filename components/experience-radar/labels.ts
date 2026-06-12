/**
 * Experience Radar — etiquetas bilingües para categorías y estados.
 * El contenido editorial de los insights está en español (curaduría MediaLab);
 * aquí solo se localiza el "chrome" de la interfaz.
 */

import type { InsightStatus, RadarCategory } from "@/lib/radar"

export const CATEGORY_LABELS: Record<RadarCategory, { es: string; en: string }> = {
  UX: { es: "UX", en: "UX" },
  AI: { es: "IA", en: "AI" },
  Accessibility: { es: "Accesibilidad", en: "Accessibility" },
  Streaming: { es: "Streaming", en: "Streaming" },
  Ticketing: { es: "Ticketing", en: "Ticketing" },
  "Fan Experience": { es: "Fan Experience", en: "Fan Experience" },
  "Mobile Experience": { es: "Mobile", en: "Mobile" },
  "High Traffic": { es: "Alto tráfico", en: "High Traffic" },
  Trust: { es: "Confianza", en: "Trust" },
  "Error Recovery": { es: "Recuperación", en: "Error Recovery" },
}

export const STATUS_LABELS: Record<InsightStatus, { es: string; en: string }> = {
  new: { es: "Nuevo", en: "New" },
  watching: { es: "En observación", en: "Watching" },
  relevant: { es: "Relevante", en: "Relevant" },
  critical: { es: "Crítico", en: "Critical" },
}

/** Clases de color por estado (usa tokens/marca, sin estilos globales nuevos). */
export const STATUS_STYLES: Record<InsightStatus, string> = {
  new: "bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30",
  watching: "bg-muted text-muted-foreground border-border",
  relevant: "bg-[#f4a261]/10 text-[#c65a10] border-[#f4a261]/40 dark:text-[#f4a261]",
  critical: "bg-[var(--magenta)]/10 text-[var(--magenta)] border-[var(--magenta)]/40",
}

/** Nombres de país legibles para los filtros. */
export const COUNTRY_LABELS: Record<string, { es: string; en: string }> = {
  GLOBAL: { es: "Global", en: "Global" },
  MX: { es: "México", en: "Mexico" },
  AR: { es: "Argentina", en: "Argentina" },
  BR: { es: "Brasil", en: "Brazil" },
  CO: { es: "Colombia", en: "Colombia" },
  US: { es: "EE. UU.", en: "United States" },
  ES: { es: "España", en: "Spain" },
}

export function countryLabel(code: string, lang: "es" | "en") {
  return COUNTRY_LABELS[code]?.[lang] ?? code
}
