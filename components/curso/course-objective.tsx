"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Layers, Brain, ShieldCheck, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseObjective() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
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
    <section id="objetivo" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
          <p className="max-w-2xl mx-auto text-base md:text-lg text-foreground/55 leading-relaxed">
            {t(
              "Investigas un problema real. Diseñas la solución. Auditas cada pantalla. Pruebas con usuarios de verdad. Sales con un producto en portafolio, no con un certificado vacío.",
              "You research a real problem. Design the solution. Audit every screen. Test with real users. You leave with a product in your portfolio, not an empty certificate."
            )}
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative rounded-2xl bg-[var(--surface-dark)] border border-[var(--cyan)]/20 shadow-2xl overflow-hidden"
        >
          {/* Glows */}
          <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-[var(--cyan)]/[0.08] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-[var(--magenta)]/[0.06] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--cyan)]/40 to-transparent" />

          <div className="relative p-8 md:p-12">
            {/* Description */}
            <div className="text-center mb-8">
              <p className="text-base md:text-lg text-foreground/70 dark:text-white/80 leading-relaxed max-w-3xl mx-auto">
                {t(
                  "Diseñas, auditas y validas un producto digital real — desde la primera idea hasta pruebas con usuarios. No reemplaza desarrollo: lo que construyes aquí llega a ingeniería listo para implementar, con cero retrabajo.",
                  "You design, audit, and validate a real digital product — from the first idea to user testing. It doesn't replace development: what you build here arrives at engineering ready to implement, with zero rework."
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
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-foreground/[0.12] dark:border-white/[0.08] bg-foreground/[0.03] dark:bg-white/[0.03] hover:border-foreground/[0.22] dark:hover:border-white/[0.15] transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                    <span className="text-[11px] font-medium text-foreground/70 dark:text-white/70 text-center leading-tight">{pillar.label}</span>
                  </motion.div>
                )
              })}
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
                {t("Ver programa completo", "See full program")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
