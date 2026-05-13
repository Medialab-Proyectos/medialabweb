"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Palette, Monitor, Code2, RocketIcon, User, Users, Frown, Sparkles } from "lucide-react"

const profiles = [
  { icon: Palette, title: "UX/UI Designers", desc: "Que quieren integrar IA sin perder su ojo de diseño ni su proceso creativo." },
  { icon: Monitor, title: "Product Designers", desc: "Que necesitan construir productos completos donde la IA es parte de la experiencia." },
  { icon: Code2, title: "Developers", desc: "Que diseñan interfaces y quieren hacerlo con más criterio visual y estratégico." },
  { icon: RocketIcon, title: "Startups", desc: "Que quieren lanzar productos potenciados por IA de forma rápida pero con profundidad." },
  { icon: User, title: "Freelancers", desc: "Que necesitan diferenciarse en un mercado cada vez más saturado de IA genérica." },
  { icon: Users, title: "Equipos de Innovación", desc: "Que buscan una metodología compartida para integrar IA en sus procesos de diseño." },
  { icon: Frown, title: "Diseñadores frustrados con IA", desc: "Que aprendieron herramientas pero siguen sin saber cómo aplicarlas con criterio." },
  { icon: Sparkles, title: "Creativos que quieren diferenciarse", desc: "Que saben que el futuro es con IA, pero quieren seguir siendo únicos." },
]

export function CourseAudience() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-20 md:py-28 bg-[var(--surface-dark)] overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--magenta)' }}>
            ¿Para quién es?
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-tight mb-6 font-display">
            ¿Te identificas?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/50">
            Esta metodología fue diseñada para quienes quieren evolucionar con la IA, no ser reemplazados por ella.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((profile, i) => {
            const Icon = profile.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                className="group"
              >
                <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-[var(--magenta)]/[0.15] hover:bg-[var(--magenta)]/[0.03] transition-all duration-500 h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] group-hover:bg-[var(--magenta)]/10 mx-auto flex items-center justify-center mb-4 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-white/30 group-hover:text-[var(--magenta)] transition-colors duration-500" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--surface-dark-fg)] mb-2">{profile.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{profile.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
