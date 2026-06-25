"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, SearchCheck, UsersRound, LineChart, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type LadderItem = {
  n: number
  icon: React.ElementType
  color: string
  titleEs: string; titleEn: string
  frontEs: string; frontEn: string
  backEs: string; backEn: string
}

const ladder: LadderItem[] = [
  {
    n: 1, icon: SearchCheck, color: "var(--magenta)",
    titleEs: "Te encuentran", titleEn: "They find you",
    frontEs: "Tu producto aparece donde tu cliente te busca.", frontEn: "Your product shows up where your customer looks for you.",
    backEs: "Arquitectura de contenido y SEO técnico para que Google —y las personas— entiendan qué haces y por qué importa.",
    backEn: "Content architecture and technical SEO so Google —and people— understand what you do and why it matters.",
  },
  {
    n: 2, icon: UsersRound, color: "var(--cyan)",
    titleEs: "Te entienden", titleEn: "They understand you",
    frontEs: "Cada pantalla habla el idioma de tu usuario.", frontEn: "Every screen speaks your user's language.",
    backEs: "Investigamos miedos, motivaciones y fricciones reales antes de diseñar una sola pantalla.",
    backEn: "We research real fears, motivations, and friction before designing a single screen.",
  },
  {
    n: 3, icon: LineChart, color: "var(--orange)",
    titleEs: "Te eligen", titleEn: "They choose you",
    frontEs: "La confianza supera a la objeción y el usuario actúa.", frontEn: "Trust outweighs objection and the user acts.",
    backEs: "Optimizamos cada punto de decisión (CRO) con datos de comportamiento real, no suposiciones.",
    backEn: "We optimize every decision point (CRO) with real behavioral data, not assumptions.",
  },
  {
    n: 4, icon: ShieldCheck, color: "#10b981",
    titleEs: "Se quedan", titleEn: "They stay",
    frontEs: "Vuelven por la experiencia, no por notificaciones.", frontEn: "They return for the experience, not for notifications.",
    backEs: "Performance, accesibilidad y arquitectura que escalan sin romperse, con un solo equipo end-to-end.",
    backEn: "Performance, accessibility, and architecture that scale without breaking, with one end-to-end team.",
  },
]

function FlipCard({ item }: { item: LadderItem }) {
  const [flipped, setFlipped] = useState(false)
  const { t } = useLanguage()
  const Icon = item.icon
  const color = item.color

  return (
    <div className="min-w-[82%] snap-start sm:min-w-0 h-[232px] [perspective:1400px]" style={{ ["--step" as string]: color }}>
      <div className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        {/* Frente */}
        <div className="value-card absolute inset-0 [backface-visibility:hidden] flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span
              className="font-display text-4xl font-bold leading-none bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 45%, transparent))` }}
            >
              0{item.n}
            </span>
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, border: `1px solid color-mix(in oklab, ${color} 32%, transparent)` }}
            >
              <Icon size={18} style={{ color }} />
            </span>
          </div>
          <h3 className="font-display font-bold text-xl text-foreground">{t(item.titleEs, item.titleEn)}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t(item.frontEs, item.frontEn)}</p>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold w-fit transition-all hover:gap-2.5"
            style={{ color }}
          >
            {t("Cómo lo logramos", "How we do it")}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Reverso */}
        <div
          className="value-card absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col gap-3 p-6 rounded-2xl border bg-card"
          style={{ borderColor: `color-mix(in oklab, ${color} 45%, transparent)` }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color }}>
            {t("Cómo lo logramos", "How we do it")}
          </span>
          <p className="text-sm text-foreground/80 leading-relaxed flex-1">{t(item.backEs, item.backEn)}</p>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground w-fit transition-colors"
          >
            <ArrowRight size={14} className="rotate-180" />
            {t("Volver", "Back")}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Sección de valor (id="about") — sobre nosotros + recorrido del usuario
 * en tarjetas que voltean para mostrar "cómo lo logramos".
 */
export function ValueSection() {
  const { t } = useLanguage()

  return (
    <section
      id="about"
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
        {/* Hook — sobre nosotros */}
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
              "Somos una agencia con más de 4 años de experiencia. Un equipo experto que combina psicología del consumidor, IA y diseño UX para que cada decisión tenga evidencia real — no suposiciones. Así construimos productos que la gente entiende, usa y recomienda.",
              "We're an agency with 4+ years of experience. An expert team that blends consumer psychology, AI, and UX design so every decision is backed by real evidence — not assumptions. That's how we build products people understand, use, and recommend."
            )}
          </p>
        </div>

        {/* Recorrido del usuario — tarjetas que voltean */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)]">{t("El recorrido de tu usuario", "Your user's journey")}</span>
            <p className="text-sm text-muted-foreground">{t("Voltea cada tarjeta para ver cómo lo logramos.", "Flip each card to see how we do it.")}</p>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ladder.map((item) => (
              <FlipCard key={item.titleEs} item={item} />
            ))}
          </div>
        </div>

        {/* Caja CTA — mismo estilo que la de "Cómo te ayudamos" */}
        <div
          className="rounded-2xl border border-border p-5 md:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: "linear-gradient(115deg, color-mix(in oklab, var(--magenta) 12%, transparent), transparent 42%), linear-gradient(300deg, color-mix(in oklab, var(--orange) 14%, transparent), transparent 48%), var(--card)" }}
        >
          <p className="text-base font-semibold text-foreground text-balance">
            {t("¿Tu producto pierde usuarios y no sabes por qué?", "Is your product losing users and you don't know why?")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:brightness-110 active:scale-95 w-full sm:w-auto"
              style={{ background: "var(--magenta)", boxShadow: "0 8px 30px color-mix(in oklab, var(--magenta) 30%, transparent)" }}
            >
              {t("Cuéntanos tu desafío", "Tell us your challenge")}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#uxbox"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-border text-foreground hover:bg-foreground/5 hover:border-foreground/30 transition-all active:scale-95 w-full sm:w-auto"
            >
              {t("Probar el UXBox gratis", "Try UXBox free")}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
