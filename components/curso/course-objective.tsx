"use client"

import { motion } from "framer-motion"
import { Layers, Brain, ShieldCheck, TrendingUp, BookOpen } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseObjective() {
  const { t } = useLanguage()

  const pillars = [
    {
      icon: Layers,
      label: t("UX/UI Estratégico", "Strategic UX/UI"),
      color: "var(--cyan)",
    },
    {
      icon: Brain,
      label: t("Análisis Conductual", "Behavioral Analysis"),
      color: "var(--magenta)",
    },
    {
      icon: ShieldCheck,
      label: t("Validación Continua", "Continuous Validation"),
      color: "var(--cyan)",
    },
    {
      icon: TrendingUp,
      label: t("Producto para Mercado", "Market-Ready Product"),
      color: "var(--magenta)",
    },
  ]

  return (
    <section id="objetivo" className="relative py-14 md:py-20 bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display font-medium" style={{ color: "var(--cyan)" }}>
            {t("Objetivo del curso", "Course objective")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4 font-display">
            {t("Arquitecto de Experiencia", "Experience Architect")}
            <br />
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("de Usuario con IA", "with AI")}
            </span>
          </h2>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="course-band relative rounded-2xl bg-[var(--surface-dark)] bg-gradient-to-br from-[var(--cyan)]/[0.10] via-transparent to-[#7c3aed]/[0.12] border border-[var(--cyan)]/20 shadow-xl overflow-hidden"
        >
          {/* Subtle brand glows */}
          <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-[var(--cyan)]/[0.08] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-[#7c3aed]/[0.08] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--cyan)]/40 to-transparent" />

          <div className="relative p-8 md:p-12">
            {/* Description */}
            <div className="text-center mb-8">
              <p className="text-base md:text-lg text-foreground/70 dark:text-white/80 leading-relaxed max-w-3xl mx-auto">
                {t(
                  "Diseñas, auditas y validas un producto digital real — desde la primera idea hasta pruebas con usuarios. Lo que construyes aquí llega a ingeniería listo para implementar, con cero retrabajo.",
                  "You design, audit, and validate a real digital product — from the first idea to user testing. What you build here arrives at engineering ready to implement, with zero rework."
                )}
              </p>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-xl border shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${pillar.color} 12%, transparent)`,
                      borderColor: `color-mix(in srgb, ${pillar.color} 38%, transparent)`,
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-full"
                      style={{ backgroundColor: `color-mix(in srgb, ${pillar.color} 18%, transparent)` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </span>
                    <span className="text-xs font-semibold text-foreground/80 dark:text-white/85 text-center leading-tight">{pillar.label}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* Role pills */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar snap-x snap-mandatory sm:flex-wrap sm:justify-center sm:overflow-visible">
              <span className="shrink-0 text-[10px] tracking-[0.12em] uppercase text-foreground/55 dark:text-white/65 font-medium mr-1">{t("Sales como:", "You become:")}</span>
              <span className="shrink-0 snap-start px-3 py-1 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.1] text-[11px] font-semibold" style={{ color: 'var(--cyan)' }}>
                {t("Arquitecto UX con IA", "AI UX Architect")}
              </span>
              <span className="shrink-0 snap-start px-3 py-1 rounded-full border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.1] text-[11px] font-semibold" style={{ color: 'var(--magenta)' }}>
                UX Prompt Designer
              </span>
              <span className="shrink-0 snap-start px-3 py-1 rounded-full border border-foreground/20 dark:border-white/20 bg-foreground/[0.04] dark:bg-white/[0.06] text-[11px] font-semibold text-foreground/70 dark:text-white/70">
                {t("Estratega de Producto", "Product Strategist")}
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#registro"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_8px_28px_-6px_rgba(232,117,26,0.6)]"
                style={{ background: "var(--magenta)" }}
              >
                {t("Inscribirme ahora →", "Enroll now →")}
              </a>
              <a
                href="#programa"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-[var(--cyan)]/40 text-[var(--cyan)] hover:bg-[var(--cyan)]/10"
              >
                <BookOpen size={16} />
                {t("Ver programa completo", "See full program")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
