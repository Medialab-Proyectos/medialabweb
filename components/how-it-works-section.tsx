"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Compass, PenTool, Terminal, BarChart3, Lightbulb } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * "¿Tienes una idea? Para eso existimos" — bloque único que fusiona el educativo
 * (no-técnico) con el proceso de 5 pasos. Antes eran dos secciones que contaban
 * la misma narrativa (idea → producto que la gente ama).
 *
 * Microinteracción: los 5 pasos son seleccionables (click + hover) y el panel
 * muestra la imagen local + descripción del paso activo. Cierra explicando qué es
 * UX en lenguaje humano. Conserva id="method" para no romper anclas.
 */
export function HowItWorksSection() {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)

  const GRADIENT = "linear-gradient(135deg, #E8772E 0%, #1A8A9E 100%)"

  const steps = [
    {
      n: "01",
      icon: Search,
      labelEs: "Entendemos tu idea",
      labelEn: "We understand your idea",
      titleEs: "Claridad total sobre tu producto en menos de 48 horas",
      titleEn: "Total clarity about your product in under 48 hours",
      descEs: "Antes de diseñar un solo pixel, necesitamos entender qué problema resuelves y para quién. Nuestra IA analiza tu idea y genera un mapa claro: oportunidad, requisitos y estrategia. Sin adivinar.",
      descEn: "Before designing a single pixel, we need to understand what problem you solve and for whom. Our AI analyzes your idea and generates a clear map: opportunity, requirements, and strategy. No guesswork.",
      img: "/images/discovery-hero.png",
      altEs: "Sesión de discovery entendiendo la idea del cliente",
      altEn: "Discovery session understanding the client's idea",
    },
    {
      n: "02",
      icon: Compass,
      labelEs: "La validamos",
      labelEn: "We validate it",
      titleEs: "Entender cómo piensa y siente tu usuario",
      titleEn: "Understand how your user thinks and feels",
      descEs: "Investigamos a las personas que van a usar tu producto — no en abstracto, sino sus miedos, motivaciones y puntos de fricción reales. Cada decisión de diseño nace de ahí.",
      descEn: "We research the people who will use your product — not in the abstract, but their real fears, motivations, and friction points. Every design decision starts there.",
      img: "/images/ux-research.png",
      altEs: "Investigación de usuarios validando la idea con datos",
      altEn: "User research validating the idea with data",
    },
    {
      n: "03",
      icon: PenTool,
      labelEs: "La diseñamos",
      labelEn: "We design it",
      titleEs: "Cada pantalla diseñada para que tu usuario sienta confianza",
      titleEn: "Every screen designed so your user feels confident",
      descEs: "Arquitectamos experiencias emocionales: cada interacción, cada transición, cada palabra está pensada para que el usuario se sienta seguro y quiera seguir.",
      descEn: "We architect emotional experiences: every interaction, every transition, every word is crafted so the user feels safe and wants to continue.",
      img: "/images/service-ux-design-team.png",
      altEs: "Equipo diseñando la experiencia de usuario",
      altEn: "Team designing the user experience",
    },
    {
      n: "04",
      icon: Terminal,
      labelEs: "La construimos",
      labelEn: "We build it",
      titleEs: "Un producto que funciona tan bien como se ve",
      titleEn: "A product that works as well as it looks",
      descEs: "Código limpio, arquitectura que escala y rendimiento que tus usuarios notan (aunque no lo sepan). Construimos para que tu producto crezca contigo, no en tu contra.",
      descEn: "Clean code, architecture that scales, and performance your users notice (even if they don't realize it). We build so your product grows with you, not against you.",
      img: "/images/service-dev-team.png",
      altEs: "Equipo de desarrollo construyendo el producto",
      altEn: "Development team building the product",
    },
    {
      n: "05",
      icon: BarChart3,
      labelEs: "La mejoramos",
      labelEn: "We improve it",
      titleEs: "Convertir más sin gastar más en tráfico",
      titleEn: "Convert more without spending more on traffic",
      descEs: "Tu producto ya tiene visitantes. Analizamos dónde se pierden y optimizamos cada punto de contacto para que más personas hagan lo que tú necesitas que hagan.",
      descEn: "Your product already has visitors. We analyze where they drop off and optimize every touchpoint so more people do what you need them to do.",
      img: "/images/service-cro-saas-team.png",
      altEs: "Análisis de métricas para optimizar la conversión",
      altEn: "Metrics analysis to optimize conversion",
    },
  ]

  const current = steps[active]

  return (
    <section
      id="method"
      className="relative py-16 md:py-24 bg-background overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* Encabezado — hook no-técnico */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-3 font-display font-medium text-[var(--magenta)]">
            {t("Cómo lo hacemos · en simple", "How we do it · in plain words")}
          </span>
          <h2
            id="how-it-works-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "¿Tienes una idea pero no sabes por dónde arrancar? Para eso existimos.",
              "Have an idea but don't know where to start? That's exactly why we exist.",
            )}
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/60 dark:text-foreground/55 leading-relaxed text-pretty">
            {t(
              "No necesitas saber de tecnología ni de diseño. Tú pones la idea; nosotros la llevamos paso a paso hasta un producto que funciona de verdad.",
              "You don't need to know about technology or design. You bring the idea; we take it step by step to a product that actually works.",
            )}
          </p>
        </div>

        {/* Interactivo: stepper centrado + panel compacto centrado */}
        <div className="flex flex-col items-center gap-6">
          {/* Selector de pasos — píldoras centradas, envuelven en móvil */}
          <div className="flex flex-wrap justify-center gap-2">
            {steps.map((step, i) => {
              const isActive = i === active
              return (
                <button
                  key={step.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-transparent text-white shadow-md"
                      : "border-border bg-card text-foreground hover:border-[#E8751A]/40"
                  }`}
                  style={isActive ? { background: "#E8751A" } : undefined}
                >
                  <span
                    className={`font-display font-bold leading-none ${isActive ? "text-white/90" : "bg-clip-text text-transparent"}`}
                    style={isActive ? undefined : { backgroundImage: GRADIENT }}
                    aria-hidden="true"
                  >
                    {step.n}
                  </span>
                  {t(step.labelEs, step.labelEn)}
                </button>
              )
            })}
          </div>

          {/* Panel del paso activo — imagen izquierda 30% + texto descriptivo */}
          <div className="w-full max-w-4xl rounded-2xl border border-border bg-card p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.n}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-[30%_1fr] gap-5 sm:gap-6 items-center"
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border">
                  <Image
                    src={current.img}
                    alt={t(current.altEs, current.altEn)}
                    fill
                    sizes="(max-width: 640px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
                    {t("Paso", "Step")} {current.n} · {t(current.labelEs, current.labelEn)}
                  </span>
                  <h3 className="mt-1.5 text-xl md:text-2xl font-bold text-foreground font-display leading-snug">
                    {t(current.titleEs, current.titleEn)}
                  </h3>
                  <p className="mt-3 text-base text-foreground/75 leading-relaxed">
                    {t(current.descEs, current.descEn)}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Cierre — qué es UX, en lenguaje humano */}
        <div className="mt-8 md:mt-10 flex items-start gap-4 p-6 md:p-7 rounded-2xl border-l-4 border border-[#E8772E]/30 border-l-[#E8772E] bg-[#E8772E]/[0.06]">
          <span
            className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center"
            style={{ background: "color-mix(in srgb, #E8772E 14%, transparent)" }}
            aria-hidden="true"
          >
            <Lightbulb className="w-5 h-5" style={{ color: "#E8772E" }} />
          </span>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed text-pretty">
            {t("A eso se le llama ", "This is what's called ")}
            <strong className="text-foreground font-semibold">
              {t("diseño de experiencia (UX)", "experience design (UX)")}
            </strong>
            {t(
              ": lograr que tu producto sea claro, fácil y que la gente quiera usarlo. Es la diferencia entre un producto que vende y uno que fracasa.",
              ": making your product clear, easy, and something people actually want to use. It's the difference between a product that sells and one that fails.",
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
