"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, SearchCheck, UsersRound, LineChart, ShieldCheck, Brain, Zap, Layers } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Sección de valor — fusiona lo esencial de About + ExperienceDesign + WhyUs
 * en una sola pieza sin redundancia. Conserva id="about" para el nav del home.
 */
export function ValueSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const ladder = [
    {
      n: "01", icon: SearchCheck, color: "var(--magenta)",
      titleEs: "Te encuentran", titleEn: "They find you",
      descEs: "Arquitectura y contenido para que Google —y tus clientes— sepan qué haces y por qué importa.",
      descEn: "Architecture and content so Google —and your customers— know what you do and why it matters.",
    },
    {
      n: "02", icon: UsersRound, color: "var(--cyan)",
      titleEs: "Te entienden", titleEn: "They understand you",
      descEs: "Mapeamos miedos, motivaciones y fricciones de tu usuario antes de diseñar una sola pantalla.",
      descEn: "We map your users' fears, motivations, and friction before designing a single screen.",
    },
    {
      n: "03", icon: LineChart, color: "var(--orange)",
      titleEs: "Te eligen", titleEn: "They choose you",
      descEs: "Optimizamos cada punto de decisión para que la confianza supere a la objeción.",
      descEn: "We optimize every decision point so trust outweighs objection.",
    },
    {
      n: "04", icon: ShieldCheck, color: "var(--magenta)",
      titleEs: "Se quedan", titleEn: "They stay",
      descEs: "Producto, performance y arquitectura que escalan sin romperse. Retención por experiencia, no por notificaciones.",
      descEn: "Product, performance, and architecture that scale without breaking. Retention through experience, not notifications.",
    },
  ]

  const diffs = [
    {
      icon: Brain,
      titleEs: "Investigamos antes de diseñar", titleEn: "We research before we design",
      descEs: "Nada de suposiciones: cada decisión nace de datos de comportamiento real.",
      descEn: "No assumptions: every decision starts from real behavioral data.",
    },
    {
      icon: Zap,
      titleEs: "Claridad en días, no meses", titleEn: "Clarity in days, not months",
      descEs: "UXBox comprime el discovery con IA y un equipo humano lo valida.",
      descEn: "UXBox compresses discovery with AI, validated by a human team.",
    },
    {
      icon: Layers,
      titleEs: "Un solo equipo, end-to-end", titleEn: "One team, end-to-end",
      descEs: "Research, diseño y desarrollo sin intermediarios ni traspasos.",
      descEn: "Research, design, and development with no middlemen or hand-offs.",
    },
  ]

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-12 md:py-24 px-6 bg-background overflow-hidden"
      aria-labelledby="value-heading"
    >
      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] pointer-events-none ambient-glow"
        style={{ background: "radial-gradient(ellipse at center, rgba(230,0,126,0.08), transparent 60%)" }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
        {/* Hook */}
        <div className="flex flex-col gap-5 max-w-3xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Por qué nos eligen", "Why teams choose us")}
          </span>
          <h2 id="value-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            {t("Tus usuarios no se van por tu idea.", "Your users don't leave because of your idea.")}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, var(--magenta), var(--cyan))" }}>
              {t("Se van porque algo no los hace sentir seguros.", "They leave because something doesn't make them feel safe.")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {t(
              "Unimos psicología del consumidor, IA y diseño UX para que cada decisión tenga evidencia real — no suposiciones. Así construimos productos que la gente entiende, usa y recomienda.",
              "We combine consumer psychology, AI, and UX design so every decision is backed by real evidence — not assumptions. That's how we build products people understand, use, and recommend."
            )}
          </p>
        </div>

        {/* Value ladder — te encuentran → entienden → eligen → se quedan (carrusel en móvil) */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ladder.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={p.titleEs}
                className={`group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl min-w-[80%] snap-start sm:min-w-0 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ background: `${p.color}18`, border: `1px solid ${p.color}33` }}>
                    <Icon size={20} style={{ color: p.color }} />
                  </div>
                  <span className="font-display font-bold text-2xl tabular-nums" style={{ color: p.color, opacity: 0.22 }}>{p.n}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-foreground">{t(p.titleEs, p.titleEn)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(p.descEs, p.descEn)}</p>
              </div>
            )
          })}
        </div>

        {/* Diferenciadores + CTA */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center rounded-3xl border border-border bg-secondary/30 p-6 md:p-10">
          <div className="grid gap-6 sm:grid-cols-3">
            {diffs.map((d) => {
              const Icon = d.icon
              return (
                <div key={d.titleEs} className="flex flex-col gap-2">
                  <Icon size={22} className="text-[var(--cyan)]" />
                  <h3 className="font-semibold text-foreground leading-snug">{t(d.titleEs, d.titleEn)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(d.descEs, d.descEn)}</p>
                </div>
              )
            })}
          </div>
          <div className="flex flex-col gap-4 lg:items-end lg:text-right">
            <p className="text-base font-medium text-foreground text-balance">
              {t("¿Tu producto pierde usuarios y no sabes por qué?", "Is your product losing users and you don't know why?")}
            </p>
            <Link
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:brightness-110 active:scale-95 w-full sm:w-auto"
              style={{ background: "var(--magenta)" }}
            >
              {t("Cuéntanos tu desafío", "Tell us your challenge")}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
