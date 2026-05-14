"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GraduationCap, BookOpen, Brain, Shield, HeartHandshake, Microscope } from "lucide-react"

const items = [
  { icon: GraduationCap, title: "Camino a validación universitaria", desc: "Trabajamos con instituciones educativas para que tu certificación tenga peso académico real. No es solo un PDF bonito." },
  { icon: BookOpen, title: "Creada desde la práctica, no desde la teoría", desc: "Esta metodología nació de años de proyectos reales con 40+ empresas. No es un framework inventado para un curso." },
  { icon: Microscope, title: "Respaldada por datos reales", desc: "Cada fase fue probada y refinada con equipos reales en múltiples industrias. Sabemos qué funciona porque lo medimos." },
  { icon: HeartHandshake, title: "Personas primero, siempre", desc: "La tecnología es la herramienta. Tú eres el diferencial. Cada módulo refuerza tu criterio humano, no lo sustituye." },
  { icon: Shield, title: "IA con responsabilidad", desc: "Aprendes a usar IA con transparencia y ética. Porque el impacto de lo que diseñas afecta a personas reales." },
  { icon: Brain, title: "Lo que la IA nunca podrá hacer por ti", desc: "Evaluar, filtrar, decidir. Ese es el skill que este curso desarrolla. Y es el que te hará irreemplazable." },
]

export function CourseValidation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            Por qué puedes confiar en esto
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            No es otro curso más.{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              Y así es como lo respaldamos.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
                <div className="p-6 md:p-8 rounded-2xl border border-foreground/[0.1] bg-foreground/[0.03] hover:border-[var(--cyan)]/[0.1] hover:bg-foreground/[0.03] transition-all duration-500 h-full">
                  <Icon className="w-6 h-6 mb-4" style={{ color: 'var(--cyan)', opacity: 0.6 }} />
                  <h3 className="text-lg font-semibold text-[var(--surface-dark-fg)] mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
