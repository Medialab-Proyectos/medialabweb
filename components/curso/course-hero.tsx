"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Users, Star, BookOpen } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
}

/* Orbital animation — 2 rings + phase labels on edges */
function OrbitalGraphic() {
  const { t } = useLanguage()
  return (
    <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] mx-auto">
      {/* Phase labels on edges */}
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.18em] uppercase text-foreground/20 font-medium">Discovery</span>
      <span className="absolute top-1/2 -right-12 md:-right-14 -translate-y-1/2 text-[9px] tracking-[0.18em] uppercase text-foreground/20 font-medium rotate-90">Design</span>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.18em] uppercase text-foreground/20 font-medium">Build</span>
      <span className="absolute top-1/2 -left-12 md:-left-14 -translate-y-1/2 text-[9px] tracking-[0.18em] uppercase text-foreground/20 font-medium -rotate-90">Validate</span>

      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-foreground/[0.06]"
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
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-14 md:inset-[4.5rem] rounded-full border border-foreground/[0.08]"
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
          <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 mb-2">{t("Lo que lograrás", "What you'll achieve")}</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--cyan)' }}>90%</p>
          <p className="text-[11px] text-foreground/40 mb-2">{t("productividad", "productivity")}</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--magenta)' }}>10%</p>
          <p className="text-[11px] text-foreground/40">{t("esfuerzo", "effort")}</p>
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
  const { t } = useLanguage()

  const trustBadges = [
    { icon: Users, text: t("40+ productos reales construidos", "40+ real products built") },
    { icon: Star, text: t("Metodología 90-10 validada", "Validated 90-10 methodology") },
    { icon: BookOpen, text: t("Autores de 'Bienvenidos al Zero UI'", "Authors of 'Welcome to Zero UI'") },
  ]

  return (
    <section ref={ref} className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src="/images/curso/hero-team.png" alt="" fill className="object-cover opacity-[0.12]" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/95 via-[var(--background)]/75 to-[var(--background)]" />
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
                <span className="text-[11px] tracking-[0.12em] uppercase font-medium" style={{ color: 'var(--magenta)' }}>{t("Cohorte 01 · Solo 30 cupos", "Cohort 01 · Only 30 seats")}</span>
              </div>
              <span className="text-[11px] text-foreground/30 hidden sm:inline">by MediaLab Ingeniería</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold tracking-tight leading-[1.12] text-foreground mb-5 font-display">
              {t("No necesitas más herramientas.", "You don't need more tools.")}
              <br />
              <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
                {t(
                  "Necesitas saber qué hacer con lo que generan.",
                  "You need to know what to do with what they generate."
                )}
              </span>
            </motion.h1>

            {/* Value prop — short, direct */}
            <motion.p variants={fadeUp} className="text-base md:text-lg text-foreground/75 leading-relaxed mb-6 max-w-lg">
              {t("12 fases para que ", "12 phases so that ")}
              <span className="text-foreground font-medium">{t("tú dirijas", "you direct")}</span>
              {t(" y la IA ejecute. Aprende a investigar, diseñar y validar productos reales.", " and AI executes. Learn to research, design, and validate real products.")}
            </motion.p>

            {/* CTAs — prominent, above the fold */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
              <a
                href="#registro"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_10px_32px_-8px_rgba(232,117,26,0.65)]"
                style={{ background: 'var(--magenta)' }}
              >
                {t("Registrarme al curso →", "Register for the course →")}
              </a>
              <a
                href="https://wa.me/573054009505?text=Hola%2C%20quiero%20información%20sobre%20el%20curso%20Behavioral%20AI%20Experience%20Design"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-[var(--cyan)]/40 text-[var(--cyan)] hover:bg-[var(--cyan)]/10"
              >
                {t("Hablar con un asesor", "Talk to an advisor")}
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs text-foreground/55 mb-7 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t(
                "Precio de lanzamiento · Garantía la primera semana",
                "Launch price · First-week guarantee"
              )}
            </motion.p>

            {/* Role pills — hidden on mobile */}
            <motion.div variants={fadeUp} className="hidden sm:flex flex-wrap items-center gap-2 mb-7">
              <span className="text-[10px] tracking-[0.12em] uppercase text-foreground/40 font-medium mr-1">{t("Te conviertes en:", "You become:")}</span>
              <span className="px-3 py-1 rounded-full border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.06] text-[11px] font-semibold" style={{ color: 'var(--cyan)' }}>
                Behavioral AI Experience Designer
              </span>
              <span className="px-3 py-1 rounded-full border border-[var(--magenta)]/25 bg-[var(--magenta)]/[0.06] text-[11px] font-semibold" style={{ color: 'var(--magenta)' }}>
                UX Prompt Designer
              </span>
            </motion.div>

            {/* Trust badges — hidden on mobile */}
            <motion.div variants={fadeUp} className="hidden sm:flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pt-5 border-t border-foreground/[0.08]">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-foreground/45" />
                    <span className="text-xs text-foreground/55">{badge.text}</span>
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
        <div className="w-5 h-7 rounded-full border border-foreground/15 flex justify-center pt-1">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-0.5 h-1.5 rounded-full" style={{ background: 'var(--magenta)' }} />
        </div>
      </motion.div>
    </section>
  )
}
