"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Search, Layers, ShieldCheck, Brain, Rocket,
  Users, Repeat, ClipboardCheck, Sparkles,
  ChevronDown, Download, Leaf
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseCurriculum() {
  const { t } = useLanguage()

  const blocks = [
    {
      id: "bloque1",
      icon: Layers,
      label: t("Bloque 1", "Block 1"),
      title: t("Diseño Funcional", "Functional Design"),
      subtitle: t("De la idea a una aplicación funcional y técnicamente sólida", "From idea to a functional and technically solid application"),
      color: "var(--cyan)",
      modules: [
        {
          icon: Search, number: "01",
          title: t("De Idea a Estrategia", "From Idea to Strategy"),
          subtitle: t("Investigación profunda con IA", "Deep research with AI"),
          problem: t("La mayoría de productos fallan porque arrancan sin entender el problema real.", "Most products fail because they start without understanding the real problem."),
          learns: [
            t("Investigar y validar ideas de negocio usando IA como analista", "Research and validate business ideas using AI as an analyst"),
            t("Detectar dolores reales de usuarios (no suposiciones)", "Detect real user pain points (not assumptions)"),
            t("Construir hipótesis UX basadas en datos", "Build UX hypotheses based on data"),
            t("Estructurar prompts de investigación accionables", "Structure actionable research prompts"),
          ],
          tools: ["ChatGPT", "Claude", "Perplexity", "Reddit Research"],
          deliverable: t("Documento estratégico y conceptual de tu aplicación.", "Strategic and conceptual document for your application."),
        },
        {
          icon: Layers, number: "02",
          title: t("Prototipado Inteligente", "Intelligent Prototyping"),
          subtitle: t("Del insight al primer diseño", "From insight to first design"),
          problem: t("Pasar de la investigación al diseño suele ser un salto al vacío.", "Going from research to design is usually a leap into the void."),
          learns: [
            t("Crear protopersonas y personas generadas con IA", "Create proto-personas and AI-generated personas"),
            t("Journey maps y mapas de empatía asistidos", "Assisted journey maps and empathy maps"),
            t("Entrevistas simuladas con IA", "AI-simulated interviews"),
            t("Sistemas de diseño y arquitectura UX base", "Design systems and base UX architecture"),
          ],
          tools: ["UXPilot", "Figma", "Claude", "ChatGPT"],
          deliverable: t("Primera versión refinada con flujos navegables y pantallas iniciales.", "First refined version with navigable flows and initial screens."),
        },
        {
          icon: ShieldCheck, number: "03",
          title: t("Auditoría Técnica", "Technical Audit"),
          subtitle: t("Encuentra los problemas antes que tus usuarios", "Find problems before your users do"),
          problem: t("Los equipos descubren errores de usabilidad cuando ya es tarde y caro.", "Teams discover usability errors when it's already late and expensive."),
          learns: [
            t("Estándares ISO 9241 y WCAG 2.2 con IA", "ISO 9241 and WCAG 2.2 standards with AI"),
            t("Recorridos cognitivos automatizados", "Automated cognitive walkthroughs"),
            t("Detección de problemas de accesibilidad y ergonomía", "Accessibility and ergonomics problem detection"),
            t("Auditorías que antes tomaban semanas", "Audits that used to take weeks"),
          ],
          tools: ["ChatGPT", "Claude", "Lighthouse", "Accessibility Tools"],
          deliverable: t("Auditoría técnica completa con hallazgos priorizados.", "Complete technical audit with prioritized findings."),
        },
        {
          icon: Brain, number: "04",
          title: t("Psicología Visual", "Visual Psychology"),
          subtitle: t("Diseña para el cerebro, no para el ojo", "Design for the brain, not the eye"),
          problem: t("Interfaces bonitas que confunden, sobrecargan o fatigan al usuario.", "Pretty interfaces that confuse, overload, or fatigue users."),
          learns: [
            t("Modelos GOMS y KLM para eficiencia de interacción", "GOMS and KLM models for interaction efficiency"),
            t("Peso visual, jerarquía y percepción cognitiva", "Visual weight, hierarchy, and cognitive perception"),
            t("Diseño psicológico y carga mental", "Psychological design and mental load"),
            t("Optimización visual basada en datos cognitivos", "Visual optimization based on cognitive data"),
          ],
          tools: ["Figma", "ChatGPT", "Claude"],
          deliverable: t("Interfaz optimizada con carga cognitiva reducida.", "Optimized interface with reduced cognitive load."),
        },
        {
          icon: Rocket, number: "05", wide: true,
          title: t("De App a Producto", "From App to Product"),
          subtitle: t("Consolidación UX y adaptación al mercado", "UX consolidation and market adaptation"),
          problem: t("Tener una app que funciona no significa que esté lista para usuarios reales.", "Having an app that works doesn't mean it's ready for real users."),
          learns: [
            t("Los 5 planos de Garrett aplicados con IA", "Garrett's 5 planes applied with AI"),
            t("Análisis de grafos para flujos huérfanos", "Graph analysis for orphan flows"),
            t("Microcopy UX que guía sin interrumpir", "UX microcopy that guides without interrupting"),
            t("Sistemas de diseño escalables", "Scalable design systems"),
            t("Handoff a desarrollo: estados, componentes, constraints y criterios responsive", "Development handoff: states, components, constraints, and responsive criteria"),
          ],
          tools: ["Figma", "FigJam", "Claude", "ChatGPT"],
          deliverable: t("Versión funcional madura con handoff base para frontend, lista para el Bloque 2.", "Mature functional version with base frontend handoff, ready for Block 2."),
        },
      ],
    },
    {
      id: "bloque2",
      icon: Users,
      label: t("Bloque 2", "Block 2"),
      title: t("Diseño para Masas", "Design for Masses"),
      subtitle: t("De producto funcional a producto que la gente adopta, usa y recomienda", "From functional product to one people adopt, use, and recommend"),
      color: "var(--magenta)",
      modules: [
        {
          icon: Users, number: "06",
          title: t("Diseño Conductual", "Behavioral Design"),
          subtitle: t("Haz que la gente actúe", "Make people act"),
          problem: t("Tu app puede ser perfecta técnicamente y que nadie la use.", "Your app can be technically perfect and no one uses it."),
          learns: [
            t("Nudges y arquitectura de decisiones (Thaler & Sunstein)", "Nudges and decision architecture (Thaler & Sunstein)"),
            t("Sesgos cognitivos aplicados: framing, scarcity, anchoring", "Applied cognitive biases: framing, scarcity, anchoring"),
            t("Behavioral design para lo que la gente HACE", "Behavioral design for what people actually DO"),
            t("Persuasión ética vs. manipulación", "Ethical persuasion vs. manipulation"),
          ],
          tools: ["Claude", "ChatGPT"],
          deliverable: t("Rediseño aplicando principios de comportamiento humano.", "Redesign applying human behavior principles."),
        },
        {
          icon: Repeat, number: "07",
          title: t("Engagement y Hábitos", "Engagement & Habits"),
          subtitle: t("Productos que generan repetición", "Products that generate repetition"),
          problem: t("Descargan tu app, la usan una vez y la olvidan.", "They download your app, use it once, and forget it."),
          learns: [
            t("Modelo de Fogg (motivación, habilidad, trigger)", "Fogg Model (motivation, ability, trigger)"),
            t("Modelo Hook de Nir Eyal", "Nir Eyal's Hook Model"),
            t("Engagement loops y sistemas de retención", "Engagement loops and retention systems"),
            t("Gamificación útil y triggers contextuales", "Useful gamification and contextual triggers"),
          ],
          tools: ["Figma", "Claude", "ChatGPT"],
          deliverable: t("App optimizada para engagement con loops de hábito.", "App optimized for engagement with habit loops."),
        },
        {
          icon: Leaf, number: "07+", optional: true,
          title: t("Diseño de Tendencias y UX Green", "Trend Design & UX Green"),
          subtitle: t("Diseño sostenible y tendencias emergentes", "Sustainable design and emerging trends"),
          problem: t("Los productos ignoran el impacto ambiental digital y las tendencias que definirán el mercado.", "Products ignore digital environmental impact and the trends that will define the market."),
          learns: [
            t("UX Green: diseño sostenible y eficiencia energética digital", "UX Green: sustainable design and digital energy efficiency"),
            t("Tendencias emergentes en diseño de producto", "Emerging trends in product design"),
            t("Diseño responsable y huella de carbono digital", "Responsible design and digital carbon footprint"),
            t("Frameworks de sostenibilidad aplicados a UX", "Sustainability frameworks applied to UX"),
          ],
          tools: ["Figma", "Claude", "Website Carbon"],
          deliverable: t("Auditoría de sostenibilidad + rediseño con principios UX Green.", "Sustainability audit + redesign with UX Green principles."),
        },
      ],
    },
    {
      id: "bloque3",
      icon: ShieldCheck,
      label: t("Bloque 3", "Block 3"),
      title: t("Validación Humana", "Human Validation"),
      subtitle: t("Valida con personas reales y prepara tu producto para evolucionar", "Validate with real people and prepare your product to evolve"),
      color: "#8b5cf6",
      modules: [
        {
          icon: ClipboardCheck, number: "08",
          title: t("Validación Real", "Real Validation"),
          subtitle: t("Feedback real, no suposiciones", "Real feedback, not assumptions"),
          problem: t("Diseñar sin feedback real produce productos que solo le gustan al equipo.", "Designing without real feedback produces products only the team likes."),
          learns: [
            t("Métricas SUS, NPS, CSAT — cuándo usar cada una", "SUS, NPS, CSAT metrics — when to use each"),
            t("Pruebas con usuarios reales", "Tests with real users"),
            t("Diseño consciente (framework Tristan Harris)", "Conscious design (Tristan Harris framework)"),
            t("Zero UI y atención reducida", "Zero UI and reduced attention"),
          ],
          tools: ["Maze", "Figma", "ChatGPT"],
          deliverable: t("Resultados de pruebas reales + plan de iteración.", "Real test results + iteration plan."),
        },
        {
          icon: Sparkles, number: "09",
          title: t("IA Adaptativa", "Adaptive AI"),
          subtitle: t("Productos que evolucionan solos", "Products that evolve on their own"),
          problem: t("Los productos estáticos mueren. El mercado y los usuarios cambian constantemente.", "Static products die. The market and users change constantly."),
          learns: [
            t("IA adaptativa: productos que aprenden del uso", "Adaptive AI: products that learn from usage"),
            t("UX evolutivo y sistemas vivos", "Evolutionary UX and living systems"),
            t("Human-centered AI a escala", "Human-centered AI at scale"),
            t("Ética digital avanzada para sistemas autónomos", "Advanced digital ethics for autonomous systems"),
          ],
          tools: ["Claude", "GPT", "Automatizaciones IA"],
          deliverable: t("Experiencia final preparada para evolucionar con IA.", "Final experience prepared to evolve with AI."),
        },
      ],
    },
  ]

  return (
    <section id="programa" className="relative py-14 md:py-20 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            {t("El programa · una metodología, no un bootcamp", "The program · a methodology, not a bootcamp")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t("9 módulos. 3 bloques. 1 producto real.", "9 modules. 3 blocks. 1 real product.")}
          </h2>
          <p className="max-w-4xl mx-auto text-lg text-foreground/50 mb-5">
            {t(
              "Un puente entre Diseño, Producto, Tecnología, Desarrollo y Negocio. Cada módulo construye sobre el anterior y deja entregables que reducen retrabajo — al final tienes un producto completo, no 9 ejercicios sueltos. ",
              "A bridge between Design, Product, Technology, Development, and Business. Each module builds on the previous and leaves deliverables that reduce rework — at the end you have a complete product, not 9 loose exercises. "
            )}
            <span className="font-bold text-foreground/70">{t("90% productividad. 10% esfuerzo.", "90% productivity. 10% effort.")}</span>
          </p>
          <div className="flex flex-nowrap justify-center gap-2 overflow-x-auto no-scrollbar px-2 mb-6">
            {[
              t("UX/UI", "UX/UI"), t("Product Design", "Product Design"), t("AI-assisted Design", "AI-assisted Design"),
              t("Product Thinking", "Product Thinking"), t("Digital Architecture", "Digital Architecture"),
              t("UX Strategy", "UX Strategy"), t("Human-Centered AI", "Human-Centered AI"),
            ].map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-medium border curso-card text-foreground/50 dark:text-foreground/45 whitespace-nowrap shrink-0">
                {tag}
              </span>
            ))}
          </div>
          <a
            href="/images/curso/Curso2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full text-sm font-semibold border border-[var(--cyan)]/30 hover:bg-[var(--cyan)]/10 transition-all duration-300"
            style={{ color: 'var(--cyan)' }}
          >
            <Download size={16} />
            {t("Descargar currículo en PDF", "Download curriculum PDF")}
          </a>
        </motion.div>

        {/* Workshop image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative w-full h-44 md:h-64 lg:h-72 rounded-2xl overflow-hidden mb-10 border border-foreground/[0.1]"
        >
          <Image
            src="/images/curso/programa.png"
            alt={t("Workshop de metodología IA en acción", "AI methodology workshop in action")}
            fill
            className="object-cover object-center opacity-90 brightness-110"
          />
        </motion.div>

        {/* Block headers — carousel on mobile, row on desktop */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 mb-8 md:mb-0 md:overflow-visible md:snap-none no-scrollbar md:grid md:grid-cols-3">
          {blocks.map((block) => (
            <a
              key={block.id}
              href={`#${block.id}`}
              className="flex-shrink-0 w-[85%] sm:w-auto snap-center md:snap-align-none cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(block.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              <div className="flex items-center gap-3 p-4 rounded-xl border curso-card hover:border-foreground/20 transition-all duration-300">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in srgb, ${block.color} 12%, transparent)` }}
                >
                  <block.icon className="w-4 h-4" style={{ color: block.color }} />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: block.color }}>{block.label}</span>
                  <h3 className="text-base font-bold text-foreground font-display truncate">{block.title}</h3>
                  <p className="text-[11px] text-foreground/40 truncate">{block.subtitle}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Blocks content */}
        <div className="space-y-16">
          {blocks.map((block) => (
            <div key={block.id} id={block.id}>
              {/* Block header — visible on desktop as section anchor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-6"
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in srgb, ${block.color} 12%, transparent)` }}
                >
                  <block.icon className="w-5 h-5" style={{ color: block.color }} />
                </span>
                <div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: block.color }}>{block.label}</span>
                  <h3 className="text-lg font-bold text-foreground font-display">{block.title}</h3>
                  <p className="text-xs text-foreground/40">{block.subtitle}</p>
                </div>
              </motion.div>

              {/* Modules grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {block.modules.map((mod, i) => (
                  <ModuleCard key={mod.number} mod={mod} blockColor={block.color} index={i} t={t} />
                ))}
              </div>

              {/* Checkpoints after blocks */}
              {block.id === "bloque1" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8 p-5 rounded-2xl border border-[var(--cyan)]/10 bg-[var(--cyan)]/[0.03] text-center"
                >
                  <p className="text-sm text-foreground/50">
                    <span className="font-semibold" style={{ color: 'var(--cyan)' }}>Checkpoint:</span>{" "}
                    {t(
                      "Al completar el Bloque 1, ya puedes construir aplicaciones funcionales con IA. Pero funcional no es suficiente — lo que sigue es lo que separa un proyecto de un producto.",
                      "After completing Block 1, you can build functional AI applications. But functional isn't enough — what follows is what separates a project from a product."
                    )}
                  </p>
                </motion.div>
              )}

              {/* Checkpoint after block 2 */}
              {block.id === "bloque2" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8 p-5 rounded-2xl border border-[var(--magenta)]/10 bg-[var(--magenta)]/[0.03] text-center"
                >
                  <p className="text-sm text-foreground/50">
                    <span className="font-semibold" style={{ color: 'var(--magenta)' }}>Checkpoint:</span>{" "}
                    {t(
                      "Tu producto ya genera engagement y hábitos. Ahora toca validar con personas reales y prepararlo para evolucionar.",
                      "Your product already generates engagement and habits. Now it's time to validate with real people and prepare it to evolve."
                    )}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ModuleCard({ mod, blockColor, index, t }: {
  mod: { icon: any; number: string; title: string; subtitle: string; problem: string; learns: string[]; tools: string[]; deliverable: string; optional?: boolean; wide?: boolean }
  blockColor: string; index: number; t: (es: string, en: string) => string
}) {
  const [open, setOpen] = useState(false)
  const Icon = mod.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
      className={mod.optional || mod.wide ? "md:col-span-2" : ""}
    >
      <div
        className={`relative rounded-2xl border curso-card hover:border-foreground/20 transition-all duration-300 overflow-hidden cursor-pointer ${mod.optional ? "border-dashed" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <div className="p-5 sm:p-6 flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
            style={{ background: `color-mix(in srgb, ${blockColor} 12%, transparent)` }}
          >
            <Icon className="w-5 h-5" style={{ color: blockColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap sm:flex-nowrap">
              <span className="text-[10px] font-mono shrink-0" style={{ color: blockColor }}>{mod.number}</span>
              {mod.optional && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border border-[var(--uxgreen,#00BFA6)]/30 bg-[var(--uxgreen,#00BFA6)]/10 text-[var(--uxgreen,#00BFA6)] shrink-0">
                  {t("Opcional", "Optional")}
                </span>
              )}
              <span className="text-[10px] text-foreground/20 hidden sm:inline">·</span>
              <span className="text-[10px] text-foreground/30 truncate hidden sm:inline">{mod.subtitle}</span>
            </div>
            <h3 className="text-base font-semibold text-foreground leading-snug">{mod.title}</h3>
            <p className="text-xs text-foreground/40 mt-1.5 italic">&quot;{mod.problem}&quot;</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-foreground/25 shrink-0 mt-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-foreground/[0.06]">
                <div className="pt-4 space-y-4">
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/30 mb-2 font-medium">{t("Lo que vas a aprender", "What you'll learn")}</p>
                    <ul className="space-y-1.5">
                      {mod.learns.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/50">
                          <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: blockColor }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/30 mb-2 font-medium">{t("Herramientas", "Tools")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.tools.map((tool, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-medium border curso-card text-foreground/50 dark:text-foreground/45">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-xl border curso-card">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/30 font-medium shrink-0 mt-0.5">{t("Entregable:", "Deliverable:")}</span>
                    <span className="text-sm text-foreground/50">{mod.deliverable}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
