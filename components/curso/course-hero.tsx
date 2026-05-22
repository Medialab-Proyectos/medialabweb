"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Users, Star, BookOpen, GraduationCap } from "lucide-react"
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

/* Orbital animation — 2 rings */
function OrbitalGraphic() {
  const { t } = useLanguage()
  return (
    <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] mx-auto">
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.18em] uppercase text-white/30 font-medium">Discovery</span>
      <span className="absolute top-1/2 -right-12 md:-right-14 -translate-y-1/2 text-[9px] tracking-[0.18em] uppercase text-white/30 font-medium rotate-90">Design</span>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.18em] uppercase text-white/30 font-medium">Build</span>
      <span className="absolute top-1/2 -left-12 md:-left-14 -translate-y-1/2 text-[9px] tracking-[0.18em] uppercase text-white/30 font-medium -rotate-90">Validate</span>

      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-white/[0.20]"
      >
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{ background: 'var(--cyan)', boxShadow: '0 0 30px 4px var(--cyan)' }} />
        <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
          className="absolute -bottom-1.5 left-1/3 w-3 h-3 rounded-full"
          style={{ background: 'var(--magenta)', boxShadow: '0 0 22px 3px var(--magenta)' }} />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-14 md:inset-[4.5rem] rounded-full border border-white/[0.22]"
      >
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-1/2 -right-2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
          style={{ background: 'var(--magenta)', boxShadow: '0 0 26px 3px var(--magenta)' }} />
        <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute -top-1.5 left-1/3 w-2.5 h-2.5 rounded-full"
          style={{ background: 'var(--cyan)', boxShadow: '0 0 20px 2px var(--cyan)' }} />
      </motion.div>

      {/* Center */}
      <div className="absolute inset-[5rem] md:inset-[6.5rem] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 mb-2">{t("Resultado", "Result")}</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--cyan)' }}>90%</p>
          <p className="text-[11px] text-white/65 mb-2">{t("productividad", "productivity")}</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--magenta)' }}>10%</p>
          <p className="text-[11px] text-white/65">{t("esfuerzo", "effort")}</p>
        </div>
      </div>

      {/* Background glow — stronger */}
      <motion.div
        animate={{ opacity: [0.10, 0.20, 0.10] }}
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
    { icon: Users, text: t("40+ productos construidos", "40+ products built") },
    { icon: Star, text: t("Metodología 90-10", "90-10 methodology") },
    { icon: BookOpen, text: t("Autores de 'Zero UI'", "Authors of 'Zero UI'") },
    { icon: GraduationCap, text: t("12+ carreras afines", "12+ related programs") },
  ]

  return (
    <section ref={ref} className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[var(--surface-dark)] text-[var(--surface-dark-fg)]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src="/images/curso/hero-team.png" alt="" fill sizes="100vw" className="object-cover opacity-[0.10]" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-dark)]/50 via-[var(--surface-dark)]/30 to-[var(--surface-dark)]/80" />
      </div>
      {/* Background effects — stronger opacity */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full blur-[100px]" style={{ background: 'rgba(42,171,179,0.15)' }} />
        <div className="absolute bottom-[25%] right-[10%] w-[400px] h-[400px] rounded-full blur-[80px]" style={{ background: 'rgba(232,117,26,0.12)' }} />
      </div>

      <motion.div style={{ opacity, y }} className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pt-28 md:pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
          {/* Left — Text */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.1]">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--cyan)' }} />
                <span className="text-[11px] tracking-[0.12em] uppercase font-medium" style={{ color: 'var(--cyan)' }}>
                  {t("Curso Arquitecto de Experiencia de Usuario con IA", "AI User Experience Architect Course")}
                </span>
              </div>
            </motion.div>

            {/* Headline — conciso, escaneable */}
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold tracking-tight leading-[1.1] text-white mb-4 font-display">
              {t("La IA construye.", "AI builds.")}
              <br />
              <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
                {t(
                  "Tú diseñas la experiencia y la estrategia.",
                  "You design the experience and strategy."
                )}
              </span>
            </motion.h1>

            {/* Value prop — 2 líneas max */}
            <motion.p variants={fadeUp} className="text-base md:text-lg text-white/80 leading-relaxed mb-6 max-w-md">
              {t(
                "Estructura, valida y optimiza productos digitales funcionales con IA — antes de invertir en desarrollo.",
                "Structure, validate, and optimize functional digital products with AI — before investing in development."
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
              <a
                href="#registro"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_10px_32px_-8px_rgba(232,117,26,0.65)]"
                style={{ background: 'var(--magenta)' }}
              >
                {t("Inscribirme →", "Enroll now →")}
              </a>
              <a
                href="https://wa.me/573054009505?text=Hola%2C%20quiero%20información%20sobre%20AI%20User%20Experience%20Architect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-[var(--cyan)]/50 text-[var(--cyan)] hover:bg-[var(--cyan)]/15"
              >
                {t("Hablar con un asesor", "Talk to an advisor")}
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs text-white/60 mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t("Precio de lanzamiento · Garantía semana 1", "Launch price · Week 1 guarantee")}
            </motion.p>
            <motion.p variants={fadeUp} className="text-[11px] text-white/60 mb-6">
              {t("Cohorte 01 · 30 cupos", "Cohort 01 · 30 seats")}
            </motion.p>

            {/* Role pills */}
            <motion.div variants={fadeUp} className="hidden sm:flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[10px] tracking-[0.12em] uppercase text-white/65 font-medium mr-1">{t("Sales como:", "You become:")}</span>
              <span className="px-3 py-1 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.1] text-[11px] font-semibold" style={{ color: 'var(--cyan)' }}>
                {t("Arquitecto UX con IA", "AI UX Architect")}
              </span>
              <span className="px-3 py-1 rounded-full border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.1] text-[11px] font-semibold" style={{ color: 'var(--magenta)' }}>
                UX Prompt Designer
              </span>
              <span className="px-3 py-1 rounded-full border border-white/20 bg-white/[0.06] text-[11px] font-semibold text-white/70">
                {t("Estratega de Producto", "Product Strategist")}
              </span>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="hidden sm:flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pt-4 border-t border-white/[0.12]">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-white/65" />
                    <span className="text-xs text-white/60">{badge.text}</span>
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
        <div className="w-5 h-7 rounded-full border border-white/20 flex justify-center pt-1">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-0.5 h-1.5 rounded-full" style={{ background: 'var(--magenta)' }} />
        </div>
      </motion.div>
    </section>
  )
}
