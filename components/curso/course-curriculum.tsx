"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, Zap, BarChart3, Microscope, Blocks, Bot, Shield, Layout, Sparkles, Heart, Lightbulb, GitBranch, Box, Layers } from "lucide-react"

const topics = [
  { icon: Brain, title: "IA para UX/UI", desc: "Integra IA en cada etapa de tu proceso de diseño — sin que tu trabajo pierda identidad ni profundidad." },
  { icon: Zap, title: "Prompt Frameworks", desc: "Deja de copiar plantillas. Aprende a diseñar sistemas de prompts que resuelven TU problema específico." },
  { icon: GitBranch, title: "AI-First Workflows", desc: "Construye flujos de trabajo donde la IA potencia tu proceso creativo, no lo interrumpe." },
  { icon: BarChart3, title: "Diseño Estratégico", desc: "Cada pantalla, cada interacción responde a un objetivo medible. Diseño con propósito, no decoración." },
  { icon: Microscope, title: "UX + Comportamiento", desc: "Entiende cómo piensan y deciden tus usuarios para diseñar experiencias que se sienten inevitables." },
  { icon: Bot, title: "IA para Research", desc: "Investiga en horas lo que antes tomaba semanas — sin perder la profundidad ni la empatía humana." },
  { icon: Blocks, title: "AI Prototyping", desc: "Prototipa ideas en minutos. Pero con criterio: sabes qué probar, por qué y cómo evaluar el resultado." },
  { icon: Layout, title: "AI Systems", desc: "Diseña sistemas que escalan: componentes, tokens y patrones generados con intención, no al azar." },
  { icon: Shield, title: "Validación Humana", desc: "El framework para separar lo bueno de lo genérico en todo lo que la IA genera. Tu filtro estratégico." },
  { icon: Layers, title: "Arquitectura de Experiencia", desc: "Estructura experiencias completas: flujos, estados emocionales, edge cases y microinteracciones." },
  { icon: Heart, title: "Diseño Emocional", desc: "Crea productos que las personas sienten, no solo usan. Donde la conexión emocional impulsa la retención." },
  { icon: Lightbulb, title: "IA + Startups", desc: "Lanza productos potenciados por IA sin sacrificar calidad ni experiencia. Velocidad con profundidad." },
  { icon: Sparkles, title: "Diseño Diferencial", desc: "Aprende a crear lo que la IA no puede generar sola: experiencias con identidad única y criterio humano." },
  { icon: Box, title: "Product Thinking", desc: "Piensa como un líder de producto: sistemas, métricas, usuarios y negocio — todo conectado." },
]

export function CourseCurriculum() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="programa" className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            Lo que sabrás hacer
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            14 módulos que transforman cómo piensas, diseñas y construyes
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/50">
            Cada módulo resuelve un problema real. Cuando termines, no solo sabrás más — sabrás hacer más.
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
                <div className="relative p-6 rounded-2xl border border-foreground/[0.04] bg-foreground/[0.02] hover:border-[var(--cyan)]/[0.15] hover:bg-[var(--cyan)]/[0.03] transition-all duration-500 h-full">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--cyan)]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] group-hover:bg-[var(--cyan)]/10 flex items-center justify-center transition-colors duration-500">
                        <Icon className="w-5 h-5 text-foreground/30 group-hover:text-[var(--cyan)] transition-colors duration-500" />
                      </div>
                      <span className="text-[10px] font-mono text-foreground/20 group-hover:text-[var(--cyan)]/50 transition-colors duration-500">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-base font-semibold text-[var(--surface-dark-fg)] mb-2">{topic.title}</h3>
                    <p className="text-sm text-foreground/40 leading-relaxed group-hover:text-foreground/50 transition-colors duration-300">{topic.desc}</p>
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
