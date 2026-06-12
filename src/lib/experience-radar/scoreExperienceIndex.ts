import type { DailyRadarReport, ExperienceInsight, ExperienceSignalCategory } from "./types"

const CATEGORY_RISK: Record<ExperienceSignalCategory, number> = {
  UX: 8,
  IA: 7,
  Accesibilidad: 10,
  Streaming: 13,
  Ticketing: 12,
  "Fan Experience": 7,
  "Mobile Experience": 10,
  Trust: 12,
  "High Traffic": 14,
  "Error Recovery": 13,
}

export function scoreInsightImpact(category: ExperienceSignalCategory, evidenceCount: number): number {
  const base = 52 + CATEGORY_RISK[category] * 2
  const evidenceBoost = Math.min(12, evidenceCount * 3)
  return Math.min(100, Math.round(base + evidenceBoost))
}

export function scoreExperienceIndex(insights: ExperienceInsight[]): number {
  if (!insights.length) return 82
  const averageRisk = insights.reduce((sum, insight) => sum + insight.impactScore, 0) / insights.length
  const criticalCount = insights.filter((insight) => insight.impactScore >= 82).length
  const index = 100 - averageRisk * 0.38 - criticalCount * 2
  return Math.max(0, Math.min(100, Math.round(index)))
}

export function getReportRiskLevel(report: DailyRadarReport): "Bajo" | "Medio" | "Alto" | "Critico" {
  if (report.worldExperienceIndex < 55) return "Critico"
  if (report.worldExperienceIndex < 68) return "Alto"
  if (report.worldExperienceIndex < 80) return "Medio"
  return "Bajo"
}
