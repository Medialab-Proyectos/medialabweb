import { ArrowRight, Building2, HeartHandshake, LineChart, SearchCheck, ShieldCheck, UsersRound } from "lucide-react"
import Link from "next/link"

const audiences = [
  {
    icon: Building2,
    label: "Para equipos B2B",
    title: "Plataformas que reducen fricción operativa",
    description:
      "Convertimos procesos complejos en flujos claros para ventas, soporte, operaciones y clientes corporativos. Menos entrenamiento, menos errores y más adopción interna.",
    proof: "SaaS, dashboards, portales enterprise y herramientas internas",
  },
  {
    icon: HeartHandshake,
    label: "Para marcas B2C",
    title: "Experiencias que se sienten confiables desde el primer toque",
    description:
      "Diseñamos productos de consumo con claridad emocional: onboarding amable, microcopy humano, decisiones simples y momentos que invitan a volver.",
    proof: "Apps, e-commerce, fintech, educación, movilidad y comunidades",
  },
]

const pillars = [
  {
    icon: SearchCheck,
    title: "Intención de búsqueda",
    description: "Arquitectura de contenido para posicionar servicios, industrias, problemas y casos de uso reales.",
  },
  {
    icon: UsersRound,
    title: "Mapa emocional",
    description: "Identificamos dudas, motivaciones y puntos de ansiedad antes de diseñar cada pantalla clave.",
  },
  {
    icon: LineChart,
    title: "Conversión medible",
    description: "Optimizamos llamados a la acción, jerarquía visual y confianza para mover usuarios hacia una decisión.",
  },
  {
    icon: ShieldCheck,
    title: "Confianza técnica",
    description: "Unimos performance, accesibilidad, SEO técnico y arquitectura escalable para crecer con el producto.",
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
              Experiencia, SEO y crecimiento
            </span>
            <h2
              id="experience-design-heading"
              className="font-display text-3xl font-bold leading-tight text-foreground text-balance md:text-4xl lg:text-5xl"
            >
              Diseño de experiencia para ser encontrado, entendido y elegido
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            Una página no indexa ni convierte solo por verse bien. Necesita hablar el lenguaje de quien busca una
            solución, responder objeciones con honestidad y hacer que cada interacción se sienta segura, rápida y
            humana. Ese es el puente que construimos entre SEO, UX, IA, producto y ventas.
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
            Ideal para empresas que necesitan mejorar posicionamiento orgánico, activar demanda B2B, aumentar
            conversión B2C o rediseñar un producto digital sin perder la voz humana de la marca.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-[var(--magenta)] hover:text-white"
          >
            Diseñar mi experiencia
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
