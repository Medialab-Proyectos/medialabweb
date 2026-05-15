"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, MessageSquare, Lightbulb, Handshake, Zap, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseCommunity() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const communityFeatures = [
    {
      icon: MessageSquare,
      title: t("Discusiones semanales", "Weekly discussions"),
      description: t(
        "Comparte tus proyectos, recibe feedback real de la comunidad y discute tendencias en IA + UX.",
        "Share your projects, get real community feedback, and discuss trends in AI + UX."
      ),
    },
    {
      icon: Lightbulb,
      title: t("Sesiones de co-creación", "Co-creation sessions"),
      description: t(
        "Sesiones en vivo donde resolvemos retos de diseño reales usando IA como copiloto colaborativo.",
        "Live sessions where we solve real design challenges using AI as a collaborative copilot."
      ),
    },
    {
      icon: Handshake,
      title: t("Red de colaboración", "Collaboration network"),
      description: t(
        "Conecta con diseñadores, developers y product managers que comparten tu visión sobre IA y producto.",
        "Connect with designers, developers, and product managers who share your vision on AI and product."
      ),
    },
    {
      icon: Zap,
      title: t("Recursos exclusivos", "Exclusive resources"),
      description: t(
        "Acceso a prompts, frameworks, plantillas y herramientas actualizadas por la comunidad.",
        "Access to prompts, frameworks, templates, and tools kept up-to-date by the community."
      ),
    },
    {
      icon: Globe,
      title: t("Eventos y speakers", "Events & speakers"),
      description: t(
        "Invitados especiales de la industria comparten su experiencia aplicando IA en diseño de producto.",
        "Special industry guests share their experience applying AI in product design."
      ),
    },
    {
      icon: Users,
      title: t("Mentoría entre pares", "Peer mentorship"),
      description: t(
        "Sistema de parejas de mentoría donde creces enseñando y aprendiendo de otros profesionales.",
        "A pair-mentorship system where you grow by teaching and learning from other professionals."
      ),
    },
  ]

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
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
                  {t("Acceso de por vida", "Lifetime access")}
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.15] mb-5 font-display">
              {t("No terminas el curso.", "You don't finish the course.")}{" "}
              <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
                {t("Entras a una comunidad.", "You join a community.")}
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-foreground/50 leading-relaxed">
              {t(
                "Al graduarte, te unes a la comunidad continua de UX + IA de MediaLab — un espacio para compartir proyectos, colaborar en retos reales y seguir creciendo junto a profesionales que piensan como tú.",
                "When you graduate, you join MediaLab's ongoing UX + AI community — a space to share projects, collaborate on real challenges, and keep growing alongside professionals who think like you."
              )}
            </p>
            <p className="max-w-xl mx-auto text-sm text-foreground/35 mt-3">
              {t(
                "Cada persona que se une hace la comunidad más valiosa para todos. Más perspectivas, más proyectos, más oportunidades.",
                "Every person who joins makes the community more valuable for everyone. More perspectives, more projects, more opportunities."
              )}
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
                  <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xs text-foreground/45 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom highlight */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-12 p-6 md:p-8 rounded-2xl border border-[var(--cyan)]/[0.12] bg-[var(--cyan)]/[0.03] text-center">
            <p className="text-lg md:text-xl font-medium text-foreground mb-2 font-display">
              {t("La IA evoluciona cada semana. Tu comunidad también.", "AI evolves every week. So does your community.")}
            </p>
            <p className="text-sm text-foreground/40 max-w-lg mx-auto">
              {t(
                "Mientras otros profesionales se quedan solos después de un curso, tú tendrás un equipo permanente para navegar cada cambio en la industria.",
                "While other professionals are on their own after a course, you'll have a permanent team to navigate every shift in the industry."
              )}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
