"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  Zap,
  Globe,
  Leaf,
  Eye,
  Brain,
  Cpu,
  BarChart2,
  Wind,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

const UXGREEN_BADGE = "/images/curso/logos/Green%20UX%20v%202.svg"

// ─── Types ───────────────────────────────────────────────────────────────────

interface UXGreenScores {
  performance: number
  coreWebVitals: number
  carbonEfficiency: number
  uxEfficiency: number
  accessibility: number
  aiEfficiency: number
  cognitiveLoad: number
  sustainableUX: number
}

interface UXGreenResult {
  url: string
  overallScore: number
  certLevel: "elite" | "certified" | "foundation" | "not-certified"
  certLabel: string
  scores: UXGreenScores
  co2Grams: number
  cleanerThan: number
  carbonRating: string
  pageWeightKb: number
  isGreenHosted: boolean
  annualCO2Kg: number
  insights: string[]
  recommendations: string[]
  dataSource: "live" | "estimated"
}

// ─── Config ───────────────────────────────────────────────────────────────────

const SCORE_PILLARS: { key: keyof UXGreenScores; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "performance", label: "Performance", icon: Zap, desc: "Velocidad de carga y tiempo de respuesta del servidor" },
  { key: "coreWebVitals", label: "Core Web Vitals", icon: BarChart2, desc: "LCP, CLS y TBT medidos por Google" },
  { key: "carbonEfficiency", label: "Carbon Efficiency", icon: Leaf, desc: "Huella de CO₂ por visita vs promedio web global" },
  { key: "uxEfficiency", label: "UX Efficiency", icon: Globe, desc: "Ratio clicks necesarios vs valor entregado al usuario" },
  { key: "accessibility", label: "Accessibility", icon: Eye, desc: "Cumplimiento WCAG 2.2 y usabilidad universal" },
  { key: "aiEfficiency", label: "AI Efficiency", icon: Cpu, desc: "Optimización para indexación y citabilidad por LLMs" },
  { key: "cognitiveLoad", label: "Cognitive Load", icon: Brain, desc: "Complejidad mental requerida para completar tareas clave" },
  { key: "sustainableUX", label: "Sustainable UX", icon: Wind, desc: "Eficiencia global de recursos digitales vs experiencia generada" },
]

const INDUSTRIES = [
  { value: "fintech", label: "Fintech / Pagos" },
  { value: "banca", label: "Banca / Seguros" },
  { value: "saas", label: "SaaS / Software B2B" },
  { value: "ecommerce", label: "E-commerce / Retail" },
  { value: "startup", label: "Startup / MVP" },
  { value: "educacion", label: "Educación / EdTech" },
  { value: "salud", label: "Salud / HealthTech" },
  { value: "movilidad", label: "Movilidad / Logística" },
  { value: "media", label: "Media / Contenido" },
  { value: "otros", label: "Otro sector" },
]

const PRODUCT_TYPES = [
  { value: "app-web", label: "Aplicación web" },
  { value: "landing", label: "Landing page / Sitio corporativo" },
  { value: "ecommerce", label: "Tienda online" },
  { value: "saas-dashboard", label: "Dashboard / Panel SaaS" },
  { value: "blog-content", label: "Blog / Contenidos" },
  { value: "marketplace", label: "Marketplace / Plataforma" },
]

const TRAFFIC_OPTIONS = [
  { value: "menos-1k", label: "< 1.000 visitas/mes" },
  { value: "1k-10k", label: "1.000 – 10.000 visitas/mes" },
  { value: "10k-100k", label: "10.000 – 100.000 visitas/mes" },
  { value: "100k-1m", label: "100.000 – 1M visitas/mes" },
  { value: "mas-1m", label: "> 1M visitas/mes" },
]

const LOADING_MESSAGES = [
  "Iniciando análisis de performance...",
  "Midiendo Core Web Vitals...",
  "Calculando huella de carbono digital...",
  "Evaluando eficiencia UX...",
  "Auditando accesibilidad...",
  "Analizando preparación para IA...",
  "Midiendo carga cognitiva...",
  "Calculando UX Score sostenible...",
  "Generando recomendaciones...",
  "Preparando tu UXGreen™ Score...",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(s: number): string {
  if (s >= 80) return "#00BFA6"
  if (s >= 65) return "#F59E0B"
  if (s >= 50) return "#E8751A"
  return "#EF4444"
}

function scoreLabel(s: number): string {
  if (s >= 90) return "Elite"
  if (s >= 80) return "Excellent"
  if (s >= 70) return "Good"
  if (s >= 60) return "Fair"
  if (s >= 50) return "Weak"
  return "Critical"
}

function certConfig(level: UXGreenResult["certLevel"]) {
  switch (level) {
    case "elite":
      return { color: "#00BFA6", bg: "rgba(0,191,166,0.12)", label: "UXGreen™ Elite", desc: "Top 10% — Experiencia digital excepcional" }
    case "certified":
      return { color: "#00BFA6", bg: "rgba(0,191,166,0.09)", label: "UXGreen™ Certified", desc: "Estándar certificado de eficiencia digital" }
    case "foundation":
      return { color: "#F59E0B", bg: "rgba(245,158,11,0.10)", label: "UXGreen™ Foundation", desc: "Base establecida — oportunidades claras de mejora" }
    default:
      return { color: "#EF4444", bg: "rgba(239,68,68,0.09)", label: "Sin Certificar", desc: "Requiere optimización antes de certificarse" }
  }
}

// ─── Animated number ─────────────────────────────────────────────────────────

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const step = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return <>{current}</>
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const [animScore, setAnimScore] = useState(0)
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const color = scoreColor(score)

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const strokeDash = circ * (animScore / 100)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${strokeDash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-white font-display" style={{ color }}>
          <AnimatedNumber target={score} />
        </span>
        <span className="text-xs text-white/40 font-mono mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score, animated }: { score: number; animated: boolean }) {
  const color = scoreColor(score)
  return (
    <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: animated ? `${score}%` : "0%",
          backgroundColor: color,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UXGreenCalculator() {
  const [step, setStep] = useState<"input" | "context" | "loading" | "results" | "error">("input")
  const [url, setUrl] = useState("")
  const [industry, setIndustry] = useState("")
  const [productType, setProductType] = useState("")
  const [country, setCountry] = useState("")
  const [traffic, setTraffic] = useState("")
  const [loadingMsg, setLoadingMsg] = useState(0)
  const [result, setResult] = useState<UXGreenResult | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [barsAnimated, setBarsAnimated] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Rotate loading messages
  useEffect(() => {
    if (step === "loading") {
      intervalRef.current = setInterval(() => {
        setLoadingMsg((p) => (p + 1) % LOADING_MESSAGES.length)
      }, 1800)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [step])

  // Animate bars after results mount
  useEffect(() => {
    if (step === "results") {
      const t = setTimeout(() => setBarsAnimated(true), 200)
      return () => clearTimeout(t)
    }
    setBarsAnimated(false)
  }, [step])

  function isValidUrl(val: string) {
    try {
      const u = val.trim()
      new URL(u.startsWith("http") ? u : "https://" + u)
      return u.length > 4 && u.includes(".")
    } catch {
      return false
    }
  }

  async function runAnalysis() {
    setStep("loading")
    setLoadingMsg(0)
    try {
      const res = await fetch("/api/uxgreen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, industry, productType, country, traffic }),
      })
      if (!res.ok) throw new Error("Analysis failed")
      const data: UXGreenResult = await res.json()
      setResult(data)
      setStep("results")
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    } catch {
      setErrorMsg("No pudimos analizar ese dominio. Verifica la URL e intenta de nuevo.")
      setStep("error")
    }
  }

  function reset() {
    setStep("input")
    setUrl("")
    setIndustry("")
    setProductType("")
    setCountry("")
    setTraffic("")
    setResult(null)
    setErrorMsg("")
    setEmail("")
    setEmailSent(false)
  }

  // ── STEP: URL Input ────────────────────────────────────────────────────────
  if (step === "input") {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl border border-white/10 p-8"
          style={{ background: "linear-gradient(135deg, rgba(0,191,166,0.04) 0%, rgba(0,0,0,0) 60%)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#00BFA6] border border-[#00BFA6]/30 bg-[#00BFA6]/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-pulse" />
              UXGreen™ Analyzer
            </span>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2 font-display">
            ¿Qué tan eficiente es tu presencia digital?
          </h3>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Ingresa tu dominio y obtén un análisis de performance, carbono, accesibilidad y UX en segundos.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <Globe size={18} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValidUrl(url)) setStep("context")
                }}
                placeholder="tudominio.com"
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-[#00BFA6]/50 focus:bg-[#00BFA6]/4 transition-all duration-200"
                autoFocus
              />
            </div>

            <button
              onClick={() => { if (isValidUrl(url)) setStep("context") }}
              disabled={!isValidUrl(url)}
              className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: isValidUrl(url)
                  ? "linear-gradient(135deg, #00BFA6, #00A891)"
                  : "rgba(255,255,255,0.08)",
                color: isValidUrl(url) ? "#000" : "rgba(255,255,255,0.3)",
              }}
            >
              Analizar sitio
              <ChevronRight size={16} />
            </button>
          </div>

          <p className="text-white/25 text-xs mt-5 text-center">
            Análisis gratuito · Sin registro requerido · Datos privados
          </p>
        </div>
      </div>
    )
  }

  // ── STEP: Context ──────────────────────────────────────────────────────────
  if (step === "context") {
    const isReady = industry && productType && traffic
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl border border-white/10 p-8"
          style={{ background: "linear-gradient(135deg, rgba(0,191,166,0.04) 0%, rgba(0,0,0,0) 60%)" }}
        >
          <button onClick={() => setStep("input")} className="text-white/30 text-xs mb-6 hover:text-white/60 transition-colors">
            ← {url}
          </button>

          <h3 className="text-xl font-semibold text-white mb-1 font-display">
            Un poco de contexto
          </h3>
          <p className="text-white/50 text-sm mb-8">
            Para un análisis más preciso, cuéntanos sobre tu producto.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-widest block mb-2">
                Industria
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#00BFA6]/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0d0d0d]">Selecciona tu industria...</option>
                {INDUSTRIES.map((i) => (
                  <option key={i.value} value={i.value} className="bg-[#0d0d0d]">{i.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-widest block mb-2">
                Tipo de producto
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#00BFA6]/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0d0d0d]">Selecciona el tipo...</option>
                {PRODUCT_TYPES.map((p) => (
                  <option key={p.value} value={p.value} className="bg-[#0d0d0d]">{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-widest block mb-2">
                Tráfico aproximado
              </label>
              <select
                value={traffic}
                onChange={(e) => setTraffic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#00BFA6]/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0d0d0d]">Visitas mensuales...</option>
                {TRAFFIC_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#0d0d0d]">{t.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={runAnalysis}
              disabled={!isReady}
              className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{
                background: isReady ? "linear-gradient(135deg, #00BFA6, #00A891)" : "rgba(255,255,255,0.08)",
                color: isReady ? "#000" : "rgba(255,255,255,0.3)",
              }}
            >
              Iniciar análisis UXGreen™
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── STEP: Loading ──────────────────────────────────────────────────────────
  if (step === "loading") {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl border border-white/10 p-10 flex flex-col items-center text-center"
          style={{ background: "linear-gradient(135deg, rgba(0,191,166,0.04) 0%, rgba(0,0,0,0) 60%)" }}
        >
          <div className="relative mb-8">
            <div
              className="w-24 h-24 rounded-full border-2 border-[#00BFA6]/20 flex items-center justify-center"
              style={{ boxShadow: "0 0 40px rgba(0,191,166,0.15)" }}
            >
              <div
                className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#00BFA6] border-r-[#00BFA6]/40 animate-spin"
                style={{ animationDuration: "1.2s" }}
              />
            </div>
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: "radial-gradient(circle, #00BFA6 0%, transparent 70%)" }}
            />
          </div>

          <p className="text-[#00BFA6] text-xs font-semibold uppercase tracking-widest mb-3">
            Analizando {url}
          </p>
          <p
            key={loadingMsg}
            className="text-white/70 text-sm transition-all duration-500"
            style={{ animation: "fadeIn 0.5s ease" }}
          >
            {LOADING_MESSAGES[loadingMsg]}
          </p>

          <div className="w-full mt-8 space-y-2">
            {SCORE_PILLARS.map((p, i) => {
              const isActive = i <= loadingMsg
              return (
                <div key={p.key} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{ background: isActive ? "rgba(0,191,166,0.2)" : "rgba(255,255,255,0.05)" }}
                  >
                    {isActive ? (
                      <CheckCircle2 size={12} className="text-[#00BFA6]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    )}
                  </div>
                  <span
                    className="text-xs transition-colors duration-300"
                    style={{ color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}
                  >
                    {p.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── STEP: Error ────────────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-red-500/20 p-8 flex flex-col items-center text-center bg-red-500/5">
          <AlertCircle size={40} className="text-red-400 mb-4" />
          <h3 className="text-white font-semibold mb-2">No pudimos analizar ese dominio</h3>
          <p className="text-white/50 text-sm mb-6 max-w-sm">{errorMsg}</p>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/8 text-white/70 text-sm hover:bg-white/12 transition-colors"
          >
            <RefreshCw size={14} />
            Intentar con otro dominio
          </button>
        </div>
      </div>
    )
  }

  // ── STEP: Results ──────────────────────────────────────────────────────────
  if (step === "results" && result) {
    const cert = certConfig(result.certLevel)

    return (
      <div ref={resultsRef} className="max-w-4xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Globe size={14} />
            <span className="font-mono text-xs">{result.url.replace("https://", "").replace("http://", "")}</span>
            {result.dataSource === "live" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00BFA6]/15 text-[#00BFA6] border border-[#00BFA6]/20">
                Datos en tiempo real
              </span>
            )}
            {result.dataSource === "estimated" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/12 text-amber-400 border border-amber-500/20">
                Estimado (dominio privado)
              </span>
            )}
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            <RefreshCw size={12} />
            Nuevo análisis
          </button>
        </div>

        {/* Score overview */}
        <div
          className="rounded-2xl border p-8 flex flex-col sm:flex-row items-center gap-8"
          style={{ borderColor: cert.color + "40", background: cert.bg }}
        >
          <ScoreRing score={result.overallScore} size={160} />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
              {result.certLevel !== "not-certified" && (
                <Image
                  src={UXGREEN_BADGE}
                  alt={`${cert.label} badge`}
                  width={48}
                  height={48}
                  unoptimized
                  className="flex-shrink-0"
                />
              )}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ color: cert.color, borderColor: cert.color + "40", background: cert.bg }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: cert.color }} />
                {cert.label}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-display">
              {scoreLabel(result.overallScore)} — {result.overallScore}/100
            </h3>
            <p className="text-white/55 text-sm">{cert.desc}</p>

            <div className="flex flex-wrap gap-4 mt-5 justify-center sm:justify-start">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{result.co2Grams.toFixed(3)}g</div>
                <div className="text-xs text-white/35">CO₂ por visita</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{result.cleanerThan}%</div>
                <div className="text-xs text-white/35">más limpio que</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: result.isGreenHosted ? "#00BFA6" : "#EF4444" }}>
                  {result.isGreenHosted ? "Verde ✓" : "No verde"}
                </div>
                <div className="text-xs text-white/35">Hosting energía</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{result.annualCO2Kg} kg</div>
                <div className="text-xs text-white/35">CO₂/año estimado</div>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Pillars */}
        <div className="grid sm:grid-cols-2 gap-3">
          {SCORE_PILLARS.map((pillar) => {
            const score = result.scores[pillar.key]
            const color = scoreColor(score)
            const Icon = pillar.icon
            return (
              <div
                key={pillar.key}
                className="rounded-xl border border-white/8 p-4 group hover:border-white/16 transition-colors"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: color + "18" }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{pillar.label}</div>
                      <div className="text-[10px] text-white/30 leading-tight mt-0.5 max-w-[160px]">{pillar.desc}</div>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-display" style={{ color }}>
                    <AnimatedNumber target={score} />
                  </span>
                </div>
                <ScoreBar score={score} animated={barsAnimated} />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-white/20">0</span>
                  <span className="text-[10px] font-medium" style={{ color }}>
                    {scoreLabel(score)}
                  </span>
                  <span className="text-[10px] text-white/20">100</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights */}
        {result.insights.length > 0 && (
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h4 className="text-sm font-semibold text-white mb-4 font-display">
              Insights principales
            </h4>
            <div className="space-y-3">
              {result.insights.map((ins, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(0,191,166,0.15)" }}
                  >
                    <span className="text-[10px] font-bold text-[#00BFA6]">{i + 1}</span>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{ins}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="rounded-2xl border border-[#00BFA6]/20 p-6" style={{ background: "rgba(0,191,166,0.03)" }}>
            <h4 className="text-sm font-semibold text-white mb-4 font-display">
              Recomendaciones prioritarias
            </h4>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3">
                  <ChevronRight size={14} className="text-[#00BFA6] flex-shrink-0 mt-1" />
                  <p className="text-sm text-white/65 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead Capture CTA */}
        {!emailSent ? (
          <div
            className="rounded-2xl border border-white/10 p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,191,166,0.06) 0%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#00BFA6] border border-[#00BFA6]/30 bg-[#00BFA6]/8 mb-4">
              Reporte completo UXGreen™
            </div>
            <h4 className="text-xl font-semibold text-white mb-2 font-display">
              ¿Quieres el plan de acción completo?
            </h4>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              Recibe un reporte detallado con hoja de ruta priorizada, benchmarks de tu industria y pasos concretos para subir tu score.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-[#00BFA6]/50 transition-all"
              />
              <button
                onClick={() => {
                  if (email.includes("@")) setEmailSent(true)
                }}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
              >
                Enviar reporte
              </button>
            </div>
            <p className="text-white/20 text-xs mt-4">
              O agenda una auditoría con nuestro equipo →{" "}
              <a href="/contacto" className="underline hover:text-white/40 transition-colors">
                Hablar con un experto
              </a>
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-[#00BFA6]/30 p-8 text-center"
            style={{ background: "rgba(0,191,166,0.06)" }}
          >
            <CheckCircle2 size={40} className="text-[#00BFA6] mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2 font-display">
              Reporte en camino
            </h4>
            <p className="text-white/55 text-sm">
              En las próximas 24h recibirás tu análisis completo UXGreen™ con el plan de acción personalizado.
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-black hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              Agendar sesión de revisión
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    )
  }

  return null
}
