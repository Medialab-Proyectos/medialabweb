"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Search, Compass, PenTool, Terminal, BarChart3, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function MethodSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      number: "01",
      label: t("Discovery", "Discovery"),
      title: t(
        "Claridad total sobre tu producto en menos de 48 horas",
        "Total clarity about your product in under 48 hours"
      ),
      description: t(
        "Antes de diseñar un solo pixel, necesitamos entender qué problema resuelves y para quién. Nuestra IA analiza tu idea y genera un mapa claro: oportunidad, requisitos y estrategia. Sin adivinar.",
        "Before designing a single pixel, we need to understand what problem you solve and for whom. Our AI analyzes your idea and generates a clear map: opportunity, requirements, and strategy. No guesswork."
      ),
      icon: Search,
      color: "var(--magenta)",
      gradient: "linear-gradient(135deg, #E8751A 0%, #c65a10 100%)",
      image: "/images/method-discovery.png",
      stat: "< 48h",
      statLabel: t("de incertidumbre a claridad", "from uncertainty to clarity"),
    },
    {
      number: "02",
      label: t("Estrategia UX", "UX Strategy"),
      title: t(
        "Entender cómo piensa y siente tu usuario",
        "Understand how your user thinks and feels"
      ),
      description: t(
        "Investigamos a las personas que van a usar tu producto — no en abstracto, sino sus miedos, motivaciones y puntos de fricción reales. Cada decisión de diseño nace de ahí.",
        "We research the people who will use your product — not in the abstract, but their real fears, motivations, and friction points. Every design decision starts there."
      ),
      icon: Compass,
      color: "var(--cyan)",
      gradient: "linear-gradient(135deg, #2AABB3 0%, #1d8a91 100%)",
      image: "/images/method-ux-strategy.png",
      stat: "100%",
      statLabel: t("decisiones basadas en evidencia", "decisions based on evidence"),
    },
    {
      number: "03",
      label: t("Diseño", "Design"),
      title: t(
        "Cada pantalla diseñada para que tu usuario sienta confianza",
        "Every screen designed so your user feels confident"
      ),
      description: t(
        "Arquitectamos experiencias emocionales: cada interacción, cada transición, cada palabra está pensada para que el usuario se sienta seguro y quiera seguir.",
        "We architect emotional experiences: every interaction, every transition, every word is crafted so the user feels safe and wants to continue."
      ),
      icon: PenTool,
      color: "var(--orange)",
      gradient: "linear-gradient(135deg, #E8751A 0%, #d4851f 100%)",
      image: "/images/method-design.jpg",
      stat: "3×",
      statLabel: t("más usuarios que regresan", "more users who return"),
    },
    {
      number: "04",
      label: t("Desarrollo", "Development"),
      title: t(
        "Un producto que funciona tan bien como se ve",
        "A product that works as well as it looks"
      ),
      description: t(
        "Código limpio, arquitectura que escala y rendimiento que tus usuarios notan (aunque no lo sepan). Construimos para que tu producto crezca contigo, no en tu contra.",
        "Clean code, architecture that scales, and performance your users notice (even if they don't realize it). We build so your product grows with you, not against you."
      ),
      icon: Terminal,
      color: "var(--magenta)",
      gradient: "linear-gradient(135deg, #E8751A 0%, #c65a10 100%)",
      image: "/images/method-development.jpg",
      stat: "0",
      statLabel: t("deuda técnica heredada", "inherited technical debt"),
    },
    {
      number: "05",
      label: t("CRO", "CRO"),
      title: t(
        "Convertir más sin gastar más en tráfico",
        "Convert more without spending more on traffic"
      ),
      description: t(
        "Tu producto ya tiene visitantes. Nosotros analizamos dónde se pierden y optimizamos cada punto de contacto para que más personas hagan lo que tú necesitas que hagan.",
        "Your product already has visitors. We analyze where they drop off and optimize every touchpoint so more people do what you need them to do."
      ),
      icon: BarChart3,
      color: "var(--cyan)",
      gradient: "linear-gradient(135deg, #2AABB3 0%, #1d8a91 100%)",
      image: "/images/method-cro.jpg",
      stat: "+40%",
      statLabel: t("más conversión promedio", "average conversion lift"),
    },
  ]

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
            {t("Así funciona", "How it works")}
          </span>
          <h2
            id="method-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "5 pasos para pasar de “tengo una idea” a “mis usuarios lo aman”",
              "5 steps to go from “I have an idea” to “my users love it”"
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Cada proyecto sigue un proceso probado que elimina suposiciones y garantiza que tu producto conecte con las personas desde el primer día. Así es como lo hacemos:",
              "Every project follows a proven process that removes assumptions and ensures your product connects with people from day one. Here's how we do it:"
            )}
          </p>
        </div>

        {/* Desktop: un solo card — stepper vertical (izq) + significado (der) */}
        <div
          className={`hidden md:grid md:grid-cols-[280px_1fr] rounded-2xl border border-border overflow-hidden h-[440px] bg-card transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          {/* Stepper vertical conectado */}
          <div className="relative flex flex-col border-r border-border bg-secondary/30">
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label={t("Pasos de la metodología MediaLab", "MediaLab methodology steps")}
              className="flex flex-col"
            >
            {steps.map((step, i) => {
              const Icon = step.icon
              const isActive = i === activeStep
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  onMouseEnter={() => setActiveStep(i)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="method-active-panel"
                  className={`group relative flex items-center gap-3 px-5 py-4 text-left transition-colors duration-300 ${isActive ? "bg-card" : "hover:bg-card/60"}`}
                >
                  {/* Acento de la fase activa */}
                  <span
                    className="absolute inset-y-0 left-0 w-1 transition-opacity duration-300"
                    style={{ background: step.gradient, opacity: isActive ? 1 : 0 }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                    style={{
                      background: isActive ? step.color : "transparent",
                      border: `1.5px solid ${isActive ? step.color : "var(--border)"}`,
                      color: isActive ? "#fff" : "var(--muted-foreground)",
                    }}
                  >
                    {isActive ? <Icon size={16} /> : step.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color, opacity: isActive ? 1 : 0.65 }}>
                      {step.number}
                    </span>
                    <span className="block truncate text-sm font-semibold" style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {step.label}
                    </span>
                  </span>
                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`}
                    style={{ color: step.color }}
                    aria-hidden="true"
                  />
                </button>
              )
            })}
            </div>

            {/* Texto descriptivo bajo el stepper */}
            <div className="mt-auto border-t border-border p-5">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{t("Cinco fases, cero adivinanzas.", "Five phases, zero guesswork.")}</span>{" "}
                {t("Cada paso entrega un resultado medible — tú eliges cuál mover primero.", "Each step delivers a measurable result — you choose which one to move first.")}
              </p>
            </div>
          </div>

          {/* Significado — imagen en cuadro (izq) + contenido (der) */}
          <div id="method-active-panel" role="tabpanel" className="grid grid-cols-[44%_1fr] h-full">
            {/* Imagen en cuadro */}
            <div className="relative m-4 lg:m-6 rounded-xl overflow-hidden border border-border">
              <div key={activeData.image} className="absolute inset-0 animate-fade-only">
                <Image src={activeData.image} alt={activeData.title} fill className="object-cover" sizes="(max-width: 1024px) 40vw, 30vw" />
              </div>
              <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }} />
              <div key={activeStep} className="absolute inset-x-0 bottom-0 z-10 p-5 animate-fade-only">
                <div className="font-display text-4xl font-bold leading-none text-white">{activeData.stat}</div>
                <div className="mt-1 text-xs font-medium text-white/85">{activeData.statLabel}</div>
              </div>
            </div>
            {/* Contenido */}
            <div key={activeStep} className="flex flex-col justify-center gap-5 p-6 pr-8 lg:p-10 animate-fade-only">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: activeData.color, boxShadow: `0 10px 30px ${activeData.color}40` }}>
                  <ActiveIcon size={22} className="text-white" />
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: activeData.color }}>
                  {t("Paso", "Step")} {activeData.number} · {activeData.label}
                </span>
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold leading-tight text-foreground text-balance">{activeData.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground line-clamp-4">{activeData.description}</p>
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
