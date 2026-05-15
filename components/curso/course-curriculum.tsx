"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, Zap, BarChart3, Microscope, Blocks, Bot, Shield, Layout, Sparkles, Heart, Lightbulb, GitBranch, Box, Layers } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseCurriculum() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const topics = [
    { icon: Brain, title: t("IA para UX/UI", "AI for UX/UI"), desc: t("Integra IA en cada etapa de tu proceso de diseño — sin que tu trabajo pierda identidad ni profundidad.", "Integrate AI into every stage of your design process — without your work losing identity or depth.") },
    { icon: Zap, title: t("Prompt Frameworks", "Prompt Frameworks"), desc: t("Deja de copiar plantillas. Aprende a diseñar sistemas de prompts que resuelven TU problema específico.", "Stop copying templates. Learn to design prompt systems that solve YOUR specific problem.") },
    { icon: GitBranch, title: t("AI-First Workflows", "AI-First Workflows"), desc: t("Construye flujos de trabajo donde la IA potencia tu proceso creativo, no lo interrumpe.", "Build workflows where AI boosts your creative process — not interrupts it.") },
    { icon: BarChart3, title: t("Diseño Estratégico", "Strategic Design"), desc: t("Cada pantalla, cada interacción responde a un objetivo medible. Diseño con propósito, no decoración.", "Every screen, every interaction answers a measurable goal. Design with purpose, not decoration.") },
    { icon: Microscope, title: t("UX + Comportamiento", "UX + Behavior"), desc: t("Entiende cómo piensan y deciden tus usuarios para diseñar experiencias que se sienten inevitables.", "Understand how your users think and decide so you can design experiences that feel inevitable.") },
    { icon: Bot, title: t("IA para Research", "AI for Research"), desc: t("Investiga en horas lo que antes tomaba semanas — sin perder la profundidad ni la empatía humana.", "Research in hours what used to take weeks — without losing depth or human empathy.") },
    { icon: Blocks, title: t("AI Prototyping", "AI Prototyping"), desc: t("Prototipa ideas en minutos. Pero con criterio: sabes qué probar, por qué y cómo evaluar el resultado.", "Prototype ideas in minutes — with judgment: you know what to test, why, and how to evaluate the result.") },
    { icon: Layout, title: t("AI Systems", "AI Systems"), desc: t("Diseña sistemas que escalan: componentes, tokens y patrones generados con intención, no al azar.", "Design systems that scale: components, tokens, and patterns generated with intent, not at random.") },
    { icon: Shield, title: t("Validación Humana", "Human Validation"), desc: t("El framework para separar lo bueno de lo genérico en todo lo que la IA genera. Tu filtro estratégico.", "The framework to separate the good from the generic in everything AI generates. Your strategic filter.") },
    { icon: Layers, title: t("Arquitectura de Experiencia", "Experience Architecture"), desc: t("Estructura experiencias completas: flujos, estados emocionales, edge cases y microinteracciones.", "Structure full experiences: flows, emotional states, edge cases, and microinteractions.") },
    { icon: Heart, title: t("Diseño Emocional", "Emotional Design"), desc: t("Crea productos que las personas sienten, no solo usan. Donde la conexión emocional impulsa la retención.", "Create products people feel — not just use. Where emotional connection drives retention.") },
    { icon: Lightbulb, title: t("IA + Startups", "AI + Startups"), desc: t("Lanza productos potenciados por IA sin sacrificar calidad ni experiencia. Velocidad con profundidad.", "Launch AI-powered products without sacrificing quality or experience. Speed with depth.") },
    { icon: Sparkles, title: t("Diseño Diferencial", "Differential Design"), desc: t("Aprende a crear lo que la IA no puede generar sola: experiencias con identidad única y criterio humano.", "Learn to create what AI can't generate alone: experiences with unique identity and human judgment.") },
    { icon: Box, title: t("Product Thinking", "Product Thinking"), desc: t("Piensa como un líder de producto: sistemas, métricas, usuarios y negocio — todo conectado.", "Think like a product leader: systems, metrics, users, and business — all connected.") },
  ]

  return (
    <section id="programa" className="relative py-20 md:py-28 bg-secondary/40 overflow-hidden">
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
            {t("Lo que sabrás hacer", "What you'll know how to do")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t(
              "14 módulos que transforman cómo piensas, diseñas y construyes",
              "14 modules that transform how you think, design, and build"
            )}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/50">
            {t(
              "Cada módulo resuelve un problema real. Cuando termines, no solo sabrás más — sabrás hacer más.",
              "Every module solves a real problem. When you finish, you won't just know more — you'll be able to do more."
            )}
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
                <div className="relative p-6 rounded-2xl border border-foreground/[0.1] bg-foreground/[0.03] hover:border-[var(--cyan)]/[0.15] hover:bg-[var(--cyan)]/[0.03] transition-all duration-500 h-full">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--cyan)]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] group-hover:bg-[var(--cyan)]/10 flex items-center justify-center transition-colors duration-500">
                        <Icon className="w-5 h-5 text-foreground/30 group-hover:text-[var(--cyan)] transition-colors duration-500" />
                      </div>
                      <span className="text-[10px] font-mono text-foreground/20 group-hover:text-[var(--cyan)]/50 transition-colors duration-500">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{topic.title}</h3>
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
