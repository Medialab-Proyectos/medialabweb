"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Zap, Globe, Leaf, Eye, Brain, Cpu, BarChart2, Wind,
  ArrowRight, ChevronDown, CheckCircle2, TrendingUp,
  Server, AlertTriangle,
} from "lucide-react"
import { UXGreenCalculator } from "@/components/uxgreen-calculator"
import { useLanguage } from "@/lib/language-context"

const UXGREEN_BADGE = "/images/curso/logos/Green%20UX%20v%202.svg"

// ─── Floating Leaf Particle System ───────────────────────────────────────────

interface LeafParticle {
  x: number
  y: number
  size: number
  rotation: number
  rotSpeed: number
  vx: number
  vy: number
  opacity: number
  color: string
  shape: number // 0 = leaf, 1 = circle dot, 2 = diamond
}

function LeafCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<LeafParticle[]>([])
  const animRef = useRef<number>(0)

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.min(Math.floor((w * h) / 18000), 45)
    const particles: LeafParticle[] = []
    const colors = [
      "rgba(0,191,166,0.35)",
      "rgba(0,191,166,0.25)",
      "rgba(0,168,145,0.30)",
      "rgba(46,204,113,0.20)",
      "rgba(0,191,166,0.15)",
    ]
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.15 + Math.random() * 0.4,
        opacity: 0.15 + Math.random() * 0.45,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.floor(Math.random() * 3),
      })
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (isMobile || prefersReduced) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      if (particlesRef.current.length === 0) initParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const drawLeaf = (ctx: CanvasRenderingContext2D, p: LeafParticle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color

      if (p.shape === 0) {
        // Leaf shape
        ctx.beginPath()
        ctx.moveTo(0, -p.size)
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.6, p.size * 0.5, 0, p.size)
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size)
        ctx.fill()
      } else if (p.shape === 1) {
        // Glowing dot
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
        grad.addColorStop(0, p.color)
        grad.addColorStop(1, "transparent")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Small diamond
        ctx.beginPath()
        ctx.moveTo(0, -p.size * 0.7)
        ctx.lineTo(p.size * 0.4, 0)
        ctx.lineTo(0, p.size * 0.7)
        ctx.lineTo(-p.size * 0.4, 0)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    }

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      particlesRef.current.forEach((p) => {
        p.x += p.vx + Math.sin(p.y * 0.003) * 0.2
        p.y += p.vy
        p.rotation += p.rotSpeed
        // Wrap around
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w }
        if (p.x > w + 20) p.x = -20
        if (p.x < -20) p.x = w + 20
        drawLeaf(ctx, p)
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className || ""}`}
      aria-hidden="true"
    />
  )
}

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
    tagline: ["Velocidad es respeto", "Speed is respect"] as [string, string],
    desc: ["Cada 100ms de mejora en carga reduce rebotes un 8% y el consumo energético por sesión. La rapidez no es lujo — es eficiencia.", "Every 100ms improvement in load time reduces bounce rates by 8% and energy consumption per session. Speed is not a luxury — it's efficiency."] as [string, string],
    metric: "53%",
    metricLabel: ["de usuarios abandona si carga > 3s", "of users leave if load time > 3s"] as [string, string],
  },
  {
    icon: BarChart2,
    title: "Core Web Vitals",
    tagline: ["Los estándares que mide Google", "The standards Google measures"] as [string, string],
    desc: ["LCP, CLS y TBT son las señales con las que Google decide tu posición. Un buen CWV es también un sitio más eficiente energéticamente.", "LCP, CLS, and TBT are the signals Google uses to determine your ranking. Good CWV also means a more energy-efficient site."] as [string, string],
    metric: "1.5s",
    metricLabel: ["LCP ideal según estándar UXGreen™", "Ideal LCP per UXGreen™ standard"] as [string, string],
  },
  {
    icon: Leaf,
    title: "Carbon Efficiency",
    tagline: ["Cada byte tiene un peso real", "Every byte has a real weight"] as [string, string],
    desc: ["La web global genera más CO₂ anual que la industria aérea. Un sitio optimizado puede ser hasta 80% más limpio que el promedio.", "The global web generates more annual CO₂ than the airline industry. An optimized site can be up to 80% cleaner than average."] as [string, string],
    metric: "0.5g",
    metricLabel: ["CO₂ por visita en sitios optimizados", "CO₂ per visit on optimized sites"] as [string, string],
  },
  {
    icon: Globe,
    title: "UX Efficiency",
    tagline: ["Menos clics, más valor", "Fewer clicks, more value"] as [string, string],
    desc: ["Una arquitectura de información eficiente reduce el tiempo en tarea, el número de peticiones al servidor y la fricción cognitiva simultáneamente.", "An efficient information architecture reduces time on task, server requests, and cognitive friction simultaneously."] as [string, string],
    metric: "40%",
    metricLabel: ["más conversión con flujos optimizados", "more conversion with optimized flows"] as [string, string],
  },
  {
    icon: Eye,
    title: "Accessibility",
    tagline: ["Diseñado para todas las personas", "Designed for everyone"] as [string, string],
    desc: ["WCAG 2.2 no es solo cumplimiento legal — es también SEO, reducción de rebote y experiencia superior para el 15% de usuarios con alguna discapacidad.", "WCAG 2.2 is not just legal compliance — it also means better SEO, reduced bounce rates, and a superior experience for the 15% of users with a disability."] as [string, string],
    metric: "15%",
    metricLabel: ["de usuarios globales con discapacidad", "of global users with a disability"] as [string, string],
  },
  {
    icon: Cpu,
    title: "AI Efficiency",
    tagline: ["IA que indexa, no que consume", "AI that indexes, not consumes"] as [string, string],
    desc: ["Los LLMs consumen energía masiva por cada consulta. Tu contenido bien estructurado reduce las inferencias necesarias y mejora su citabilidad.", "LLMs consume massive energy per query. Well-structured content reduces the inferences needed and improves citability."] as [string, string],
    metric: "3×",
    metricLabel: ["más citable con arquitectura semántica", "more citable with semantic architecture"] as [string, string],
  },
  {
    icon: Brain,
    title: "Cognitive Load",
    tagline: ["Claridad es poder", "Clarity is power"] as [string, string],
    desc: ["Una interfaz compleja no solo frustra — hace que el usuario repita acciones, recargue páginas y genere peticiones innecesarias al servidor.", "A complex interface doesn't just frustrate — it causes users to repeat actions, reload pages, and generate unnecessary server requests."] as [string, string],
    metric: "50ms",
    metricLabel: ["tarda el cerebro en evaluar tu UI", "for the brain to evaluate your UI"] as [string, string],
  },
  {
    icon: Wind,
    title: "Sustainable UX",
    tagline: ["Diseño que dura y que importa", "Design that lasts and matters"] as [string, string],
    desc: ["La sostenibilidad digital mide la proporción entre los recursos digitales consumidos y el valor real entregado. Un KPI nuevo para una era nueva.", "Digital sustainability measures the ratio between digital resources consumed and real value delivered. A new KPI for a new era."] as [string, string],
    metric: "80%",
    metricLabel: ["de la web puede mejorar este ratio", "of the web can improve this ratio"] as [string, string],
  },
]

// ─── Stats data ──────────────────────────────────────────────────────────────

const STATS = [
  {
    icon: TrendingUp,
    value: "74%",
    label: ["de usuarios abandona sitios confusos antes de convertir", "of users abandon confusing sites before converting"] as [string, string],
    source: "Google UX Research 2024",
    sourceUrl: "https://web.dev/learn/performance/why-speed-matters",
  },
  {
    icon: Zap,
    value: "4×",
    label: ["más energía consume una página lenta vs una optimizada", "more energy consumed by a slow page vs an optimized one"] as [string, string],
    source: "Sustainable Web Design, Tom Greenwood",
    sourceUrl: "https://sustainablewebdesign.org/",
  },
  {
    icon: Server,
    value: "4%",
    label: ["de las emisiones globales de CO₂ proviene de la web", "of global CO₂ emissions come from the web"] as [string, string],
    source: "IEA / The Shift Project 2024",
    sourceUrl: "https://theshiftproject.org/en/lean-ict-2/",
  },
  {
    icon: AlertTriangle,
    value: "88%",
    label: ["de usuarios no regresa tras una mala experiencia digital", "of users never return after a bad digital experience"] as [string, string],
    source: "HubSpot State of Marketing 2024",
    sourceUrl: "https://www.hubspot.com/state-of-marketing",
  },
]

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: ["¿Qué es exactamente UXGreen™?", "What exactly is UXGreen™?"] as [string, string],
    a: ["UXGreen™ es el framework y estándar propio de MediaLab que evalúa la eficiencia digital total de un sitio o producto web: performance, accesibilidad, huella de carbono, carga cognitiva, preparación para IA y UX en un único score. No es una auditoría ecológica — es un estándar de excelencia técnica con impacto ambiental medible, desarrollado por MediaLab como primera iniciativa en Latinoamérica.", "UXGreen™ is MediaLab's proprietary framework and standard that evaluates the total digital efficiency of a website or web product: performance, accessibility, carbon footprint, cognitive load, AI readiness, and UX in a single score. It's not an ecological audit — it's a standard of technical excellence with measurable environmental impact, developed by MediaLab as the first initiative of its kind in Latin America."] as [string, string],
  },
  {
    q: ["¿UXGreen™ es solo para sitios 'sostenibles'?", "Is UXGreen™ only for 'sustainable' sites?"] as [string, string],
    a: ["No. UXGreen™ es para cualquier empresa que quiera un producto digital más rápido, más accesible, más eficiente y con mejor posicionamiento. La sostenibilidad es una consecuencia inevitable de la excelencia técnica — no el punto de partida ideológico.", "No. UXGreen™ is for any company that wants a faster, more accessible, more efficient digital product with better rankings. Sustainability is an inevitable consequence of technical excellence — not the ideological starting point."] as [string, string],
  },
  {
    q: ["¿Cómo funciona la calculadora?", "How does the calculator work?"] as [string, string],
    a: ["El UXGreen™ Analyzer mide tu sitio usando Website Carbon API y Google PageSpeed Insights en tiempo real, complementado con análisis heurístico por industria y volumen de tráfico. El resultado es un score ponderado de 8 dimensiones que reflejan la eficiencia real de tu experiencia digital.", "The UXGreen™ Analyzer measures your site using the Website Carbon API and Google PageSpeed Insights in real time, complemented with heuristic analysis by industry and traffic volume. The result is a weighted score across 8 dimensions that reflect the real efficiency of your digital experience."] as [string, string],
  },
  {
    q: ["¿Qué significa cumplir con el estándar UXGreen™?", "What does it mean to comply with the UXGreen™ standard?"] as [string, string],
    a: ["Significa que tu producto digital ha sido evaluado bajo las 8 dimensiones del estándar de MediaLab y cumple con los criterios de eficiencia digital. Incluyes en tu sitio que cumples con UXGreen™ by MediaLab, un reporte detallado de tu score y recomendaciones de mejora.", "It means your digital product has been evaluated under MediaLab's 8-dimension standard and meets the digital efficiency criteria. You can display on your site that you comply with UXGreen™ by MediaLab, along with a detailed score report and improvement recommendations."] as [string, string],
  },
  {
    q: ["¿Cuánto mejora el SEO con UXGreen™?", "How much does SEO improve with UXGreen™?"] as [string, string],
    a: ["Core Web Vitals y performance son señales de ranking directas en Google. Un sitio que mejora de 45 a 80 en CWV puede esperar una mejora del 15-35% en posicionamiento orgánico, más la reducción de bounce rate que impacta señales de comportamiento.", "Core Web Vitals and performance are direct ranking signals in Google. A site that improves from 45 to 80 in CWV can expect a 15-35% improvement in organic ranking, plus reduced bounce rates that impact behavioral signals."] as [string, string],
  },
  {
    q: ["¿MediaLab puede implementar las mejoras?", "Can MediaLab implement the improvements?"] as [string, string],
    a: ["Sí. MediaLab ofrece auditorías UXGreen™ completas e implementación de todas las optimizaciones necesarias para cumplir con el estándar. Incluye diseño UX, optimización técnica, accesibilidad y estrategia de IA. Agenda tu sesión de discovery.", "Yes. MediaLab offers complete UXGreen™ audits and implementation of all optimizations needed to meet the standard. This includes UX design, technical optimization, accessibility, and AI strategy. Schedule your discovery session."] as [string, string],
  },
]


// ─── FAQ Accordion ───────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-current/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-colors leading-relaxed">
          {q}
        </span>
        <ChevronDown
          size={16}
          className="opacity-30 flex-shrink-0 mt-0.5 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm opacity-55 leading-relaxed">{a}</p>
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
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-[var(--surface-dark)] text-[var(--surface-dark-foreground)] min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-14 dark-hero-text"
        aria-labelledby="uxgreen-hero-heading"
      >
        {/* Background image — nature/sustainability */}
        <div className="absolute inset-0">
          <Image
            src="/images/uxgreen-hero-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover uxgreen-hero-bg"
            priority
          />
          <div className="absolute inset-0 uxgreen-hero-overlay" />
        </div>

        {/* Floating leaf canvas animation */}
        <LeafCanvas className="z-[2] uxgreen-leaf-canvas" />

        {/* Ambient glows */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none ambient-glow"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,191,166,0.14) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full pointer-events-none ambient-glow"
          style={{
            background: "radial-gradient(ellipse at center, rgba(46,204,113,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
          aria-hidden="true"
        />

        <div
          className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Badge pill */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs font-semibold"
              style={{
                borderColor: "rgba(0,191,166,0.35)",
                background: "rgba(0,191,166,0.08)",
                color: "#00BFA6",
              }}
            >
              <Image
                src={UXGREEN_BADGE}
                alt="UXGreen™ Badge"
                width={28}
                height={28}
                unoptimized
                className="drop-shadow-sm"
              />
              <Leaf size={14} />
              UXGreen™ Framework — by MediaLab
            </div>
          </div>

          {/* Heading */}
          <h1
            id="uxgreen-hero-heading"
            className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)" }}
          >
            <Leaf size={28} className="inline-block mr-2 align-middle" style={{ color: "#00BFA6" }} />
            {t("Tu web afecta tu", "Your website impacts your")}{" "}
            <span style={{ color: "#00BFA6" }}>{t("huella de carbono.", "carbon footprint.")}</span>
            <br />
            <span className="opacity-60">{t("Nosotros lo medimos.", "We measure it.")}</span>
          </h1>

          {/* Subhead */}
          <p className="opacity-60 max-w-2xl mx-auto leading-relaxed mb-8" style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)" }}>
            {t("UXGreen™ es el primer estándar de MediaLab que une", "UXGreen™ is MediaLab's first standard that combines")}{" "}
            <strong className="opacity-80">{t("performance, accesibilidad, IA y sostenibilidad digital", "performance, accessibility, AI, and digital sustainability")}</strong>{" "}
            {t("en una evaluación única. Diseñado para reducir la huella de carbono de experiencias digitales.", "in a single evaluation. Designed to reduce the carbon footprint of digital experiences.")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              {t("Descubre el estándar", "Discover the standard")}
              <ArrowRight size={16} />
            </a>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02] uxgreen-secondary-btn"
              style={{ borderColor: "rgba(0,191,166,0.35)", color: "#00BFA6" }}
            >
              {t("Analiza tu sitio — gratis", "Analyze your site — free")}
            </a>
          </div>

          {/* Social proof micro */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs opacity-70 flex-wrap">
            <span>✓ {t("Análisis gratuito", "Free analysis")}</span>
            <span>✓ {t("Sin registro", "No sign-up")}</span>
            <span>✓ {t("Datos en tiempo real", "Real-time data")}</span>
            <span>✓ {t("Evaluación verificable", "Verifiable evaluation")}</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div
            className="w-5 h-8 rounded-full border border-current/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: "rgba(0,191,166,0.6)" }} />
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
          
          {/* Manifesto Intro Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            
            {/* Left Column: Text & Equation */}
            <div className="lg:col-span-7 text-left">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
                {t("El problema real", "The real problem")}
              </span>
              <h2
                id="manifesto-heading"
                className="font-display font-bold text-3xl sm:text-4xl mb-5 leading-tight"
              >
                {t("¿Por qué la mala UX", "Why does bad UX")}{" "}
                <span style={{ color: "#00BFA6" }}>{t("contamina la web?", "pollute the web?")}</span>
              </h2>
              <p className="opacity-50 leading-relaxed mb-8" style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)" }}>
                {t("Un sitio lento no solo frustra a tus usuarios — consume más energía, genera más CO₂, requiere más infraestructura y destruye más negocio. La ineficiencia digital tiene un costo doble: humano y ambiental.", "A slow site doesn't just frustrate your users — it consumes more energy, generates more CO₂, requires more infrastructure, and destroys more business. Digital inefficiency has a double cost: human and environmental.")}
              </p>

              {/* Equation */}
              <div
                className="rounded-2xl uxgreen-card p-6 text-center"
                style={{ background: "rgba(0,191,166,0.03)" }}
              >
                <p className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">
                  {t("La ecuación UXGreen™", "The UXGreen™ equation")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
                  {[
                    t("Performance óptima", "Optimal performance"),
                    "=",
                    t("Menos energía", "Less energy"),
                    "=",
                    t("Mejor UX", "Better UX"),
                    "=",
                    t("Más conversión", "More conversion"),
                    "=",
                    t("Menor CO₂", "Lower CO₂"),
                  ].map((item, i) => (
                    <span
                      key={i}
                      className={item === "=" ? "opacity-25" : ""}
                      style={item !== "=" ? { color: i === 0 ? "#00BFA6" : "inherit" } : {}}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Digital Sustainability Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full border border-current/10 shadow-2xl bg-black/40">
                <Image
                  src="/images/uxgreen-team.png"
                  alt="MediaLab UXGreen Team Collaboration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className="text-white text-xs font-medium opacity-90 drop-shadow-sm">
                    {t("Investigación y codiseño de interfaces de alta eficiencia digital", "Research and co-design of high-efficiency digital interfaces")}
                  </p>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full pointer-events-none opacity-20 filter blur-xl" style={{ background: "#00BFA6" }} />
            </div>

          </div>

          {/* Stats Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="rounded-2xl uxgreen-card p-6 transition-all duration-700"
                  style={{
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
                  <p className="text-sm opacity-65 leading-relaxed mb-3">{t(stat.label[0], stat.label[1])}</p>
                  <a
                    href={stat.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] opacity-40 font-mono hover:text-[#00BFA6] hover:underline transition-colors"
                  >
                    {stat.source}
                  </a>
                </div>
              )
            })}
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
              {t("El estándar", "The standard")}
            </span>
            <h2
              id="pillars-heading"
              className="font-display font-bold text-3xl sm:text-4xl mb-5"
            >
              {t("8 dimensiones del estándar MediaLab de", "8 dimensions of the MediaLab")}{" "}
              <span style={{ color: "#00BFA6" }}>{t("eficiencia digital", "digital efficiency standard")}</span>
            </h2>
            <p className="opacity-50 max-w-xl mx-auto">
              {t("UXGreen™ evalúa lo que importa: la experiencia real, el impacto ambiental y la preparación para el futuro de la web.", "UXGreen™ evaluates what matters: the real experience, environmental impact, and readiness for the future of the web.")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="rounded-2xl uxgreen-card p-5 hover:border-[#00BFA6]/30 transition-all duration-300 group"
                  style={{
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
                  <div className="text-xs font-semibold opacity-30 uppercase tracking-widest mb-1">
                    0{i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-1">{pillar.title}</h3>
                  <p className="text-[#00BFA6] text-xs font-medium mb-3">{t(pillar.tagline[0], pillar.tagline[1])}</p>
                  <p className="opacity-50 text-xs leading-relaxed mb-4">{t(pillar.desc[0], pillar.desc[1])}</p>
                  <div className="border-t border-current/8 pt-4">
                    <span className="text-xl font-bold font-display">{pillar.metric}</span>
                    <p className="opacity-30 text-[10px] mt-0.5">{t(pillar.metricLabel[0], pillar.metricLabel[1])}</p>
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
            <div className="flex justify-center mb-5">
              <div className="relative">
                <Image
                  src={UXGREEN_BADGE}
                  alt="UXGreen™ Badge"
                  width={96}
                  height={96}
                  unoptimized
                  className="drop-shadow-lg"
                  style={{ filter: "drop-shadow(0 0 20px rgba(0,191,166,0.4))" }}
                />
                <div className="absolute inset-0 rounded-full animate-ping opacity-15" style={{ background: "radial-gradient(circle, #00BFA6 0%, transparent 70%)" }} />
              </div>
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              UXGreen™ Analyzer
            </span>
            <h2
              id="calculator-heading"
              className="font-display font-bold text-3xl sm:text-4xl mb-5"
            >
              {t("Obtén tu", "Get your")}{" "}
              <span style={{ color: "#00BFA6" }}>UXGreen™ Score</span>
            </h2>
            <p className="opacity-50 max-w-xl mx-auto text-sm leading-relaxed">
              {t("Análisis en tiempo real de performance, carbono, accesibilidad, IA y UX. Gratis. Sin registro. Resultado en menos de 30 segundos.", "Real-time analysis of performance, carbon, accessibility, AI, and UX. Free. No sign-up. Results in under 30 seconds.")}
            </p>
          </div>

          <UXGreenCalculator />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[var(--surface-mid)]" aria-labelledby="how-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Steps (left 7 cols) */}
            <div className="lg:col-span-7 text-left">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
                {t("El proceso", "The process")}
              </span>
              <h2
                id="how-heading"
                className="font-display font-bold text-3xl sm:text-4xl mb-10 leading-tight"
              >
                {t("De análisis a", "From analysis to")}{" "}
                <span style={{ color: "#00BFA6" }}>{t("cumplimiento", "compliance")}</span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: t("Analiza", "Analyze"),
                    desc: t("Ingresa tu dominio en el UXGreen™ Analyzer. Obtenemos datos en tiempo real de performance, carbono y accesibilidad.", "Enter your domain in the UXGreen™ Analyzer. We obtain real-time data on performance, carbon, and accessibility."),
                  },
                  {
                    step: "02",
                    title: t("Diagnostica", "Diagnose"),
                    desc: t("Recibes tu score en 8 dimensiones, insights específicos y un roadmap de mejoras priorizado por impacto.", "You receive your score across 8 dimensions, specific insights, and an improvement roadmap prioritized by impact."),
                  },
                  {
                    step: "03",
                    title: t("Mejora y cumple", "Improve and comply"),
                    desc: t("Implementa las mejoras (con MediaLab o tu equipo) e incluye en tu sitio que cumples con el estándar UXGreen™ by MediaLab.", "Implement the improvements (with MediaLab or your team) and display on your site that you comply with the UXGreen™ by MediaLab standard."),
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start rounded-2xl uxgreen-card p-6 transition-all duration-300 hover:border-[#00BFA6]/20">
                    <div
                      className="text-3xl font-bold font-display opacity-80 flex-shrink-0"
                      style={{ color: "#00BFA6" }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm opacity-55 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup image (right 5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full border border-current/10 shadow-2xl bg-black/40">
                <Image
                  src="/images/uxgreen-testing.png"
                  alt="MediaLab UXGreen Human Testing and Analysis"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20 filter blur-xl" style={{ background: "#00BFA6" }} />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full pointer-events-none opacity-10 filter blur-2xl" style={{ background: "#2ecc71" }} />
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[var(--surface-dark)]" aria-labelledby="faq-uxgreen-heading">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-4">
              {t("Preguntas frecuentes", "Frequently asked questions")}
            </span>
            <h2
              id="faq-uxgreen-heading"
              className="font-display font-bold text-3xl"
            >
              {t("Todo sobre UXGreen™", "All about UXGreen™")}
            </h2>
          </div>

          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={t(faq.q[0], faq.q[1])} a={t(faq.a[0], faq.a[1])} />
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
            {t("Pioneros en eficiencia digital sostenible", "Pioneers in sustainable digital efficiency")}
          </div>

          <h2
            id="cta-uxgreen-heading"
            className="font-display font-bold text-4xl sm:text-5xl mb-5 leading-tight"
          >
            {t("Tu producto digital merece", "Your digital product deserves")}{" "}
            <span style={{ color: "#00BFA6" }}>{t("un estándar más alto.", "a higher standard.")}</span>
          </h2>

          <p className="opacity-55 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {t("Empieza con un análisis gratuito. Termina con un producto más rápido, más accesible, más eficiente y evaluado bajo el primer estándar de UX sostenible de MediaLab.", "Start with a free analysis. End with a faster, more accessible, more efficient product evaluated under MediaLab's first sustainable UX standard.")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              {t("Obtener mi UXGreen™ Score", "Get my UXGreen™ Score")}
              <ArrowRight size={16} />
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm border border-current/40 hover:border-current/60 hover:bg-current/10 transition-all"
            >
              {t("Hablar con un experto", "Talk to an expert")}
            </Link>
          </div>

          <p className="opacity-25 text-xs mt-6">
            {t("Análisis gratuito · Estándar UXGreen™ by MediaLab · MediaLab Ingeniería © 2026", "Free analysis · UXGreen™ Standard by MediaLab · MediaLab Ingeniería © 2026")}
          </p>
        </div>
      </section>
    </div>
  )
}
