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
    { label: t("Abrumado", "Overwhelmed"), desc: t("15 herramientas nuevas cada mes y ninguna dirección clara", "15 new tools every month and no clear direction") },
    { label: t("Genérico", "Generic"), desc: t("Tus diseños se ven iguales a los de cualquier prompt de ChatGPT", "Your designs look like any ChatGPT prompt's output") },
    { label: t("Inseguro", "Unsure"), desc: t("No sabes si lo que genera la IA es bueno o solo rápido", "You don't know whether what AI generates is good or just fast") },
    { label: t("Dependiente", "Dependent"), desc: t("Sin IA no avanzas, con IA no decides", "Without AI you can't move forward; with AI you can't decide") },
    { label: t("Ansioso", "Anxious"), desc: t("La sensación constante de que alguien te va a reemplazar", "The constant feeling that someone is about to replace you") },
  ]

  const after = [
    { label: t("Behavioral AI Experience Designer", "Behavioral AI Experience Designer"), desc: t("Diseñas experiencias donde la IA potencia la conexión humana, no la reemplaza", "You design experiences where AI amplifies human connection — it doesn't replace it") },
    { label: t("UX Prompt Designer", "UX Prompt Designer"), desc: t("Creas sistemas de prompts estratégicos que resuelven problemas reales de producto", "You create strategic prompt systems that solve real product problems") },
    { label: t("Estratégico", "Strategic"), desc: t("Cada decisión de diseño responde a un por qué conductual y un objetivo medible", "Every design decision answers a behavioral 'why' and a measurable goal") },
    { label: t("Diferencial", "Differentiated"), desc: t("Tu firma humana amplifica lo que la IA genera — tu criterio es tu ventaja competitiva", "Your human signature amplifies what AI generates — your judgment is your competitive edge") },
    { label: t("A prueba de futuro", "Future-proof"), desc: t("Habilidades que no caducan cuando sale la próxima herramienta", "Skills that don't expire when the next tool drops") },
  ]

  return (
    <section id="transformacion" className="relative py-20 md:py-28 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            {t("En esto te conviertes", "This is who you become")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug font-display">
            {t("Entras como profesional curioso.", "You enter as a curious professional.")}{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("Sales como Behavioral AI Experience Designer.", "You leave as a Behavioral AI Experience Designer.")}
            </span>
          </h2>
        </motion.div>

        {/* Emotional image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-10 md:mb-14 border border-foreground/[0.1]"
        >
          <Image
            src="/images/curso/transformation.png"
            alt={t("De la confusión a la claridad", "From confusion to clarity")}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-transparent to-[var(--cyan)]/20" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-start">
          {/* Before */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="text-center md:text-left mb-6">
              <span className="text-sm font-medium text-red-400/80 tracking-wider uppercase font-display">{t("Antes", "Before")}</span>
            </div>
            <div className="space-y-3">
              {before.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.08 }}
                  className="p-4 rounded-xl border border-red-500/[0.06] bg-red-500/[0.02]">
                  <p className="text-base font-medium text-foreground/70">{item.label}</p>
                  <p className="text-sm text-foreground/30">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-12">
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.5, duration: 0.5 }}
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: 'var(--cyan)', background: 'rgba(42,171,179,0.15)' }}>
              <ArrowRight className="w-5 h-5" style={{ color: 'var(--cyan)' }} />
            </motion.div>
          </div>
          <div className="flex md:hidden items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center rotate-90"
              style={{ borderColor: 'var(--cyan)', background: 'rgba(42,171,179,0.15)' }}>
              <ArrowRight className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
            </motion.div>
          </div>

          {/* After */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }}>
            <div className="text-center md:text-left mb-6">
              <span className="text-sm font-medium tracking-wider uppercase font-display" style={{ color: 'var(--cyan)' }}>{t("En esto te conviertes", "This is who you become")}</span>
            </div>
            <div className="space-y-3">
              {after.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + i * 0.08 }}
                  className="p-4 rounded-xl border border-[var(--cyan)]/[0.08] bg-[var(--cyan)]/[0.02]">
                  <p className="text-base font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-foreground/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
