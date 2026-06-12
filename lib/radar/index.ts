/**
 * Experience Radar — punto de entrada del módulo.
 *
 * Módulo aislado y autocontenido. Para revertir toda la sección basta con eliminar
 * la carpeta lib/radar/, la carpeta components/experience-radar/, app/experience-radar/
 * y app/api/experience-radar/ — nada del resto del sitio depende de aquí.
 *
 * Pipeline: fetchSignals → classifySignal → generateInsight → scoreInsight
 *           → computeWorldIndex / buildTodaySummary.
 */

export * from "./types"
export * from "./sources"
export { mockSignals } from "./mockSignals"
export { classifySignal } from "./classifySignal"
export {
  scoreInsight,
  impactLevelFromScore,
  statusFromScore,
  type ScoreFactors,
} from "./scoreInsight"
export {
  generateInsight,
  generateInsights,
  aggregateImpactLevel,
} from "./generateInsight"
export { fetchSignals, type FetchOptions } from "./fetchSignals"
export { computeWorldIndex, buildTodaySummary } from "./worldIndex"

import { fetchSignals, type FetchOptions } from "./fetchSignals"
import { generateInsights } from "./generateInsight"
import { buildTodaySummary, computeWorldIndex } from "./worldIndex"
import type { ExperienceInsight, RadarRunResult } from "./types"

/**
 * Ejecuta el pipeline completo del radar y devuelve el resultado del día.
 *
 * Modo seguro: el resultado vuelve como borrador sin revisar (reviewState "draft",
 * reviewed false). La IA puede generar hallazgos, pero no se publican como
 * definitivos sin revisión humana.
 */
export async function runRadar(opts: FetchOptions = {}): Promise<RadarRunResult> {
  const signals = await fetchSignals(opts)
  const insights: ExperienceInsight[] = generateInsights(signals)
  const index = computeWorldIndex(insights)
  const today = buildTodaySummary(insights)

  return {
    generatedAt: new Date().toISOString(),
    reviewState: "draft",
    reviewed: false,
    count: insights.length,
    insights,
    index,
    today,
  }
}

/**
 * Versión síncrona para renderizado en cliente/SSR a partir de los datos mock.
 * No hace I/O: ideal para la página estática mientras no haya backend conectado.
 */
import { mockSignals } from "./mockSignals"
export function getMockRadar(): RadarRunResult {
  const insights = generateInsights(mockSignals)
  return {
    generatedAt: new Date().toISOString(),
    reviewState: "draft",
    reviewed: false,
    count: insights.length,
    insights,
    index: computeWorldIndex(insights),
    today: buildTodaySummary(insights, "2026-06-11"),
  }
}
