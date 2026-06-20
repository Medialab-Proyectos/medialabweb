const CANONICAL_BIAS_LABELS = [
  "Adaptación hedónica",
  "Anclaje",
  "Aversión a la incertidumbre",
  "Aversión a la pérdida",
  "Comparación social",
  "Contagio emocional",
  "Disponibilidad",
  "Efecto cascada",
  "Efecto David vs Goliat",
  "Efecto de alivio",
  "Efecto de autoridad",
  "Efecto de contraste",
  "Efecto de disponibilidad",
  "Efecto de encuadre",
  "Efecto de identificación",
  "Efecto de primacía",
  "Efecto de recencia",
  "Efecto de urgencia",
  "Efecto halo",
  "Escalada de compromiso",
  "Exceso de confianza",
  "Heurística del error",
  "Heurística del resultado",
  "Memoria comparativa",
  "Paradoja de la recuperación",
  "Primacía",
  "Prueba social",
  "Punto de referencia",
  "Recencia",
  "Regla pico-fin",
  "Resiliencia percibida",
  "Sesgo de acción",
  "Sesgo de atribución",
  "Sesgo de autoridad",
  "Sesgo de confirmación",
  "Sesgo de esfuerzo",
  "Sesgo de expectativa",
  "Sesgo de inmediatez",
  "Sesgo de optimismo",
  "Sesgo de recencia",
  "Sesgo de resultado",
  "Sesgo de statu quo",
  "Sesgo del diseñador",
  "Sesgo de automatización",
  "Sobrecarga por defecto",
] as const

export const COGNITIVE_BIAS_CATALOG = [...CANONICAL_BIAS_LABELS]

const CANONICAL_BY_SLUG = new Map<string, string>([
  ["adaptacion hedonica", "Adaptación hedónica"],
  ["anclaje", "Anclaje"],
  ["aversion a la incertidumbre", "Aversión a la incertidumbre"],
  ["aversion a la perdida", "Aversión a la pérdida"],
  ["comparacion social", "Comparación social"],
  ["comparacion social con brasil 2014", "Comparación social"],
  ["contagio emocional", "Contagio emocional"],
  ["disponibilidad", "Disponibilidad"],
  ["efecto cascada", "Efecto cascada"],
  ["efecto david vs goliat", "Efecto David vs Goliat"],
  ["efecto de alivio", "Efecto de alivio"],
  ["efecto de autoridad", "Efecto de autoridad"],
  ["efecto de contraste", "Efecto de contraste"],
  ["efecto de disponibilidad", "Efecto de disponibilidad"],
  ["efecto de encuadre", "Efecto de encuadre"],
  ["efecto de identificacion", "Efecto de identificación"],
  ["efecto de primacia", "Efecto de primacía"],
  ["efecto de recencia", "Efecto de recencia"],
  ["efecto de urgencia", "Efecto de urgencia"],
  ["efecto halo", "Efecto halo"],
  ["escalada de compromiso", "Escalada de compromiso"],
  ["exceso de confianza", "Exceso de confianza"],
  ["heuristica del error", "Heurística del error"],
  ["heuristica del resultado", "Heurística del resultado"],
  ["memoria comparativa", "Memoria comparativa"],
  ["paradoja de la recuperacion", "Paradoja de la recuperación"],
  ["primacia", "Primacía"],
  ["prueba social", "Prueba social"],
  ["punto de referencia", "Punto de referencia"],
  ["recencia", "Recencia"],
  ["regla pico fin", "Regla pico-fin"],
  ["resiliencia percibida", "Resiliencia percibida"],
  ["sesgo de accion", "Sesgo de acción"],
  ["sesgo de atribucion", "Sesgo de atribución"],
  ["sesgo de autoridad", "Sesgo de autoridad"],
  ["sesgo de confirmacion", "Sesgo de confirmación"],
  ["sesgo de esfuerzo", "Sesgo de esfuerzo"],
  ["sesgo de expectativa", "Sesgo de expectativa"],
  ["sesgo de inmediatez", "Sesgo de inmediatez"],
  ["sesgo de optimismo", "Sesgo de optimismo"],
  ["sesgo de recencia", "Sesgo de recencia"],
  ["sesgo de resultado", "Sesgo de resultado"],
  ["sesgo de statu quo", "Sesgo de statu quo"],
  ["sesgo del disenador", "Sesgo del diseñador"],
  ["sesgo de automatizacion", "Sesgo de automatización"],
  ["sobrecarga por defecto", "Sobrecarga por defecto"],
])

function slugifyBias(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

export function normalizeCognitiveBiasLabel(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed

  const [head] = trimmed.split(":")
  const canonical = CANONICAL_BY_SLUG.get(slugifyBias(head.trim()))
  return canonical ?? head.trim()
}

export function normalizeCognitiveBias(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed

  const colonIndex = trimmed.indexOf(":")
  if (colonIndex < 0) return normalizeCognitiveBiasLabel(trimmed)

  const label = normalizeCognitiveBiasLabel(trimmed.slice(0, colonIndex))
  const explanation = trimmed.slice(colonIndex + 1).trim()
  return explanation ? `${label}: ${explanation}` : label
}

export function normalizeCognitiveBiases(values: string[]): string[] {
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const value of values) {
    const item = normalizeCognitiveBias(value)
    if (!item) continue
    const key = slugifyBias(item)
    if (seen.has(key)) continue
    seen.add(key)
    normalized.push(item)
  }

  return normalized
}
