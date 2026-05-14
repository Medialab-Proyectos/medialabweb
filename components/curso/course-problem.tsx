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
    <section id="problema" className="relative py-24 md:py-32 bg-[var(--surface-dark)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/[0.02] rounded-full blur-[180px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section header — short */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-red-400/60 mb-3 font-display">
            Lo que nadie dice en voz alta
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug font-display">
            Si alguna te tocó, este curso existe por ti.
          </h2>
        </motion.div>

        {/* Cards grid — compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="group"
            >
              <div className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-red-500/[0.1] hover:bg-red-500/[0.02] transition-all duration-400 h-full flex flex-col">
                <span className="text-xl text-red-400/20 font-serif leading-none mb-2">&ldquo;</span>
                <p className="text-sm md:text-base text-white/65 leading-relaxed flex-1 group-hover:text-white/80 transition-colors duration-300">
                  {quote.text}
                </p>
                <p className="text-[11px] text-white/25 mt-3 pt-3 border-t border-white/[0.03]">{quote.context}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
