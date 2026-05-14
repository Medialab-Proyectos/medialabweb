"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-label="About MediaLab Ingeniería"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div
          className={`flex flex-col gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            Tu producto tiene un problema
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            Tus usuarios abandonan{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--magenta), var(--cyan))" }}
            >
              porque tu producto no los entiende.
            </span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Sabes que tu producto tiene potencial. Pero algo no conecta: los usuarios llegan y se van, las conversiones no suben, el equipo diseña sin datos reales. El problema no es tu idea — es que nadie investigó qué necesitan sentir tus usuarios.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Nosotros empezamos por ahí. Combinamos psicología del consumidor, IA y diseño UX para que cada decisión de tu producto esté respaldada por evidencia real. El resultado: productos que la gente quiere usar y negocios que crecen.
          </p>
          <p className="text-base font-medium text-foreground leading-relaxed">
            Emocional. Medible. Humano.
          </p>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--magenta)] hover:gap-3 transition-all duration-200 w-fit"
          >
            Cuéntanos tu desafío →
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right: visual cards */}
        <div
          className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          aria-hidden="true"
        >
          <div className="col-span-2 rounded-2xl p-6 flex flex-col gap-3 text-white"
            style={{ background: "linear-gradient(135deg, var(--magenta), oklch(0.4 0.25 300))" }}>
            <span className="text-3xl font-display font-bold">UX + IA</span>
            <p className="text-sm text-white/80 leading-relaxed">
              Entendemos cómo piensan tus usuarios. La IA nos ayuda a hacerlo en días, no meses.
            </p>
          </div>
          <div className="rounded-2xl p-5 bg-[var(--surface-dark)] text-white flex flex-col gap-2">
            <span className="text-2xl font-display font-bold" style={{ color: "var(--cyan)" }}>Evidencia</span>
            <p className="text-xs text-white/60 leading-relaxed">Cada decisión respaldada por datos reales</p>
          </div>
          <div className="rounded-2xl p-5 flex flex-col gap-2"
            style={{ background: "linear-gradient(135deg, var(--orange), oklch(0.65 0.2 60))" }}>
            <span className="text-2xl font-display font-bold text-white">Impacto</span>
            <p className="text-xs text-white/80 leading-relaxed">Resultados que puedes medir desde el día uno</p>
          </div>
          <div className="col-span-2 rounded-2xl p-5 border border-border bg-card flex flex-col gap-2">
            <span className="text-lg font-display font-semibold text-foreground">
              Emocional. Medible. Humano.
            </span>
            <p className="text-sm text-muted-foreground">
              Productos que las personas quieren usar — y negocios que crecen gracias a eso.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
