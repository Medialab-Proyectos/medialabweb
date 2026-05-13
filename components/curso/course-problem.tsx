"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const quotes = [
  { text: "Siento que me estoy quedando atrás.", context: "Diseñador UI · 4 años de experiencia" },
  { text: "Todo se está viendo igual.", context: "UX Designer en agencia" },
  { text: "Ahora esperan que haga el trabajo de 5 personas.", context: "Product Designer en startup" },
  { text: "Aprendí prompts… pero sigo sin saber construir productos.", context: "Freelancer UX/UI" },
  { text: "La IA me hizo más rápido, pero no mejor.", context: "Developer frontend" },
  { text: "Ya no sé qué habilidades sobrevivirán.", context: "Diseñador gráfico en transición" },
]

export function CourseProblem() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="problema" className="relative py-24 md:py-32 bg-[var(--surface-dark)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/[0.02] rounded-full blur-[180px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section intro — intimate, not shouting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-red-400/60 mb-3 font-display">
            El problema real
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug font-display mb-4">
            Nadie lo dice en voz alta.
            <span className="text-white/30 block mt-1">Pero todos lo sienten.</span>
          </h2>
          <p className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed">
            Hablamos con diseñadores, UX/UI y developers cada semana. Estas son las frases que más escuchamos — probablemente te identifiques con alguna.
          </p>
        </motion.div>

        {/* Emotional quotes — stacked, intimate, not grid */}
        <div className="space-y-3">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="group"
            >
              <div className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.03] bg-white/[0.015] hover:border-red-500/[0.08] hover:bg-red-500/[0.015] transition-all duration-400">
                {/* Quote mark */}
                <span className="text-xl text-red-400/20 font-serif leading-none mt-0.5 shrink-0">&ldquo;</span>
                <div className="flex-1">
                  <p className="text-base md:text-lg text-white/70 font-light leading-relaxed group-hover:text-white/85 transition-colors duration-300">
                    {quote.text}
                  </p>
                  <p className="text-xs text-white/25 mt-2">{quote.context}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition statement — bridges to solution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-14 pt-8 border-t border-white/[0.04]"
        >
          <p className="text-sm md:text-base text-white/35 max-w-lg">
            El problema no es la IA. <span className="text-[var(--surface-dark-fg)] font-medium">El problema es no saber qué hacer con lo que genera.</span>
          </p>
          <p className="text-xs text-white/20 mt-3">
            Por eso diseñamos una metodología que resuelve exactamente esto ↓
          </p>
        </motion.div>
      </div>
    </section>
  )
}
