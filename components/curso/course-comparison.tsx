"use client"

import { motion } from "framer-motion"
import { X, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseComparison() {
  const { t } = useLanguage()

  const traditional = [
    t("Enseñan herramientas y pantallas bonitas", "They teach tools and pretty screens"),
    t("Prompts que caducan en semanas", "Prompts that expire in weeks"),
    t("No conectan UX con frontend/backend", "They don't connect UX with frontend/backend"),
    t("No reducen tiempos de validación", "They don't reduce validation time"),
    t("Crean dependencia técnica desde el inicio", "Create technical dependency from the start"),
    t("Entregables que generan retrabajo", "Deliverables that create rework"),
  ]

  const medialab = [
    t("Construyes productos más rápido", "You build products faster"),
    t("Llegas mejor preparado a desarrollo", "You arrive better prepared for dev"),
    t("Diseñas pensando en frontend y backend", "You design with frontend and backend in mind"),
    t("IA como copiloto, no como muleta", "AI as copilot, not a crutch"),
    t("Más personas pueden crear productos", "More people can create products"),
    t("Producto real en tu portafolio", "Real product in your portfolio"),
  ]

  return (
    <section id="diferencia" className="relative py-14 md:py-20 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display font-medium" style={{ color: 'var(--magenta)' }}>
            {t("Por qué esto es diferente", "Why this is different")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug font-display">
            {t("Ellos enseñan herramientas.", "They teach tools.")}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t(" Nosotros enseñamos a construir productos.", " We teach you to build products.")}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="curso-card-danger p-6 md:p-8 rounded-2xl border h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 dark:bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{t("Cursos tradicionales", "Traditional courses")}</h3>
              </div>
              <ul className="space-y-3">
                {traditional.map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-center gap-3">
                    <X className="w-3.5 h-3.5 text-red-500/70 dark:text-red-400/60 shrink-0" />
                    <span className="text-foreground/65 dark:text-foreground/50 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* MediaLab */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="curso-card-highlight p-6 md:p-8 rounded-2xl border h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[var(--cyan)]/15 flex items-center justify-center">
                  <Check className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{t("Metodología MediaLab", "MediaLab methodology")}</h3>
                  <p className="text-[11px]" style={{ color: 'var(--cyan)' }}>{t("Arquitecto de Experiencia de Usuario con IA", "AI User Experience Architect")}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {medialab.map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.06 }}
                    className="flex items-center gap-3">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--cyan)' }} />
                    <span className="text-foreground/80 dark:text-foreground/70 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
              {/* No replace dev badge */}
              <div className="mt-6 p-3 rounded-xl bg-[var(--cyan)]/10 dark:bg-[var(--cyan)]/[0.06] border border-[var(--cyan)]/20">
                <p className="text-xs text-foreground/70 dark:text-foreground/50">
                  <span className="font-semibold" style={{ color: 'var(--cyan)' }}>{t("No reemplaza desarrollo.", "Doesn't replace development.")}</span>{" "}
                  {t("Acelera decisiones antes de invertir en código.", "Accelerates decisions before investing in code.")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
