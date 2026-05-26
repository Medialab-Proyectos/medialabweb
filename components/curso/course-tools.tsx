"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function CourseTools() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const tools = [
    { name: "ChatGPT Plus", category: t("Ideación & Research", "Ideation & Research"), logo: "/images/chatgpt-6.svg", w: 32, h: 32 },
    { name: "Claude", category: t("Análisis & Estrategia", "Analysis & Strategy"), logo: "/images/claude-logo.svg", w: 32, h: 32 },
    { name: "v0", category: t("UI Generation", "UI Generation"), logo: "/images/v0-logo-png_seeklogo-605781.png", w: 32, h: 32 },
    { name: "UXpilot", category: t("UX con IA", "UX with AI"), logo: "/images/uxpilot.fw.png", w: 36, h: 36 },
    { name: "Figma AI", category: t("Diseño & Prototipado", "Design & Prototyping"), logo: "/images/curso/logos/figma.svg", w: 28, h: 28 },
  ]

  return (
    <section id="herramientas" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            {t("Las herramientas que usarás", "The tools you'll use")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t(
              "No te damos una lista. Te enseñamos cuándo y por qué usar cada una.",
              "We don't give you a list. We teach you when and why to use each one."
            )}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tools.map((tool, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
              <div className="p-5 md:p-6 rounded-2xl border curso-card hover:border-[var(--cyan)]/30 transition-all duration-500 h-full text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white shadow-[0_4px_14px_-6px_rgba(0,0,0,0.35)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_22px_-6px_rgba(42,171,179,0.35)]">
                  <Image src={tool.logo} alt={tool.name} width={tool.w} height={tool.h} className="object-contain" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">{tool.name}</h3>
                <p className="text-[11px] text-foreground/55">{tool.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 0.5 }} className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.04]">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--cyan)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--cyan)' }}>
              {t(
                "Licencias premium incluidas — sin costo durante el curso",
                "Premium licenses included — free during the course"
              )}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
