"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Zap, Globe, Leaf, Eye, Brain, Cpu, BarChart2, Wind,
  ArrowRight, ChevronDown, TrendingUp,
  Server, AlertTriangle, Gauge, RotateCw, ExternalLink, Mail,
} from "lucide-react"
import { UXGreenCalculator } from "@/components/uxgreen-calculator"
import { UXGreenSectionNav } from "@/components/uxgreen-section-nav"
import { useLanguage } from "@/lib/language-context"

// ─── Inline Google "G" isologo ───────────────────────────────────────────────

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

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
    color: "#0E7C66",
    title: "Performance",
    tagline: ["Velocidad es respeto", "Speed is respect"] as [string, string],
    desc: ["Cada 100ms de mejora en carga reduce rebotes un 8% y el consumo energético por sesión. La rapidez no es lujo — es eficiencia.", "Every 100ms improvement in load time reduces bounce rates by 8% and energy consumption per session. Speed is not a luxury — it's efficiency."] as [string, string],
    metric: "53%",
    metricLabel: ["de usuarios abandona si carga > 3s", "of users leave if load time > 3s"] as [string, string],
  },
  {
    icon: BarChart2,
    color: "#10916F",
    title: "Core Web Vitals",
    tagline: ["Los estándares que mide Google", "The standards Google measures"] as [string, string],
    desc: ["LCP, CLS y TBT son las señales con las que Google decide tu posición. Un buen CWV es también un sitio más eficiente energéticamente.", "LCP, CLS, and TBT are the signals Google uses to determine your ranking. Good CWV also means a more energy-efficient site."] as [string, string],
    metric: "1.5s",
    metricLabel: ["LCP ideal según estándar UXGreen™", "Ideal LCP per UXGreen™ standard"] as [string, string],
  },
  {
    icon: Leaf,
    color: "#12A37A",
    title: "Carbon Efficiency",
    tagline: ["Cada byte tiene un peso real", "Every byte has a real weight"] as [string, string],
    desc: ["La web global genera más CO₂ anual que la industria aérea. Un sitio optimizado puede ser hasta 80% más limpio que el promedio.", "The global web generates more annual CO₂ than the airline industry. An optimized site can be up to 80% cleaner than average."] as [string, string],
    metric: "0.5g",
    metricLabel: ["CO₂ por visita en sitios optimizados", "CO₂ per visit on optimized sites"] as [string, string],
  },
  {
    icon: Globe,
    color: "#00BFA6",
    title: "UX Efficiency",
    tagline: ["Menos clics, menos energía", "Fewer clicks, less energy"] as [string, string],
    desc: ["Cada clic innecesario es una petición extra al servidor que consume energía. Un flujo eficiente reduce las solicitudes HTTP, el tiempo de procesamiento y el gasto energético por sesión.", "Every unnecessary click is an extra server request that consumes energy. An efficient flow reduces HTTP requests, processing time, and energy expenditure per session."] as [string, string],
    metric: "40%",
    metricLabel: ["menos peticiones con flujos optimizados", "fewer requests with optimized flows"] as [string, string],
  },
  {
    icon: Eye,
    color: "#1FB98C",
    title: "Accessibility",
    tagline: ["Inclusión que reduce desperdicio", "Inclusion that reduces waste"] as [string, string],
    desc: ["Un sitio inaccesible obliga al 15% de usuarios a reintentar, recargar y abandonar — generando tráfico y procesamiento innecesario. WCAG 2.2 no solo es legal: reduce el rebote y el consumo energético por visita fallida.", "An inaccessible site forces 15% of users to retry, reload, and abandon — generating unnecessary traffic and processing. WCAG 2.2 isn't just legal: it reduces bounce rates and energy consumption from failed visits."] as [string, string],
    metric: "15%",
    metricLabel: ["de usuarios generan tráfico extra por barreras", "of users generate extra traffic due to barriers"] as [string, string],
  },
  {
    icon: Cpu,
    color: "#2ECC71",
    title: "AI Efficiency",
    tagline: ["IA que indexa, no que consume", "AI that indexes, not consumes"] as [string, string],
    desc: ["Los LLMs consumen energía masiva por cada consulta. Tu contenido bien estructurado reduce las inferencias necesarias y mejora su citabilidad.", "LLMs consume massive energy per query. Well-structured content reduces the inferences needed and improves citability."] as [string, string],
    metric: "3×",
    metricLabel: ["más citable con arquitectura semántica", "more citable with semantic architecture"] as [string, string],
  },
  {
    icon: Brain,
    color: "#58D68D",
    title: "Cognitive Load",
    tagline: ["Confusión = más consumo", "Confusion = more consumption"] as [string, string],
    desc: ["Una interfaz confusa genera recargas, clics repetidos y sesiones más largas — cada acción innecesaria consume CPU, ancho de banda y energía del servidor. Reducir la carga cognitiva es reducir la huella de carbono.", "A confusing interface generates reloads, repeated clicks, and longer sessions — every unnecessary action consumes CPU, bandwidth, and server energy. Reducing cognitive load means reducing the carbon footprint."] as [string, string],
    metric: "50ms",
    metricLabel: ["para decidir si tu UI desperdicia energía", "to decide if your UI wastes energy"] as [string, string],
  },
  {
    icon: Wind,
    color: "#82E0AA",
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
    icon: AlertTriangle,
    value: "88%",
    label: ["de usuarios no regresa tras una mala experiencia digital", "of users never return after a bad digital experience"] as [string, string],
    detail: ["Una sola experiencia lenta o confusa basta para perder a casi 9 de cada 10 usuarios — y recuperarlos cuesta hasta 5× más que retenerlos.", "A single slow or confusing experience is enough to lose almost 9 of 10 users — and winning them back costs up to 5× more than retaining them."] as [string, string],
    source: "HubSpot State of Marketing 2024",
    sourceUrl: "https://www.hubspot.com/state-of-marketing",
    negative: true,
  },
  {
    icon: Server,
    value: "4%",
    label: ["de las emisiones globales de CO₂ proviene de la web", "of global CO₂ emissions come from the web"] as [string, string],
    detail: ["Si internet fuera un país, sería el 4º mayor emisor del planeta. Cada MB que no optimizas suma a esa huella en cada visita.", "If the internet were a country, it would be the 4th-largest emitter on Earth. Every unoptimized MB adds to that footprint on every visit."] as [string, string],
    source: "IEA / The Shift Project 2024",
    sourceUrl: "https://theshiftproject.org/en/lean-ict-2/",
    negative: true,
  },
  {
    icon: TrendingUp,
    value: "35%",
    label: ["más conversión orgánica al mejorar Core Web Vitals de 45 a 80+", "more organic conversion when improving Core Web Vitals from 45 to 80+"] as [string, string],
    detail: ["Pasar de 45 a 80+ en Core Web Vitals mejora el ranking y la conversión orgánica hasta un 35% — sin gastar un peso más en pauta.", "Going from 45 to 80+ in Core Web Vitals improves ranking and organic conversion by up to 35% — without spending more on ads."] as [string, string],
    source: "Google Search Central 2024",
    sourceUrl: "https://developers.google.com/search/docs/appearance/core-web-vitals",
    negative: false,
  },
  {
    icon: Zap,
    value: "80%",
    label: ["menos CO₂ por visita en sitios optimizados vs el promedio", "less CO₂ per visit on optimized sites vs the average"] as [string, string],
    detail: ["Un sitio bien diseñado emite hasta 80% menos CO₂ por visita que el promedio. Eficiencia y sostenibilidad son la misma optimización.", "A well-designed site emits up to 80% less CO₂ per visit than average. Efficiency and sustainability are the same optimization."] as [string, string],
    source: "Sustainable Web Design, Tom Greenwood",
    sourceUrl: "https://sustainablewebdesign.org/",
    negative: false,
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

// ─── Pillar card ─────────────────────────────────────────────────────────────

function PillarCard({ pillar, num, visible }: { pillar: (typeof PILLARS)[number]; num: number; visible: boolean }) {
  const { t } = useLanguage()
  const Icon = pillar.icon
  const c = pillar.color
  return (
    <div
      className="rounded-2xl uxgreen-card p-5 transition-all duration-300 group snap-start min-w-[80%] sm:min-w-0 flex flex-col"
      style={{
        transitionDelay: visible ? `${num * 50}ms` : "0ms",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {/* Icon at the same level as the title — no oversized icon block */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <Icon size={18} style={{ color: c }} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="font-display font-semibold text-sm">{pillar.title}</h3>
        <span className="ml-auto text-[11px] font-semibold opacity-25 tabular-nums tracking-widest">
          {String(num).padStart(2, "0")}
        </span>
      </div>
      <p className="text-xs font-medium mb-3" style={{ color: c }}>{t(pillar.tagline[0], pillar.tagline[1])}</p>
      <p className="opacity-50 text-xs leading-relaxed mb-4 flex-1">{t(pillar.desc[0], pillar.desc[1])}</p>
      <div className="border-t pt-4" style={{ borderColor: `${c}33` }}>
        <span className="text-xl font-bold font-display" style={{ color: c }}>{pillar.metric}</span>
        <p className="opacity-30 text-[10px] mt-0.5">{t(pillar.metricLabel[0], pillar.metricLabel[1])}</p>
      </div>
    </div>
  )
}

// ─── Stat flip card (problem indicators) ─────────────────────────────────────

function StatFlipCard({ stat, visible, delay }: { stat: (typeof STATS)[number]; visible: boolean; delay: number }) {
  const { t } = useLanguage()
  const [flipped, setFlipped] = useState(false)
  const Icon = stat.icon
  return (
    <div
      className="uxgreen-flip snap-start min-w-[82%] sm:min-w-0 h-[260px] transition-all duration-700"
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className={`uxgreen-flip-inner ${flipped ? "is-flipped" : ""}`}>
        {/* Front */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-label={t("Ver más sobre este dato", "See more about this stat")}
          className="uxgreen-flip-face rounded-2xl uxgreen-card p-6 text-left w-full"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,191,166,0.12)" }}>
            <Icon size={20} style={{ color: "#00BFA6" }} />
          </div>
          <div className="text-4xl font-bold font-display mb-2" style={{ color: "#00BFA6" }}>{stat.value}</div>
          <p className="text-sm opacity-65 leading-relaxed flex-1">{t(stat.label[0], stat.label[1])}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#00BFA6] opacity-70">
            <RotateCw size={11} /> {t("Ver el caso", "See the case")}
          </span>
        </button>

        {/* Back */}
        <div className="uxgreen-flip-face uxgreen-flip-back rounded-2xl uxgreen-card p-6 text-left">
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="text-left flex-1"
            aria-label={t("Volver", "Back")}
          >
            <p className="text-sm opacity-80 leading-relaxed">{t(stat.detail[0], stat.detail[1])}</p>
          </button>
          <a
            href={stat.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#00BFA6] hover:underline"
          >
            <ExternalLink size={12} /> {stat.source}
          </a>
        </div>
      </div>
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
    // Scroll to top on mount — prevents browser/Next.js restoring a previous scroll position
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="uxgreen-page bg-[var(--surface-dark)] text-[var(--surface-dark-foreground)] min-h-screen">
      <UXGreenSectionNav />
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-14 dark-hero-text"
        aria-labelledby="uxgreen-hero-heading"
      >
        {/* Background image — nature/sustainability */}
        <div className="absolute inset-0 bg-black">
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
          {/* Badge pill — hidden on mobile to keep the hero clean */}
          <div className="hidden sm:flex justify-center mb-8">
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
              UXGreen™ Framework — by MediaLab
            </div>
          </div>

          {/* Heading */}
          <h1
            id="uxgreen-hero-heading"
            className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)" }}
          >
            {t("La ineficiencia energética digital", "Digital energy inefficiency")}{" "}
            <span className="uxgreen-accent uxgreen-heat">{t("tiene un costo real.", "has a real cost.")}</span>
          </h1>

          {/* Subhead */}
          <p className="max-w-2xl mx-auto leading-relaxed mb-6 opacity-80" style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)" }}>
            <strong style={{ color: "#00BFA6" }}>{t("UXGreen™ es el estándar de MediaLab", "UXGreen™ is MediaLab's standard")}</strong>{" "}
            {t("que mide la eficiencia digital de tu producto en 8 dimensiones: performance, accesibilidad, huella de carbono, carga cognitiva, UX y preparación para IA. Optimizar reduce el CO₂ por visita hasta un 80%.", "that measures your product's digital efficiency across 8 dimensions: performance, accessibility, carbon footprint, cognitive load, UX, and AI readiness. Optimizing reduces CO₂ per visit by up to 80%.")}
          </p>

          {/* Google ranking callout — highlighted + sourced */}
          <div className="flex justify-center mb-8">
            <a
              href="https://developers.google.com/search/docs/appearance/core-web-vitals"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all hover:scale-[1.02] max-w-xl"
              style={{ borderColor: "rgba(0,191,166,0.45)", background: "rgba(0,0,0,0.32)", boxShadow: "0 0 24px rgba(0,191,166,0.12)" }}
            >
              <GoogleG className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold leading-snug text-left" style={{ color: "#fff" }}>
                {t("Google penaliza los sitios lentos e ineficientes — tu ranking depende de esto.", "Google penalizes slow, inefficient sites — your ranking depends on it.")}
              </span>
              <ArrowRight size={14} className="flex-shrink-0 text-[#00BFA6] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              <Gauge size={16} />
              {t("Analiza tu sitio gratis", "Analyze your site free")}
              <ArrowRight size={16} />
            </a>
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02] uxgreen-secondary-btn"
              style={{ borderColor: "rgba(0,191,166,0.35)", color: "#00BFA6" }}
            >
              {t("¿Qué mide UXGreen™?", "What does UXGreen™ measure?")}
            </a>
          </div>

          {/* Social proof micro */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs opacity-70 flex-wrap">
            <span>✓ {t("30 segundos", "30 seconds")}</span>
            <span>✓ {t("Sin registro", "No sign-up")}</span>
            <span>✓ {t("Resultados al instante", "Instant results")}</span>
            <span>✓ {t("Score verificable", "Verifiable score")}</span>
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
        id="manifesto"
        ref={statsRef as React.RefObject<HTMLElement>}
        className="py-24 px-6 bg-[var(--surface-mid)] scroll-mt-28"
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
                <span className="uxgreen-heat">{t("contamina la web?", "pollute the web?")}</span>
              </h2>
              <p className="opacity-50 leading-relaxed mb-8" style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)" }}>
                {t("Un sitio lento no solo frustra a tus usuarios — consume más energía, genera más CO₂, requiere más infraestructura y destruye más negocio. La ineficiencia digital tiene un costo doble: humano y ambiental.", "A slow site doesn't just frustrate your users — it consumes more energy, generates more CO₂, requires more infrastructure, and destroys more business. Digital inefficiency has a double cost: human and environmental.")}
              </p>

              {/* Equation — standout green background */}
              <div
                className="rounded-2xl p-6 text-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #00BFA6 0%, #0E8A6F 55%, #0a6b56 100%)",
                  boxShadow: "0 14px 36px rgba(0,191,166,0.28)",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>
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
                      style={{ color: item === "=" ? "rgba(255,255,255,0.45)" : "#fff" }}
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
              </div>
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full pointer-events-none opacity-20 filter blur-xl" style={{ background: "#00BFA6" }} />
            </div>

          </div>

          {/* Stats Cards — flip to reveal the case, carousel on mobile */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar uxgreen-carousel sm:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
            {STATS.map((stat, i) => (
              <StatFlipCard key={i} stat={stat} visible={statsVisible} delay={i * 80} />
            ))}
          </div>
          <p className="sm:hidden text-center text-[10px] opacity-30 mt-3">
            {t("Toca una tarjeta para ver el caso · desliza →", "Tap a card to see the case · swipe →")}
          </p>

          {/* Micro-testimonial — Goleman: human empathy between data */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-2xl uxgreen-card p-6 md:p-8 text-center relative">
              <div className="text-[#00BFA6] opacity-30 text-4xl font-serif leading-none mb-3" aria-hidden="true">&ldquo;</div>
              <p className="text-sm opacity-70 leading-relaxed mb-4 italic">
                {t(
                  "No tenía idea de que nuestra landing generaba 4.2g de CO₂ por visita. Después de optimizar con las recomendaciones de UXGreen™, bajamos a 0.3g — y el bounce rate se redujo 22%. Ahora rendimiento y sostenibilidad son parte de nuestro roadmap.",
                  "I had no idea our landing was generating 4.2g of CO₂ per visit. After optimizing with UXGreen™ recommendations, we dropped to 0.3g — and bounce rate decreased 22%. Now performance and sustainability are part of our roadmap."
                )}
              </p>
              <div className="flex items-center justify-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                  style={{ background: "#00BFA6" }}
                >
                  DR
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium opacity-80">Diego R.</p>
                  <p className="text-[10px] opacity-40">{t("CTO · SaaS B2B · Colombia", "CTO · B2B SaaS · Colombia")}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 8 PILLARS ─────────────────────────────────────────────────────────── */}
      <section
        id="pillars"
        ref={pillarsRef as React.RefObject<HTMLElement>}
        className="py-24 px-6 bg-[var(--surface-dark)] scroll-mt-28"
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
              <span className="uxgreen-heat">{t("eficiencia digital", "digital efficiency standard")}</span>
            </h2>
            <p className="opacity-50 max-w-xl mx-auto">
              {t("UXGreen™ evalúa lo que importa: la experiencia real, el impacto ambiental y la preparación para el futuro de la web.", "UXGreen™ evaluates what matters: the real experience, environmental impact, and readiness for the future of the web.")}
            </p>
          </div>

          {/* Category A: Rendimiento — pillars 0,1,2 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,191,166,0.12)" }}>
                <Zap size={16} style={{ color: "#00BFA6" }} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">{t("Consumo energético", "Energy consumption")}</h3>
                <p className="text-[10px] opacity-40">{t("Velocidad, métricas de Google y huella de carbono por cada visita", "Speed, Google metrics, and carbon footprint per visit")}</p>
              </div>
            </div>
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto no-scrollbar uxgreen-carousel sm:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
              {PILLARS.slice(0, 3).map((pillar, i) => (
                <PillarCard key={i} pillar={pillar} num={i + 1} visible={pillarsVisible} />
              ))}
            </div>
          </div>

          {/* Category B: Experiencia — pillars 3,4,5 (was 4th=UX Efficiency originally index 3) */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,191,166,0.12)" }}>
                <Eye size={16} style={{ color: "#00BFA6" }} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">{t("Eficiencia de recursos", "Resource efficiency")}</h3>
                <p className="text-[10px] opacity-40">{t("Menos peticiones al servidor, menos recarga, menos energía desperdiciada por mala UX", "Fewer server requests, fewer reloads, less energy wasted by poor UX")}</p>
              </div>
            </div>
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto no-scrollbar uxgreen-carousel sm:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
              {[PILLARS[3], PILLARS[4], PILLARS[6]].map((pillar, i) => {
                const originalIndex = [3, 4, 6][i]
                return <PillarCard key={originalIndex} pillar={pillar} num={originalIndex + 1} visible={pillarsVisible} />
              })}
            </div>
          </div>

          {/* Category C: Futuro — pillars 5,7 (AI Efficiency + Sustainable UX) */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,191,166,0.12)" }}>
                <Wind size={16} style={{ color: "#00BFA6" }} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">{t("Sostenibilidad a largo plazo", "Long-term sustainability")}</h3>
                <p className="text-[10px] opacity-40">{t("IA eficiente y diseño sostenible que reduce el costo energético con cada iteración", "Efficient AI and sustainable design that reduces energy cost with every iteration")}</p>
              </div>
            </div>
            <div className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto no-scrollbar uxgreen-carousel sm:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
              {[PILLARS[5], PILLARS[7]].map((pillar, i) => {
                const originalIndex = [5, 7][i]
                return <PillarCard key={originalIndex} pillar={pillar} num={originalIndex + 1} visible={pillarsVisible} />
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ────────────────────────────────────────────────────────── */}
      <section
        id="calculator"
        className="py-24 px-6 bg-[var(--surface-mid)] scroll-mt-28"
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
              <span className="uxgreen-heat">UXGreen™ Score</span>
            </h2>
            <p className="opacity-50 max-w-xl mx-auto text-sm leading-relaxed">
              {t("Análisis en tiempo real de performance, carbono, accesibilidad, IA y UX. Gratis. Sin registro. Resultado en menos de 30 segundos.", "Real-time analysis of performance, carbon, accessibility, AI, and UX. Free. No sign-up. Results in under 30 seconds.")}
            </p>
          </div>

          <UXGreenCalculator />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="process" className="py-24 px-6 bg-[var(--surface-mid)] scroll-mt-28" aria-labelledby="how-heading">
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
                <span className="uxgreen-heat">{t("cumplimiento", "compliance")}</span>
              </h2>

              <div className="relative space-y-5">
                {/* Sequence connector — implies 01 → 02 → 03 */}
                <span
                  className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-[#00BFA6]/50 via-[#00BFA6]/30 to-[#00BFA6]/10"
                  aria-hidden="true"
                />
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
                  <div key={i} className="relative flex gap-4 sm:gap-5 items-start">
                    <div
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0 text-black"
                      style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)", boxShadow: "0 4px 14px rgba(0,191,166,0.35)" }}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1 rounded-2xl uxgreen-card p-5 sm:p-6 transition-all duration-300 hover:border-[#00BFA6]/20">
                      <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm opacity-55 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup image (right 5 cols) */}
            <div className="lg:col-span-5 relative lg:mt-20">
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

      {/* ── BRIDGE: Score → Auditoría ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[var(--surface-dark)]" aria-labelledby="bridge-heading">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#00BFA6]/20 overflow-hidden">
            <div className="grid md:grid-cols-[1fr_auto_1fr] items-stretch">
              {/* Left — free */}
              <div className="p-8 md:p-10 text-center md:text-left">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-3">
                  {t("Hazlo tú", "Do it yourself")}
                </span>
                <h3 className="font-display font-bold text-xl mb-3">
                  {t("Analiza gratis", "Analyze for free")}
                </h3>
                <p className="opacity-50 text-sm leading-relaxed mb-5">
                  {t("Usa el UXGreen™ Analyzer, obtén tu score en 8 dimensiones y un roadmap de mejoras que puedes implementar con tu equipo.", "Use the UXGreen™ Analyzer, get your score across 8 dimensions and an improvement roadmap you can implement with your team.")}
                </p>
                <a
                  href="#calculator"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02]"
                  style={{ borderColor: "rgba(0,191,166,0.35)", color: "#00BFA6" }}
                >
                  {t("Ir al Analyzer", "Go to Analyzer")}
                </a>
              </div>

              {/* Divider */}
              <div className="hidden md:flex items-center px-2">
                <div className="w-px h-2/3 bg-current/10" />
              </div>
              <div className="md:hidden flex justify-center py-2">
                <div className="h-px w-2/3 bg-current/10" />
              </div>

              {/* Right — paid */}
              <div className="p-8 md:p-10 text-center md:text-left" style={{ background: "rgba(0,191,166,0.03)" }}>
                <span className="text-xs font-semibold tracking-widest uppercase text-[#00BFA6] block mb-3">
                  {t("Que MediaLab lo haga", "Let MediaLab do it")}
                </span>
                <h3 className="font-display font-bold text-xl mb-3">
                  {t("Auditoría + implementación", "Audit + implementation")}
                </h3>
                <p className="opacity-50 text-sm leading-relaxed mb-5">
                  {t("Nuestro equipo ejecuta la auditoría UXGreen™ completa, implementa las optimizaciones y certifica tu producto bajo el estándar.", "Our team runs the full UXGreen™ audit, implements optimizations, and certifies your product under the standard.")}
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
                >
                  {t("Agendar discovery", "Schedule discovery")}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          <p id="bridge-heading" className="text-center opacity-30 text-xs mt-6">
            {t("El 73% de empresas que analizan su score agendan una sesión de discovery en la primera semana.", "73% of companies that analyze their score schedule a discovery session within the first week.")}
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-[var(--surface-dark)] scroll-mt-28" aria-labelledby="faq-uxgreen-heading">
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
      <section id="cta" className="py-24 px-6 bg-[var(--surface-mid)] relative overflow-hidden scroll-mt-28" aria-labelledby="cta-uxgreen-heading">
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
            {t("Primer estándar de eficiencia digital en Latinoamérica", "First digital efficiency standard in Latin America")}
          </div>

          <h2
            id="cta-uxgreen-heading"
            className="font-display font-bold text-4xl sm:text-5xl mb-5 leading-tight"
          >
            {t("¿Tu producto digital", "Does your digital product")}{" "}
            <span className="uxgreen-heat">{t("cumple?", "pass?")}</span>
          </h2>

          <p className="opacity-55 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {t("Tus usuarios lo saben en 3 segundos. Google lo mide en cada visita. Tu competencia ya lo está optimizando. La pregunta no es si deberías medirlo — es cuánto estás perdiendo por no hacerlo.", "Your users know in 3 seconds. Google measures it on every visit. Your competition is already optimizing. The question isn't whether you should measure it — it's how much you're losing by not doing it.")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              {t("Medir mi sitio ahora — gratis", "Measure my site now — free")}
              <ArrowRight size={16} />
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm border border-current/40 hover:border-current/60 hover:bg-current/10 transition-all"
            >
              <Mail size={16} />
              {t("Contáctanos", "Contact us")}
            </Link>
          </div>

          <p className="opacity-25 text-xs mt-6">
            {t("Análisis gratuito · Sin registro · Estándar UXGreen™ by MediaLab © 2026", "Free analysis · No sign-up · UXGreen™ Standard by MediaLab © 2026")}
          </p>
        </div>
      </section>
    </div>
  )
}
