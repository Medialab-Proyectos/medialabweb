/**
 * Experience Radar — scoring de impacto.
 *
 * scoreInsight() calcula un score de 0 a 100 a partir de cinco factores:
 *  - reach        Alcance estimado de la señal.
 *  - severity     Severidad de la fricción para el usuario.
 *  - relevance    Relevancia para la experiencia digital.
 *  - novelty      Nivel de novedad del hallazgo.
 *  - confidence   Confianza de la fuente.
 *
 * Todos los factores se expresan de 0 a 1. La salida es un entero 0–100.
 */

import type { ImpactLevel, InsightStatus } from "./types"

export interface ScoreFactors {
  /** Alcance estimado 0–1. */
  reach: number
  /** Severidad de la fricción 0–1. */
  severity: number
  /** Relevancia para experiencia digital 0–1. */
  relevance: number
  /** Novedad 0–1. */
  novelty: number
  /** Confianza de la fuente 0–1. */
  confidence: number
}

/** Pesos relativos de cada factor (suman 1). */
const WEIGHTS: Record<keyof ScoreFactors, number> = {
  reach: 0.25,
  severity: 0.3,
  relevance: 0.25,
  novelty: 0.1,
  confidence: 0.1,
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Calcula el score de impacto de 0 a 100. */
export function scoreInsight(factors: ScoreFactors): number {
  const total =
    clamp01(factors.reach) * WEIGHTS.reach +
    clamp01(factors.severity) * WEIGHTS.severity +
    clamp01(factors.relevance) * WEIGHTS.relevance +
    clamp01(factors.novelty) * WEIGHTS.novelty +
    clamp01(factors.confidence) * WEIGHTS.confidence

  return Math.round(total * 100)
}

/** Traduce un score 0–100 a un nivel de impacto legible. */
export function impactLevelFromScore(score: number): ImpactLevel {
  if (score >= 85) return "Crítico"
  if (score >= 65) return "Alto"
  if (score >= 40) return "Medio"
  return "Bajo"
}

/** Deriva el estado de relevancia de la card a partir del score. */
export function statusFromScore(score: number): InsightStatus {
  if (score >= 85) return "critical"
  if (score >= 65) return "relevant"
  if (score >= 40) return "watching"
  return "new"
}
