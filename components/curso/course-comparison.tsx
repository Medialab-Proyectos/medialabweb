"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { X, Check } from "lucide-react"

const traditional = [
  "Te enseñan qué botones apretar",
  "Te dan plantillas de prompts que caducan en semanas",
  "Te muestran outputs impresionantes sin contexto",
  "Te venden productividad sin propósito",
  "Copias y pegas sin entender por qué funciona",
  "Terminas más rápido, pero sin más valor",
]

const medialab = [
  "Aprendes a decidir qué vale la pena construir",
  "Desarrollas frameworks de pensamiento que no caducan",
  "Construyes productos reales con impacto medible",
  "Validas con usuarios antes de enamorarte de una idea",
  "Integras IA en tu proceso sin perder tu identidad",
  "Diseñas sistemas escalables, no pantallas sueltas",
  "Sales con un proyecto en tu portafolio que demuestra todo",
]

export function CourseComparison() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="diferencia" className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--magenta)' }}>
            Por qué esto es diferente
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug font-display">
            La mayoría de cursos de IA te enseñan herramientas. Nosotros te enseñamos a pensar.
          </h2>
          <p className="text-sm md:text-base text-white/40 mt-4 max-w-xl mx-auto">La diferencia entre saber usar una herramienta y saber qué construir con ella.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 md:p-10 rounded-2xl border border-red-500/[0.08] bg-red-500/[0.02] h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--surface-dark-fg)]">Cursos tradicionales</h3>
                  <p className="text-xs text-white/40">Lo que encuentras en todos lados</p>
                </div>
              </div>
              <ul className="space-y-4">
                {traditional.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <X className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                    <span className="text-white/50 text-sm md:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 p-4 rounded-xl bg-red-500/[0.04] border border-red-500/[0.06]">
                <p className="text-sm text-white/40 italic">
                  &ldquo;Sabía usar 10 herramientas de IA. Pero no sabía cuándo ni por qué elegir ninguna.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* MediaLab */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[var(--cyan)]/20 via-[var(--cyan)]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative p-8 md:p-10 rounded-2xl border border-[var(--cyan)]/[0.12] bg-[var(--cyan)]/[0.02] h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--cyan)]/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[var(--cyan)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--surface-dark-fg)]">Metodología MediaLab</h3>
                  <p className="text-xs" style={{ color: 'var(--cyan)' }}>Lo que realmente necesitas</p>
                </div>
              </div>
              <ul className="space-y-4">
                {medialab.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--cyan)' }} />
                    <span className="text-white/80 text-sm md:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
