"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Zap, Clock, Heart, Server, Lightbulb } from "lucide-react"

const reasons = [
  {
    icon: Brain,
    title: "Psicología del consumidor (B2C & B2B)",
    description:
      "Entendemos cómo piensan, sienten y deciden tus usuarios. Aplicamos ciencia del comportamiento para diseñar experiencias que conectan emocionalmente y generan acción.",
    color: "var(--magenta)",
  },
  {
    icon: Zap,
    title: "Discovery de producto con IA",
    description:
      "UXBox comprime meses de definición en días. Nuestra IA analiza tu idea y genera una propuesta estructurada con requisitos, estrategia UX y conceptos de diseño.",
    color: "var(--cyan)",
  },
  {
    icon: Clock,
    title: "Desarrollo de producto rápido",
    description:
      "De la idea al MVP en semanas, no meses. Procesos ágiles, validación continua y un equipo multidisciplinario que entiende tanto el negocio como la tecnología.",
    color: "var(--orange)",
  },
  {
    icon: Heart,
    title: "Experiencias digitales de alto engagement",
    description:
      "Diseñamos para que los usuarios regresen. Combinamos UX emocional, micro-interacciones y personalización para crear productos B2C memorables y plataformas B2B eficientes.",
    color: "var(--magenta)",
  },
  {
    icon: Server,
    title: "Arquitecturas escalables",
    description:
      "Construimos sobre React, Next.js, Node.js e infraestructura cloud. Código limpio, arquitectura modular y rendimiento optimizado para crecer con tu negocio.",
    color: "var(--cyan)",
  },
  {
    icon: Lightbulb,
    title: "Innovación centrada en el humano",
    description:
      "La tecnología al servicio de las personas, no al revés. Cada decisión de diseño y desarrollo pasa por un filtro: ¿mejora la vida del usuario?",
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
