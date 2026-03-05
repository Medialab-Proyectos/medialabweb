"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    number: "01",
    title: "Describe tu idea",
    description: "Cuéntanos sobre tu idea o proyecto digital en lenguaje simple.",
  },
  {
    number: "02",
    title: "La IA analiza tu concepto",
    description: "Nuestra IA analiza tu concepto y genera un conjunto estructurado de requisitos de producto.",
  },
  {
    number: "03",
    title: "Conceptos de diseño",
    description: "Nuestro equipo de diseño prepara conceptos iniciales de producto y enfoques de UX.",
  },
  {
    number: "04",
    title: "Revisa y decide",
    description: "Revisas la propuesta y decides si avanzar con el desarrollo.",
  },
]

const benefits = [
  "Discovery de producto extremadamente rápido",
  "Menores costos de definición de producto",
  "Roadmap de producto digital claro",
  "Visualización temprana del diseño",
]

export function UXBoxSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="uxbox"
      ref={ref}
      className="py-24 px-6 bg-[var(--surface-dark)] text-[var(--surface-dark-fg)] overflow-hidden relative"
      aria-labelledby="uxbox-heading"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, var(--magenta), transparent 70%)", transform: "translate(30%, -30%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, var(--cyan), transparent 70%)", transform: "translate(-30%, 30%)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div
            className={`flex flex-col gap-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)] mb-4 block">
                Nuestra Plataforma
              </span>
              <h2
                id="uxbox-heading"
                className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-white text-balance"
              >
                UXBox — Convierte tu idea en producto digital{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, var(--magenta), var(--orange))" }}
                >
                  en días
                </span>
              </h2>
            </div>

            <p className="text-base text-white/70 leading-relaxed">
              UXBox es nuestra plataforma inteligente de descubrimiento de producto. En lugar de pasar meses
              definiendo requisitos, UXBox usa inteligencia artificial para transformar tu idea en una
              propuesta de producto estructurada.
            </p>

            {/* Benefits */}
            <ul className="flex flex-col gap-3" aria-label="UXBox benefits">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle size={18} style={{ color: "var(--cyan)" }} className="shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-black bg-white hover:bg-[var(--magenta)] hover:text-white transition-all duration-200 active:scale-95 w-fit"
            >
              Envía tu idea de proyecto
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Steps */}
          <div
            className={`flex flex-col gap-4 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="flex gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span
                  className="font-display font-bold text-2xl shrink-0 bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
                >
                  {step.number}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
