"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GraduationCap, BookOpen, Brain, Shield, HeartHandshake, Microscope, Layers, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseValidation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const items = [
    { icon: Shield, title: t("NO reemplaza desarrollo", "Does NOT replace development"), desc: t("Acelera decisiones antes de inversión técnica avanzada.", "Accelerates decisions before advanced technical investment.") },
    { icon: Layers, title: t("Frontera entre 7 disciplinas", "At the frontier of 7 disciplines"), desc: t("UX/UI · Product Design · AI Design · Product Thinking · Digital Architecture · UX Strategy · Human-Centered AI.", "UX/UI · Product Design · AI Design · Product Thinking · Digital Architecture · UX Strategy · Human-Centered AI.") },
    { icon: GraduationCap, title: t("Camino a validación universitaria", "Path to university validation"), desc: t("Certificación con peso académico real, no solo un PDF.", "Certification with real academic weight, not just a PDF.") },
    { icon: BookOpen, title: t("Desde la práctica, no la teoría", "From practice, not theory"), desc: t("Metodología nacida de 40+ proyectos reales.", "Methodology born from 40+ real projects.") },
    { icon: Microscope, title: t("Respaldada por datos", "Backed by data"), desc: t("Cada fase probada con equipos reales en múltiples industrias.", "Every phase tested with real teams across multiple industries.") },
    { icon: HeartHandshake, title: t("Personas primero", "People first"), desc: t("Reforzamos tu criterio humano, no lo sustituimos.", "We reinforce your human judgment, not replace it.") },
    { icon: Zap, title: t("IA con responsabilidad", "Responsible AI"), desc: t("Transparencia y ética en cada decisión de diseño.", "Transparency and ethics in every design decision.") },
    { icon: Brain, title: t("Lo que la IA no hace por ti", "What AI won't do for you"), desc: t("Evaluar, filtrar, decidir. Eso te hace irreemplazable.", "Evaluate, filter, decide. That makes you irreplaceable.") },
  ]

  return (
    <section className="relative py-20 md:py-28 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display font-medium" style={{ color: 'var(--cyan)' }}>
            {t("Por qué confiar", "Why trust this")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug font-display">
            {t("No es otro curso más.", "Not just another course.")}{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("Así lo respaldamos.", "This is how we back it up.")}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              >
                <div className="curso-card p-5 md:p-6 rounded-xl border transition-all duration-300 h-full">
                  <Icon className="w-5 h-5 mb-3 text-foreground/50" />
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-xs text-foreground/55 dark:text-foreground/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
