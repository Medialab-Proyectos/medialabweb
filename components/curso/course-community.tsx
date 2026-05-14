"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, MessageSquare, Lightbulb, Handshake, Zap, Globe } from "lucide-react"

const communityFeatures = [
  {
    icon: MessageSquare,
    title: "Discusiones semanales",
    description: "Comparte tus proyectos, recibe feedback real de la comunidad y discute tendencias en IA + UX.",
  },
  {
    icon: Lightbulb,
    title: "Sesiones de co-creación",
    description: "Sesiones en vivo donde resolvemos retos de diseño reales usando IA como copiloto colaborativo.",
  },
  {
    icon: Handshake,
    title: "Red de colaboración",
    description: "Conecta con diseñadores, developers y product managers que comparten tu visión sobre IA y producto.",
  },
  {
    icon: Zap,
    title: "Recursos exclusivos",
    description: "Acceso a prompts, frameworks, plantillas y herramientas actualizadas por la comunidad.",
  },
  {
    icon: Globe,
    title: "Eventos y speakers",
    description: "Invitados especiales de la industria comparten su experiencia aplicando IA en diseño de producto.",
  },
  {
    icon: Users,
    title: "Mentoría entre pares",
    description: "Sistema de parejas de mentoría donde creces enseñando y aprendiendo de otros profesionales.",
  },
]

export function CourseCommunity() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-24 md:py-32 bg-[var(--surface-dark)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-[var(--cyan)]/[0.04] rounded-full blur-[200px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--magenta)]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.06]">
                <Users size={14} style={{ color: 'var(--cyan)' }} />
                <span className="text-xs tracking-[0.15em] uppercase font-medium" style={{ color: 'var(--cyan)' }}>
                  Acceso de por vida
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-[1.15] mb-5 font-display">
              No terminas el curso.{" "}
              <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
                Entras a una comunidad.
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-foreground/50 leading-relaxed">
              Al graduarte, te unes a la comunidad continua de UX + IA de MediaLab — un espacio para compartir proyectos, colaborar en retos reales y seguir creciendo junto a profesionales que piensan como tú.
            </p>
            <p className="max-w-xl mx-auto text-sm text-foreground/35 mt-3">
              Cada persona que se une hace la comunidad más valiosa para todos. Más perspectivas, más proyectos, más oportunidades.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {communityFeatures.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                  className="group p-6 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/[0.1] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-foreground/[0.08] bg-foreground/[0.03] group-hover:border-[var(--cyan)]/30 transition-colors duration-300">
                    <Icon size={18} className="text-foreground/50 group-hover:text-[var(--cyan)] transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--surface-dark-fg)] mb-2">{feature.title}</h3>
                  <p className="text-xs text-foreground/45 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom highlight */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-12 p-6 md:p-8 rounded-2xl border border-[var(--cyan)]/[0.12] bg-[var(--cyan)]/[0.03] text-center">
            <p className="text-lg md:text-xl font-medium text-[var(--surface-dark-fg)] mb-2 font-display">
              La IA evoluciona cada semana. Tu comunidad también.
            </p>
            <p className="text-sm text-foreground/40 max-w-lg mx-auto">
              Mientras otros profesionales se quedan solos después de un curso, tú tendrás un equipo permanente para navegar cada cambio en la industria.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
