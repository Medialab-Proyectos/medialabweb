/**
 * Experience Radar — señales mock (fallback local).
 *
 * Estos datos son redacción propia de MediaLab a partir de señales públicas de
 * comportamiento digital durante eventos masivos. NO reproducen noticias completas
 * de terceros, no mencionan marcadores ni resultados, y no usan marcas/logos
 * oficiales. El foco es siempre la experiencia, no el deporte.
 *
 * Se usan cuando no hay fuentes externas conectadas (ver sources.ts).
 */

import type { Signal } from "./types"

const TODAY = "2026-06-11"

export const mockSignals: Signal[] = [
  {
    id: "sig-001",
    title: "Picos simultáneos de audiencia en plataformas de transmisión",
    summary:
      "Durante partidos de alta convocatoria, la audiencia ingresa de forma simultánea y satura el inicio de la transmisión.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "GLOBAL",
    tags: ["streaming", "alta demanda", "latencia", "espera"],
    rawCategory: "streaming",
    sourceConfidence: 0.9,
  },
  {
    id: "sig-002",
    title: "Filas virtuales en venta de entradas",
    summary:
      "La apertura de venta de boletería genera colas virtuales con tiempos de espera variables y mensajes poco claros.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "MX",
    tags: ["ticketing", "cola virtual", "ansiedad", "confianza"],
    rawCategory: "ticketing",
    sourceConfidence: 0.85,
  },
  {
    id: "sig-003",
    title: "Consumo mayoritario desde dispositivos móviles",
    summary:
      "El grueso del tráfico durante eventos en vivo llega desde móvil, con sesiones cortas e intermitentes.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "GLOBAL",
    tags: ["mobile", "sesiones cortas", "continuidad"],
    rawCategory: "mobile",
    sourceConfidence: 0.8,
  },
  {
    id: "sig-004",
    title: "Picos de búsqueda de información en tiempo real",
    summary:
      "Los usuarios buscan datos en vivo (alineaciones, horarios, estados) y abandonan si la información tarda o es ambigua.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "AR",
    tags: ["claridad", "tiempo real", "información", "alta demanda"],
    rawCategory: "ux",
    sourceConfidence: 0.75,
  },
  {
    id: "sig-005",
    title: "Subtitulado y accesibilidad en transmisiones en vivo",
    summary:
      "Aumenta el uso de subtítulos y lectura asistida; las fallas de accesibilidad excluyen a parte de la audiencia.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "GLOBAL",
    tags: ["accesibilidad", "subtítulos", "inclusión"],
    rawCategory: "accessibility",
    sourceConfidence: 0.7,
  },
  {
    id: "sig-006",
    title: "Errores de pago y recuperación durante picos",
    summary:
      "En momentos de máxima demanda aumentan los errores de pago; la recuperación poco clara erosiona la confianza.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "BR",
    tags: ["error recovery", "pagos", "confianza", "alta demanda"],
    rawCategory: "error",
    sourceConfidence: 0.82,
  },
  {
    id: "sig-007",
    title: "Notificaciones masivas y carga cognitiva",
    summary:
      "El volumen de notificaciones push durante eventos satura la atención del usuario y genera fatiga.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "GLOBAL",
    tags: ["fan experience", "notificaciones", "carga cognitiva"],
    rawCategory: "fan",
    sourceConfidence: 0.7,
  },
  {
    id: "sig-008",
    title: "Asistentes con IA para resolver dudas en vivo",
    summary:
      "Crece el uso de asistentes con IA para resolver dudas durante el evento; las respuestas imprecisas rompen la confianza.",
    sourceName: "Curaduría editorial MediaLab",
    sourceUrl: "https://medialab.design/experience-radar",
    publishedAt: TODAY,
    detectedAt: TODAY,
    country: "GLOBAL",
    tags: ["ia", "asistentes", "confianza", "tiempo real"],
    rawCategory: "ai",
    sourceConfidence: 0.72,
  },
]
