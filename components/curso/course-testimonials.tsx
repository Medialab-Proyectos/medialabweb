"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  { text: "Volví a sentirme relevante. Ahora entiendo dónde encajo en este nuevo mundo y por qué mis habilidades importan más que nunca.", name: "Camila Restrepo", role: "UX Designer · 6 años exp." },
  { text: "Dejé de copiar prompts y empecé a construir sistemas. La diferencia entre usar IA y pensar con IA es abismal.", name: "Andrés Mejía", role: "Product Designer · Startup" },
  { text: "La IA dejó de darme miedo. Ahora la uso como copiloto, no como amenaza. Sé exactamente cuándo confiar y cuándo decidir yo.", name: "Laura Vásquez", role: "UI Designer · Freelancer" },
  { text: "Ahora tengo estructura. Antes saltaba entre herramientas sin dirección. El framework 90-10 cambió completamente mi proceso.", name: "Diego Torres", role: "Developer · Frontend Lead" },
  { text: "Aprendí a pensar diferente. No es sobre qué herramienta usar, es sobre qué preguntas hacer. Eso fue transformador.", name: "Valentina Ruiz", role: "Diseñadora de Producto · Agencia" },
  { text: "Mis clientes notan la diferencia. Entrego más rápido, pero con más profundidad. Dejé de competir por precio y empecé a competir por valor.", name: "Santiago López", role: "Freelancer UX/UI · B2B" },
]

export function CourseTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="testimonios" className="relative py-20 md:py-28 bg-[var(--surface-dark)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--magenta)]/[0.02] rounded-full blur-[200px]" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--magenta)' }}>
            Testimonios
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            Lo que dicen quienes ya tomaron el paso.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
              <div className="relative p-6 md:p-8 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-[var(--magenta)]/[0.1] hover:bg-white/[0.03] transition-all duration-500 h-full flex flex-col">
                <Quote className="w-5 h-5 mb-4" style={{ color: 'var(--magenta)', opacity: 0.3 }} />
                <p className="text-base text-white/70 leading-relaxed mb-6 flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--magenta)]/10"
                    style={{ background: 'linear-gradient(135deg, var(--magenta), var(--cyan))', opacity: 0.15 }}>
                    <span className="text-sm font-semibold" style={{ color: 'var(--magenta)' }}>{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--surface-dark-fg)]">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
