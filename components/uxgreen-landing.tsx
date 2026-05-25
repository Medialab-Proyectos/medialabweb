"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Zap, Globe, Leaf, Eye, Brain, Cpu, BarChart2, Wind,
  ArrowRight, ChevronDown, CheckCircle2, TrendingUp,
  Server, AlertTriangle, Gauge,
} from "lucide-react"
import { UXGreenCalculator } from "@/components/uxgreen-calculator"
import { useLanguage } from "@/lib/language-context"

const UXGREEN_BADGE = "/images/curso/logos/Green%20UX%20v%202.svg"

// ─── Hook: Scroll visibility ────────────────────────────────────────────────

function useVisible(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Pillars data ────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: Zap,
    title: "Performance",
    tagline: "Velocidad es respeto",
    desc: "Cada 100ms de mejora en carga reduce rebotes un 8% y el consumo energético por sesión. La rapidez no es lujo — es eficiencia.",
    metric: "53%",
    metricLabel: "de usuarios abandona si carga > 3s",
  },
  {
    icon: BarChart2,
    title: "Core Web Vitals",
    tagline: "Los estándares que mide Google",
    desc: "LCP, CLS y TBT son las señales con las que Google decide tu posición. Un buen CWV es también un sitio más eficiente energéticamente.",
    metric: "1.5s",
    metricLabel: "LCP ideal para certificación UXGreen™",
  },
  {
    icon: Leaf,
    title: "Carbon Efficiency",
    tagline: "Cada byte tiene un peso real",
    desc: "La web global genera más CO₂ anual que la industria aérea. Un sitio optimizado puede ser hasta 80% más limpio que el promedio.",
    metric: "0.5g",
    metricLabel: "CO₂ por visita en sitios certificados",
  },
  {
    icon: Globe,
    title: "UX Efficiency",
    tagline: "Menos clics, más valor",
    desc: "Una arquitectura de información eficiente reduce el tiempo en tarea, el número de peticiones al servidor y la fricción cognitiva simultáneamente.",
    metric: "40%",
    metricLabel: "más conversión con flujos optimizados",
  },
  {
    icon: Eye,
    title: "Accessibility",
    tagline: "Diseñado para todas las personas",
    desc: "WCAG 2.2 no es solo cumplimiento legal — es también SEO, reducción de rebote y experiencia superior para el 15% de usuarios con alguna discapacidad.",
    metric: "15%",
    metricLabel: "de usuarios globales con discapacidad",
  },
  {
    icon: Cpu,
    title: "AI Efficiency",
    tagline: "IA que indexa, no que consume",
    desc: "Los LLMs consumen energía masiva por cada consulta. Tu contenido bien estructurado reduce las inferencias necesarias y mejora su citabilidad.",
    metric: "3×",
    metricLabel: "más citable con arquitectura semántica",
  },
  {
    icon: Brain,
    title: "Cognitive Load",
    tagline: "Claridad es poder",
    desc: "Una interfaz compleja no solo frustra — hace que el usuario repita acciones, recargue páginas y genere peticiones innecesarias al servidor.",
    metric: "50ms",
    metricLabel: "tarda el cerebro en evaluar tu UI",
  },
  {
    icon: Wind,
    title: "Sustainable UX",
    tagline: "Diseño que dura y que importa",
    desc: "La sostenibilidad digital mide la proporción entre los recursos digitales consumidos y el valor real entregado. Un KPI nuevo para una era nueva.",
    metric: "80%",
    metricLabel: "de la web puede mejorar este ratio",
  },
]

// ─── Stats data ──────────────────────────────────────────────────────────────

const STATS = [
  {
    icon: TrendingUp,
    value: "74%",
    label: "de usuarios abandona sitios confusos antes de convertir",
    source: "Google UX Research 2024",
  },
  {
    icon: Zap,
    value: "4×",
    label: "más energía consume una página lenta vs una optimizada",
    source: "Sustainable Web Design, Tom Greenwood",
  },
  {
    icon: Server,
    value: "4%",
    label: "de las emisiones globales de CO₂ proviene de la web",
    source: "IEA / The Shift Project 2024",
  },
  {
    icon: AlertTriangle,
    value: "88%",
    label: "de usuarios no regresa tras una mala experiencia digital",
    source: "HubSpot State of Marketing 2024",
  },
]

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "¿Qué es exactamente UXGreen™?",
    a: "UXGreen™ es el framework y certificación de MediaLab que evalúa la eficiencia digital total de un sitio o producto web: performance, accesibilidad, huella de carbono, carga cognitiva, preparación para IA y UX en un único score. No es una auditoría ecológica — es un estándar de excelencia técnica con impacto ambiental medible.",
  },
  {
    q: "¿UXGreen™ es solo para sitios 'sostenibles'?",
    a: "No. UXGreen™ es para cualquier empresa que quiera un producto digital más rápido, más accesible, más eficiente y con mejor posicionamiento. La sostenibilidad es una consecuencia inevitable de la excelencia técnica — no el punto de partida ideológico.",
  },
  {
    q: "¿Cómo funciona la calculadora?",
    a: "El UXGreen™ Analyzer mide tu sitio usando Website Carbon API y Google PageSpeed Insights en tiempo real, complementado con análisis heurístico por industria y volumen de tráfico. El resultado es un score ponderado de 8 dimensiones que reflejan la eficiencia real de tu experiencia digital.",
  },
  {
    q: "¿Qué significa obtener la certificación UXGreen™?",
    a: "Existen tres niveles: Foundation (60-74), Certified (75-89) y Elite (90+). Cada nivel indica que tu producto cumple estándares medibles de eficiencia digital. La certificación incluye badge verificable, reporte detallado y acceso a la comunidad de productos certificados.",
  },
  {
    q: "¿Cuánto mejora el SEO con UXGreen™?",
    a: "Core Web Vitals y performance son señales de ranking directas en Google. Un sitio que mejora de 45 a 80 en CWV puede esperar una mejora del 15-35% en posicionamiento orgánico, más la reducción de bounce rate que impacta señales de comportamiento.",
  },
  {
    q: "¿MediaLab puede implementar las mejoras?",
    a: "Sí. MediaLab ofrece auditorías UXGreen™ completas e implementación de todas las optimizaciones necesarias para alcanzar la certificación. Incluye diseño UX, optimización técnica, accesibilidad y estrategia de IA. Agenda tu sesión de discovery.",
  },
]

// ─── Cert Tiers ──────────────────────────────────────────────────────────────

const CERT_TIERS = [
  {
    name: "UXGreen™ Foundation",
    range: "60 – 74",
    color: "#F59E0B",
    features: [
      "Diagnóstico completo de 8 dimensiones",
      "Reporte de brechas y oportunidades",
      "Badge verificable Foundation",
      "Guía de mejora prioritaria",
    ],
  },
  {
    name: "UXGreen™ Certified",
    range: "75 – 89",
    color: "#00BFA6",
    featured: true,
    features: [
      "Score verificado ≥ 75 en todas las dimensiones",
      "Badge Certified con enlace de verificación",
      "Reporte ejecutivo y técnico completo",
      "Benchmarks de industria incluidos",
      "Revisión anual de mantenimiento",
    ],
  },
  {
    name: "UXGreen™ Elite",
    range: "90 – 100",
    color: "#00BFA6",
    elite: true,
    features: [
      "Top 10% de eficiencia web global",
      "Badge Elite con firma digital",
      "Mención en directorio UXGreen™",
      "Caso de estudio publicado",
      "Consultoría trimestral incluida",
    ],
  },
]

// ─── FAQ Accordion ───────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors leading-relaxed">
          {q}
        </span>
        <ChevronDown
          size={16}
          className="text-white/30 flex-shrink-0 mt-0.5 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm text-white/55 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function UXGreenLanding() {
  const { t } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)
  const { ref: statsRef, visible: statsVisible } = useVisible()
  const { ref: pillarsRef, visible: pillarsVisible } = useVisible()
  const { ref: certRef, visible: certVisible } = useVisible()
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-[var(--surface-dark)] text-white min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center px-6 pt-28 pb-20"
        aria-labelledby="uxgreen-hero-heading"
      >
        {/* Ambient glows */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,191,166,0.10) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(232,117,26,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div
          className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold"
              style={{
                borderColor: "rgba(0,191,166,0.35)",
                background: "rgba(0,191,166,0.08)",
                color: "#00BFA6",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#00BFA6" }}
              />
              UXGreen™ Framework — by MediaLab
            </div>
          </div>

          {/* Heading */}
          <h1
            id="uxgreen-hero-heading"
            className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
          >
            La web tiene un problema{" "}
            <span style={{ color: "#00BFA6" }}>de eficiencia.</span>
            <br />
            La mayoría lo llama diseño.
            <br />
            <span className="text-white/50">Nosotros lo medimos.</span>
          </h1>

          {/* Subhead */}
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed mb-10" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
            UXGreen™ es el primer estándar que une{" "}
            <strong className="text-white/80">performance, accesibilidad, IA y sostenibilidad digital</strong>{" "}
            en una certificación única. Diseñado para la nueva era de experiencias digitales que compiten por cada milisegundo — y cada byte.
          </p>

          {/* Badge visual */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(0,191,166,0.25) 0%, transparent 70%)",
                  filter: "blur(16px)",
                }}
                aria-hidden="true"
              />
              <Image
                src={UXGREEN_BADGE}
                alt="UXGreen™ Certification Badge"
                width={96}
                height={96}
                unoptimized
                className="relative z-10 drop-shadow-lg"
                style={{ filter: "drop-shadow(0 0 20px rgba(0,191,166,0.3))" }}
              />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              Analiza tu sitio — gratis
              <ArrowRight size={16} />
            </a>
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-all"
            >
              Ver el estándar
            </a>
          </div>

          {/* Social proof micro */}
          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-white/25 flex-wrap">
            <span>✓ Análisis gratuito</span>
            <span>✓ Sin registro</span>
            <span>✓ Datos en tiempo real</span>
            <span>✓ Certificación verificable</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div
            className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── MANIFESTO (Stats) ─────────────────────────────────────────────────── */}
      <section
        ref={statsRef as React.RefObject<HTMLElement>}
        className="py-24 px-6 bg-[var(--surface-mid)]"
        aria-labelledby="manifesto-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              El problema real
            </span>
            <h2
              id="manifesto-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-white mb-5"
            >
              ¿Por qué la mala UX{" "}
              <span style={{ color: "#00BFA6" }}>contamina la web?</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
              Un sitio lento no solo frustra a tus usuarios — consume más energía, genera más CO₂, requiere más infraestructura y destruye más negocio. La ineficiencia digital tiene un costo doble: humano y ambiental.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className={`rounded-2xl border border-white/8 p-6 transition-all duration-700`}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    transitionDelay: statsVisible ? `${i * 80}ms` : "0ms",
                    opacity: statsVisible ? 1 : 0,
                    transform: statsVisible ? "translateY(0)" : "translateY(24px)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(0,191,166,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#00BFA6" }} />
                  </div>
                  <div
                    className="text-4xl font-bold font-display mb-2"
                    style={{ color: "#00BFA6" }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed mb-3">{stat.label}</p>
                  <span className="text-[10px] text-white/25 font-mono">{stat.source}</span>
                </div>
              )
            })}
          </div>

          {/* Equation */}
          <div
            className="mt-16 rounded-2xl border border-white/8 p-8 text-center"
            style={{ background: "rgba(0,191,166,0.03)" }}
          >
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
              La ecuación UXGreen™
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-white text-sm sm:text-base font-semibold">
              {[
                "Performance óptima",
                "=",
                "Menos energía",
                "=",
                "Mejor UX",
                "=",
                "Más conversión",
                "=",
                "Menor CO₂",
              ].map((item, i) => (
                <span
                  key={i}
                  className={item === "=" ? "text-white/25" : ""}
                  style={item !== "=" ? { color: i === 0 ? "#00BFA6" : "rgba(255,255,255,0.75)" } : {}}
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-white/35 text-xs mt-5 max-w-xl mx-auto">
              La sostenibilidad digital no es un compromiso con el rendimiento — es su consecuencia inevitable. Un sitio excelente es siempre un sitio eficiente.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8 PILLARS ─────────────────────────────────────────────────────────── */}
      <section
        id="pillars"
        ref={pillarsRef as React.RefObject<HTMLElement>}
        className="py-24 px-6 bg-[var(--surface-dark)]"
        aria-labelledby="pillars-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${pillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              El estándar
            </span>
            <h2
              id="pillars-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-white mb-5"
            >
              8 dimensiones de{" "}
              <span style={{ color: "#00BFA6" }}>eficiencia digital</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              UXGreen™ evalúa lo que importa: la experiencia real, el impacto ambiental y la preparación para el futuro de la web.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/8 p-5 hover:border-[#00BFA6]/30 transition-all duration-300 group"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    transitionDelay: pillarsVisible ? `${i * 50}ms` : "0ms",
                    opacity: pillarsVisible ? 1 : 0,
                    transform: pillarsVisible ? "translateY(0)" : "translateY(24px)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: "rgba(0,191,166,0.10)" }}
                  >
                    <Icon size={18} style={{ color: "#00BFA6" }} />
                  </div>
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">
                    0{i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm mb-1">{pillar.title}</h3>
                  <p className="text-[#00BFA6] text-xs font-medium mb-3">{pillar.tagline}</p>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">{pillar.desc}</p>
                  <div className="border-t border-white/6 pt-4">
                    <span className="text-xl font-bold text-white font-display">{pillar.metric}</span>
                    <p className="text-white/30 text-[10px] mt-0.5">{pillar.metricLabel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ────────────────────────────────────────────────────────── */}
      <section
        id="calculator"
        className="py-24 px-6 bg-[var(--surface-mid)]"
        aria-labelledby="calculator-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              UXGreen™ Analyzer
            </span>
            <h2
              id="calculator-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-white mb-5"
            >
              Obtén tu{" "}
              <span style={{ color: "#00BFA6" }}>UXGreen™ Score</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Análisis en tiempo real de performance, carbono, accesibilidad, IA y UX. Gratis. Sin registro. Resultado en menos de 30 segundos.
            </p>
          </div>

          <UXGreenCalculator />
        </div>
      </section>

      {/* ── CERTIFICATION TIERS ──────────────────────────────────────────────── */}
      <section
        id="certificacion"
        ref={certRef as React.RefObject<HTMLElement>}
        className="py-24 px-6 bg-[var(--surface-dark)]"
        aria-labelledby="cert-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${certVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              Certificación
            </span>
            <h2
              id="cert-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-white mb-5"
            >
              Tres niveles de{" "}
              <span style={{ color: "#00BFA6" }}>excelencia digital</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              La certificación UXGreen™ es un estándar verificable que demuestra que tu producto digital opera con eficiencia de clase mundial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {CERT_TIERS.map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl p-7 border transition-all duration-700 relative ${tier.featured ? "border-[#00BFA6]/40" : tier.elite ? "border-[#00BFA6]/60" : "border-white/10"}`}
                style={{
                  background: tier.featured
                    ? "linear-gradient(135deg, rgba(0,191,166,0.08) 0%, rgba(0,0,0,0) 100%)"
                    : tier.elite
                    ? "linear-gradient(135deg, rgba(0,191,166,0.12) 0%, rgba(0,0,0,0) 100%)"
                    : "rgba(255,255,255,0.02)",
                  transitionDelay: certVisible ? `${i * 100}ms` : "0ms",
                  opacity: certVisible ? 1 : 0,
                  transform: certVisible ? "translateY(0)" : "translateY(24px)",
                }}
              >
                {tier.featured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-black"
                    style={{ background: "#00BFA6" }}
                  >
                    MÁS POPULAR
                  </div>
                )}
                {tier.elite && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-black"
                    style={{ background: "linear-gradient(135deg, #00BFA6, #007D6D)" }}
                  >
                    TOP 10%
                  </div>
                )}

                <div className="mb-5">
                  {tier.featured || tier.elite ? (
                    <div className="relative inline-block">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${tier.color}30 0%, transparent 70%)`,
                          filter: "blur(10px)",
                        }}
                        aria-hidden="true"
                      />
                      <Image
                        src={UXGREEN_BADGE}
                        alt={`${tier.name} badge`}
                        width={56}
                        height={56}
                        unoptimized
                        className="relative z-10"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: `${tier.color}14`, border: `1px solid ${tier.color}25` }}
                    >
                      <Gauge size={24} style={{ color: tier.color }} />
                    </div>
                  )}
                </div>

                <h3 className="font-display font-bold text-white text-lg mb-1">{tier.name}</h3>
                <div
                  className="text-2xl font-bold font-mono mb-5"
                  style={{ color: tier.color }}
                >
                  {tier.range}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} style={{ color: tier.color }} className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/65">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#calculator"
                  className="mt-7 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                  style={{
                    borderColor: `${tier.color}40`,
                    color: tier.color,
                    background: `${tier.color}10`,
                  }}
                >
                  Calcular mi score
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[var(--surface-mid)]" aria-labelledby="how-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              El proceso
            </span>
            <h2
              id="how-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-white mb-5"
            >
              De análisis a{" "}
              <span style={{ color: "#00BFA6" }}>certificación</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Analiza",
                desc: "Ingresa tu dominio en el UXGreen™ Analyzer. Obtenemos datos en tiempo real de performance, carbono y accesibilidad.",
              },
              {
                step: "02",
                title: "Diagnostica",
                desc: "Recibes tu score en 8 dimensiones, insights específicos y un roadmap de mejoras priorizado por impacto.",
              },
              {
                step: "03",
                title: "Certifica",
                desc: "Implementa las mejoras (con MediaLab o tu equipo) y obtén la certificación UXGreen™ verificable externamente.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="text-4xl font-bold font-display mb-4 opacity-20"
                  style={{ color: "#00BFA6" }}
                >
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[var(--surface-dark)]" aria-labelledby="faq-uxgreen-heading">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              Preguntas frecuentes
            </span>
            <h2
              id="faq-uxgreen-heading"
              className="font-display font-bold text-3xl text-white"
            >
              Todo sobre UXGreen™
            </h2>
          </div>

          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[var(--surface-mid)] relative overflow-hidden" aria-labelledby="cta-uxgreen-heading">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,191,166,0.08) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold mb-6"
            style={{ borderColor: "rgba(0,191,166,0.35)", background: "rgba(0,191,166,0.08)", color: "#00BFA6" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#00BFA6] animate-pulse" />
            Pioneros en eficiencia digital sostenible
          </div>

          <h2
            id="cta-uxgreen-heading"
            className="font-display font-bold text-4xl sm:text-5xl text-white mb-5 leading-tight"
          >
            Tu producto digital merece{" "}
            <span style={{ color: "#00BFA6" }}>un estándar más alto.</span>
          </h2>

          <p className="text-white/55 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Empieza con un análisis gratuito. Termina con un producto más rápido, más accesible, más eficiente y certificado por el primer estándar de UX sostenible de Latinoamérica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              Obtener mi UXGreen™ Score
              <ArrowRight size={16} />
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-all"
            >
              Hablar con un experto
            </Link>
          </div>

          <p className="text-white/25 text-xs mt-6">
            Análisis gratuito · Certificación para cualquier industria · MediaLab Ingeniería © 2026
          </p>
        </div>
      </section>
    </div>
  )
}
