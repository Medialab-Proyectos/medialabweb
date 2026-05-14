"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Search, Target, MessageSquare, Lightbulb, Users, Layers, Cpu, Eye, Filter, Rocket, LayoutGrid, Diamond } from "lucide-react"
import Image from "next/image"

const stages = [
  { label: "Discovery", color: "cyan" },
  { label: "Creación", color: "magenta" },
  { label: "Validación", color: "amber" },
  { label: "Entrega", color: "violet" },
]

const phases = [
  { id: 1, stage: 0, icon: Search, name: "Discovery", subtitle: "Entendimiento profundo", description: "Investigación del problema, contexto del usuario y oportunidades de diseño. Defines el terreno antes de generar nada.", outputs: ["Mapa de contexto", "User insights", "Brief estratégico"], tools: ["ChatGPT", "Claude", "Miro"] },
  { id: 2, stage: 0, icon: Target, name: "Problem Framing", subtitle: "Definición estructurada", description: "Transformas la complejidad en un reto de diseño accionable. El criterio humano define qué vale la pena resolver.", outputs: ["Problem statement", "Hipótesis de diseño", "Criterios de éxito"], tools: ["Figma", "Claude", "FigJam"] },
  { id: 3, stage: 0, icon: MessageSquare, name: "Prompt Systems", subtitle: "Diseño de sistemas de prompts", description: "Diseñas sistemas de prompts estratégicos — no copias plantillas. Cada prompt responde a un objetivo de diseño claro.", outputs: ["Framework de prompts", "Librería de contextos", "Cadenas de iteración"], tools: ["ChatGPT", "Claude", "Cursor"] },
  { id: 4, stage: 1, icon: Lightbulb, name: "AI Ideation", subtitle: "Generación de opciones con IA", description: "La IA genera decenas de posibilidades en minutos. Tú aprendes a evaluar cuáles tienen sentido real para el usuario.", outputs: ["Opciones de diseño", "Variantes de concepto", "Divergencia controlada"], tools: ["Midjourney", "v0", "Figma AI"] },
  { id: 5, stage: 1, icon: Users, name: "User Validation", subtitle: "Validación con usuarios reales", description: "Antes de enamorarte de una idea, la enfrentas a usuarios reales. La IA genera — tú decides con evidencia.", outputs: ["Feedback cualitativo", "Mapa de validación", "Decisiones documentadas"], tools: ["Figma", "Maze", "Loom"] },
  { id: 6, stage: 1, icon: Layers, name: "Experience Refinement", subtitle: "Refinamiento de la experiencia", description: "Iteras con criterio: cada cambio tiene una razón emocional, funcional y estratégica.", outputs: ["Prototipo refinado", "Flujos optimizados", "Sistema de interacciones"], tools: ["Figma", "Framer", "Cursor"] },
  { id: 7, stage: 2, icon: Cpu, name: "Product Logic", subtitle: "Lógica de producto", description: "Conectas diseño con negocio. Cada decisión de UX resuelve un objetivo medible. La IA ejecuta — tú defines la lógica.", outputs: ["Árbol de decisiones", "Flujos de negocio", "Especificaciones técnicas"], tools: ["Claude", "Cursor", "Lovable"] },
  { id: 8, stage: 2, icon: Eye, name: "Human Evaluation", subtitle: "Evaluación humana del output", description: "Revisas todo lo que la IA generó con un framework de evaluación. Identificas lo que vale, lo que sobra y lo que falta.", outputs: ["Scorecards de evaluación", "Análisis de calidad", "Reporte de criterio"], tools: ["Figma", "Claude", "Notion"] },
  { id: 9, stage: 2, icon: Filter, name: "Strategic Filtering", subtitle: "Filtrado estratégico · Método 90-10", description: "Aplicas la Metodología 90-10: logras el 90% de productividad con el 10% de esfuerzo. Automatizas lo repetitivo y te enfocas en lo único.", outputs: ["Framework 90-10", "Criterios de filtrado", "Propuesta diferencial"], tools: ["Claude", "Figma", "FigJam"] },
  { id: 10, stage: 3, icon: Rocket, name: "MVP Building", subtitle: "Construcción del MVP", description: "Construyes un producto funcional usando IA como copiloto de desarrollo. Velocidad con profundidad.", outputs: ["MVP funcional", "Sistema de componentes", "Documentación técnica"], tools: ["Cursor", "v0", "Lovable"] },
  { id: 11, stage: 3, icon: LayoutGrid, name: "UX Systems", subtitle: "Sistemas de diseño UX", description: "Diseñas sistemas escalables que mantienen coherencia cuando la IA genera componentes.", outputs: ["Design system", "Tokens", "Guía de componentes"], tools: ["Figma", "Storybook", "Framer"] },
  { id: 12, stage: 3, icon: Diamond, name: "Final Product Thinking", subtitle: "Pensamiento de producto final", description: "Integras todo: estrategia, diseño, validación y construcción. Tu producto final es humano, diferencial y potenciado por IA.", outputs: ["Producto final", "Caso de estudio", "Portfolio piece"], tools: ["All tools", "Presentación"] },
]

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

  return (
    <section id="metodologia" className="relative py-20 md:py-28 bg-[var(--surface-dark)] overflow-hidden">
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
            El sistema que te faltaba
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            12 fases. Un camino claro. <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">De la confusión al producto real.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/50">
            No es un curso de herramientas. Es un journey de transformación donde aprendes a pensar, decidir y construir con IA en cada paso.
          </p>
        </motion.div>

        {/* Workshop image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden mb-8 border border-white/[0.04]"
        >
          <Image
            src="/images/curso/methodology-workshop.png"
            alt="Workshop de metodología IA en acción"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-dark)] via-transparent to-[var(--surface-dark)]/60" />
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
                    <div className={`absolute inset-1 rounded-full ${isActive ? s.dot : 'bg-white/20'} transition-colors duration-300`} />
                  </div>

                  <div className={`${isLeft ? 'md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12 md:text-left'} md:direction-ltr`}>
                    <button onClick={() => setActivePhase(isActive ? null : i)} className="w-full text-left group">
                      <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 ${
                        isActive ? `${s.border} ${s.bg} shadow-xl` : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.03]'
                      }`}>
                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${s.text}`} />
                          </div>
                          <span className={`text-xs font-mono ${s.text}`}>Fase {String(phase.id).padStart(2, '0')}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--surface-dark-fg)] mb-1">{phase.name}</h3>
                        <p className="text-sm text-white/40 mb-3">{phase.subtitle}</p>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-white/50 leading-relaxed mb-4 text-left">{phase.description}</p>
                              <div className="grid grid-cols-2 gap-3 text-left">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Outputs</p>
                                  {phase.outputs.map((o, j) => (
                                    <p key={j} className="text-xs text-white/50 mb-1">→ {o}</p>
                                  ))}
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Herramientas</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {phase.tools.map((t, j) => (
                                      <span key={j} className={`px-2 py-0.5 text-[10px] rounded-full ${s.border} ${s.bg} ${s.text} border`}>
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className={`mt-3 text-xs ${s.text} opacity-60`}>
                          {isActive ? 'Clic para cerrar' : 'Clic para ver más →'}
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
