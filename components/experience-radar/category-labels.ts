/**
 * Etiqueta legible (bilingüe) para la categoría editorial de una nota. Evita mostrar
 * jerga interna como "Trust" o "High Traffic" al lector. Si no hay mapeo, se muestra
 * la categoría tal cual.
 */
export const CATEGORY_LABEL: Record<string, { es: string; en: string }> = {
  UX: { es: "UX", en: "UX" },
  IA: { es: "IA", en: "AI" },
  Accesibilidad: { es: "Accesibilidad", en: "Accessibility" },
  Streaming: { es: "Streaming", en: "Streaming" },
  Ticketing: { es: "Boletería", en: "Ticketing" },
  "Fan Experience": { es: "Experiencia del fan", en: "Fan experience" },
  "Mobile Experience": { es: "Experiencia móvil", en: "Mobile experience" },
  Trust: { es: "Confianza", en: "Trust" },
  "High Traffic": { es: "Alto tráfico", en: "High traffic" },
  "Error Recovery": { es: "Recuperación", en: "Error recovery" },
}

/** Devuelve la etiqueta localizada de la categoría (o la categoría cruda si no hay mapeo). */
export function categoryLabel(category: string, lang: "es" | "en"): string {
  return CATEGORY_LABEL[category]?.[lang] ?? category
}
