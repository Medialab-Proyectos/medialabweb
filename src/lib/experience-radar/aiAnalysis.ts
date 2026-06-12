import OpenAI from "openai"
import { z } from "zod"
import type { DailyRadarReport } from "./types"

const DEFAULT_MODEL = "gpt-5.4-mini"

const analysisSchema = z.object({
  findingOfTheDay: z.string().min(20).max(700).optional(),
  executiveSummary: z.string().min(20).max(1200).optional(),
  medialabInsight: z.string().min(20).max(1000).optional(),
  productDesignApplication: z.string().min(20).max(1000).optional(),
  aiSummary: z.string().min(20).max(1000).optional(),
  risks: z.array(z.string().min(8).max(400)).max(5).optional(),
  opportunities: z.array(z.string().min(8).max(400)).max(5).optional(),
  recommendations: z.array(z.string().min(8).max(400)).max(5).optional(),
})

function parseJsonObject(value: string): unknown {
  const start = value.indexOf("{")
  const end = value.lastIndexOf("}")
  if (start < 0 || end <= start) throw new Error("OpenAI did not return a JSON object")
  return JSON.parse(value.slice(start, end + 1))
}

function compactReport(report: DailyRadarReport) {
  return {
    date: report.date,
    editorialSignals: report.editorialSignals,
    currentFinding: report.findingOfTheDay,
    topInsights: report.topInsights.slice(0, 6).map((insight) => ({
      category: insight.category,
      title: insight.title,
      insight: insight.insight,
      risk: insight.risk,
      opportunity: insight.opportunity,
      recommendation: insight.recommendation,
    })),
    signals: report.signals.slice(0, 20).map((signal) => ({
      source: signal.sourceName,
      title: signal.title,
      summary: signal.summary.slice(0, 500),
      teams: signal.teams,
      tags: signal.tags,
      classifications: signal.classifications,
      sentiment: signal.sentiment,
      repeatedComplaints: signal.repeatedComplaints?.slice(0, 4),
      frequentQuestions: signal.frequentQuestions?.slice(0, 4),
    })),
  }
}

export async function enrichDailyRadarReportWithAI(
  report: DailyRadarReport,
): Promise<DailyRadarReport> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL
  if (!apiKey) {
    return {
      ...report,
      aiAnalysis: {
        status: "skipped",
        model,
        reason: "missing_openai_api_key",
      },
    }
  }

  try {
    const client = new OpenAI({ apiKey })
    const response = await client.responses.create({
      model,
      instructions: [
        "Eres el analista de Experience Radar de MediaLab.",
        "Analiza experiencia digital, UX, comportamiento, producto e IA; no hagas apuestas ni pronosticos deportivos.",
        "Usa exclusivamente la evidencia entregada. No inventes marcadores, resultados, estadisticas, citas ni hechos.",
        "Prioriza hallazgos accionables para productos digitales de alta demanda.",
        "Responde solo con un objeto JSON valido con estas claves opcionales:",
        "findingOfTheDay, executiveSummary, medialabInsight, productDesignApplication, aiSummary, risks, opportunities, recommendations.",
        "risks, opportunities y recommendations deben ser arreglos de textos breves.",
      ].join(" "),
      input: JSON.stringify(compactReport(report)),
    })

    const analysis = analysisSchema.parse(parseJsonObject(response.output_text))
    const risks = analysis.risks?.length ? analysis.risks : report.risks
    const opportunities = analysis.opportunities?.length
      ? analysis.opportunities
      : report.opportunities
    const recommendations = analysis.recommendations?.length
      ? analysis.recommendations
      : report.recommendations
    const finding = analysis.findingOfTheDay || report.findingOfTheDay

    return {
      ...report,
      aiAnalysis: {
        status: "used",
        model,
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      findingOfTheDay: finding,
      risks,
      opportunities,
      recommendations,
      article: {
        ...report.article,
        medialabInsight: analysis.medialabInsight || report.article.medialabInsight,
        productDesignApplication:
          analysis.productDesignApplication || report.article.productDesignApplication,
        aiSummary: analysis.aiSummary || report.article.aiSummary,
      },
      note: {
        ...report.note,
        executiveSummary: analysis.executiveSummary || report.note.executiveSummary,
        mainFinding: finding,
        detectedRisks: risks,
        designOpportunities: opportunities,
        productRecommendations: recommendations,
      },
    }
  } catch (error) {
    console.warn("Experience Radar AI analysis unavailable; using deterministic report.", error)
    const status = typeof error === "object" && error && "status" in error
      ? String(error.status)
      : "unknown"
    return {
      ...report,
      aiAnalysis: {
        status: "fallback",
        model,
        reason: `openai_error_${status}`,
      },
    }
  }
}
