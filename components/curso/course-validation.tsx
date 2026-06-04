"use client"

import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Brain, Shield, HeartHandshake, Microscope, Layers, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseValidation() {
  const { t } = useLanguage()

  const items = [
    {
      icon: Shield,
      title: t("NO reemplaza desarrollo", "Does NOT replace development"),
      desc: t("Acelera decisiones antes de inversión técnica avanzada.", "Accelerates decisions before advanced technical investment."),
    },
    {
      icon: Layers,
      title: t("Frontera entre 7 disciplinas", "At the frontier of 7 disciplines"),
      desc: t("UX/UI · Product Design · AI Design · Product Thinking · Digital Architecture · UX Strategy · Human-Centered AI.", "UX/UI · Product Design · AI Design · Product Thinking · Digital Architecture · UX Strategy · Human-Centered AI."),
    },
    {
      icon: GraduationCap,
      title: t("Camino a validación universitaria", "Path to university validation"),
      desc: t("Certificación con peso académico real, no solo un PDF.", "Certification with real academic weight, not just a PDF."),
    },
    {
      icon: BookOpen,
      title: t("Desde la práctica, no la teoría", "From practice, not theory"),
      desc: t("Metodología nacida de 40+ proyectos reales.", "Methodology born from 40+ real projects."),
    },
    {
      icon: Microscope,
      title: t("Respaldada por datos", "Backed by data"),
      desc: t("Cada fase probada con equipos reales en múltiples industrias.", "Every phase tested with real teams across multiple industries."),
    },
    {
      icon: HeartHandshake,
      title: t("Personas primero", "People first"),
      desc: t("Reforzamos tu criterio humano, no lo sustituimos.", "We reinforce your human judgment, not replace it."),
    },
    {
      icon: Zap,
      title: t("IA con responsabilidad", "Responsible AI"),
      desc: t("Transparencia y ética en cada decisión de diseño.", "Transparency and ethics in every design decision."),
    },
    {
      icon: Brain,
      title: t("Lo que la IA no hace por ti", "What AI won't do for you"),
      desc: t("Evaluar, filtrar, decidir. Eso te hace irreemplazable.", "Evaluate, filter, decide. That makes you irreplaceable."),
    },
  ]

  return (
    <section className="relative py-14 md:py-20 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display font-medium" style={{ color: "var(--cyan)" }}>
            {t("Por qué confiar", "Why trust this")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug font-display">
            {t("No es otro curso más.", "Not just another course.")}{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("Así lo respaldamos.", "This is how we back it up.")}
            </span>
          </h2>
        </motion.div>

        {/* Cards — carousel on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                className="flex-shrink-0 w-[75%] sm:w-auto snap-center"
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

        {/* Title for bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 mb-5 text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight font-display">
            {t("Y lo más importante", "And most importantly")}
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="curso-card p-6 rounded-2xl border">
            <HeartHandshake className="w-5 h-5 mb-4 text-[var(--cyan)]" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("Mentoría y feedback visibles", "Visible mentorship and feedback")}
            </h3>
            <p className="text-sm text-foreground/55 dark:text-foreground/45 leading-relaxed">
              {t(
                "Trabajas sobre tu propio producto y recibes revisión de estrategia, arquitectura UX, handoff y narrativa de portafolio. No es una clase pasiva: cada semana debe dejar una decisión mejor tomada.",
                "You work on your own product and receive review on strategy, UX architecture, handoff, and portfolio narrative. It is not a passive class: every week should leave you with a better decision made."
              )}
            </p>
          </div>
          <div className="curso-card p-6 rounded-2xl border">
            <Shield className="w-5 h-5 mb-4 text-[var(--magenta)]" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("Expectativas honestas", "Honest expectations")}
            </h3>
            <p className="text-sm text-foreground/55 dark:text-foreground/45 leading-relaxed">
              {t(
                "No prometemos empleo automático ni magia de prompts. Prometemos un producto defendible, un proceso visible y criterio para explicar por qué diseñaste lo que diseñaste.",
                "We do not promise automatic employment or prompt magic. We promise a defensible product, a visible process, and judgment to explain why you designed what you designed."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
