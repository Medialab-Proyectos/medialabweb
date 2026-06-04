"use client"

import { motion } from "framer-motion"
import { Users, MessageSquare, Lightbulb, Handshake, Zap, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseCommunity() {
  const { t } = useLanguage()

  const communityFeatures = [
    {
      icon: MessageSquare,
      title: t("Discusiones semanales", "Weekly discussions"),
      description: t(
        "Comparte proyectos, recibe feedback real y discute tendencias IA + UX.",
        "Share projects, get real feedback, and discuss AI + UX trends."
      ),
    },
    {
      icon: Lightbulb,
      title: t("Sesiones de co-creación", "Co-creation sessions"),
      description: t(
        "Retos de diseño reales resueltos en vivo con IA como copiloto.",
        "Real design challenges solved live with AI as copilot."
      ),
    },
    {
      icon: Handshake,
      title: t("Red de colaboración", "Collaboration network"),
      description: t(
        "Diseñadores, developers y PMs que comparten tu visión.",
        "Designers, developers, and PMs who share your vision."
      ),
    },
    {
      icon: Zap,
      title: t("Recursos exclusivos", "Exclusive resources"),
      description: t(
        "Prompts, frameworks, plantillas actualizados por la comunidad.",
        "Prompts, frameworks, templates updated by the community."
      ),
    },
    {
      icon: Globe,
      title: t("Eventos y speakers", "Events & speakers"),
      description: t(
        "Invitados de la industria comparten IA aplicada a producto.",
        "Industry guests share applied AI in product."
      ),
    },
    {
      icon: Users,
      title: t("Mentoría entre pares", "Peer mentorship"),
      description: t(
        "Creces enseñando y aprendiendo de otros profesionales.",
        "Grow by teaching and learning from other professionals."
      ),
    },
  ]

  return (
    <section id="comunidad" className="relative py-14 md:py-20 bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-[var(--cyan)]/[0.04] rounded-full blur-[200px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--magenta)]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
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
          </div>

          {/* Features — carousel on mobile, grid on desktop */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible sm:snap-none sm:pb-0">
            {communityFeatures.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                  className="group p-5 rounded-xl border curso-card hover:border-[var(--cyan)]/25 transition-all duration-300 flex-shrink-0 w-[80%] sm:w-auto snap-center"
                >
                  <Icon size={16} className="text-foreground/40 group-hover:text-[var(--cyan)] transition-colors duration-300 mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-xs text-foreground/55 dark:text-foreground/40 leading-snug">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <a
              href="#registro"
              className="flex items-center justify-center gap-2 w-full max-w-xl mx-auto px-8 py-4 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_8px_28px_-6px_rgba(42,171,179,0.5)]"
              style={{ background: "linear-gradient(135deg, var(--cyan), color-mix(in srgb, var(--cyan) 70%, var(--magenta)))" }}
            >
              <Users size={16} />
              {t("Unirme a la comunidad →", "Join the community →")}
            </a>
            <p className="mt-3 text-xs text-foreground/40">
              {t("Incluido con tu inscripción al curso — acceso de por vida.", "Included with your course enrollment — lifetime access.")}
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
