"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Microscope, Brain, Code2, BarChart3, ChevronRight, ArrowRight, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const services = [
  {
    icon: Microscope,
    titleEs: "Experiencias que tus usuarios recordarán",
    titleEn: "Experiences your users will remember",
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, var(--magenta), oklch(0.45 0.24 300))",
    image: "/images/service-ux-design-team.png",
    imageAltEs: "Equipo de diseño UX trabajando en wireframes y sistema de diseño",
    imageAltEn: "UX design team working on wireframes and design system",
    itemsEs: [
      "Investigación profunda de usuarios B2B y B2C",
      "Diseño de interacción y experiencia emocional",
      "Psicología del consumidor aplicada al diseño",
      "Arquitectura de información intuitiva",
      "Sistemas de diseño que escalan contigo",
      "Optimización de conversión (CRO)",
    ],
    itemsEn: [
      "Deep B2B and B2C user research",
      "Interaction and emotional experience design",
      "Consumer psychology applied to design",
      "Intuitive information architecture",
      "Design systems that scale with you",
      "Conversion rate optimization (CRO)",
    ],
    descriptionEs:
      "Tus usuarios no navegan flujos — navegan estados emocionales. Investigamos cómo piensan, qué sienten y qué los frena. Luego diseñamos experiencias que los hacen sentir seguros, comprendidos y listos para actuar.",
    descriptionEn:
      "Your users don't navigate flows — they navigate emotional states. We research how they think, what they feel, and what holds them back. Then we design experiences that make them feel safe, understood, and ready to act.",
    href: "/servicios/diseno-ux-ui",
    ctaEs: "Conoce el diseño UX/UI",
    ctaEn: "Explore UX/UI design",
  },
  {
    icon: Brain,
    titleEs: "De idea vaga a producto claro en días",
    titleEn: "From vague idea to clear product in days",
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, var(--cyan), oklch(0.55 0.18 220))",
    image: "/images/service-ai-discovery-team.png",
    imageAltEs: "Fundador trabajando en el discovery de producto con IA",
    imageAltEn: "Founder working on AI-powered product discovery",
    itemsEs: [
      "Discovery de producto acelerado con IA",
      "Validación rápida de ideas y conceptos",
      "Generación inteligente de requisitos",
      "Análisis competitivo automatizado",
      "Definición ágil de producto",
    ],
    itemsEn: [
      "AI-accelerated product discovery",
      "Rapid idea and concept validation",
      "Intelligent requirements generation",
      "Automated competitive analysis",
      "Agile product definition",
    ],
    descriptionEs:
      "¿Cuántas semanas llevas definiendo tu producto? UXBox comprime meses de discovery en días. Le cuentas tu idea, y nuestra IA genera una propuesta estructurada con requisitos, estrategia y conceptos de diseño.",
    descriptionEn:
      "How many weeks have you spent defining your product? UXBox compresses months of discovery into days. You describe your idea, and our AI generates a structured proposal with requirements, strategy, and design concepts.",
    href: "/servicios/discovery-con-ia",
    ctaEs: "Conoce el discovery con IA",
    ctaEn: "Explore AI discovery",
  },
  {
    icon: Code2,
    titleEs: "Código que tus usuarios nunca notarán (y eso es bueno)",
    titleEn: "Code your users will never notice (and that's good)",
    color: "var(--orange)",
    gradient: "linear-gradient(135deg, var(--orange), oklch(0.65 0.2 60))",
    image: "/images/service-dev-team.png",
    imageAltEs: "Desarrolladores revisando código en setup de monitores dual",
    imageAltEn: "Developers reviewing code on dual monitor setup",
    itemsEs: [
      "Plataformas web B2B y dashboards",
      "Apps móviles y experiencias B2C",
      "MVPs listos para validar en semanas",
      "Arquitecturas escalables en la nube",
      "Integraciones con IA y APIs",
    ],
    itemsEn: [
      "B2B web platforms and dashboards",
      "Mobile apps and B2C experiences",
      "MVPs ready to validate in weeks",
      "Scalable cloud architectures",
      "AI and API integrations",
    ],
    descriptionEs:
      "El mejor software es el que se siente invisible. Construimos productos con código limpio, arquitectura que crece contigo y un enfoque obsesivo en que cada interacción se sienta natural.",
    descriptionEn:
      "The best software feels invisible. We build products with clean code, architecture that scales with you, and an obsessive focus on making every interaction feel natural.",
    tech: ["React", "Next.js", "Node.js", "Cloud", "AI"],
    href: "/servicios/desarrollo-producto-digital",
    ctaEs: "Conoce el desarrollo de producto",
    ctaEn: "Explore product development",
  },
  {
    icon: BarChart3,
    titleEs: "Más conversión sin gastar más en tráfico",
    titleEn: "More conversion without spending more on traffic",
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, oklch(0.55 0.22 320), var(--magenta))",
    image: "/images/service-cro-saas-team.png",
    imageAltEs: "Equipo de growth analizando métricas de conversión en laptop",
    imageAltEn: "Growth team analyzing conversion metrics on laptop",
    itemsEs: [
      "Embudos de activación y onboarding",
      "Optimización de pricing y checkout",
      "Retención y expansión de planes",
      "Experimentación A/B basada en datos",
    ],
    itemsEn: [
      "Activation and onboarding funnels",
      "Pricing and checkout optimization",
      "Plan retention and expansion",
      "Data-driven A/B experimentation",
    ],
    descriptionEs:
      "Tu SaaS tiene tráfico, pero la conversión no sube. Analizamos comportamiento real y optimizamos cada punto de fricción — activación, retención y expansión — con datos, investigación de usuarios e IA.",
    descriptionEn:
      "Your SaaS has traffic, but conversion won't budge. We analyze real behavior and optimize every friction point — activation, retention, and expansion — with data, user research, and AI.",
    href: "/servicios/cro-saas",
    ctaEs: "Conoce el CRO para SaaS",
    ctaEn: "Explore CRO for SaaS",
  },
]

function ServiceCard({
  service,
  index,
  visible,
}: {
  service: (typeof services)[0]
  index: number
  visible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const { lang, localized } = useLanguage()
  const router = useRouter()
  const Icon = service.icon
  const title = lang === "es" ? service.titleEs : service.titleEn
  const description = lang === "es" ? service.descriptionEs : service.descriptionEn
  const items = lang === "es" ? service.itemsEs : service.itemsEn

  const handleNavigate = useCallback((e: React.MouseEvent) => {
    if (navigating || !service.href) return
    e.preventDefault()
    setNavigating(true)
    sessionStorage.setItem("homeScrollY", String(window.scrollY))
    router.push(localized(service.href))
  }, [navigating, service.href, router, localized])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col gap-6 p-8 rounded-3xl border border-border bg-card overflow-hidden cursor-default
        transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        hover:border-transparent hover:shadow-2xl ${navigating ? "opacity-70 pointer-events-none" : ""}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        boxShadow: hovered ? `0 24px 48px -12px ${service.color}33` : undefined,
      }}
    >
      {/* Loading overlay */}
      {navigating && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/60 backdrop-blur-[2px] rounded-3xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin" style={{ color: service.color }} />
            <span className="text-xs font-medium text-muted-foreground">{lang === "es" ? "Cargando experiencia…" : "Loading experience…"}</span>
          </div>
        </div>
      )}

      {/* Gradient accent on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          background: service.gradient,
          opacity: hovered ? 0.06 : 0,
        }}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: service.gradient }}
      >
        <Icon size={26} className="text-white" />
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-xl text-foreground">{title}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      {/* Human team photo */}
      {service.image && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden">
          <Image
            src={service.image}
            alt={lang === "es" ? (service.imageAltEs ?? "") : (service.imageAltEn ?? "")}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Subtle color overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
            style={{
              background: service.gradient,
              opacity: hovered ? 0.15 : 0,
            }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Items */}
      <ul className="flex flex-col gap-2" aria-label={`${title} services`}>
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
            <ChevronRight size={14} style={{ color: service.color }} className="shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      {/* Tech stack badges */}
      {service.tech && (
        <div className="flex flex-wrap gap-2 pt-2">
          {service.tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs font-medium border border-border bg-secondary text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Dedicated landing link (internal linking for SEO) */}
      {service.href && (
        <Link
          href={localized(service.href)}
          onClick={handleNavigate}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold mt-auto pt-2 transition-colors hover:underline ${navigating ? "cursor-wait" : ""}`}
          style={{ color: service.color }}
          aria-disabled={navigating}
        >
          {navigating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {lang === "es" ? "Cargando…" : "Loading…"}
            </>
          ) : (
            <>
              {lang === "es" ? service.ctaEs : service.ctaEn}
              <ArrowRight size={14} />
            </>
          )}
        </Link>
      )}
    </div>
  )
}

export function ServicesSection() {
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

  return (
    <section
      id="services"
      ref={ref}
      className="py-24 px-6 bg-secondary/30"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Image src="/images/ecosistema/Factory.svg" alt="UXFactory" width={110} height={30} className="h-7 w-auto dark:brightness-0 dark:invert dark:opacity-60 opacity-70" />
            <span className="w-px h-5 bg-border" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
              {t("Cómo te ayudamos", "How we help you")}
            </span>
          </div>
          <h2
            id="services-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "Tu producto necesita más que código bonito. Necesita entender a las personas.",
              "Your product needs more than beautiful code. It needs to understand people."
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "La mayoría de los productos fallan porque se saltan un paso: investigar qué necesitan sentir las personas que los van a usar. Nosotros empezamos por ahí — y luego diseñamos, construimos y optimizamos sin perder esa conexión humana.",
              "Most products fail because they skip one step: researching what the people who'll use them need to feel. That's where we start — then we design, build, and optimize without losing that human connection."
            )}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.titleEs} service={service} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
