"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Search, Layers, ShieldCheck, Brain, Rocket, Users, Repeat, ClipboardCheck, Sparkles } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const stageStyles: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  cyan:    { border: "border-[var(--cyan)]/20", bg: "bg-[var(--cyan)]/[0.06]", text: "text-[var(--cyan)]", dot: "bg-[var(--cyan)]" },
  magenta: { border: "border-[var(--magenta)]/20", bg: "bg-[var(--magenta)]/[0.06]", text: "text-[var(--magenta)]", dot: "bg-[var(--magenta)]" },
}

export function CourseMethodology() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [activePhase, setActivePhase] = useState<number | null>(null)
  const { t } = useLanguage()

  const stages = [
    { label: t("Diseño Funcional", "Functional Design"), color: "cyan" },
    { label: t("Diseño para Masas", "Design for Masses"), color: "magenta" },
  ]

  const phases = [
    {
      id: 1, stage: 0, icon: Search,
      name: t("Investigación profunda con IA", "Deep AI-powered research"),
      subtitle: t("De la idea a la estrategia", "From idea to strategy"),
      description: t(
        "Aprendes a convertir una idea o problema en una base estratégica de experiencia digital usando IA. Investigas dolores reales, construyes hipótesis UX y estructuras prompts de investigación accionables.",
        "You learn to turn an idea or problem into a strategic digital experience foundation using AI. You research real pain points, build UX hypotheses, and structure actionable research prompts."
      ),
      outputs: [
        t("Documento estratégico", "Strategic document"),
        t("Hipótesis UX", "UX hypotheses"),
        t("Análisis de dolores reales", "Real pain point analysis"),
      ],
      tools: ["ChatGPT", "Claude", "Perplexity"],
    },
    {
      id: 2, stage: 0, icon: Layers,
      name: t("Prototipado inteligente", "Intelligent prototyping"),
      subtitle: t("Del insight al primer diseño", "From insight to first design"),
      description: t(
        "Refinas aplicaciones usando investigación aplicada y simulaciones humanas. Creas protopersonas, journey maps, entrevistas simuladas con IA y sistemas de diseño iniciales.",
        "You refine applications using applied research and human simulations. You create proto-personas, journey maps, AI-simulated interviews, and initial design systems."
      ),
      outputs: [
        t("Protopersonas y personas IA", "Proto-personas and AI personas"),
        t("Flujos navegables", "Navigable flows"),
        t("Arquitectura UX base", "Base UX architecture"),
      ],
      tools: ["UXPilot", "Figma", "Claude"],
    },
    {
      id: 3, stage: 0, icon: ShieldCheck,
      name: t("Auditoría técnica y cognitiva", "Technical & cognitive audit"),
      subtitle: t("Encuentra problemas antes que tus usuarios", "Find problems before your users do"),
      description: t(
        "La IA detecta problemas técnicos y cognitivos antes de pruebas reales. Aplicas ISO 9241, WCAG 2.2, recorridos cognitivos y auditorías automáticas.",
        "AI detects technical and cognitive problems before real testing. You apply ISO 9241, WCAG 2.2, cognitive walkthroughs, and automated audits."
      ),
      outputs: [
        t("Auditoría completa", "Complete audit"),
        t("Hallazgos priorizados", "Prioritized findings"),
        t("Recorridos cognitivos", "Cognitive walkthroughs"),
      ],
      tools: ["Lighthouse", "Claude", "ChatGPT"],
    },
    {
      id: 4, stage: 0, icon: Brain,
      name: t("Psicología visual y análisis cognitivo", "Visual psychology & cognitive analysis"),
      subtitle: t("Diseña para el cerebro, no para el ojo", "Design for the brain, not the eye"),
      description: t(
        "Aprendes cómo el diseño afecta la percepción y carga mental del usuario. Aplicas modelos GOMS, KLM, peso visual, jerarquía y diseño psicológico.",
        "You learn how design affects user perception and mental load. You apply GOMS and KLM models, visual weight, hierarchy, and psychological design."
      ),
      outputs: [
        t("Interfaz optimizada", "Optimized interface"),
        t("Carga cognitiva reducida", "Reduced cognitive load"),
        t("Análisis de percepción", "Perception analysis"),
      ],
      tools: ["Figma", "Claude", "ChatGPT"],
    },
    {
      id: 5, stage: 0, icon: Rocket,
      name: t("Consolidación UX y mercado", "UX consolidation & market readiness"),
      subtitle: t("De app funcional a producto real", "From functional app to real product"),
      description: t(
        "Conviertes una app funcional en un producto listo para mercado. Aplicas la Teoría de Garrett, análisis de grafos, microcopy UX y sistemas de diseño escalables.",
        "You turn a functional app into a market-ready product. You apply Garrett's theory, graph analysis, UX microcopy, and scalable design systems."
      ),
      outputs: [
        t("Versión funcional madura", "Mature functional version"),
        t("Sistemas escalables", "Scalable systems"),
        t("Microcopy UX", "UX microcopy"),
      ],
      tools: ["Figma", "FigJam", "Claude"],
    },
    {
      id: 6, stage: 1, icon: Users,
      name: t("Diseño conductual", "Behavioral design"),
      subtitle: t("Haz que la gente actúe", "Make people act"),
      description: t(
        "Diseñas experiencias para comportamiento humano y adopción masiva. Aplicas nudges, sesgos cognitivos (Thaler & Sunstein), framing, scarcity y persuasión ética.",
        "You design experiences for human behavior and mass adoption. You apply nudges, cognitive biases (Thaler & Sunstein), framing, scarcity, and ethical persuasion."
      ),
      outputs: [
        t("Rediseño conductual", "Behavioral redesign"),
        t("Mapa de sesgos aplicados", "Applied bias map"),
        t("Persuasión ética", "Ethical persuasion"),
      ],
      tools: ["Claude", "ChatGPT"],
    },
    {
      id: 7, stage: 1, icon: Repeat,
      name: t("Engagement y hábitos digitales", "Engagement & digital habits"),
      subtitle: t("Productos que generan repetición", "Products that generate repetition"),
      description: t(
        "Diseñas productos que generan repetición y permanencia. Aplicas el Modelo Fogg, Hooked Model de Nir Eyal, engagement loops y gamificación útil.",
        "You design products that generate repetition and permanence. You apply the Fogg Model, Nir Eyal's Hook Model, engagement loops, and useful gamification."
      ),
      outputs: [
        t("Loops de hábito", "Habit loops"),
        t("Sistema de retención", "Retention system"),
        t("Triggers contextuales", "Contextual triggers"),
      ],
      tools: ["Figma", "Claude", "ChatGPT"],
    },
    {
      id: 8, stage: 1, icon: ClipboardCheck,
      name: t("Validación real y diseño ético", "Real validation & ethical design"),
      subtitle: t("Feedback real, no suposiciones", "Real feedback, not assumptions"),
      description: t(
        "Validas aplicaciones maduras en contextos reales. Aplicas métricas SUS, NPS, CSAT, diseño consciente (Tristan Harris) y principios de Zero UI.",
        "You validate mature applications in real contexts. You apply SUS, NPS, CSAT metrics, conscious design (Tristan Harris), and Zero UI principles."
      ),
      outputs: [
        t("Resultados de pruebas reales", "Real test results"),
        t("Plan de iteración", "Iteration plan"),
        t("Framework ético", "Ethical framework"),
      ],
      tools: ["Maze", "Figma", "ChatGPT"],
    },
    {
      id: 9, stage: 1, icon: Sparkles,
      name: t("IA adaptativa y diseño consciente", "Adaptive AI & conscious design"),
      subtitle: t("Productos que evolucionan solos", "Products that evolve on their own"),
      description: t(
        "Construyes experiencias digitales evolutivas y éticas. Aplicas IA adaptativa, UX evolutivo, sistemas vivos y human-centered AI a escala.",
        "You build evolutionary and ethical digital experiences. You apply adaptive AI, evolutionary UX, living systems, and human-centered AI at scale."
      ),
      outputs: [
        t("Experiencia evolutiva", "Evolutionary experience"),
        t("Sistema adaptativo", "Adaptive system"),
        t("Producto final ético", "Ethical final product"),
      ],
      tools: ["Claude", "GPT", t("Automatizaciones IA", "AI Automations")],
    },
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
            {t("Una metodología, no un bootcamp", "A methodology, not a bootcamp")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t("9 módulos. 2 bloques. ", "9 modules. 2 blocks. ")}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("De la confusión al producto real.", "From confusion to real product.")}
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/50 mb-4">
            {t(
              "Un puente entre Diseño, Producto, Tecnología, Innovación, Desarrollo y Negocio. Cada módulo produce entregables que reducen retrabajo en equipos técnicos.",
              "A bridge between Design, Product, Technology, Innovation, Development, and Business. Each module produces deliverables that reduce rework for technical teams."
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {[
              t("UX/UI", "UX/UI"), t("Product Design", "Product Design"), t("AI-assisted Design", "AI-assisted Design"),
              t("Product Thinking", "Product Thinking"), t("Digital Architecture", "Digital Architecture"),
              t("UX Strategy", "UX Strategy"), t("Human-Centered AI", "Human-Centered AI"),
            ].map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-medium border curso-card text-foreground/50 dark:text-foreground/45">
                {tag}
              </span>
            ))}
          </div>
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
              <div key={i} className={`px-4 py-2 rounded-full ${s.border} ${s.bg} border whitespace-nowrap`}>
                <span className={`text-xs font-medium ${s.text} tracking-wide`}>
                  <span className="hidden sm:inline">{t("Bloque", "Block")} {String(i + 1).padStart(2, '0')} — </span>
                  <span className="sm:hidden">{t("B", "B")}{i + 1} · </span>
                  {stage.label}
                </span>
              </div>
            )
          })}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--cyan)]/20 via-[var(--magenta)]/20 to-[var(--magenta)]/10 md:-translate-x-px" />

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
                        isActive ? `${s.border} ${s.bg} shadow-xl` : 'curso-card hover:border-foreground/20'
                      }`}>
                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${s.text}`} />
                          </div>
                          <span className={`text-xs font-mono ${s.text}`}>{t("Módulo", "Module")} {String(phase.id).padStart(2, '0')}</span>
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
                                  <p className="text-[10px] uppercase tracking-wider text-foreground/30 mb-2">{t("Resultados", "Outcomes")}</p>
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

          {/* Checkpoint between blocks — visual separator in timeline */}
          {/* Already handled by color transition in the timeline line */}
        </div>
      </div>
    </section>
  )
}
