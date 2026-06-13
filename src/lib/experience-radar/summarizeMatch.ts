/**
 * Experience Radar — resumen por PARTIDO con IA.
 *
 * Redacta `quickSummary` (≤100 palabras) y `matchSummary` (~30 s de lectura) coherentes
 * a partir de las señales disponibles y del contexto de cada selección (Wikipedia/
 * WinSports). Pensado para casos con poca conversación (p. ej. Estados Unidos), donde el
 * texto plantilla queda vago.
 *
 * Cumplimiento (igual que aiAnalysis.ts):
 *  - Usa SOLO la evidencia entregada. No inventa marcadores, resultados ni estadísticas.
 *  - Enfoque de experiencia digital / comportamiento, no crónica deportiva.
 * Sin OPENAI_API_KEY o ante cualquier error devuelve null (el agente cae a su respaldo).
 */

import OpenAI from "openai"
import { z } from "zod"
import type { TeamContext } from "./fetchTeamContext"

const DEFAULT_MODEL = "gpt-5.4-mini"

const summarySchema = z.object({
  quickSummary: z.string().min(40).max(900).optional(),
  matchSummary: z.string().min(40).max(900).optional(),
})

export interface MatchSummaryInput {
  label: string
  teams: string[]
  event: string
  status: "previa" | "finalizado"
  hook: string
  category: string
  signals: Array<{ title: string; summary: string; source: string }>
  teamContext: TeamContext[]
}

function parseJsonObject(value: string): unknown {
  const start = value.indexOf("{")
  const end = value.lastIndexOf("}")
  if (start < 0 || end <= start) throw new Error("OpenAI did not return a JSON object")
  return JSON.parse(value.slice(start, end + 1))
}

export async function summarizeMatch(
  input: MatchSummaryInput,
): Promise<{ quickSummary?: string; matchSummary?: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return null
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL

  try {
    const client = new OpenAI({ apiKey })
    const response = await client.responses.create({
      model,
      instructions: [
        "Eres el redactor de Experience Radar de MediaLab.",
        "Escribe sobre experiencia digital, emoción y comportamiento de las hinchadas; NO narres una crónica deportiva.",
        "Usa exclusivamente la evidencia entregada (señales y contexto de las selecciones). No inventes marcadores, resultados, goles, estadísticas ni citas.",
        input.status === "previa"
          ? "Es una PREVIA: enfócate en la expectativa, la conversación y el ánimo con que llegan las hinchadas."
          : "El partido ya terminó: enfócate en cómo se vivió y qué dejó en la conversación, sin afirmar un marcador que no esté en la evidencia.",
        "Si hay poca señal, apóyate en el contexto de las selecciones para dar un texto coherente, siempre en clave de experiencia.",
        "Responde SOLO con un objeto JSON válido con estas claves de texto:",
        "quickSummary (<= 90 palabras) y matchSummary (<= 90 palabras). Español neutro, claro y específico.",
      ].join(" "),
      input: JSON.stringify(input),
    })

    const parsed = summarySchema.parse(parseJsonObject(response.output_text))
    if (!parsed.quickSummary && !parsed.matchSummary) return null
    return parsed
  } catch (error) {
    console.warn("Experience Radar match summary unavailable; using deterministic fallback.", error)
    return null
  }
}
