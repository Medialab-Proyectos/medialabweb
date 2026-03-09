"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Compass, PenTool, Terminal, BarChart3, ChevronRight } from "lucide-react"

const steps = [
  {
    number: "01",
    label: "Discovery",
    title: "Definición asistida por IA",
    description: "Usamos herramientas inteligentes para definir la oportunidad de tu producto y requisitos clave.",
    icon: Search,
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, #E8751A 0%, #c65a10 100%)",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    stat: "< 48h",
    statLabel: "para tener claridad",
  },
  {
    number: "02",
    label: "Estrategia UX",
    title: "Diseño centrado en el humano",
    description: "Investigamos profundamente a tus usuarios para traducir los insights en estrategia clara.",
    icon: Compass,
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, #2AABB3 0%, #1d8a91 100%)",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
    stat: "100%",
    statLabel: "basado en datos",
  },
  {
    number: "03",
    label: "Diseño",
    title: "Arquitectura de experiencia",
    description: "Diseñamos cada interacción creando interfaces intuitivas y visualmente atractivas.",
    icon: PenTool,
    color: "var(--orange)",
    gradient: "linear-gradient(135deg, #E8751A 0%, #d4851f 100%)",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    stat: "3×",
    statLabel: "más retención",
  },
  {
    number: "04",
    label: "Desarrollo",
    title: "Tecnología escalable",
    description: "Construimos tu producto con código limpio, arquitectura performante e integraciones.",
    icon: Terminal,
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, #E8751A 0%, #c65a10 100%)",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    stat: "0",
    statLabel: "deuda técnica",
  },
  {
    number: "05",
    label: "Optimización",
    title: "Mejora continua",
    description: "Analizamos y optimizamos usando datos reales para impulsar mejoras medibles.",
    icon: BarChart3,
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, #2AABB3 0%, #1d8a91 100%)",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    stat: "+40%",
    statLabel: "conversión mejorada",
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
            Nuestra Metodología
          </span>
          <h2
            id="method-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            De la idea al producto digital
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Un proceso probado de cinco pasos que lleva tu concepto desde la idea inicial hasta un
            producto digital lanzado y optimizado — con claridad y confianza en cada etapa.
          </p>
        </div>

        {/* Desktop: Step cards grid */}
        <div className="hidden md:grid grid-cols-5 gap-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = i === activeStep
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(i)}
                className={`group relative flex flex-col gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden
                  ${isActive
                    ? "border-transparent shadow-xl bg-card"
                    : "border-border bg-background hover:border-transparent hover:shadow-lg hover:bg-card"
                  }
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                aria-pressed={isActive}
              >
                {/* Gradient top bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
                  style={{ background: step.gradient, opacity: isActive ? 1 : 0 }} />

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isActive ? step.color : `${step.color}18`,
                    boxShadow: isActive ? `0 6px 20px ${step.color}40` : "none",
                  }}>
                  <Icon size={19} style={{ color: isActive ? "white" : step.color }} />
                </div>

                {/* Number label */}
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: step.color }}>
                  {step.number}
                </span>

                {/* Step name */}
                <span className="font-semibold text-sm text-foreground leading-tight">{step.label}</span>

                {/* Stat badge */}
                <div className="mt-auto">
                  <span className="font-display font-bold text-lg" style={{ color: step.color }}>{step.stat}</span>
                  <p className="text-[10px] text-muted-foreground leading-tight">{step.statLabel}</p>
                </div>

                {/* Active arrow */}
                {isActive && (
                  <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: step.color }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Active step detail panel */}
        <div className={`hidden md:flex gap-8 p-0 rounded-3xl border overflow-hidden transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ background: "var(--card)", borderColor: `${activeData.color}30` }}>

          {/* Left: visual image */}
          <div className="relative w-1/2 min-h-[320px] shrink-0">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img src={activeData.image} alt={activeData.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
              <div className="font-display font-bold text-5xl text-white mb-2">
                {activeData.stat}
              </div>
              <div className="text-sm text-white/80 font-medium">{activeData.statLabel}</div>
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-center gap-4 py-10 pr-10 w-1/2">
            <span className="text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-2" style={{ color: activeData.color }}>
              <ActiveIcon size={16} /> Paso {activeData.number} — {activeData.label}
            </span>
            <h3 className="font-display font-bold text-3xl text-foreground text-balance leading-tight">{activeData.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-base">{activeData.description}</p>
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
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover opacity-15" />
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
