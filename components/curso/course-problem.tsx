"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export function CourseProblem() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const quotes = [
    {
      text: t(
        "Mis clientes me piden que haga en 2 días lo que antes tomaba 2 semanas.",
        "My clients ask me to do in 2 days what used to take 2 weeks."
      ),
      context: t("Diseñador UI · 4 años exp.", "UI Designer · 4 yrs exp."),
    },
    {
      text: t(
        "Todos los proyectos de mi portafolio se ven iguales a los de ChatGPT.",
        "All the projects in my portfolio look the same as ChatGPT's."
      ),
      context: t("UX Designer · Agencia", "UX Designer · Agency"),
    },
    {
      text: t(
        "Aprendí 15 herramientas y sigo sin construir un producto real.",
        "I've learned 15 tools and still haven't built a real product."
      ),
      context: t("Freelancer UX/UI", "Freelance UX/UI"),
    },
    {
      text: t(
        "Genero más rápido, pero mis diseños se sienten vacíos.",
        "I generate faster, but my designs feel empty."
      ),
      context: t("Developer frontend", "Frontend developer"),
    },
    {
      text: t(
        "Me contrataron como diseñador, pero ahora soy el 'experto en IA'.",
        "They hired me as a designer, but now I'm the 'AI expert'."
      ),
      context: t("Product Designer · Startup", "Product Designer · Startup"),
    },
    {
      text: t(
        "Cada semana hay una herramienta nueva y nunca voy a alcanzar.",
        "Every week there's a new tool — I'll never catch up."
      ),
      context: t("Diseñador en transición", "Designer in transition"),
    },
  ]

  return (
    <section id="problema" className="relative py-16 md:py-20 bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/[0.02] rounded-full blur-[180px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section header — tighter, more emotional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-red-400/70 mb-3 font-display">
            {t("Honesto: nos pasó a todos", "Honest: it happened to all of us")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-foreground tracking-tight leading-tight font-display">
            {t("Si alguna de estas te suena,", "If any of these sounds familiar,")}
            <br className="hidden sm:inline"/>
            {t(" este curso es para ti.", " this course is for you.")}
          </h2>
        </motion.div>

        {/* Mobile: bare list */}
        <div className="sm:hidden divide-y divide-foreground/[0.08] border-y border-foreground/[0.08]">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.06 }}
              className="py-4 flex gap-3"
            >
              <span className="text-red-400/45 font-serif text-2xl leading-none shrink-0 mt-0.5" aria-hidden="true">&ldquo;</span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] text-foreground/85 leading-snug italic">
                  {quote.text}
                </p>
                <p className="text-[11px] text-foreground/45 mt-1.5">
                  — {quote.context}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="group"
            >
              <div className="p-4 md:p-5 rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] hover:border-red-500/25 hover:bg-red-500/[0.04] transition-all duration-400 h-full flex flex-col">
                <span className="text-xl text-red-400/35 font-serif leading-none mb-1.5">&ldquo;</span>
                <p className="text-[15px] text-foreground/80 leading-relaxed flex-1 group-hover:text-foreground transition-colors duration-300">
                  {quote.text}
                </p>
                <p className="text-[11px] text-foreground/40 mt-2.5 pt-2.5 border-t border-foreground/[0.06]">{quote.context}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
