"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Users, Star, BookOpen } from "lucide-react"

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
}

const trustBadges = [
  { icon: Users, text: "40+ empresas han confiado en MediaLab" },
  { icon: Star, text: "Metodología propietaria validada" },
  { icon: BookOpen, text: "Autores de 'Bienvenidos al Zero UI'" },
]

export function CourseHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.7], [0, 80])

  return (
    <section ref={ref} className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[var(--surface-dark)]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-[var(--cyan)]/[0.04] rounded-full blur-[160px] animate-[float-1_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[25%] right-[10%] w-[400px] h-[400px] bg-[var(--magenta)]/[0.03] rounded-full blur-[140px] animate-[float-2_25s_ease-in-out_infinite]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--surface-dark)_75%)]" />
      </div>

      <motion.div style={{ opacity, y }} className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 pt-28 md:pt-32 pb-16">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Eyebrow — scarcity + authority */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--magenta)]/20 bg-[var(--magenta)]/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--magenta)' }} />
              <span className="text-[11px] tracking-[0.12em] uppercase font-medium" style={{ color: 'var(--magenta)' }}>Cohorte 01 · Solo 30 cupos</span>
            </div>
            <span className="text-[11px] text-white/30">by MediaLab Ingeniería</span>
          </motion.div>

          {/* Pre-headline — emotional hook */}
          <motion.p variants={fadeUp} className="text-center text-sm md:text-base text-white/40 mb-4 max-w-xl mx-auto">
            Para diseñadores y creativos que sienten que la IA los está dejando atrás.
          </motion.p>

          {/* Main headline — balanced size, emotional */}
          <motion.h1 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold tracking-tight leading-[1.15] text-[var(--surface-dark-fg)] mb-6 font-display max-w-4xl mx-auto">
            Aprende a construir con IA
            <br />
            <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
              sin perder tu criterio humano.
            </span>
          </motion.h1>

          {/* Value proposition — clear and specific */}
          <motion.p variants={fadeUp} className="text-center text-base md:text-lg text-white/50 leading-relaxed mb-8 max-w-2xl mx-auto">
            Una metodología de 12 fases para diseñadores UX/UI, developers y startups que quieren usar IA como copiloto estratégico — no como reemplazo. Frameworks reales. Proyectos reales. Criterio humano.
          </motion.p>

          {/* CTA cluster — clear hierarchy */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <a href="#reservar" className="group px-7 py-3.5 text-sm font-semibold text-white rounded-full transition-all duration-400 hover:scale-[1.03] hover:shadow-lg" style={{ background: 'var(--magenta)' }}>
              Reservar mi cupo →
            </a>
            <a href="#metodologia" className="px-7 py-3.5 text-sm font-medium text-white/60 border border-white/[0.08] rounded-full hover:border-white/[0.15] hover:text-white/80 hover:bg-white/[0.02] transition-all duration-300">
              Explorar la metodología
            </a>
          </motion.div>

          {/* Trust bar — social proof immediately */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-8 border-t border-white/[0.04]">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-white/20" />
                  <span className="text-xs text-white/35">{badge.text}</span>
                </div>
              )
            })}
          </motion.div>

          {/* Central quote — below trust, subtle */}
          <motion.div variants={fadeUp} className="mt-12 text-center">
            <p className="text-sm md:text-base text-white/30 italic max-w-lg mx-auto">
              &ldquo;La IA genera opciones. <span className="not-italic font-medium" style={{ color: 'var(--magenta)' }}>Tú aprenderás a darles sentido.</span>&rdquo;
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-5 h-7 rounded-full border border-white/15 flex justify-center pt-1">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-0.5 h-1.5 rounded-full" style={{ background: 'var(--magenta)' }} />
        </div>
      </motion.div>
    </section>
  )
}
