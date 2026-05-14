"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Briefcase, Award, MessageCircle } from "lucide-react"
import { CourseRegisterForm } from "./course-register-form"

export function CourseCta() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="registro" className="relative py-24 md:py-32 bg-[var(--surface-dark)] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[var(--magenta)]/[0.04] rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--cyan)]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
          {/* Left — CTA content */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-[1.15] mb-6 font-display">
              La IA no va a esperar a que estés listo.
              <br />
              <span className="bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
                Pero puedes elegir estar preparado.
              </span>
            </h2>

            <p className="max-w-xl text-lg text-foreground/50 leading-relaxed mb-8">
              30 cupos. 8 semanas. Al terminar, eres un <span className="text-[var(--cyan)] font-medium">Behavioral AI Experience Designer</span> y <span className="text-[var(--magenta)] font-medium">UX Prompt Designer</span>.
            </p>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-foreground/30 line-through text-lg">$1,500</span>
              <span className="text-4xl md:text-5xl font-bold font-display" style={{ color: 'var(--cyan)' }}>$995</span>
              <span className="text-foreground/40 text-sm">USD</span>
            </div>
            <p className="text-xs text-foreground/30 mb-8">Precio de lanzamiento · Garantía de devolución la primera semana</p>

            {/* WhatsApp link */}
            <a
              href="https://wa.me/573054009505?text=Hola%2C%20quiero%20información%20sobre%20el%20curso%20Behavioral%20AI%20Experience%20Design"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg mb-8"
              style={{ background: 'var(--cyan)' }}
            >
              <MessageCircle size={16} />
              ¿Dudas? Habla con un asesor
            </a>

            {/* Compact includes */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground/40">
              <span className="flex items-center gap-1.5"><Users size={13} className="text-foreground/30" /> 30 cupos</span>
              <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-foreground/30" /> Proyecto real</span>
              <span className="flex items-center gap-1.5"><Award size={13} className="text-foreground/30" /> Certificación</span>
              <span className="flex items-center gap-1.5"><Users size={13} className="text-foreground/30" /> Comunidad de por vida</span>
            </div>
          </motion.div>

          {/* Right — Registration form */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:sticky lg:top-24">
            <CourseRegisterForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
