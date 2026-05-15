"use client"

import { ArrowRight, Building2, HeartHandshake, LineChart, SearchCheck, ShieldCheck, UsersRound } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

const audiences = [
  {
    icon: Building2,
    labelEs: "Si tu producto es B2B",
    labelEn: "If your product is B2B",
    titleEs: "Tus equipos pierden horas en flujos que deberían ser simples",
    titleEn: "Your teams lose hours on flows that should be simple",
    descriptionEs:
      "Convertimos procesos internos complejos en experiencias claras que tu equipo adopta sin capacitación. Menos fricción operativa, menos tickets de soporte, más productividad real.",
    descriptionEn:
      "We turn complex internal processes into clear experiences your team adopts without training. Less operational friction, fewer support tickets, more real productivity.",
    proofEs: "SaaS · Dashboards · Portales enterprise · Herramientas internas",
    proofEn: "SaaS · Dashboards · Enterprise portals · Internal tools",
  },
  {
    icon: HeartHandshake,
    labelEs: "Si tu producto es B2C",
    labelEn: "If your product is B2C",
    titleEs: "Tus usuarios se van antes de entender lo que ofreces",
    titleEn: "Your users leave before understanding what you offer",
    descriptionEs:
      "Diseñamos para que las personas sientan confianza desde el primer toque: onboarding que no abruma, microcopy que resuelve dudas y momentos que invitan a quedarse.",
    descriptionEn:
      "We design so people feel confident from the first touch: onboarding that doesn't overwhelm, microcopy that answers questions, and moments that invite them to stay.",
    proofEs: "Apps · E-commerce · Fintech · Educación · Movilidad",
    proofEn: "Apps · E-commerce · Fintech · Education · Mobility",
  },
]

const pillars = [
  {
    icon: SearchCheck,
    titleEs: "Te encuentran",
    titleEn: "They find you",
    descriptionEs: "Arquitectura de contenido para que Google entienda qué haces, para quién y por qué importa.",
    descriptionEn: "Content architecture so Google understands what you do, for whom, and why it matters.",
  },
  {
    icon: UsersRound,
    titleEs: "Te entienden",
    titleEn: "They understand you",
    descriptionEs: "Mapeamos las dudas, motivaciones y ansiedades de tu usuario antes de diseñar una sola pantalla.",
    descriptionEn: "We map your users' doubts, motivations, and anxieties before designing a single screen.",
  },
  {
    icon: LineChart,
    titleEs: "Te eligen",
    titleEn: "They choose you",
    descriptionEs: "Optimizamos cada punto de decisión para que la confianza supere las objeciones y el usuario actúe.",
    descriptionEn: "We optimize every decision point so trust outweighs objections and users take action.",
  },
  {
    icon: ShieldCheck,
    titleEs: "Se quedan",
    titleEn: "They stay",
    descriptionEs: "Performance, accesibilidad y arquitectura técnica que hacen que la experiencia escale sin romperse.",
    descriptionEn: "Performance, accessibility, and technical architecture that let the experience scale without breaking.",
  },
]

export function ExperienceDesignSection() {
  const { lang, t } = useLanguage()
  return (
    <section
      id="experience-design"
      className="bg-background px-6 py-24"
      aria-labelledby="experience-design-heading"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="flex max-w-3xl flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--magenta)]">
              {t("El problema que casi nadie resuelve bien", "The problem almost no one solves well")}
            </span>
            <h2
              id="experience-design-heading"
              className="font-display text-3xl font-bold leading-tight text-foreground text-balance md:text-4xl lg:text-5xl"
            >
              {t(
                "Tu producto puede verse increíble y aun así perder usuarios. Aquí está la solución.",
                "Your product can look amazing and still lose users. Here's the fix."
              )}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t(
              "Una interfaz bonita no indexa en Google, no resuelve objeciones y no convierte visitantes en clientes. Lo que sí funciona es diseñar desde la intención de búsqueda del usuario, responder sus miedos con honestidad y hacer que cada interacción se sienta segura. Ese es el puente que construimos.",
              "A pretty interface doesn't rank on Google, doesn't resolve objections, and doesn't convert visitors into customers. What works is designing from user search intent, answering their fears honestly, and making every interaction feel safe. That's the bridge we build."
            )}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {audiences.map((audience) => {
            const Icon = audience.icon
            const label = t(audience.labelEs, audience.labelEn)
            const title = t(audience.titleEs, audience.titleEn)
            const description = t(audience.descriptionEs, audience.descriptionEn)
            const proof = t(audience.proofEs, audience.proofEn)
            return (
              <article
                key={audience.labelEs}
                className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 md:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--magenta)] text-white">
                    <Icon size={21} />
                  </span>
                  <span className="text-sm font-semibold text-[var(--magenta)]">{label}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-2xl font-bold leading-tight text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <p className="mt-auto border-t border-border pt-4 text-sm font-medium text-foreground/80">
                  {proof}
                </p>
              </article>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            const title = t(pillar.titleEs, pillar.titleEn)
            const description = t(pillar.descriptionEs, pillar.descriptionEn)
            return (
              <div key={pillar.titleEs} className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/35 p-5">
                <Icon size={22} className="text-[var(--cyan)]" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-start justify-between gap-5 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            ¿Tu producto necesita posicionarse mejor en Google, activar más demanda o rediseñar su experiencia 
            sin perder la voz humana de tu marca? Hablemos.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-[var(--magenta)] hover:text-white"
          >
            Quiero mejorar mi experiencia →
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
