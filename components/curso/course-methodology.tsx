"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Search, Target, MessageSquare, Lightbulb, Users, Layers, Cpu, Eye, Filter, Rocket, LayoutGrid, Diamond } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const stageStyles: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  cyan:    { border: "border-[var(--cyan)]/20", bg: "bg-[var(--cyan)]/[0.06]", text: "text-[var(--cyan)]", dot: "bg-[var(--cyan)]" },
  magenta: { border: "border-[var(--magenta)]/20", bg: "bg-[var(--magenta)]/[0.06]", text: "text-[var(--magenta)]", dot: "bg-[var(--magenta)]" },
  amber:   { border: "border-amber-500/20", bg: "bg-amber-500/[0.06]", text: "text-amber-400", dot: "bg-amber-400" },
  violet:  { border: "border-violet-500/20", bg: "bg-violet-500/[0.06]", text: "text-violet-400", dot: "bg-violet-400" },
}

export function CourseMethodology() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [activePhase, setActivePhase] = useState<number | null>(null)
  const { t } = useLanguage()

  const stages = [
    { label: t("Discovery", "Discovery"), color: "cyan" },
    { label: t("Creación", "Creation"), color: "magenta" },
    { label: t("Validación", "Validation"), color: "amber" },
    { label: t("Entrega", "Delivery"), color: "violet" },
  ]

  const phases = [
    { id: 1, stage: 0, icon: Search, name: t("Discovery", "Discovery"), subtitle: t("Entendimiento profundo", "Deep understanding"), description: t("Investigación del problema, contexto del usuario y oportunidades de diseño. Defines el terreno antes de generar nada.", "Problem research, user context, and design opportunities. You define the terrain before generating anything."), outputs: [t("Mapa de contexto", "Context map"), t("User insights", "User insights"), t("Brief estratégico", "Strategic brief")], tools: ["ChatGPT", "Claude", "Miro"] },
    { id: 2, stage: 0, icon: Target, name: t("Problem Framing", "Problem Framing"), subtitle: t("Definición estructurada", "Structured definition"), description: t("Transformas la complejidad en un reto de diseño accionable. El criterio humano define qué vale la pena resolver.", "You turn complexity into an actionable design challenge. Human judgment defines what's worth solving."), outputs: [t("Problem statement", "Problem statement"), t("Hipótesis de diseño", "Design hypotheses"), t("Criterios de éxito", "Success criteria")], tools: ["Figma", "Claude", "FigJam"] },
    { id: 3, stage: 0, icon: MessageSquare, name: t("Prompt Systems", "Prompt Systems"), subtitle: t("Diseño de sistemas de prompts", "Prompt system design"), description: t("Diseñas sistemas de prompts estratégicos — no copias plantillas. Cada prompt responde a un objetivo de diseño claro.", "You design strategic prompt systems — not copy templates. Every prompt serves a clear design goal."), outputs: [t("Framework de prompts", "Prompt framework"), t("Librería de contextos", "Context library"), t("Cadenas de iteración", "Iteration chains")], tools: ["ChatGPT", "Claude", "Cursor"] },
    { id: 4, stage: 1, icon: Lightbulb, name: t("AI Ideation", "AI Ideation"), subtitle: t("Generación de opciones con IA", "Option generation with AI"), description: t("La IA genera decenas de posibilidades en minutos. Tú aprendes a evaluar cuáles tienen sentido real para el usuario.", "AI generates dozens of possibilities in minutes. You learn to evaluate which ones make real sense for the user."), outputs: [t("Opciones de diseño", "Design options"), t("Variantes de concepto", "Concept variants"), t("Divergencia controlada", "Controlled divergence")], tools: ["Midjourney", "v0", "Figma AI"] },
    { id: 5, stage: 1, icon: Users, name: t("User Validation", "User Validation"), subtitle: t("Validación con usuarios reales", "Validation with real users"), description: t("Antes de enamorarte de una idea, la enfrentas a usuarios reales. La IA genera — tú decides con evidencia.", "Before falling in love with an idea, you confront it with real users. AI generates — you decide with evidence."), outputs: [t("Feedback cualitativo", "Qualitative feedback"), t("Mapa de validación", "Validation map"), t("Decisiones documentadas", "Documented decisions")], tools: ["Figma", "Maze", "Loom"] },
    { id: 6, stage: 1, icon: Layers, name: t("Experience Refinement", "Experience Refinement"), subtitle: t("Refinamiento de la experiencia", "Experience refinement"), description: t("Iteras con criterio: cada cambio tiene una razón emocional, funcional y estratégica.", "You iterate with judgment: every change has an emotional, functional, and strategic reason."), outputs: [t("Prototipo refinado", "Refined prototype"), t("Flujos optimizados", "Optimized flows"), t("Sistema de interacciones", "Interaction system")], tools: ["Figma", "Framer", "Cursor"] },
    { id: 7, stage: 2, icon: Cpu, name: t("Product Logic", "Product Logic"), subtitle: t("Lógica de producto", "Product logic"), description: t("Conectas diseño con negocio. Cada decisión de UX resuelve un objetivo medible. La IA ejecuta — tú defines la lógica.", "You connect design with business. Every UX decision solves a measurable goal. AI executes — you define the logic."), outputs: [t("Árbol de decisiones", "Decision tree"), t("Flujos de negocio", "Business flows"), t("Especificaciones técnicas", "Technical specs")], tools: ["Claude", "Cursor", "Lovable"] },
    { id: 8, stage: 2, icon: Eye, name: t("Human Evaluation", "Human Evaluation"), subtitle: t("Evaluación humana del output", "Human evaluation of output"), description: t("Revisas todo lo que la IA generó con un framework de evaluación. Identificas lo que vale, lo que sobra y lo que falta.", "You review everything AI generated with an evaluation framework. You identify what's worth keeping, what's noise, and what's missing."), outputs: [t("Scorecards de evaluación", "Evaluation scorecards"), t("Análisis de calidad", "Quality analysis"), t("Reporte de criterio", "Judgment report")], tools: ["Figma", "Claude", "Notion"] },
    { id: 9, stage: 2, icon: Filter, name: t("Strategic Filtering", "Strategic Filtering"), subtitle: t("Filtrado estratégico · Método 90-10", "Strategic filtering · 90-10 Method"), description: t("Aplicas la Metodología 90-10: logras el 90% de productividad con el 10% de esfuerzo. Automatizas lo repetitivo y te enfocas en lo único.", "You apply the 90-10 Methodology: you reach 90% productivity with 10% effort. You automate the repetitive and focus on the unique."), outputs: [t("Framework 90-10", "90-10 framework"), t("Criterios de filtrado", "Filtering criteria"), t("Propuesta diferencial", "Differential proposal")], tools: ["Claude", "Figma", "FigJam"] },
    { id: 10, stage: 3, icon: Rocket, name: t("MVP Building", "MVP Building"), subtitle: t("Construcción del MVP", "MVP construction"), description: t("Construyes un producto funcional usando IA como copiloto de desarrollo. Velocidad con profundidad.", "You build a functional product using AI as a development copilot. Speed with depth."), outputs: [t("MVP funcional", "Functional MVP"), t("Sistema de componentes", "Component system"), t("Documentación técnica", "Technical documentation")], tools: ["Cursor", "v0", "Lovable"] },
    { id: 11, stage: 3, icon: LayoutGrid, name: t("UX Systems", "UX Systems"), subtitle: t("Sistemas de diseño UX", "UX design systems"), description: t("Diseñas sistemas escalables que mantienen coherencia cuando la IA genera componentes.", "You design scalable systems that maintain coherence when AI generates components."), outputs: [t("Design system", "Design system"), t("Tokens", "Tokens"), t("Guía de componentes", "Component guide")], tools: ["Figma", "Storybook", "Framer"] },
    { id: 12, stage: 3, icon: Diamond, name: t("Final Product Thinking", "Final Product Thinking"), subtitle: t("Pensamiento de producto final", "Final product thinking"), description: t("Integras todo: estrategia, diseño, validación y construcción. Tu producto final es humano, diferencial y potenciado por IA.", "You integrate everything: strategy, design, validation, and construction. Your final product is human, differentiated, and AI-powered."), outputs: [t("Producto final", "Final product"), t("Caso de estudio", "Case study"), t("Portfolio piece", "Portfolio piece")], tools: ["All tools", t("Presentación", "Presentation")] },
  ]

  return (
    <section id="metodologia" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[var(--cyan)]/[0.03] rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--magenta)]/[0.03] rounded-full blur-[180px]" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            {t("El sistema que te faltaba", "The system you were missing")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t("12 fases. Un camino claro. ", "12 phases. One clear path. ")}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("De la confusión al producto real.", "From confusion to real product.")}
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/50">
            {t(
              "No es un curso de herramientas. Es un journey de transformación donde aprendes a pensar, decidir y construir con IA en cada paso.",
              "It's not a tool course. It's a transformation journey where you learn to think, decide, and build with AI at every step."
            )}
          </p>
        </motion.div>

        {/* Workshop image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden mb-8 border border-foreground/[0.1]"
        >
          <Image
            src="/images/curso/methodology-workshop.png"
            alt={t("Workshop de metodología IA en acción", "AI methodology workshop in action")}
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-[var(--background)]/60" />
        </motion.div>

        {/* Stage pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14"
        >
          {stages.map((stage, i) => {
            const s = stageStyles[stage.color]
            return (
              <div key={i} className={`px-4 py-2 rounded-full ${s.border} ${s.bg} border`}>
                <span className={`text-xs font-medium ${s.text} tracking-wide`}>
                  {String(i + 1).padStart(2, '0')} — {stage.label}
                </span>
              </div>
            )
          })}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--cyan)]/20 via-[var(--magenta)]/20 to-violet-500/20 md:-translate-x-px" />

          <div className="space-y-6 md:space-y-12">
            {phases.map((phase, i) => {
              const stage = stages[phase.stage]
              const s = stageStyles[stage.color]
              const isLeft = i % 2 === 0
              const isActive = activePhase === i
              const Icon = phase.icon

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className={`relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-8 ${isLeft ? '' : 'md:direction-rtl'}`}
                >
                  {/* Node dot */}
                  <div className={`absolute left-4 md:left-1/2 top-6 w-5 h-5 rounded-full border-2 ${s.border} ${s.bg} md:-translate-x-1/2 z-10 transition-all duration-300 ${isActive ? 'scale-150 shadow-lg' : ''}`}>
                    <div className={`absolute inset-1 rounded-full ${isActive ? s.dot : 'bg-foreground/20'} transition-colors duration-300`} />
                  </div>

                  <div className={`${isLeft ? 'md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12 md:text-left'} md:direction-ltr`}>
                    <button onClick={() => setActivePhase(isActive ? null : i)} className="w-full text-left group">
                      <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 ${
                        isActive ? `${s.border} ${s.bg} shadow-xl` : 'border-foreground/[0.1] bg-foreground/[0.03] hover:border-foreground/20 hover:bg-foreground/[0.05]'
                      }`}>
                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${s.text}`} />
                          </div>
                          <span className={`text-xs font-mono ${s.text}`}>{t("Fase", "Phase")} {String(phase.id).padStart(2, '0')}</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{phase.name}</h3>
                        <p className="text-sm text-foreground/40 mb-3">{phase.subtitle}</p>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-foreground/50 leading-relaxed mb-4 text-left">{phase.description}</p>
                              <div className="grid grid-cols-2 gap-3 text-left">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-foreground/30 mb-2">Outputs</p>
                                  {phase.outputs.map((o, j) => (
                                    <p key={j} className="text-xs text-foreground/50 mb-1">→ {o}</p>
                                  ))}
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-foreground/30 mb-2">{t("Herramientas", "Tools")}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {phase.tools.map((tool, j) => (
                                      <span key={j} className={`px-2 py-0.5 text-[10px] rounded-full ${s.border} ${s.bg} ${s.text} border`}>
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className={`mt-3 text-xs ${s.text} opacity-60`}>
                          {isActive ? t("Clic para cerrar", "Click to close") : t("Clic para ver más →", "Click to see more →")}
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
