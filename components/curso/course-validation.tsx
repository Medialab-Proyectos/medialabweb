"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GraduationCap, BookOpen, Brain, Shield, HeartHandshake, Microscope } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseValidation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const items = [
    { icon: GraduationCap, title: t("Camino a validación universitaria", "Path to university validation"), desc: t("Trabajamos con instituciones educativas para que tu certificación tenga peso académico real. No es solo un PDF bonito.", "We work with academic institutions so your certification has real academic weight. It's not just a pretty PDF.") },
    { icon: BookOpen, title: t("Creada desde la práctica, no desde la teoría", "Built from practice, not theory"), desc: t("Esta metodología nació de años de proyectos reales con 40+ empresas. No es un framework inventado para un curso.", "This methodology was born from years of real projects with 40+ companies. It's not a framework invented for a course.") },
    { icon: Microscope, title: t("Respaldada por datos reales", "Backed by real data"), desc: t("Cada fase fue probada y refinada con equipos reales en múltiples industrias. Sabemos qué funciona porque lo medimos.", "Every phase was tested and refined with real teams across multiple industries. We know what works because we measured it.") },
    { icon: HeartHandshake, title: t("Personas primero, siempre", "People first, always"), desc: t("La tecnología es la herramienta. Tú eres el diferencial. Cada módulo refuerza tu criterio humano, no lo sustituye.", "Technology is the tool. You are the difference. Every module reinforces your human judgment — it doesn't replace it.") },
    { icon: Shield, title: t("IA con responsabilidad", "Responsible AI"), desc: t("Aprendes a usar IA con transparencia y ética. Porque el impacto de lo que diseñas afecta a personas reales.", "You learn to use AI with transparency and ethics. Because the impact of what you design affects real people.") },
    { icon: Brain, title: t("Lo que la IA nunca podrá hacer por ti", "What AI will never do for you"), desc: t("Evaluar, filtrar, decidir. Ese es el skill que este curso desarrolla. Y es el que te hará irreemplazable.", "Evaluate, filter, decide. That's the skill this course develops. And it's what will make you irreplaceable.") },
  ]

  return (
    <section className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            {t("Por qué puedes confiar en esto", "Why you can trust this")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            {t("No es otro curso más.", "It's not just another course.")}{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("Y así es como lo respaldamos.", "And this is how we back it up.")}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
                <div className="p-6 md:p-8 rounded-2xl border border-foreground/[0.1] bg-foreground/[0.03] hover:border-[var(--cyan)]/[0.1] hover:bg-foreground/[0.03] transition-all duration-500 h-full">
                  <Icon className="w-6 h-6 mb-4" style={{ color: 'var(--cyan)', opacity: 0.6 }} />
                  <h3 className="text-lg font-semibold text-[var(--surface-dark-fg)] mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
