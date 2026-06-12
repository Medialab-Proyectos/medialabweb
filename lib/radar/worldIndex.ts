/**
 * Experience Radar — World Experience Index (índice propio de MediaLab).
 *
 * Índice 0–100 que resume la salud de la experiencia digital durante el evento,
 * a partir de ocho variables. Se calcula desde los insights detectados: cuanto
 * mayor es el riesgo/impacto en una dimensión, más baja su puntuación.
 */

import { aggregateImpactLevel } from "./generateInsight"
import type {
  ExperienceInsight,
  RadarCategory,
  TodaySummary,
  WorldExperienceIndex,
} from "./types"

/** Qué variable del índice castiga cada categoría cuando aparece con alto impacto. */
const CATEGORY_TO_VARIABLE: Record<RadarCategory, keyof WorldExperienceIndex["variables"]> = {
  UX: "clarity",
  "High Traffic": "speed",
  Streaming: "continuity",
  Ticketing: "trust",
  Accessibility: "accessibility",
  "Mobile Experience": "continuity",
  AI: "trust",
  Trust: "trust",
  "Error Recovery": "errorRecovery",
  "Fan Experience": "fanEmotion",
}

const BASE = 88 // punto de partida optimista; cada riesgo lo reduce.

/**
 * Calcula el World Experience Index a partir de los insights del día.
 */
export function computeWorldIndex(insights: ExperienceInsight[]): WorldExperienceIndex {
  const variables: WorldExperienceIndex["variables"] = {
    clarity: BASE,
    speed: BASE,
    trust: BASE,
    accessibility: BASE,
    continuity: BASE,
    cognitiveLoad: BASE,
    fanEmotion: BASE,
    errorRecovery: BASE,
  }

  for (const insight of insights) {
    const variable = CATEGORY_TO_VARIABLE[insight.category]
    // Penalización proporcional al impacto del insight.
    const penalty = Math.round((insight.impactScore / 100) * 22)
    variables[variable] = Math.max(35, variables[variable] - penalty)
    // La alta demanda y los errores también elevan la carga cognitiva.
    if (insight.category === "High Traffic" || insight.category === "Error Recovery") {
      variables.cognitiveLoad = Math.max(35, variables.cognitiveLoad - Math.round(penalty / 2))
    }
  }

  const values = Object.values(variables)
  const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length)

  return { overall, variables }
}

/** Construye el resumen del panel "Hoy en experiencia". */
export function buildTodaySummary(
  insights: ExperienceInsight[],
  date = new Date().toISOString().slice(0, 10),
): TodaySummary {
  // Riesgos UX: hallazgos de alto impacto que exigen atención inmediata.
  const uxRisks = insights.filter((i) => i.impactScore >= 77).length
  // Oportunidades de mejora: el resto de hallazgos, accionables vía diseño.
  const opportunities = Math.max(0, insights.length - uxRisks)
  // Señales de comportamiento: categorías distintas detectadas hoy.
  const behaviorSignals = new Set(insights.map((i) => i.category)).size

  return {
    date,
    findings: insights.length,
    uxRisks,
    opportunities,
    behaviorSignals,
    impactLevel: aggregateImpactLevel(insights),
  }
}
