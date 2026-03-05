"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Compass, PenTool, Terminal, BarChart3 } from "lucide-react"

const steps = [
  {
    number: "01",
    label: "Discovery",
    title: "Definición de producto asistida por IA",
    description:
      "Usamos herramientas inteligentes y frameworks estructurados para definir rápidamente la oportunidad de tu producto, el panorama competitivo y los requisitos clave.",
    icon: Search,
    color: "var(--magenta)",
  },
  {
    number: "02",
    label: "Estrategia UX",
    title: "Diseño de producto centrado en el humano",
    description:
      "Investigamos profundamente a tus usuarios — sus comportamientos, motivaciones y puntos de dolor — para traducir los insights en una estrategia de producto clara.",
    icon: Compass,
    color: "var(--cyan)",
  },
  {
    number: "03",
    label: "Diseño de Producto",
    title: "Diseño de interfaces y arquitectura de experiencia",
    description:
      "Diseñamos cada interacción, pantalla y sistema con precisión — creando interfaces intuitivas, accesibles y visualmente atractivas.",
    icon: PenTool,
    color: "var(--orange)",
  },
  {
    number: "04",
    label: "Desarrollo",
    title: "Implementación de tecnología escalable",
    description:
      "Construimos tu producto con tecnología moderna y escalable — código limpio, arquitectura performante e integraciones sin fricción.",
    icon: Terminal,
    color: "var(--magenta)",
  },
  {
    number: "05",
    label: "Optimización",
    title: "Mejora continua basada en datos",
    description:
      "Monitoreamos, analizamos y optimizamos tu producto continuamente — usando datos reales de usuarios para impulsar mejoras medibles.",
    icon: BarChart3,
    color: "var(--cyan)",
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

        {/* Steps: horizontal on desktop, vertical list on mobile */}
        <div className="hidden md:grid grid-cols-5 gap-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = i === activeStep
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(i)}
                className={`flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer
                  ${isActive
                    ? "border-transparent shadow-lg bg-card"
                    : "border-border bg-background hover:border-[var(--magenta)] hover:shadow-md"
                  }
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                aria-pressed={isActive}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isActive ? step.color : `${step.color}20`,
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? "white" : step.color }} />
                </div>
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: step.color }}
                >
                  {step.number}
                </span>
                <span className="font-semibold text-sm text-foreground leading-tight">{step.label}</span>
              </button>
            )
          })}
        </div>

        {/* Active step detail */}
        <div
          className={`hidden md:flex gap-6 p-8 rounded-3xl bg-card border border-border transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, ${activeData.color}, ${activeData.color}88)` }}
          >
            <ActiveIcon size={26} className="text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: activeData.color }}>
              Paso {activeData.number} — {activeData.label}
            </span>
            <h3 className="font-display font-bold text-xl text-foreground">{activeData.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{activeData.description}</p>
          </div>
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden flex flex-col gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`flex gap-4 p-5 rounded-2xl border border-border bg-card transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: step.color }}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: step.color }}>
                    {step.number} — {step.label}
                  </span>
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
