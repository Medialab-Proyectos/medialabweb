"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Zap, Clock, Heart, Server, Lightbulb } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const reasons = [
    {
      icon: Brain,
      title: t(
        "Diseñamos para cómo tu usuario piensa, no para cómo tú crees que piensa",
        "We design for how your user thinks — not how you assume they think"
      ),
      description: t(
        "La mayoría de las agencias diseñan sobre suposiciones. Nosotros investigamos miedos, motivaciones y puntos de fricción reales antes de abrir Figma.",
        "Most agencies design on assumptions. We research real fears, motivations, and friction points before we open Figma."
      ),
      color: "var(--magenta)",
    },
    {
      icon: Zap,
      title: t(
        "Tu idea, clara y accionable en días (no meses)",
        "Your idea, clear and actionable in days (not months)"
      ),
      description: t(
        "UXBox comprimió meses de discovery en días para 40+ equipos. Le cuentas tu idea y nuestra IA te devuelve un roadmap real: requisitos, estrategia y diseño.",
        "UXBox compressed months of discovery into days for 40+ teams. You tell it your idea and our AI returns a real roadmap: requirements, strategy, and design."
      ),
      color: "var(--cyan)",
    },
    {
      icon: Clock,
      title: t(
        "Del concepto al MVP en semanas, no en trimestres",
        "From concept to MVP in weeks, not quarters"
      ),
      description: t(
        "Porque cada semana que tu producto no está en manos de usuarios reales es una semana de feedback perdido. Nos movemos rápido sin sacrificar calidad.",
        "Because every week your product isn't in real users' hands is a week of feedback lost. We move fast without sacrificing quality."
      ),
      color: "var(--orange)",
    },
    {
      icon: Heart,
      title: t(
        "Productos que la gente quiere volver a usar",
        "Products people want to come back to"
      ),
      description: t(
        "La retención no se logra con notificaciones push. Se logra cuando la experiencia se siente tan bien que el usuario regresa por decisión propia.",
        "Retention isn't won with push notifications. It's won when the experience feels so good the user returns on their own."
      ),
      color: "var(--magenta)",
    },
    {
      icon: Server,
      title: t(
        "Tecnología que crece contigo, no en tu contra",
        "Technology that grows with you, not against you"
      ),
      description: t(
        "React, Next.js, Node.js, Cloud. Código modular que tu equipo puede mantener. Nada de deuda técnica escondida ni arquitecturas que colapsen al escalar.",
        "React, Next.js, Node.js, Cloud. Modular code your team can maintain. No hidden technical debt or architectures that collapse at scale."
      ),
      color: "var(--cyan)",
    },
    {
      icon: Lightbulb,
      title: t(
        "Cada decisión pasa por un filtro: ¿mejora la vida del usuario?",
        "Every decision passes one filter: does it improve the user's life?"
      ),
      description: t(
        "No nos enamoramos de la tecnología. Nos enamoramos de resolver problemas reales. Si una funcionalidad no mejora la experiencia humana, no la construimos.",
        "We don't fall in love with technology. We fall in love with solving real problems. If a feature doesn't improve the human experience, we don't build it."
      ),
      color: "var(--orange)",
    },
  ]

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-[var(--surface-dark)] text-[var(--surface-dark-fg)] relative overflow-hidden transition-colors duration-300"
      aria-labelledby="why-us-heading"
    >
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--surface-dark-fg) 1px, transparent 1px), linear-gradient(90deg, var(--surface-dark-fg) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Lo que nos hace diferentes", "What makes us different")}
          </span>
          <h2
            id="why-us-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight dark:text-white text-foreground text-balance"
          >
            {t(
              "No somos la única opción. Somos la que entiende a tus usuarios.",
              "We're not your only option. We're the one that understands your users."
            )}
          </h2>
          <p className="text-base dark:text-white/60 text-muted-foreground leading-relaxed">
            {t(
              "Hay muchas agencias que diseñan bonito. Pocas que investigan antes de diseñar. Y casi ninguna que combina psicología del consumidor, IA y desarrollo en un solo equipo.",
              "Plenty of agencies design beautifully. Few research before they design. And almost none combine consumer psychology, AI, and development in a single team."
            )}
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className={`group flex flex-col gap-4 p-6 rounded-2xl border dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5
                  hover:dark:bg-white/8 hover:bg-foreground/8 hover:dark:border-white/20 hover:border-foreground/20 transition-all duration-300 cursor-default
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${reason.color}20`, border: `1px solid ${reason.color}40` }}
                >
                  <Icon size={20} style={{ color: reason.color }} />
                </div>
                <h3 className="font-semibold text-base dark:text-white text-foreground">{reason.title}</h3>
                <p className="text-sm dark:text-white/60 text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
