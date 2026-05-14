"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function CourseCta() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="reservar" className="relative py-24 md:py-32 bg-[var(--surface-dark)] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[var(--magenta)]/[0.04] rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--cyan)]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--magenta)]/20 bg-[var(--magenta)]/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--magenta)' }} />
              <span className="text-xs tracking-[0.15em] uppercase font-medium" style={{ color: 'var(--magenta)' }}>
                Cohorte 01 — Acceso limitado
              </span>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-[1.15] mb-6 font-display">
            La IA no va a esperar a que estés listo.
            <br />
            <span className="bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              Pero puedes elegir estar preparado.
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-lg text-white/50 leading-relaxed mb-10">
            30 cupos. 8 semanas. Una metodología que transforma cómo trabajas con IA — para siempre.
          </p>

          {/* Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-10">
            <div className="inline-flex flex-col items-center gap-2 p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-baseline gap-3">
                <span className="text-white/30 line-through text-lg">$1,500 USD</span>
                <span className="text-4xl md:text-5xl font-bold font-display" style={{ color: 'var(--cyan)' }}>$1,000</span>
                <span className="text-white/40 text-sm">USD</span>
              </div>
              <p className="text-xs text-white/30">Precio de lanzamiento · Primera cohorte</p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#waitlist"
              className="px-10 py-4 text-base font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
              style={{ background: 'var(--magenta)' }}
            >
              Registrarme al curso →
            </a>
            <a
              href="#contacto"
              className="px-8 py-4 text-base font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
              style={{ background: 'var(--cyan)' }}
            >
              Hablar con un asesor
            </a>
          </div>

          {/* Extras */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Solo 30 personas", detail: "Feedback real, no masivo" },
              { label: "Comunidad de por vida", detail: "Acceso permanente" },
              { label: "Proyecto real", detail: "Sales con portfolio piece" },
              { label: "Certificación", detail: "Reconocimiento profesional" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] text-center">
                <p className="text-sm font-medium text-[var(--surface-dark-fg)] mb-0.5">{item.label}</p>
                <p className="text-xs text-white/40">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
