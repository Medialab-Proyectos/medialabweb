"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function CourseTransformation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const before = [
    { label: t("Abrumado", "Overwhelmed"), desc: t("15 herramientas nuevas al mes, ninguna dirección clara.", "15 new tools per month, no clear direction.") },
    { label: t("Desconectado", "Disconnected"), desc: t("Tus entregables generan retrabajo en desarrollo.", "Your deliverables create rework for dev.") },
    { label: t("Inseguro", "Unsure"), desc: t("No sabes si lo que genera la IA es bueno o solo rápido.", "You don't know if what AI generates is good or just fast.") },
    { label: t("Dependiente", "Dependent"), desc: t("No puedes validar sin depender del equipo técnico.", "Can't validate without depending on the tech team.") },
  ]

  const after = [
    { label: t("Arquitecto UX con IA", "AI UX Architect"), desc: t("Diseñas experiencias donde la IA potencia al humano.", "You design experiences where AI empowers the human.") },
    { label: t("Arquitecto de Producto", "Product Architect"), desc: t("Productos listos para evolucionar hacia desarrollo real.", "Products ready to evolve toward real development.") },
    { label: t("Puente UX ↔ Dev", "UX ↔ Dev Bridge"), desc: t("Conectas diseño, negocio y equipos técnicos.", "You connect design, business, and tech teams.") },
    { label: t("A prueba de futuro", "Future-proof"), desc: t("Skills que no caducan: pensamiento, no botones.", "Skills that don't expire: thinking, not clicking.") },
  ]

  return (
    <section id="transformacion" className="relative py-20 md:py-28 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display font-medium" style={{ color: 'var(--cyan)' }}>
            {t("Tu transformación", "Your transformation")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug font-display">
            {t("Entras curioso.", "You enter curious.")}{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("Sales Arquitecto.", "You leave an Architect.")}
            </span>
          </h2>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden mb-10 border border-foreground/[0.12] dark:border-foreground/[0.1]"
        >
          <Image src="/images/curso/transformation.png" alt="" fill className="object-cover opacity-70 dark:opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-transparent to-[var(--cyan)]/25" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-start">
          {/* Before */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }}>
            <p className="text-sm font-medium text-red-500 dark:text-red-400/80 tracking-wider uppercase font-display text-center md:text-left mb-4">{t("Antes", "Before")}</p>
            <div className="space-y-3">
              {before.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.06 }}
                  className="curso-card-danger p-4 rounded-xl border">
                  <p className="text-sm font-medium text-foreground/80 dark:text-foreground/70">{item.label}</p>
                  <p className="text-xs text-foreground/55 dark:text-foreground/35">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-12">
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.5, duration: 0.5 }}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: 'var(--cyan)', background: 'rgba(42,171,179,0.15)' }}>
              <ArrowRight className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
            </motion.div>
          </div>
          <div className="flex md:hidden items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center rotate-90"
              style={{ borderColor: 'var(--cyan)', background: 'rgba(42,171,179,0.15)' }}>
              <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--cyan)' }} />
            </motion.div>
          </div>

          {/* After */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }}>
            <p className="text-sm font-medium tracking-wider uppercase font-display text-center md:text-left mb-4" style={{ color: 'var(--cyan)' }}>{t("Después", "After")}</p>
            <div className="space-y-3">
              {after.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + i * 0.06 }}
                  className="curso-card-highlight p-4 rounded-xl border">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-foreground/55 dark:text-foreground/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
