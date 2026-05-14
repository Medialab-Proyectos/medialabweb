"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Users, Star, BookOpen } from "lucide-react"
import Image from "next/image"

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
}

const trustBadges = [
  { icon: Users, text: "40+ productos reales construidos" },
  { icon: Star, text: "Metodología 90-10 validada" },
  { icon: BookOpen, text: "Autores de 'Bienvenidos al Zero UI'" },
]

/* Orbital animation — 2 rings + phase labels on edges */
function OrbitalGraphic() {
  return (
    <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] mx-auto">
      {/* Phase labels on edges */}
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.18em] uppercase text-white/20 font-medium">Discovery</span>
      <span className="absolute top-1/2 -right-12 md:-right-14 -translate-y-1/2 text-[9px] tracking-[0.18em] uppercase text-white/20 font-medium rotate-90">Design</span>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.18em] uppercase text-white/20 font-medium">Build</span>
      <span className="absolute top-1/2 -left-12 md:-left-14 -translate-y-1/2 text-[9px] tracking-[0.18em] uppercase text-white/20 font-medium -rotate-90">Validate</span>

      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-white/[0.06]"
      >
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full"
          style={{ background: 'var(--cyan)', boxShadow: '0 0 18px var(--cyan)' }} />
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
          className="absolute -bottom-1 left-1/3 w-2 h-2 rounded-full"
          style={{ background: 'var(--magenta)', boxShadow: '0 0 10px var(--magenta)' }} />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute inset-14 md:inset-[4.5rem] rounded-full border border-white/[0.08]"
      >
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{ background: 'var(--magenta)', boxShadow: '0 0 14px var(--magenta)' }} />
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute -top-1 left-1/3 w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
      </motion.div>

      {/* Center — result text (well inside inner ring) */}
      <div className="absolute inset-[5rem] md:inset-[6.5rem] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-2">Lo que lograrás</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--cyan)' }}>90%</p>
          <p className="text-[11px] text-white/40 mb-2">productividad</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--magenta)' }}>10%</p>
          <p className="text-[11px] text-white/40">esfuerzo</p>
        </div>
      </div>

      {/* Background glow */}
      <motion.div
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-1/4 rounded-full blur-[50px]"
        style={{ background: 'linear-gradient(135deg, var(--cyan), var(--magenta))' }}
      />
    </div>
  )
}

export function CourseHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.7], [0, 80])

  return (
    <section ref={ref} className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[var(--surface-dark)]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src="/images/curso/hero-team.png" alt="" fill className="object-cover opacity-[0.12]" priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,14,0.95) 0%, rgba(10,10,14,0.75) 50%, rgba(10,10,14,1) 100%)' }} />
      </div>
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full blur-[160px]" style={{ background: 'rgba(42,171,179,0.04)' }} />
        <div className="absolute bottom-[25%] right-[10%] w-[400px] h-[400px] rounded-full blur-[140px]" style={{ background: 'rgba(232,117,26,0.03)' }} />
      </div>

      <motion.div style={{ opacity, y }} className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pt-28 md:pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
          {/* Left — Text */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--magenta)]/20 bg-[var(--magenta)]/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--magenta)' }} />
                <span className="text-[11px] tracking-[0.12em] uppercase font-medium" style={{ color: 'var(--magenta)' }}>Cohorte 01 · Solo 30 cupos</span>
              </div>
              <span className="text-[11px] text-white/30 hidden sm:inline">by MediaLab Ingeniería</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold tracking-tight leading-[1.12] text-[var(--surface-dark-fg)] mb-5 font-display">
              No necesitas más herramientas.
              <br />
              <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
                Necesitas saber qué hacer con lo que generan.
              </span>
            </motion.h1>

            {/* Value prop with target profiles */}
            <motion.p variants={fadeUp} className="text-base md:text-lg text-white/50 leading-relaxed mb-4 max-w-lg">
              12 fases para diseñadores, developers y startups. Aprende a investigar, diseñar, construir y validar productos donde tú decides y la IA ejecuta.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.05] text-[11px] font-medium" style={{ color: 'var(--cyan)' }}>
                Behavioral AI Experience Design
              </span>
              <span className="px-3 py-1 rounded-full border border-[var(--magenta)]/20 bg-[var(--magenta)]/[0.05] text-[11px] font-medium" style={{ color: 'var(--magenta)' }}>
                UX Prompt Design
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3 mb-10">
              <a href="#reservar" className="px-7 py-3.5 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg" style={{ background: 'var(--magenta)' }}>
                Registrarme al curso →
              </a>
              <a href="#contacto" className="px-7 py-3.5 text-sm font-medium text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg" style={{ background: 'var(--cyan)' }}>
                Hablar con un asesor
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pt-6 border-t border-white/[0.04]">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-xs text-white/35">{badge.text}</span>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right — Orbital graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="hidden md:block -mt-10"
          >
            <OrbitalGraphic />
          </motion.div>
        </div>
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
