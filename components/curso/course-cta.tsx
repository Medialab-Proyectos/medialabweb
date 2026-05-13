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
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
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

          {/* Epic headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-[1.15] mb-6 font-display">
            El futuro no será de quienes generen más.
            <br />
            <span className="bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              Será de quienes sepan decidir mejor.
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-lg text-white/50 leading-relaxed mb-12">
            Únete a la primera cohorte de diseñadores, developers y creativos que aprenderán a
            construir con IA sin perder lo que los hace humanos.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#waitlist"
              className="group relative px-10 py-5 text-lg font-semibold text-white rounded-full transition-all duration-500 hover:scale-105 animate-pulse-glow"
              style={{ background: 'var(--magenta)' }}
            >
              <span className="relative z-10">Quiero aprender la metodología</span>
            </a>
          </div>

          {/* Extras */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Cohortes limitadas", detail: "Máx. 30 personas" },
              { label: "Comunidad privada", detail: "Acceso de por vida" },
              { label: "Workshops en vivo", detail: "8 semanas intensivas" },
              { label: "Certificación", detail: "Al completar el curso" },
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
