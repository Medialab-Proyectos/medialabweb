import { ArrowRight, Building2, HeartHandshake, LineChart, SearchCheck, ShieldCheck, UsersRound } from "lucide-react"
import Link from "next/link"

const audiences = [
  {
    icon: Building2,
    label: "Si tu producto es B2B",
    title: "Tus equipos pierden horas en flujos que deberían ser simples",
    description:
      "Convertimos procesos internos complejos en experiencias claras que tu equipo adopta sin capacitación. Menos fricción operativa, menos tickets de soporte, más productividad real.",
    proof: "SaaS · Dashboards · Portales enterprise · Herramientas internas",
  },
  {
    icon: HeartHandshake,
    label: "Si tu producto es B2C",
    title: "Tus usuarios se van antes de entender lo que ofreces",
    description:
      "Diseñamos para que las personas sientan confianza desde el primer toque: onboarding que no abruma, microcopy que resuelve dudas y momentos que invitan a quedarse.",
    proof: "Apps · E-commerce · Fintech · Educación · Movilidad",
  },
]

const pillars = [
  {
    icon: SearchCheck,
    title: "Te encuentran",
    description: "Arquitectura de contenido para que Google entienda qué haces, para quién y por qué importa.",
  },
  {
    icon: UsersRound,
    title: "Te entienden",
    description: "Mapeamos las dudas, motivaciones y ansiedades de tu usuario antes de diseñar una sola pantalla.",
  },
  {
    icon: LineChart,
    title: "Te eligen",
    description: "Optimizamos cada punto de decisión para que la confianza supere las objeciones y el usuario actúe.",
  },
  {
    icon: ShieldCheck,
    title: "Se quedan",
    description: "Performance, accesibilidad y arquitectura técnica que hacen que la experiencia escale sin romperse.",
  },
]

export function ExperienceDesignSection() {
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
              El problema que casi nadie resuelve bien
            </span>
            <h2
              id="experience-design-heading"
              className="font-display text-3xl font-bold leading-tight text-foreground text-balance md:text-4xl lg:text-5xl"
            >
              Tu producto puede verse increíble y aun así perder usuarios. Aquí está la solución.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            Una interfaz bonita no indexa en Google, no resuelve objeciones y no convierte visitantes en clientes.
            Lo que sí funciona es diseñar desde la intención de búsqueda del usuario, responder sus miedos con honestidad
            y hacer que cada interacción se sienta segura. Ese es el puente que construimos.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {audiences.map((audience) => {
            const Icon = audience.icon
            return (
              <article
                key={audience.label}
                className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 md:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--magenta)] text-white">
                    <Icon size={21} />
                  </span>
                  <span className="text-sm font-semibold text-[var(--magenta)]">{audience.label}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-2xl font-bold leading-tight text-foreground">{audience.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{audience.description}</p>
                </div>
                <p className="mt-auto border-t border-border pt-4 text-sm font-medium text-foreground/80">
                  {audience.proof}
                </p>
              </article>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div key={pillar.title} className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/35 p-5">
                <Icon size={22} className="text-[var(--cyan)]" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
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
