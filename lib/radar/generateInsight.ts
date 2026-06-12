/**
 * Experience Radar — generación de insights.
 *
 * Convierte una Signal en un ExperienceInsight: "de la noticia al insight".
 * No describe el marcador ni el resultado deportivo; traduce la señal en
 * aprendizajes de experiencia digital, riesgos de usuario y oportunidades de diseño.
 *
 * Estrategia de IA (placeholder):
 *  - Si existe process.env.OPENAI_API_KEY → TODO: enriquecer la redacción con el SDK
 *    de OpenAI (ya está en dependencias). Ver generateInsightWithAI() más abajo.
 *  - Si NO existe → se usan reglas locales deterministas (esta función). Sin costo,
 *    sin llamadas externas, reproducible.
 *
 * Modo seguro: todo insight nace en reviewState "draft" y reviewed=false. La IA
 * puede proponer hallazgos, pero NO se publican como definitivos sin revisión humana.
 */

import { classifySignal } from "./classifySignal"
import {
  impactLevelFromScore,
  scoreInsight,
  statusFromScore,
  type ScoreFactors,
} from "./scoreInsight"
import type {
  ExperienceInsight,
  InsightRecommendations,
  RadarCategory,
  Signal,
} from "./types"

/** Plantilla editorial por categoría (reglas locales). */
interface CategoryPlaybook {
  uxInsight: string
  userRisk: string
  designOpportunity: string
  recommendations: InsightRecommendations
  /** Factores base de scoring para la categoría (0–1). */
  factors: Omit<ScoreFactors, "confidence">
}

const PLAYBOOK: Record<RadarCategory, CategoryPlaybook> = {
  Streaming: {
    uxInsight:
      "Cuando la audiencia entra de forma simultánea, la experiencia depende menos del diseño visual y más de la arquitectura de espera, los mensajes de estado y la recuperación de errores.",
    userRisk: "Frustración, abandono y pérdida de confianza.",
    designOpportunity:
      "Diseñar estados de carga, colas transparentes, mensajes claros y continuidad entre dispositivos.",
    recommendations: {
      designer: "Revisar estados vacíos, loading, error y confirmación.",
      research: "Detectar puntos de ansiedad del usuario durante eventos en vivo.",
      product: "Priorizar la experiencia de espera por encima de features secundarias.",
      tech: "Precargar contenido y monitorear latencia bajo carga concurrente.",
      business: "Proteger la confianza: un mal arranque cuesta retención futura.",
    },
    factors: { reach: 0.95, severity: 0.8, relevance: 0.9, novelty: 0.4 },
  },
  Ticketing: {
    uxInsight:
      "En picos de demanda la fila virtual define la percepción de justicia: la espera tolerable es la que el usuario entiende y puede confiar.",
    userRisk: "Ansiedad, abandono de compra y percepción de trato injusto.",
    designOpportunity:
      "Comunicar posición y tiempo estimado, evitar reinicios de fila y dar continuidad clara hasta el pago.",
    recommendations: {
      designer: "Diseñar la cola con feedback de progreso y expectativas realistas.",
      research: "Mapear el punto exacto donde el usuario duda o abandona.",
      product: "Definir reglas de equidad y comunicarlas en la interfaz.",
      tech: "Sostener la sesión y el lugar en cola ante reintentos.",
      business: "Una compra perdida por fricción es ingreso y confianza perdidos.",
    },
    factors: { reach: 0.7, severity: 0.85, relevance: 0.8, novelty: 0.5 },
  },
  Accessibility: {
    uxInsight:
      "En eventos masivos la accesibilidad deja de ser un extra: subtítulos, contraste y lectura asistida determinan quién puede participar.",
    userRisk: "Exclusión de parte de la audiencia y daño reputacional.",
    designOpportunity:
      "Garantizar subtítulos sincronizados, navegación por teclado y compatibilidad con lectores de pantalla.",
    recommendations: {
      designer: "Verificar contraste, foco visible y jerarquía para lectores de pantalla.",
      research: "Incluir usuarios con discapacidad en las pruebas en vivo.",
      product: "Tratar la accesibilidad como requisito, no como mejora opcional.",
      tech: "Validar ARIA, subtítulos y rendimiento en tecnologías asistivas.",
      business: "Ampliar la audiencia alcanzable y reducir riesgo legal.",
    },
    factors: { reach: 0.6, severity: 0.7, relevance: 0.85, novelty: 0.55 },
  },
  "Error Recovery": {
    uxInsight:
      "Bajo carga, los errores son inevitables; lo que define la experiencia es cómo el sistema los explica y ayuda a recuperarse.",
    userRisk: "Pérdida de confianza, transacciones abandonadas y soporte saturado.",
    designOpportunity:
      "Diseñar mensajes de error accionables, reintentos seguros y rutas de recuperación claras.",
    recommendations: {
      designer: "Escribir mensajes de error que digan qué pasó y qué hacer ahora.",
      research: "Detectar dónde el error se vuelve abandono definitivo.",
      product: "Definir SLAs de recuperación visibles para el usuario.",
      tech: "Implementar reintentos idempotentes y degradación elegante.",
      business: "La recuperación bien diseñada preserva ingresos y reputación.",
    },
    factors: { reach: 0.75, severity: 0.9, relevance: 0.85, novelty: 0.45 },
  },
  "Mobile Experience": {
    uxInsight:
      "El consumo en vivo es mayoritariamente móvil y fragmentado: la experiencia debe sobrevivir a sesiones cortas, redes inestables y cambios de dispositivo.",
    userRisk: "Pérdida de contexto, recargas frustrantes y abandono.",
    designOpportunity:
      "Optimizar para móvil primero, preservar estado y permitir continuidad entre dispositivos.",
    recommendations: {
      designer: "Diseñar para el pulgar, con objetivos táctiles y carga progresiva.",
      research: "Observar el uso real en condiciones de red adversas.",
      product: "Priorizar el camino móvil crítico antes que el escritorio.",
      tech: "Optimizar peso, caché y reconexión ante red intermitente.",
      business: "El móvil es el canal principal: ahí se gana o se pierde la sesión.",
    },
    factors: { reach: 0.9, severity: 0.6, relevance: 0.8, novelty: 0.4 },
  },
  AI: {
    uxInsight:
      "Los asistentes con IA en tiempo real ayudan solo si son precisos y transparentes: una respuesta confiada pero errónea daña más que la ausencia de respuesta.",
    userRisk: "Desinformación, decisiones equivocadas y erosión de confianza.",
    designOpportunity:
      "Mostrar fuentes y nivel de certeza, permitir corrección y separar dato de opinión.",
    recommendations: {
      designer: "Diseñar estados de incertidumbre y citas de fuente visibles.",
      research: "Medir cuándo el usuario confía de más en la IA.",
      product: "Definir límites claros de lo que el asistente puede afirmar.",
      tech: "Anclar respuestas a datos verificados y registrar trazabilidad.",
      business: "La confianza en la IA es un activo frágil: protégelo con diseño.",
    },
    factors: { reach: 0.7, severity: 0.7, relevance: 0.9, novelty: 0.8 },
  },
  Trust: {
    uxInsight:
      "En eventos de alto tráfico la confianza se gana en los detalles: claridad de estado, seguridad percibida y coherencia entre lo prometido y lo entregado.",
    userRisk: "Desconfianza, abandono y daño de marca difícil de revertir.",
    designOpportunity:
      "Reforzar señales de seguridad, confirmaciones claras y coherencia en toda la jornada.",
    recommendations: {
      designer: "Hacer visibles las señales de seguridad y confirmación.",
      research: "Identificar los momentos donde el usuario duda de la plataforma.",
      product: "Alinear expectativas y entrega en cada paso.",
      tech: "Garantizar consistencia de estado entre servicios.",
      business: "La confianza es el multiplicador de la conversión sostenida.",
    },
    factors: { reach: 0.65, severity: 0.75, relevance: 0.85, novelty: 0.5 },
  },
  "High Traffic": {
    uxInsight:
      "El alto tráfico convierte a la experiencia en un problema de arquitectura: velocidad, claridad y continuidad entre dispositivos importan más que la estética.",
    userRisk: "Caídas percibidas, esperas opacas y abandono masivo.",
    designOpportunity:
      "Diseñar para la espera y la degradación: prioridad de contenido, mensajes de estado y caché.",
    recommendations: {
      designer: "Definir qué se muestra primero cuando el sistema está saturado.",
      research: "Detectar el umbral de espera que dispara el abandono.",
      product: "Planear la experiencia de pico como un escenario de primera clase.",
      tech: "Probar bajo carga real y monitorear latencia en vivo.",
      business: "El pico es la vitrina: ahí se mide la marca a gran escala.",
    },
    factors: { reach: 1, severity: 0.8, relevance: 0.9, novelty: 0.45 },
  },
  "Fan Experience": {
    uxInsight:
      "El volumen de notificaciones y estímulos durante el evento eleva la carga cognitiva: más mensajes no es más cercanía, es más fatiga.",
    userRisk: "Saturación, silenciamiento de notificaciones y desconexión.",
    designOpportunity:
      "Priorizar y agrupar notificaciones, permitir control granular y respetar la atención.",
    recommendations: {
      designer: "Diseñar jerarquía y control de notificaciones centrado en el usuario.",
      research: "Medir el punto donde la notificación pasa de útil a molesta.",
      product: "Definir una política de frecuencia basada en valor real.",
      tech: "Segmentar envíos y respetar preferencias en tiempo real.",
      business: "La atención del fan es finita: gastarla mal cuesta engagement.",
    },
    factors: { reach: 0.8, severity: 0.55, relevance: 0.75, novelty: 0.5 },
  },
  UX: {
    uxInsight:
      "Cuando todos buscan información en tiempo real, la claridad y la velocidad de respuesta pesan más que cualquier adorno visual.",
    userRisk: "Confusión, búsquedas fallidas y abandono inmediato.",
    designOpportunity:
      "Priorizar la información crítica, reducir pasos y dar respuestas inmediatas y legibles.",
    recommendations: {
      designer: "Simplificar la jerarquía y exponer primero el dato más buscado.",
      research: "Identificar qué información busca el usuario y por qué falla.",
      product: "Recortar el camino al dato clave durante el evento.",
      tech: "Servir datos en vivo con baja latencia y caché inteligente.",
      business: "La claridad reduce soporte y multiplica la retención.",
    },
    factors: { reach: 0.85, severity: 0.65, relevance: 0.85, novelty: 0.4 },
  },
}

/**
 * Títulos editoriales por señal conocida (mock). Permite copy pulido sin perder
 * el comportamiento general por categoría para señales nuevas.
 */
const TITLE_OVERRIDES: Record<string, string> = {
  "sig-001": "Alta demanda en plataformas de transmisión",
  "sig-002": "Filas virtuales y percepción de justicia en ticketing",
  "sig-003": "Móvil como canal dominante en vivo",
  "sig-004": "Búsqueda de información en tiempo real",
  "sig-005": "Accesibilidad en transmisiones masivas",
  "sig-006": "Recuperación ante errores de pago en picos",
  "sig-007": "Saturación de notificaciones y carga cognitiva",
  "sig-008": "Asistentes con IA y confianza en vivo",
}

/**
 * Convierte una señal en un insight de experiencia mediante reglas locales.
 * Determinista y sin llamadas externas.
 */
export function generateInsight(signal: Signal): ExperienceInsight {
  const category = classifySignal(signal)
  const play = PLAYBOOK[category]

  const factors: ScoreFactors = {
    ...play.factors,
    confidence: signal.sourceConfidence ?? 0.6,
  }
  const impactScore = scoreInsight(factors)
  const confidenceScore = Math.round((signal.sourceConfidence ?? 0.6) * 100)

  return {
    id: `ins-${signal.id}`,
    signalId: signal.id,
    title: TITLE_OVERRIDES[signal.id] ?? signal.title,
    category,
    eventSummary: signal.summary,
    uxInsight: play.uxInsight,
    userRisk: play.userRisk,
    designOpportunity: play.designOpportunity,
    recommendations: play.recommendations,
    impactScore,
    confidenceScore,
    status: statusFromScore(impactScore),
    // Modo seguro: nunca se publica sin revisión humana.
    reviewState: "draft",
    reviewed: false,
    sourceName: signal.sourceName,
    sourceUrl: signal.sourceUrl,
    country: signal.country,
    createdAt: signal.detectedAt,
  }
}

/** Genera insights para una lista de señales. */
export function generateInsights(signals: Signal[]): ExperienceInsight[] {
  return signals.map(generateInsight)
}

/** Nivel de impacto agregado de un conjunto de insights. */
export function aggregateImpactLevel(insights: ExperienceInsight[]) {
  if (insights.length === 0) return impactLevelFromScore(0)
  const avg =
    insights.reduce((acc, i) => acc + i.impactScore, 0) / insights.length
  return impactLevelFromScore(Math.round(avg))
}

/**
 * TODO (integración futura de IA):
 * Si process.env.OPENAI_API_KEY está definido, enriquecer la redacción del insight
 * con el SDK de OpenAI (ya presente en package.json). El resultado SIEMPRE debe
 * volver con reviewState "draft" y reviewed=false para conservar el modo seguro.
 *
 * export async function generateInsightWithAI(signal: Signal): Promise<ExperienceInsight> {
 *   const base = generateInsight(signal)
 *   if (!process.env.OPENAI_API_KEY) return base
 *   // const client = new OpenAI()
 *   // const completion = await client.chat.completions.create({ ... })
 *   // return { ...base, uxInsight: ..., reviewState: "draft", reviewed: false }
 *   return base
 * }
 */
