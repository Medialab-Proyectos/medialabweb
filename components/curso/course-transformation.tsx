"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"

const before = [
  { label: "Lento", desc: "Procesos manuales interminables" },
  { label: "Saturado", desc: "Demasiadas herramientas, poco criterio" },
  { label: "Confundido", desc: "Sin saber qué aprender primero" },
  { label: "Genérico", desc: "Diseños que se ven iguales a todos" },
  { label: "Reemplazable", desc: "Miedo constante al futuro" },
]

const after = [
  { label: "Estratégico", desc: "Cada decisión tiene propósito" },
  { label: "Rápido con criterio", desc: "Velocidad + profundidad" },
  { label: "Relevante", desc: "Habilidades a prueba de futuro" },
  { label: "Diferencial", desc: "Tu firma humana amplificada" },
  { label: "AI-Native", desc: "La IA como extensión natural" },
]

export function CourseTransformation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="transformacion" className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            Transformación
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug font-display">
            De donde estás, <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">a donde podrías estar.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-start">
          {/* Before */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="text-center md:text-left mb-6">
              <span className="text-sm font-medium text-red-400/80 tracking-wider uppercase font-display">Antes</span>
            </div>
            <div className="space-y-3">
              {before.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.08 }}
                  className="p-4 rounded-xl border border-red-500/[0.06] bg-red-500/[0.02]">
                  <p className="text-base font-medium text-white/70">{item.label}</p>
                  <p className="text-sm text-white/30">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-12">
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.5, duration: 0.5 }}
              className="w-12 h-12 rounded-full border flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--cyan), var(--magenta))', opacity: 0.2, borderColor: 'var(--cyan)' }}>
              <ArrowRight className="w-5 h-5" style={{ color: 'var(--cyan)' }} />
            </motion.div>
          </div>
          <div className="flex md:hidden items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
              className="w-10 h-10 rounded-full border flex items-center justify-center rotate-90"
              style={{ borderColor: 'var(--cyan)', background: 'var(--cyan)', opacity: 0.15 }}>
              <ArrowRight className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
            </motion.div>
          </div>

          {/* After */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }}>
            <div className="text-center md:text-left mb-6">
              <span className="text-sm font-medium tracking-wider uppercase font-display" style={{ color: 'var(--cyan)' }}>Después</span>
            </div>
            <div className="space-y-3">
              {after.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + i * 0.08 }}
                  className="p-4 rounded-xl border border-[var(--cyan)]/[0.08] bg-[var(--cyan)]/[0.02]">
                  <p className="text-base font-medium text-[var(--surface-dark-fg)]">{item.label}</p>
                  <p className="text-sm text-white/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
