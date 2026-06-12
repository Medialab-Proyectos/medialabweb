"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Send, RefreshCw, Gauge, TrendingUp, Heart, Activity, ShieldCheck, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const TEAL = "#2AABB3"
const ACCENT = "#E8751A"
const MAGENTA = "#D83A6F"

/** Banda de un valor 0–100 a etiqueta corta + color. */
function band(
  value: number,
  t: (es: string, en: string) => string,
  labels: { low: [string, string]; mid: [string, string]; high: [string, string] },
): { label: string; color: string } {
  if (value >= 67) return { label: t(...labels.high), color: MAGENTA }
  if (value >= 34) return { label: t(...labels.mid), color: ACCENT }
  return { label: t(...labels.low), color: TEAL }
}

/**
 * Bloque 5 — Simulador del aficionado. Tres preguntas rápidas (confianza, a quién
 * apoyas, qué esperas del próximo partido) y devuelve tres lecturas divertidas:
 * riesgo de sobreconfianza, nivel emocional y tendencia de comportamiento. No mide
 * UX ni recomienda apuestas; corre 100% en el cliente, sin recopilar datos. Bilingüe.
 */
export function FanSimulator() {
  const { t } = useLanguage()

  const [confidence, setConfidence] = useState(60) // qué tan confiado se siente
  const [team, setTeam] = useState("") // a qué selección apoya
  const [expectation, setExpectation] = useState(60) // qué espera del próximo partido
  const [submitted, setSubmitted] = useState(false)

  const sliders = [
    {
      id: "confidence",
      icon: Gauge,
      value: confidence,
      set: setConfidence,
      label: t("¿Qué tan confiado/a te sientes?", "How confident do you feel?"),
    },
    {
      id: "expectation",
      icon: TrendingUp,
      value: expectation,
      set: setExpectation,
      label: t("¿Qué esperas del próximo partido?", "What do you expect from the next match?"),
      lowHint: t("Cautela", "Caution"),
      highHint: t("Victoria segura", "Sure win"),
    },
  ]

  const result = useMemo(() => {
    // Riesgo de sobreconfianza: confianza alta + expectativa alta lo disparan.
    const overconfidence = Math.round(confidence * 0.6 + expectation * 0.4)
    // Nivel emocional: cuánto se aleja de la neutralidad (50) en ambos ejes.
    const emotional = Math.min(100, Math.round((Math.abs(confidence - 50) + Math.abs(expectation - 50)) * 1.3))
    // Tendencia de comportamiento: confianza − cautela.
    const behavior = Math.round((confidence + expectation) / 2)

    const supporter = team.trim()
    const overBand = band(overconfidence, t, {
      low: ["Bajo", "Low"],
      mid: ["Moderado", "Moderate"],
      high: ["Alto", "High"],
    })
    const emoBand = band(emotional, t, {
      low: ["Sereno", "Calm"],
      mid: ["Encendido", "Fired up"],
      high: ["A flor de piel", "Sky-high"],
    })
    const behaviorLabel =
      behavior >= 67
        ? t("Impulsivo: decides con el corazón en caliente", "Impulsive: you decide in the heat of the moment")
        : behavior >= 34
          ? t("Equilibrado: mezclas emoción y cabeza", "Balanced: you mix emotion and reason")
          : t("Reservado: esperas a ver antes de opinar", "Reserved: you wait and see before judging")

    const reading = supporter
      ? t(
          `Como hincha de ${supporter}, llegas al próximo partido con la confianza alta. Ojo: la euforia de la última jornada infla las probabilidades del siguiente rival.`,
          `As a ${supporter} fan, you arrive at the next match riding high on confidence. Careful: last round's euphoria inflates the odds you give the next opponent.`,
        )
      : t(
          "Llegas al próximo partido con la emoción por delante. La última jornada pesa más de lo que crees al estimar al siguiente rival.",
          "You arrive at the next match with emotion in the lead. The last round weighs more than you think when sizing up the next opponent.",
        )

    return {
      metrics: [
        {
          icon: Gauge,
          name: t("Riesgo de sobreconfianza", "Overconfidence risk"),
          value: overconfidence,
          band: overBand,
        },
        { icon: Heart, name: t("Nivel emocional", "Emotional level"), value: emotional, band: emoBand },
        {
          icon: Activity,
          name: t("Tendencia de comportamiento", "Behavior tendency"),
          value: behavior,
          band: { label: behaviorLabel, color: behavior >= 67 ? MAGENTA : behavior >= 34 ? ACCENT : TEAL },
        },
      ],
      reading,
    }
  }, [confidence, expectation, team, t])

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--cyan)]">
        <Sparkles size={14} /> {t("Simulador", "Simulator")}
      </div>
      <h3 className="mt-2 text-xl font-bold">{t("¿Cómo llegas al próximo partido?", "How do you arrive at the next match?")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(
          "Responde tres cosas y te devolvemos tu perfil de aficionado. Es solo por diversión: nada de apuestas.",
          "Answer three quick things and we'll hand you your fan profile. Just for fun — no betting.",
        )}
      </p>

      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="mt-6 space-y-5"
        >
          {/* Selección que apoya */}
          <div className="space-y-1.5">
            <label htmlFor="fan-team" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Heart size={13} className="text-[var(--magenta)]" /> {t("¿Qué selección apoyas?", "Which team do you support?")}
            </label>
            <input
              id="fan-team"
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              maxLength={40}
              placeholder={t("Tu selección…", "Your team…")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--cyan)]"
            />
          </div>

          {sliders.map((s) => (
            <div key={s.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`fan-${s.id}`} className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <s.icon size={13} className="text-[var(--cyan)]" /> {s.label}
                </label>
                <span className="font-bold tabular-nums text-[var(--cyan)]">{s.value}%</span>
              </div>
              <input
                id={`fan-${s.id}`}
                type="range"
                min={0}
                max={100}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-[var(--cyan)]"
              />
              {s.lowHint && (
                <div className="flex justify-between text-[10px] text-muted-foreground/70">
                  <span>{s.lowHint}</span>
                  <span>{s.highHint}</span>
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background transition-colors hover:bg-[var(--cyan)] hover:text-white"
          >
            <Send size={12} /> {t("Ver mi perfil de aficionado", "See my fan profile")}
          </button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 space-y-4 rounded-xl border border-border bg-muted/30 p-5"
        >
          <div className="space-y-4">
            {result.metrics.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-foreground/90">
                    <m.icon size={13} style={{ color: m.band.color }} /> {m.name}
                  </span>
                  <span className="font-semibold" style={{ color: m.band.color }}>
                    {m.band.label}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.band.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">{result.reading}</p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--cyan)] transition-colors hover:text-foreground"
          >
            <RefreshCw size={11} /> {t("Volver a simular", "Simulate again")}
          </button>
        </motion.div>
      )}

      {/* Aviso obligatorio: este simulador NO recomienda apuestas. */}
      <p className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-background/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--cyan)]" />
        {t(
          "Este simulador no recomienda apuestas. Ayuda a entender cómo la emoción y los sesgos afectan la forma en que vivimos un partido. Corre localmente en tu dispositivo; no se recopilan datos.",
          "This simulator does not recommend betting. It helps you understand how emotion and biases shape the way we experience a match. It runs locally on your device; no data is collected.",
        )}
      </p>
    </div>
  )
}
