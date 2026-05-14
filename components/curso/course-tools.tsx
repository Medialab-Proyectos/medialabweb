"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const tools = [
  { name: "ChatGPT Plus", category: "Ideación & Research", logo: "/images/chatgpt-6.svg", w: 32, h: 32 },
  { name: "Claude", category: "Análisis & Estrategia", logo: "/images/claude-logo.svg", w: 32, h: 32 },
  { name: "v0", category: "UI Generation", logo: "/images/v0-logo-png_seeklogo-605781.png", w: 32, h: 32 },
  { name: "UXpilot", category: "UX con IA", logo: "/images/uxpilot.fw.png", w: 36, h: 36 },
  { name: "Figma AI", category: "Diseño & Prototipado", logo: "/images/curso/logos/figma.svg", w: 28, h: 28 },
]

export function CourseTools() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="herramientas" className="relative py-20 md:py-28 bg-[var(--surface-dark)] overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            Las herramientas que usarás
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            No te damos una lista. Te enseñamos cuándo y por qué usar cada una.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tools.map((tool, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
              <div className="p-5 md:p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-[var(--cyan)]/[0.15] hover:bg-[var(--cyan)]/[0.03] transition-all duration-500 h-full text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.05] group-hover:bg-white/[0.08] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Image src={tool.logo} alt={tool.name} width={tool.w} height={tool.h} className="opacity-80 group-hover:opacity-100 transition-opacity duration-300 object-contain" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[var(--surface-dark-fg)] mb-1">{tool.name}</h3>
                <p className="text-[11px] text-white/40">{tool.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 0.5 }} className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.04]">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--cyan)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--cyan)' }}>
              Licencias premium incluidas — sin costo adicional
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
