"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const tools = [
  { name: "ChatGPT Plus", category: "Ideación & Research", color: "from-green-400 to-green-600" },
  { name: "Claude", category: "Análisis & Estrategia", color: "from-orange-300 to-orange-500" },
  { name: "Figma AI", category: "Diseño & Prototipado", color: "from-purple-400 to-pink-500" },
  { name: "Midjourney", category: "Generación Visual", color: "from-blue-400 to-indigo-500" },
  { name: "Cursor", category: "Desarrollo AI-First", color: "from-cyan-400 to-blue-500" },
  { name: "v0", category: "UI Generation", color: "from-zinc-300 to-zinc-500" },
  { name: "Lovable", category: "App Building", color: "from-pink-400 to-rose-500" },
  { name: "Runway", category: "Video & Motion", color: "from-violet-400 to-purple-600" },
  { name: "Framer AI", category: "Web Design", color: "from-blue-300 to-cyan-500" },
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
            Herramientas & Licencias
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            Tu stack de IA premium
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/50">
            Acceso guiado a las herramientas más potentes del mercado. No solo las usarás — aprenderás cuándo y por qué.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }} className="group">
              <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-500 h-full">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{tool.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--surface-dark-fg)]">{tool.name}</h3>
                    <p className="text-xs text-white/40">{tool.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.5 }} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.04]">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--cyan)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--cyan)' }}>
              Acceso guiado a herramientas premium incluido durante el curso
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
