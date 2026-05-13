"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GraduationCap, BookOpen, Brain, Shield, HeartHandshake, Microscope } from "lucide-react"

const items = [
  { icon: GraduationCap, title: "Futura validación universitaria", desc: "Trabajamos activamente con instituciones educativas para que la certificación tenga peso académico real." },
  { icon: BookOpen, title: "Metodología propietaria", desc: "Desarrollada por MediaLab tras años de investigación en UX, IA y diseño conductual aplicado a productos reales." },
  { icon: Microscope, title: "Investigación MediaLab", desc: "Basada en datos reales de proyectos con más de 40 empresas en múltiples industrias." },
  { icon: HeartHandshake, title: "Enfoque humano", desc: "La tecnología como herramienta, el criterio como diferencial. Siempre diseño centrado en personas." },
  { icon: Shield, title: "IA ética", desc: "Enseñamos a usar IA con responsabilidad, transparencia y enfoque en el impacto humano real." },
  { icon: Brain, title: "Pensamiento crítico", desc: "El skill más valioso del futuro: saber qué hacer con lo que la IA genera. Evaluar, filtrar, decidir." },
]

export function CourseValidation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            Validación & Futuro
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            Esto no es otro curso. <span className="text-white/40">Es una inversión en tu futuro.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
                <div className="p-6 md:p-8 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-[var(--cyan)]/[0.1] hover:bg-white/[0.03] transition-all duration-500 h-full">
                  <Icon className="w-6 h-6 mb-4" style={{ color: 'var(--cyan)', opacity: 0.6 }} />
                  <h3 className="text-lg font-semibold text-[var(--surface-dark-fg)] mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
