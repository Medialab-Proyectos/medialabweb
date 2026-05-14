"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const quotes = [
  { text: "Mis clientes me piden que haga en 2 días lo que antes tomaba 2 semanas.", context: "Diseñador UI · 4 años exp." },
  { text: "Todos los proyectos de mi portafolio se ven iguales a los de ChatGPT.", context: "UX Designer · Agencia" },
  { text: "Aprendí 15 herramientas y sigo sin construir un producto real.", context: "Freelancer UX/UI" },
  { text: "Genero más rápido, pero mis diseños se sienten vacíos.", context: "Developer frontend" },
  { text: "Me contrataron como diseñador, pero ahora soy el 'experto en IA'.", context: "Product Designer · Startup" },
  { text: "Cada semana hay una herramienta nueva y nunca voy a alcanzar.", context: "Diseñador en transición" },
]

export function CourseProblem() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="problema" className="relative py-16 md:py-20 bg-[var(--surface-dark)] overflow-hidden">
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
            Honesto: nos pasó a todos
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-[var(--surface-dark-fg)] tracking-tight leading-tight font-display">
            Si alguna de estas te suena,<br className="hidden sm:inline"/> este curso es para ti.
          </h2>
        </motion.div>

        {/* Cards grid — compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="group"
            >
              <div className="p-4 md:p-5 rounded-xl border border-[var(--surface-dark-fg)]/[0.08] bg-[var(--surface-dark-fg)]/[0.03] hover:border-red-500/25 hover:bg-red-500/[0.04] transition-all duration-400 h-full flex flex-col">
                <span className="text-xl text-red-400/35 font-serif leading-none mb-1.5">&ldquo;</span>
                <p className="text-sm md:text-[15px] text-[var(--surface-dark-fg)]/80 leading-relaxed flex-1 group-hover:text-[var(--surface-dark-fg)] transition-colors duration-300">
                  {quote.text}
                </p>
                <p className="text-[11px] text-[var(--surface-dark-fg)]/40 mt-2.5 pt-2.5 border-t border-[var(--surface-dark-fg)]/[0.06]">{quote.context}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
