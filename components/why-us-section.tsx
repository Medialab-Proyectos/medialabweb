"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Zap, Clock, Heart, Server, Lightbulb } from "lucide-react"

const reasons = [
  {
    icon: Brain,
    title: "Diseñamos para cómo tu usuario piensa, no para cómo tú crees que piensa",
    description:
      "La mayoría de las agencias diseñan sobre suposiciones. Nosotros investigamos miedos, motivaciones y puntos de fricción reales antes de abrir Figma.",
    color: "var(--magenta)",
  },
  {
    icon: Zap,
    title: "Tu idea, clara y accionable en días (no meses)",
    description:
      "UXBox comprimió meses de discovery en días para 40+ equipos. Le cuentas tu idea y nuestra IA te devuelve un roadmap real: requisitos, estrategia y diseño.",
    color: "var(--cyan)",
  },
  {
    icon: Clock,
    title: "Del concepto al MVP en semanas, no en trimestres",
    description:
      "Porque cada semana que tu producto no está en manos de usuarios reales es una semana de feedback perdido. Nos movemos rápido sin sacrificar calidad.",
    color: "var(--orange)",
  },
  {
    icon: Heart,
    title: "Productos que la gente quiere volver a usar",
    description:
      "La retención no se logra con notificaciones push. Se logra cuando la experiencia se siente tan bien que el usuario regresa por decisión propia.",
    color: "var(--magenta)",
  },
  {
    icon: Server,
    title: "Tecnología que crece contigo, no en tu contra",
    description:
      "React, Next.js, Node.js, Cloud. Código modular que tu equipo puede mantener. Nada de deuda técnica escondida ni arquitecturas que colapsen al escalar.",
    color: "var(--cyan)",
  },
  {
    icon: Lightbulb,
    title: "Cada decisión pasa por un filtro: ¿mejora la vida del usuario?",
    description:
      "No nos enamoramos de la tecnología. Nos enamoramos de resolver problemas reales. Si una funcionalidad no mejora la experiencia humana, no la construimos.",
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
            Lo que nos hace diferentes
          </span>
          <h2
            id="why-us-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-white text-balance"
          >
            No somos la única opción. Somos la que entiende a tus usuarios.
          </h2>
          <p className="text-base text-white/60 leading-relaxed">
            Hay muchas agencias que diseñan bonito. Pocas que investigan antes de diseñar. 
            Y casi ninguna que combina psicología del consumidor, IA y desarrollo en un solo equipo.
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
