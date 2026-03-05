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
            Sobre Nosotros
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            Diseñamos experiencias que{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--magenta), var(--cyan))" }}
            >
              transforman industrias
            </span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            MediaLab Ingeniería es una agencia de diseño de experiencias digitales especializada en comportamiento humano.
            Nuestro trabajo combina investigación UX, estrategia de producto, inteligencia artificial y diseño conductual
            para crear soluciones digitales innovadoras, escalables y significativas.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Nos enfocamos en optimizar flujos de interacción, mejorar la usabilidad y diseñar sistemas que
            conecten marketing, tecnología y satisfacción del usuario.
          </p>
          <p className="text-base font-medium text-foreground leading-relaxed">
            Nuestra misión es simple: transformar ideas en productos digitales que generen impacto medible.
          </p>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--magenta)] hover:gap-3 transition-all duration-200 w-fit"
          >
            Iniciar proyecto
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
              Donde el diseño centrado en el humano se encuentra con la tecnología inteligente.
            </p>
          </div>
          <div className="rounded-2xl p-5 bg-[var(--surface-dark)] text-white flex flex-col gap-2">
            <span className="text-2xl font-display font-bold" style={{ color: "var(--cyan)" }}>Research</span>
            <p className="text-xs text-white/60 leading-relaxed">Insights conductuales profundos</p>
          </div>
          <div className="rounded-2xl p-5 flex flex-col gap-2"
            style={{ background: "linear-gradient(135deg, var(--orange), oklch(0.65 0.2 60))" }}>
            <span className="text-2xl font-display font-bold text-white">Impacto</span>
            <p className="text-xs text-white/80 leading-relaxed">Valor de negocio medible</p>
          </div>
          <div className="col-span-2 rounded-2xl p-5 border border-border bg-card flex flex-col gap-2">
            <span className="text-lg font-display font-semibold text-foreground">
              Humano. Escalable. Innovador.
            </span>
            <p className="text-sm text-muted-foreground">
              Productos digitales que enganchan usuarios y crecen con tu negocio.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
