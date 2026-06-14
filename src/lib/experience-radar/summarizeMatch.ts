/**
 * Experience Radar — resumen por PARTIDO con IA.
 *
 * Redacta `quickSummary` (≤90 palabras) y `matchSummary` (~30 s de lectura) coherentes a
 * partir de las señales disponibles y del contexto de cada selección (Wikipedia/WinSports).
 *
 * Motor: OpenAI (`OPENAI_MODEL`, por defecto `gpt-5.4-mini`) — el mismo que usa el resto
 * del agente. Sin `OPENAI_API_KEY` o ante cualquier error devuelve null y el agente usa su
 * respaldo determinista.
 *
 * Cumplimiento: usa SOLO la evidencia entregada. No inventa marcadores, resultados ni
 * estadísticas. Enfoque de experiencia digital y comportamiento del hincha, no crónica.
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

/** Instrucciones: marco de experiencia + economía conductual + reacción real del fan. */
function instructions(input: MatchSummaryInput): string {
  return [
    "Eres el redactor de Experience Radar de MediaLab.",
    "Escribe sobre experiencia digital, emoción y comportamiento de las hinchadas; NO narres una crónica deportiva.",
    "Usa exclusivamente la evidencia entregada (señales y contexto de las selecciones). No inventes marcadores, resultados, goles, estadísticas ni citas.",
    input.status === "previa"
      ? "Es una PREVIA: enfócate en la expectativa, la conversación y el ánimo con que llegan las hinchadas."
      : "El partido ya terminó: enfócate en QUÉ sintió cada hinchada DURANTE el partido y POR QUÉ, y en cómo cambió su reacción en redes ANTES vs DESPUÉS, sin afirmar un marcador que no esté en la evidencia.",
    "El sentimiento del fan mueve todo: cuando la evidencia lo permita, observa la polémica, los chistes y memes, el cambio de canal o de medio (por dónde se vio y por dónde se siguió), la fricción de interacción y las señales de molestia o rechazo de plataformas.",
    "Distingue ganar de perder: si una hinchada vivió una goleada en contra, su ánimo es de tristeza/frustración, no de euforia. Sé fiel a lo que realmente sintieron.",
    "Léelo como economía conductual aplicada al fan: en quién confía, qué sesgos aparecen y cómo eso cambia su comportamiento y uso de medios digitales.",
    "Si hay poca señal, apóyate en el contexto de las selecciones para dar un texto coherente, siempre en clave de experiencia.",
    "Responde SOLO con un objeto JSON válido con dos claves de texto: quickSummary (<= 90 palabras) y matchSummary (<= 90 palabras). Español neutro, claro y específico.",
  ].join(" ")
}

function parseJsonObject(value: string): unknown {
  const start = value.indexOf("{")
  const end = value.lastIndexOf("}")
  if (start < 0 || end <= start) throw new Error("model did not return a JSON object")
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
      instructions: instructions(input),
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
