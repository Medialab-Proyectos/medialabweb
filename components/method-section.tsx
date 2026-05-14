"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Search, Compass, PenTool, Terminal, BarChart3, ChevronRight } from "lucide-react"

const steps = [
  {
    number: "01",
    label: "Discovery",
    title: "Claridad total sobre tu producto en menos de 48 horas",
    description: "Antes de diseñar un solo pixel, necesitamos entender qué problema resuelves y para quién. Nuestra IA analiza tu idea y genera un mapa claro: oportunidad, requisitos y estrategia. Sin adivinar.",
    icon: Search,
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, #E8751A 0%, #c65a10 100%)",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    stat: "< 48h",
    statLabel: "de incertidumbre a claridad",
  },
  {
    number: "02",
    label: "Estrategia UX",
    title: "Entender cómo piensa y siente tu usuario",
    description: "Investigamos a las personas que van a usar tu producto — no en abstracto, sino sus miedos, motivaciones y puntos de fricción reales. Cada decisión de diseño nace de ahí.",
    icon: Compass,
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, #2AABB3 0%, #1d8a91 100%)",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
    stat: "100%",
    statLabel: "decisiones basadas en evidencia",
  },
  {
    number: "03",
    label: "Diseño",
    title: "Cada pantalla diseñada para que tu usuario sienta confianza",
    description: "No decoramos interfaces — arquitectamos experiencias emocionales. Cada interacción, cada transición, cada palabra está pensada para que el usuario se sienta seguro y quiera seguir.",
    icon: PenTool,
    color: "var(--orange)",
    gradient: "linear-gradient(135deg, #E8751A 0%, #d4851f 100%)",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    stat: "3×",
    statLabel: "más usuarios que regresan",
  },
  {
    number: "04",
    label: "Desarrollo",
    title: "Un producto que funciona tan bien como se ve",
    description: "Código limpio, arquitectura que escala y rendimiento que tus usuarios notan (aunque no lo sepan). Construimos para que tu producto crezca contigo, no en tu contra.",
    icon: Terminal,
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, #E8751A 0%, #c65a10 100%)",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    stat: "0",
    statLabel: "deuda técnica heredada",
  },
  {
    number: "05",
    label: "Optimización CRO",
    title: "Convertir más sin gastar más en tráfico",
    description: "Tu producto ya tiene visitantes. Nosotros analizamos dónde se pierden y optimizamos cada punto de contacto para que más personas hagan lo que tú necesitas que hagan.",
    icon: BarChart3,
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, #2AABB3 0%, #1d8a91 100%)",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    stat: "+40%",
    statLabel: "más conversión promedio",
  },
]

export function MethodSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const activeData = steps[activeStep]
  const ActiveIcon = activeData.icon

  return (
    <section
      id="method"
      ref={ref}
      className="py-24 px-6 bg-secondary/30"
      aria-labelledby="method-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            Así funciona
          </span>
          <h2
            id="method-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            5 pasos para pasar de “tengo una idea” a “mis usuarios lo aman”
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            No improvisamos. Cada proyecto sigue un proceso probado que elimina suposiciones y garantiza
            que tu producto conecte con las personas desde el primer día. Así es como lo hacemos:
          </p>
        </div>

        {/* Desktop: Step tabs */}
        <div
          className="hidden md:grid grid-cols-5 gap-2 rounded-xl border border-border bg-background p-2"
          role="tablist"
          aria-label="Pasos de la metodología MediaLab"
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = i === activeStep
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(i)}
                className={`group relative flex min-h-[124px] flex-col gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-300 cursor-pointer overflow-hidden
                  ${isActive
                    ? "border-transparent bg-card shadow-lg"
                    : "border-transparent bg-transparent hover:bg-card/70"
                  }
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                role="tab"
                aria-pressed={isActive}
                aria-selected={isActive}
                aria-controls="method-active-panel"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 transition-opacity duration-300"
                  style={{ background: step.gradient, opacity: isActive ? 1 : 0 }}
                  aria-hidden="true"
                />

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-all duration-300"
                    style={{
                      background: isActive ? step.color : `${step.color}18`,
                      boxShadow: isActive ? `0 8px 24px ${step.color}35` : "none",
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? "white" : step.color }} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>
                      {step.number}
                    </span>
                    <span className="block truncate text-sm font-semibold text-foreground">{step.label}</span>
                  </div>
                </div>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {step.title}
                </p>

                <div className="mt-auto flex items-end justify-between gap-2">
                  <div>
                    <span className="font-display text-lg font-bold" style={{ color: step.color }}>{step.stat}</span>
                    <p className="text-[10px] leading-tight text-muted-foreground">{step.statLabel}</p>
                  </div>
                  <ChevronRight
                    size={15}
                    className={`transition-all duration-300 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
                    style={{ color: step.color }}
                    aria-hidden="true"
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Active step detail panel */}
        <div
          id="method-active-panel"
          role="tabpanel"
          className={`hidden md:grid grid-cols-[0.95fr_1.05fr] rounded-xl border overflow-hidden transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ background: "var(--card)", borderColor: `${activeData.color}35` }}
        >

          {/* Left: visual image */}
          <div className="relative min-h-[300px]">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <Image src={activeData.image} alt={activeData.title} fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
              <div className="font-display font-bold text-5xl text-white mb-2">
                {activeData.stat}
              </div>
              <div className="text-sm text-white/80 font-medium">{activeData.statLabel}</div>
            </div>
          </div>

          {/* Right: content */}
          <div className="relative flex flex-col justify-center gap-5 p-8 lg:p-10">
            <div
              className="absolute inset-y-8 left-0 w-1 rounded-r-full"
              style={{ background: activeData.gradient }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-md"
                style={{ background: activeData.color }}
              >
                <ActiveIcon size={21} className="text-white" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: activeData.color }}>
                Paso {activeData.number} · {activeData.label}
              </span>
            </div>
            <span className="sr-only" style={{ color: activeData.color }}>
              <ActiveIcon size={16} /> Paso {activeData.number} — {activeData.label}
            </span>
            <h3 className="font-display text-3xl font-bold leading-tight text-foreground text-balance">{activeData.title}</h3>
            <p className="text-base leading-relaxed text-muted-foreground">{activeData.description}</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border border-border bg-background p-4">
                <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Resultado</span>
                <span className="mt-2 block font-display text-2xl font-bold" style={{ color: activeData.color }}>
                  {activeData.stat}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Foco</span>
                <span className="mt-2 block text-sm font-semibold text-foreground">{activeData.statLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: vertical cards */}
        <div className="md:hidden flex flex-col gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`flex gap-4 p-5 rounded-2xl border border-border bg-card overflow-hidden relative transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl z-20" style={{ background: step.gradient }} />
                
                {/* Background image for mobile card */}
                <div className="absolute inset-0 z-0">
                  <Image src={step.image} alt={step.title} fill className="object-cover opacity-15" sizes="100vw" />
                  <div className="absolute inset-0 bg-card/90" />
                </div>

                <div className="relative z-10 ml-2 w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: step.color }}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="relative z-10 flex flex-col gap-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: step.color }}>
                      {step.number} — {step.label}
                    </span>
                    <span className="font-display font-bold text-base bg-secondary/80 px-2 py-0.5 rounded" style={{ color: step.color }}>{step.stat}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
