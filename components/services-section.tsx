"use client"

import { useEffect, useRef, useState } from "react"
import { Microscope, Brain, Code2, ChevronRight } from "lucide-react"

const services = [
  {
    icon: Microscope,
    title: "Experiencias que tus usuarios recordarán",
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, var(--magenta), oklch(0.45 0.24 300))",
    items: [
      "Investigación profunda de usuarios B2B y B2C",
      "Diseño de interacción y experiencia emocional",
      "Psicología del consumidor aplicada al diseño",
      "Arquitectura de información intuitiva",
      "Sistemas de diseño que escalan contigo",
      "Optimización de conversión (CRO)",
    ],
    description:
      "Tus usuarios no navegan flujos — navegan estados emocionales. Investigamos cómo piensan, qué sienten y qué los frena. Luego diseñamos experiencias que los hacen sentir seguros, comprendidos y listos para actuar.",
  },
  {
    icon: Brain,
    title: "De idea vaga a producto claro en días",
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, var(--cyan), oklch(0.55 0.18 220))",
    items: [
      "Discovery de producto acelerado con IA",
      "Validación rápida de ideas y conceptos",
      "Generación inteligente de requisitos",
      "Análisis competitivo automatizado",
      "Definición ágil de producto",
    ],
    description:
      "¿Cuántas semanas llevas definiendo tu producto? UXBox comprime meses de discovery en días. Le cuentas tu idea, y nuestra IA genera una propuesta estructurada con requisitos, estrategia y conceptos de diseño.",
  },
  {
    icon: Code2,
    title: "Código que tus usuarios nunca notarán (y eso es bueno)",
    color: "var(--orange)",
    gradient: "linear-gradient(135deg, var(--orange), oklch(0.65 0.2 60))",
    items: [
      "Plataformas web B2B y dashboards",
      "Apps móviles y experiencias B2C",
      "MVPs listos para validar en semanas",
      "Arquitecturas escalables en la nube",
      "Integraciones con IA y APIs",
    ],
    description:
      "El mejor software es el que se siente invisible. Construimos productos con código limpio, arquitectura que crece contigo y un enfoque obsesivo en que cada interacción se sienta natural.",
    tech: ["React", "Next.js", "Node.js", "Cloud", "IA"],
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
  const Icon = service.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col gap-6 p-8 rounded-3xl border border-border bg-card overflow-hidden cursor-default
        transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        hover:border-transparent hover:shadow-2xl`}
      style={{
        transitionDelay: `${index * 120}ms`,
        boxShadow: hovered ? `0 24px 48px -12px ${service.color}33` : undefined,
      }}
    >
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
      <h3 className="font-display font-bold text-xl text-foreground">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {service.description}
      </p>

      {/* Items */}
      <ul className="flex flex-col gap-2" aria-label={`${service.title} services`}>
        {service.items.map((item) => (
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
    </div>
  )
}

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            Cómo te ayudamos
          </span>
          <h2
            id="services-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            Tu producto necesita más que código bonito. Necesita entender a las personas.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            La mayoría de los productos fallan porque se saltan un paso: investigar qué necesitan sentir las personas que los van a usar.
            Nosotros empezamos por ahí — y luego diseñamos, construimos y optimizamos sin perder esa conexión humana.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
