"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { X, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseComparison() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const { t } = useLanguage()

  const traditional = [
    t("Te enseñan qué botones apretar", "They teach you which buttons to press"),
    t(
      "Te dan plantillas de prompts que caducan en semanas",
      "They give you prompt templates that expire in weeks"
    ),
    t(
      "Te muestran outputs impresionantes sin contexto",
      "They show you impressive outputs without context"
    ),
    t("Te venden productividad sin propósito", "They sell you productivity without purpose"),
    t(
      "Copias y pegas sin entender por qué funciona",
      "You copy and paste without understanding why it works"
    ),
    t("Terminas más rápido, pero sin más valor", "You finish faster but with no more value"),
  ]

  const medialab = [
    t(
      "Aprendes a decidir qué vale la pena construir",
      "You learn to decide what's worth building"
    ),
    t(
      "Desarrollas frameworks de pensamiento que no caducan",
      "You develop thinking frameworks that don't expire"
    ),
    t(
      "Construyes productos reales con impacto medible",
      "You build real products with measurable impact"
    ),
    t(
      "Validas con usuarios antes de enamorarte de una idea",
      "You validate with users before falling in love with an idea"
    ),
    t(
      "Integras IA en tu proceso sin perder tu identidad",
      "You integrate AI into your process without losing your identity"
    ),
    t(
      "Diseñas sistemas escalables, no pantallas sueltas",
      "You design scalable systems, not isolated screens"
    ),
    t(
      "Sales con un proyecto en tu portafolio que demuestra todo",
      "You leave with a portfolio project that proves it all"
    ),
  ]

  return (
    <section id="diferencia" className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--magenta)' }}>
            {t("Por qué esto es diferente", "Why this is different")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug font-display">
            {t(
              "La mayoría de cursos de IA te enseñan herramientas. Nosotros te enseñamos a pensar.",
              "Most AI courses teach you tools. We teach you to think."
            )}
          </h2>
          <p className="text-sm md:text-base text-foreground/40 mt-4 max-w-xl mx-auto">
            {t(
              "La diferencia entre saber usar una herramienta y saber qué construir con ella.",
              "The difference between knowing how to use a tool and knowing what to build with it."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 md:p-10 rounded-2xl border border-red-500/[0.08] bg-red-500/[0.02] h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--surface-dark-fg)]">{t("Cursos tradicionales", "Traditional courses")}</h3>
                  <p className="text-xs text-foreground/40">{t("Lo que encuentras en todos lados", "What you find everywhere")}</p>
                </div>
              </div>
              <ul className="space-y-4">
                {traditional.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <X className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                    <span className="text-foreground/50 text-sm md:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 p-4 rounded-xl bg-red-500/[0.04] border border-red-500/[0.06]">
                <p className="text-sm text-foreground/40 italic">
                  &ldquo;{t(
                    "Sabía usar 10 herramientas de IA. Pero no sabía cuándo ni por qué elegir ninguna.",
                    "I knew how to use 10 AI tools. But I didn't know when or why to choose any of them."
                  )}&rdquo;
                </p>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-red-500/[0.03] border border-red-500/[0.04]">
                <p className="text-[11px] uppercase tracking-wider text-red-400/50 mb-1 font-medium">{t("El costo de no actuar", "The cost of not acting")}</p>
                <p className="text-sm text-foreground/45">
                  {t(
                    "Cada mes que pasa, más profesionales dominan IA con criterio. La brecha entre quienes saben usar IA y quienes saben pensar con IA se agranda.",
                    "Every month that passes, more professionals master AI with judgment. The gap between those who can use AI and those who can think with AI grows wider."
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* MediaLab */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[var(--cyan)]/20 via-[var(--cyan)]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative p-8 md:p-10 rounded-2xl border border-[var(--cyan)]/[0.12] bg-[var(--cyan)]/[0.02] h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--cyan)]/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[var(--cyan)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--surface-dark-fg)]">{t("Metodología MediaLab", "MediaLab methodology")}</h3>
                  <p className="text-xs" style={{ color: 'var(--cyan)' }}>{t("Lo que realmente necesitas", "What you actually need")}</p>
                </div>
              </div>
              <ul className="space-y-4">
                {medialab.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--cyan)' }} />
                    <span className="text-foreground/80 text-sm md:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
