"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Zap, Clock, Heart, Server, Lightbulb } from "lucide-react"

const reasons = [
  {
    icon: Brain,
    title: "Psicología del consumidor (B2C & B2B)",
    description:
      "Entendemos la psicología humana y la toma de decisiones — diseñamos experiencias digitales que influyen en el comportamiento y conectan emocionalmente con tus clientes B2C y aliados B2B.",
    color: "var(--magenta)",
  },
  {
    icon: Zap,
    title: "Discovery de producto con IA",
    description:
      "Nuestra plataforma UXBox usa IA para comprimir meses de definición de producto en días — con mayor precisión.",
    color: "var(--cyan)",
  },
  {
    icon: Clock,
    title: "Desarrollo de producto rápido",
    description:
      "Nos movemos rápido sin tomar atajos — procesos lean y ágiles que te mantienen avanzando de la idea al lanzamiento.",
    color: "var(--orange)",
  },
  {
    icon: Heart,
    title: "Experiencias digitales de alto engagement",
    description:
      "Diseñamos productos B2C a los que los usuarios vuelven y flujos B2B que aumentan la productividad — porque un gran diseño UX no solo es funcional, es genuinamente disfrutable.",
    color: "var(--magenta)",
  },
  {
    icon: Server,
    title: "Arquitecturas escalables",
    description:
      "Cada producto que construimos está diseñado para crecer — stacks tecnológicos modernos y limpios que escalan con tu negocio.",
    color: "var(--cyan)",
  },
  {
    icon: Lightbulb,
    title: "Innovación centrada en el humano",
    description:
      "Mantenemos a las personas reales en el centro de cada decisión — combinando datos, empatía y creatividad para resolver problemas difíciles.",
    color: "var(--orange)",
  },
]

export function WhyUsSection() {
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
      ref={ref}
      className="py-24 px-6 bg-[var(--surface-dark)] text-[var(--surface-dark-fg)] relative overflow-hidden"
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
            Por Qué MediaLab
          </span>
          <h2
            id="why-us-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-white text-balance"
          >
            Por qué las empresas B2B y marcas B2C eligen MediaLab
          </h2>
          <p className="text-base text-white/60 leading-relaxed">
            Traemos una combinación única de profundidad en investigación, capacidad de IA y excelencia en diseño
            que transforma ideas ambiciosas en productos digitales listos para el mercado.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className={`group flex flex-col gap-4 p-6 rounded-2xl border border-white/10 bg-white/5
                  hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-default
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${reason.color}20`, border: `1px solid ${reason.color}40` }}
                >
                  <Icon size={20} style={{ color: reason.color }} />
                </div>
                <h3 className="font-semibold text-base text-white">{reason.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
