/**
 * Cronograma REAL de las fases del motor UXBox.
 *
 * Cada fase tarda un tiempo real (en minutos) según las etiquetas de la
 * línea de tiempo. La fase "lista" de una etapa = suma de duraciones de
 * todas las etapas anteriores + la suya. El cliente calcula la etapa activa
 * a partir de `startedAt` (madura entre visitas), y el servidor usa el mismo
 * cronograma para programar los correos de fin de fase con QStash.
 *
 * Este módulo NO importa nada de servidor: es seguro en cliente y servidor.
 */

export type Lang = "es" | "en"

export interface PhaseLab {
  idea?: string
  signals?: string[]
  projectName?: string
  references?: string
  objective?: string
  audience?: string
  brief?: string
  prototype?: string
}

export interface PhaseDef {
  /** identificador estable de la fase */
  key: string
  /** minutos que tarda ESTA fase */
  durationMin: number
  /** si la fase dispara correo al lead y/o notificación al admin */
  email: "lead" | "lead+admin" | "none"
}

/**
 * Duraciones tomadas de las etiquetas de la línea de tiempo:
 * Idea ~10min · Mercado ~2h · Competidores ~3h · Oportunidades ~2h ·
 * Blueprint ~10min · Listos (~5min tras el blueprint para separar el correo final).
 */
const REAL_PHASES: PhaseDef[] = [
  { key: "idea", durationMin: 10, email: "lead" },
  { key: "market", durationMin: 120, email: "lead" },
  { key: "competitors", durationMin: 180, email: "lead" },
  { key: "opportunities", durationMin: 120, email: "lead" },
  { key: "blueprint", durationMin: 10, email: "lead" },
  { key: "ready", durationMin: 5, email: "lead+admin" },
]

/**
 * Modo prueba: si `NEXT_PUBLIC_UXBOX_FAST` es un número > 0, cada fase dura ese
 * número de minutos (p. ej. "1" = 1 min por fase → 6 correos en ~6 min).
 * Vacío/0 = tiempos reales. La var debe estar en build (cliente) y runtime (server).
 */
const FAST_MIN = Number(process.env.NEXT_PUBLIC_UXBOX_FAST)
const FAST = Number.isFinite(FAST_MIN) && FAST_MIN > 0

export const PHASES: PhaseDef[] = FAST
  ? REAL_PHASES.map((p) => ({ ...p, durationMin: FAST_MIN }))
  : REAL_PHASES

export const STAGE_COUNT = PHASES.length

/** Minutos acumulados hasta COMPLETAR la etapa `stage` (incluida). */
export function cumulativeMinutes(stage: number): number {
  let total = 0
  for (let i = 0; i <= stage && i < PHASES.length; i += 1) total += PHASES[i].durationMin
  return total
}

/** Milisegundos desde `startedAt` hasta completar la etapa `stage`. */
export function stageReadyAt(startedAt: number, stage: number): number {
  return startedAt + cumulativeMinutes(stage) * 60 * 1000
}

/**
 * Índice de la última etapa COMPLETADA según el tiempo transcurrido.
 * Devuelve -1 si todavía no se completa ninguna.
 */
export function doneStageByElapsed(startedAt: number, now: number): number {
  let done = -1
  for (let i = 0; i < PHASES.length; i += 1) {
    if (now >= stageReadyAt(startedAt, i)) done = i
    else break
  }
  return done
}

/* ── Contenido del correo por fase (bilingüe) ── */

export interface PhaseEmailCopy {
  subject: string
  heading: string
  /** párrafos/insights del cuerpo */
  lines: string[]
  /** muestra el bloque "agenda con un humano" + brief (fase final) */
  finale?: boolean
}

const pick = (lang: Lang, es: string, en: string) => (lang === "en" ? en : es)

/**
 * Devuelve el contenido del correo para la etapa, personalizado con los datos
 * del lab. Devuelve null si la etapa no envía correo al lead.
 */
export function phaseEmailCopy(stage: number, lab: PhaseLab, lang: Lang): PhaseEmailCopy | null {
  const def = PHASES[stage]
  if (!def || def.email === "none") return null

  const name = lab.projectName?.trim() || pick(lang, "tu proyecto", "your project")
  const signals = (lab.signals || []).filter(Boolean)
  const primary = signals[0] || pick(lang, "tu categoría", "your category")
  const signalList = signals.length ? signals.join(", ") : primary

  switch (def.key) {
    case "idea":
      return {
        subject: pick(lang, `Tu análisis arrancó — ${name}`, `Your analysis has started — ${name}`),
        heading: pick(lang, "Encendí el motor", "I ignited the engine"),
        lines: [
          pick(lang,
            `Acabo de capturar y estructurar tu idea para <strong>${name}</strong>. A partir de ahora trabajo en segundo plano: no necesitas dejar la página abierta.`,
            `I just captured and structured your idea for <strong>${name}</strong>. From now on I work in the background: you don't need to keep the page open.`),
          pick(lang,
            `Te avisaré por correo a medida que cada fase del análisis quede lista.`,
            `I'll email you as each phase of the analysis is completed.`),
        ],
      }
    case "market":
      return {
        subject: pick(lang, `Mercado detectado — ${name}`, `Market detected — ${name}`),
        heading: pick(lang, "Detecté tu mercado", "I detected your market"),
        lines: [
          pick(lang,
            `Tu idea encaja con señales claras de <strong>${signalList}</strong>. Hay una tendencia creciente que juega a tu favor.`,
            `Your idea fits clear signals of <strong>${signalList}</strong>. There's a growing trend working in your favor.`),
          pick(lang,
            `Ya estoy mapeando a los competidores del espacio ${primary} para encontrar los huecos.`,
            `I'm now mapping the competitors in the ${primary} space to find the gaps.`),
        ],
      }
    case "competitors":
      return {
        subject: pick(lang, `Competidores mapeados — ${name}`, `Competitors mapped — ${name}`),
        heading: pick(lang, "Mapeé a tus competidores", "I mapped your competitors"),
        lines: [
          pick(lang,
            `Revisé a los jugadores principales en ${primary} y encontré un hueco claro en la experiencia de onboarding.`,
            `I reviewed the main players in ${primary} and found a clear gap in the onboarding experience.`),
          pick(lang,
            `Con esto puedo definir por dónde diferenciarte. Sigo con las oportunidades de UX.`,
            `With this I can pinpoint where to differentiate you. Moving on to the UX opportunities.`),
        ],
      }
    case "opportunities":
      return {
        subject: pick(lang, `Oportunidades de UX listas — ${name}`, `UX opportunities ready — ${name}`),
        heading: pick(lang, "Encontré tus oportunidades", "I found your opportunities"),
        lines: [
          pick(lang,
            `Detecté ángulos de diferenciación por experiencia: el módulo de mayor impacto es automatizar el primer flujo de valor.`,
            `I detected differentiation angles through experience: the highest-impact module is automating the first value flow.`),
          pick(lang,
            `Estoy ensamblando tu blueprint de producto. Falta poco.`,
            `I'm assembling your product blueprint. Almost there.`),
        ],
      }
    case "blueprint":
      return {
        subject: pick(lang, `Tu blueprint está listo — ${name}`, `Your blueprint is ready — ${name}`),
        heading: pick(lang, "Tu blueprint está listo", "Your blueprint is ready"),
        lines: [
          pick(lang,
            `Terminé la definición de producto de <strong>${name}</strong>: problema validable, usuario y contexto, prioridades y el siguiente experimento.`,
            `I finished the product definition for <strong>${name}</strong>: validatable problem, user and context, priorities, and the next experiment.`),
          ...(lab.brief ? [lab.brief.split("\n\n").filter(Boolean)[0]] : []),
        ],
      }
    case "ready":
      return {
        subject: pick(lang, `Tu análisis está listo — ${name}`, `Your analysis is ready — ${name}`),
        heading: pick(lang, "Tu análisis está listo", "Your analysis is ready"),
        lines: [
          pick(lang,
            `Terminé el análisis completo de <strong>${name}</strong>. El siguiente paso es humano, te contactaremos a este correo, pero si no quieres esperar, agenda una llamada.`,
            `I finished the full analysis for <strong>${name}</strong>. The next step is human — we'll contact you at this email, but if you don't want to wait, book a call.`),
        ],
        finale: true,
      }
    default:
      return null
  }
}
