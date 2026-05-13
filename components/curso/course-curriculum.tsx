"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, Zap, BarChart3, Microscope, Blocks, Bot, Shield, Layout, Sparkles, Heart, Lightbulb, GitBranch, Box, Layers } from "lucide-react"

const topics = [
  { icon: Brain, title: "IA para UX/UI", desc: "Integra inteligencia artificial en cada etapa del proceso de diseño de experiencia." },
  { icon: Zap, title: "Prompt Frameworks", desc: "Diseña sistemas de prompts que resuelven problemas reales, no plantillas genéricas." },
  { icon: GitBranch, title: "AI-First Workflows", desc: "Construye flujos de trabajo modernos donde la IA potencia — no reemplaza — tu proceso." },
  { icon: BarChart3, title: "Diseño Estratégico", desc: "Cada decisión de diseño responde a un objetivo medible de negocio." },
  { icon: Microscope, title: "UX + Comportamiento", desc: "Entiende cómo piensan y deciden los usuarios para diseñar con psicología." },
  { icon: Bot, title: "IA para Research", desc: "Usa IA para investigar más rápido sin perder profundidad ni empatía." },
  { icon: Blocks, title: "AI Prototyping", desc: "Prototipa en minutos lo que antes tomaba semanas. Con criterio, no solo velocidad." },
  { icon: Layout, title: "AI Systems", desc: "Diseña sistemas que escalan: componentes, tokens y patrones generados con criterio." },
  { icon: Shield, title: "Validación Humana", desc: "Frameworks para evaluar y filtrar lo que la IA genera. Lo bueno de lo genérico." },
  { icon: Layers, title: "Arquitectura de Experiencia", desc: "Estructura experiencias completas: flujos, estados, edge cases y emociones." },
  { icon: Heart, title: "Diseño Emocional", desc: "Crea productos que las personas sienten, no solo usan. Conexión emocional real." },
  { icon: Lightbulb, title: "IA + Startups", desc: "Lanza productos más rápido con IA sin sacrificar calidad ni experiencia." },
  { icon: Sparkles, title: "Diseño Diferencial", desc: "Aprende a crear lo que la IA no puede generar sola: experiencias únicas con identidad." },
  { icon: Box, title: "Product Thinking", desc: "Del diseño al producto: piensa en sistemas, métricas, usuarios y negocio." },
]

export function CourseCurriculum() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="programa" className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            Programa completo
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            Lo que aprenderás
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/50">
            14 módulos diseñados para transformar cómo piensas, diseñas y construyes con IA.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topics.map((topic, i) => {
            const Icon = topic.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                className="group"
              >
                <div className="relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-[var(--cyan)]/[0.15] hover:bg-[var(--cyan)]/[0.03] transition-all duration-500 h-full">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--cyan)]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] group-hover:bg-[var(--cyan)]/10 flex items-center justify-center mb-4 transition-colors duration-500">
                      <Icon className="w-5 h-5 text-white/30 group-hover:text-[var(--cyan)] transition-colors duration-500" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--surface-dark-fg)] mb-2">{topic.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors duration-300">{topic.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
