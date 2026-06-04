"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseTransformation() {
  const { t } = useLanguage()

  const pairs = [
    {
      before: { label: t("Abrumado", "Overwhelmed"), desc: t("15 herramientas nuevas al mes, ninguna dirección clara.", "15 new tools per month, no clear direction.") },
      after: { label: t("En control", "In control"), desc: t("Tú decides cuándo usar IA y cuándo confiar en tu criterio. Tu primer producto real en portafolio antes del módulo 5.", "You decide when to use AI and when to trust your judgment. Your first real product in your portfolio before module 5.") },
    },
    {
      before: { label: t("Desconectado", "Disconnected"), desc: t("Tus entregables generan retrabajo en desarrollo.", "Your deliverables create rework for dev.") },
      after: { label: t("Integrado", "Integrated"), desc: t("Diseño, negocio y desarrollo hablan el mismo idioma en tus entregables. Cero retrabajo en handoff.", "Design, business, and dev speak the same language in your deliverables. Zero rework at handoff.") },
    },
    {
      before: { label: t("Inseguro", "Unsure"), desc: t("No sabes si lo que genera la IA es bueno o solo rápido.", "You don't know if what AI generates is good or just fast.") },
      after: { label: t("Con criterio", "With judgment"), desc: t("Evalúas, filtras y decides con frameworks probados. La IA propone, tú dispones.", "You evaluate, filter, and decide with proven frameworks. AI proposes, you decide.") },
    },
    {
      before: { label: t("Dependiente", "Dependent"), desc: t("No puedes validar sin depender del equipo técnico.", "Can't validate without depending on the tech team.") },
      after: { label: t("Autónomo", "Autonomous"), desc: t("Validas con usuarios reales, construyes prototipos funcionales y llegas a desarrollo con todo resuelto.", "You validate with real users, build functional prototypes, and arrive at dev with everything resolved.") },
    },
  ]

  return (
    <section id="transformacion" className="relative py-14 md:py-20 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display font-medium" style={{ color: 'var(--cyan)' }}>
            {t("Tu transformación", "Your transformation")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug font-display">
            {t("Entras diseñando pantallas.", "You enter designing screens.")}{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("Sales diseñando productos.", "You leave designing products.")}
            </span>
          </h2>
        </motion.div>

        {/* Column headers — desktop only */}
        <div className="hidden md:grid grid-cols-[1fr_2rem_1fr] gap-4 mb-4">
          <p className="text-sm font-medium text-red-500 dark:text-red-400/80 tracking-wider uppercase font-display">{t("Antes", "Before")}</p>
          <div />
          <p className="text-sm font-medium tracking-wider uppercase font-display" style={{ color: 'var(--cyan)' }}>{t("Después", "After")}</p>
        </div>

        {/* Paired rows */}
        <div className="space-y-3">
          {pairs.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              className="grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 items-stretch"
            >
              {/* Before card */}
              <div className="curso-card-danger p-3 md:p-4 rounded-xl border flex flex-col justify-center min-h-[80px]">
                <p className="text-xs md:text-sm font-medium text-foreground/80 dark:text-foreground/70">{pair.before.label}</p>
                <p className="text-[10px] md:text-xs text-foreground/55 dark:text-foreground/35 mt-0.5">{pair.before.desc}</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: 'var(--cyan)', background: 'rgba(42,171,179,0.15)' }}
                >
                  <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" style={{ color: 'var(--cyan)' }} />
                </div>
              </div>

              {/* After card */}
              <div className="curso-card-highlight p-3 md:p-4 rounded-xl border flex flex-col justify-center min-h-[80px]">
                <p className="text-xs md:text-sm font-medium text-foreground">{pair.after.label}</p>
                <p className="text-[10px] md:text-xs text-foreground/55 dark:text-foreground/40 mt-0.5">{pair.after.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
