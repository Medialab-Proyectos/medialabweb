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
import { useLanguage } from "@/lib/language-context"

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

const SCORE_PILLARS: { key: keyof UXGreenScores; label: string; icon: React.ElementType; desc: [string, string] }[] = [
  { key: "performance", label: "Performance", icon: Zap, desc: ["Velocidad de carga y tiempo de respuesta del servidor", "Load speed and server response time"] },
  { key: "coreWebVitals", label: "Core Web Vitals", icon: BarChart2, desc: ["LCP, CLS y TBT medidos por Google", "LCP, CLS and TBT as measured by Google"] },
  { key: "carbonEfficiency", label: "Carbon Efficiency", icon: Leaf, desc: ["Huella de CO₂ por visita vs promedio web global", "CO₂ footprint per visit vs global web average"] },
  { key: "uxEfficiency", label: "UX Efficiency", icon: Globe, desc: ["Ratio clicks necesarios vs valor entregado al usuario", "Required clicks ratio vs value delivered to user"] },
  { key: "accessibility", label: "Accessibility", icon: Eye, desc: ["Cumplimiento WCAG 2.2 y usabilidad universal", "WCAG 2.2 compliance and universal usability"] },
  { key: "aiEfficiency", label: "AI Efficiency", icon: Cpu, desc: ["Optimización para indexación y citabilidad por LLMs", "Optimization for LLM indexing and citability"] },
  { key: "cognitiveLoad", label: "Cognitive Load", icon: Brain, desc: ["Complejidad mental requerida para completar tareas clave", "Mental complexity required to complete key tasks"] },
  { key: "sustainableUX", label: "Sustainable UX", icon: Wind, desc: ["Eficiencia global de recursos digitales vs experiencia generada", "Global efficiency of digital resources vs experience delivered"] },
]

const INDUSTRIES: { value: string; label: [string, string] }[] = [
  { value: "fintech", label: ["Fintech / Pagos", "Fintech / Payments"] },
  { value: "banca", label: ["Banca / Seguros", "Banking / Insurance"] },
  { value: "saas", label: ["SaaS / Software B2B", "SaaS / B2B Software"] },
  { value: "ecommerce", label: ["E-commerce / Retail", "E-commerce / Retail"] },
  { value: "startup", label: ["Startup / MVP", "Startup / MVP"] },
  { value: "educacion", label: ["Educación / EdTech", "Education / EdTech"] },
  { value: "salud", label: ["Salud / HealthTech", "Health / HealthTech"] },
  { value: "movilidad", label: ["Movilidad / Logística", "Mobility / Logistics"] },
  { value: "media", label: ["Media / Contenido", "Media / Content"] },
  { value: "otros", label: ["Otro sector", "Other sector"] },
]

const PRODUCT_TYPES: { value: string; label: [string, string] }[] = [
  { value: "app-web", label: ["Aplicación web", "Web application"] },
  { value: "landing", label: ["Landing page / Sitio corporativo", "Landing page / Corporate site"] },
  { value: "ecommerce", label: ["Tienda online", "Online store"] },
  { value: "saas-dashboard", label: ["Dashboard / Panel SaaS", "Dashboard / SaaS Panel"] },
  { value: "blog-content", label: ["Blog / Contenidos", "Blog / Content"] },
  { value: "marketplace", label: ["Marketplace / Plataforma", "Marketplace / Platform"] },
]

const TRAFFIC_OPTIONS: { value: string; label: [string, string] }[] = [
  { value: "menos-1k", label: ["< 1.000 visitas/mes", "< 1,000 visits/month"] },
  { value: "1k-10k", label: ["1.000 – 10.000 visitas/mes", "1,000 – 10,000 visits/month"] },
  { value: "10k-100k", label: ["10.000 – 100.000 visitas/mes", "10,000 – 100,000 visits/month"] },
  { value: "100k-1m", label: ["100.000 – 1M visitas/mes", "100,000 – 1M visits/month"] },
  { value: "mas-1m", label: ["> 1M visitas/mes", "> 1M visits/month"] },
]

const LOADING_MESSAGES: [string, string][] = [
  ["Iniciando análisis de performance...", "Starting performance analysis..."],
  ["Midiendo Core Web Vitals...", "Measuring Core Web Vitals..."],
  ["Calculando huella de carbono digital...", "Calculating digital carbon footprint..."],
  ["Evaluando eficiencia UX...", "Evaluating UX efficiency..."],
  ["Auditando accesibilidad...", "Auditing accessibility..."],
  ["Analizando preparación para IA...", "Analyzing AI readiness..."],
  ["Midiendo carga cognitiva...", "Measuring cognitive load..."],
  ["Calculando UX Score sostenible...", "Calculating sustainable UX Score..."],
  ["Generando recomendaciones...", "Generating recommendations..."],
  ["Preparando tu UXGreen™ Score...", "Preparing your UXGreen™ Score..."],
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

function certConfigFn(level: UXGreenResult["certLevel"], t: (es: string, en: string) => string) {
  switch (level) {
    case "elite":
      return { color: "#00BFA6", bg: "rgba(0,191,166,0.12)", label: "UXGreen™ Elite", desc: t("Top 10% — Experiencia digital excepcional", "Top 10% — Exceptional digital experience") }
    case "certified":
      return { color: "#00BFA6", bg: "rgba(0,191,166,0.09)", label: "UXGreen™ Certified", desc: t("Estándar de eficiencia digital de MediaLab", "MediaLab digital efficiency standard") }
    case "foundation":
      return { color: "#F59E0B", bg: "rgba(245,158,11,0.10)", label: "UXGreen™ Foundation", desc: t("Base establecida — oportunidades claras de mejora", "Foundation established — clear improvement opportunities") }
    default:
      return { color: "#EF4444", bg: "rgba(239,68,68,0.09)", label: t("Sin evaluar", "Not evaluated"), desc: t("Requiere optimización para cumplir el estándar", "Requires optimization to meet the standard") }
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
        <span className="text-4xl font-bold font-display" style={{ color }}>
          <AnimatedNumber target={score} />
        </span>
        <span className="text-xs opacity-40 font-mono mt-0.5">/ 100</span>
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
  const { t } = useLanguage()
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
      const timer = setTimeout(() => setBarsAnimated(true), 200)
      return () => clearTimeout(timer)
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
      setErrorMsg(t(
        "No pudimos analizar ese dominio. Verifica la URL e intenta de nuevo.",
        "We couldn't analyze that domain. Check the URL and try again."
      ))
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

          <h3 className="text-xl font-semibold mb-2 font-display">
            {t("¿Qué tan eficiente es tu presencia digital?", "How efficient is your digital presence?")}
          </h3>
          <p className="opacity-50 text-sm mb-8 leading-relaxed">
            {t(
              "Ingresa tu dominio y obtén un análisis de performance, carbono, accesibilidad y UX en segundos.",
              "Enter your domain and get a performance, carbon, accessibility and UX analysis in seconds."
            )}
          </p>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
                <Globe size={18} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValidUrl(url)) setStep("context")
                }}
                placeholder={t("tudominio.com", "yourdomain.com")}
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/5 border border-white/20 text-sm outline-none focus:border-[#00BFA6]/50 focus:bg-[#00BFA6]/4 transition-all duration-200 placeholder:opacity-25"
                autoFocus
              />
            </div>

            <button
              onClick={() => { if (isValidUrl(url)) setStep("context") }}
              disabled={!isValidUrl(url)}
              className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90"
              style={{
                background: isValidUrl(url)
                  ? "linear-gradient(135deg, #00BFA6, #00A891)"
                  : "rgba(0,191,166,0.15)",
                color: isValidUrl(url) ? "#000" : "#00BFA6",
                opacity: isValidUrl(url) ? 1 : 0.5,
              }}
            >
              <Globe size={16} />
              {t("Analizar sitio", "Analyze site")}
              <ChevronRight size={16} />
            </button>
          </div>

          <p className="opacity-25 text-xs mt-5 text-center">
            {t(
              "Análisis gratuito · Sin registro requerido · Datos privados",
              "Free analysis · No registration required · Private data"
            )}
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
          <button onClick={() => setStep("input")} className="opacity-30 text-xs mb-6 hover:opacity-60 transition-colors">
            ← {url}
          </button>

          <h3 className="text-xl font-semibold mb-1 font-display">
            {t("Un poco de contexto", "A bit of context")}
          </h3>
          <p className="opacity-50 text-sm mb-8">
            {t("Para un análisis más preciso, cuéntanos sobre tu producto.", "For a more accurate analysis, tell us about your product.")}
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs opacity-40 font-semibold uppercase tracking-widest block mb-2">
                {t("Industria", "Industry")}
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-[#00BFA6]/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0d0d0d]">{t("Selecciona tu industria...", "Select your industry...")}</option>
                {INDUSTRIES.map((i) => (
                  <option key={i.value} value={i.value} className="bg-[#0d0d0d]">{t(i.label[0], i.label[1])}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs opacity-40 font-semibold uppercase tracking-widest block mb-2">
                {t("Tipo de producto", "Product type")}
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-[#00BFA6]/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0d0d0d]">{t("Selecciona el tipo...", "Select the type...")}</option>
                {PRODUCT_TYPES.map((p) => (
                  <option key={p.value} value={p.value} className="bg-[#0d0d0d]">{t(p.label[0], p.label[1])}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs opacity-40 font-semibold uppercase tracking-widest block mb-2">
                {t("Tráfico aproximado", "Approximate traffic")}
              </label>
              <select
                value={traffic}
                onChange={(e) => setTraffic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-[#00BFA6]/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0d0d0d]">{t("Visitas mensuales...", "Monthly visits...")}</option>
                {TRAFFIC_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0d0d0d]">{t(opt.label[0], opt.label[1])}</option>
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
              {t("Iniciar análisis UXGreen™", "Start UXGreen™ analysis")}
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
            {t("Analizando", "Analyzing")} {url}
          </p>
          <p
            key={loadingMsg}
            className="opacity-70 text-sm transition-all duration-500"
            style={{ animation: "fadeIn 0.5s ease" }}
          >
            {t(LOADING_MESSAGES[loadingMsg][0], LOADING_MESSAGES[loadingMsg][1])}
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
          <h3 className="font-semibold mb-2">{t("No pudimos analizar ese dominio", "We couldn't analyze that domain")}</h3>
          <p className="opacity-50 text-sm mb-6 max-w-sm">{errorMsg}</p>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/8 opacity-70 text-sm hover:bg-white/12 transition-colors"
          >
            <RefreshCw size={14} />
            {t("Intentar con otro dominio", "Try another domain")}
          </button>
        </div>
      </div>
    )
  }

  // ── STEP: Results ──────────────────────────────────────────────────────────
  if (step === "results" && result) {
    const cert = certConfigFn(result.certLevel, t)

    return (
      <div ref={resultsRef} className="max-w-4xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 opacity-40 text-sm">
            <Globe size={14} />
            <span className="font-mono text-xs">{result.url.replace("https://", "").replace("http://", "")}</span>
            {result.dataSource === "live" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00BFA6]/15 text-[#00BFA6] border border-[#00BFA6]/20">
                {t("Datos en tiempo real", "Real-time data")}
              </span>
            )}
            {result.dataSource === "estimated" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/12 text-amber-400 border border-amber-500/20">
                {t("Estimado (dominio privado)", "Estimated (private domain)")}
              </span>
            )}
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 opacity-30 hover:opacity-60 text-xs transition-colors"
          >
            <RefreshCw size={12} />
            {t("Nuevo análisis", "New analysis")}
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
            <h3 className="text-2xl font-bold mb-2 font-display">
              {scoreLabel(result.overallScore)} — {result.overallScore}/100
            </h3>
            <p className="opacity-55 text-sm">{cert.desc}</p>

            <div className="flex flex-wrap gap-4 mt-5 justify-center sm:justify-start">
              <div className="text-center">
                <div className="text-lg font-bold">{result.co2Grams.toFixed(3)}g</div>
                <div className="text-xs opacity-35">{t("CO₂ por visita", "CO₂ per visit")}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{result.cleanerThan}%</div>
                <div className="text-xs opacity-35">{t("más limpio que", "cleaner than")}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: result.isGreenHosted ? "#00BFA6" : "#EF4444" }}>
                  {result.isGreenHosted ? t("Verde ✓", "Green ✓") : t("No verde", "Not green")}
                </div>
                <div className="text-xs opacity-35">{t("Hosting energía", "Energy hosting")}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{result.annualCO2Kg} kg</div>
                <div className="text-xs opacity-35">{t("CO₂/año estimado", "Estimated CO₂/year")}</div>
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
                      <div className="text-xs font-semibold">{pillar.label}</div>
                      <div className="text-[10px] opacity-30 leading-tight mt-0.5 max-w-[160px]">{t(pillar.desc[0], pillar.desc[1])}</div>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-display" style={{ color }}>
                    <AnimatedNumber target={score} />
                  </span>
                </div>
                <ScoreBar score={score} animated={barsAnimated} />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] opacity-20">0</span>
                  <span className="text-[10px] font-medium" style={{ color }}>
                    {scoreLabel(score)}
                  </span>
                  <span className="text-[10px] opacity-20">100</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights */}
        {result.insights.length > 0 && (
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h4 className="text-sm font-semibold mb-4 font-display">
              {t("Insights principales", "Key insights")}
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
                  <p className="text-sm opacity-65 leading-relaxed">{ins}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="rounded-2xl border border-[#00BFA6]/20 p-6" style={{ background: "rgba(0,191,166,0.03)" }}>
            <h4 className="text-sm font-semibold mb-4 font-display">
              {t("Recomendaciones prioritarias", "Priority recommendations")}
            </h4>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3">
                  <ChevronRight size={14} className="text-[#00BFA6] flex-shrink-0 mt-1" />
                  <p className="text-sm opacity-65 leading-relaxed">{rec}</p>
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
              {t("Reporte completo UXGreen™", "Full UXGreen™ report")}
            </div>
            <h4 className="text-xl font-semibold mb-2 font-display">
              {t("¿Quieres el plan de acción completo?", "Want the full action plan?")}
            </h4>
            <p className="opacity-50 text-sm mb-6 max-w-md mx-auto">
              {t(
                "Recibe un reporte detallado con hoja de ruta priorizada, benchmarks de tu industria y pasos concretos para subir tu score.",
                "Get a detailed report with a prioritized roadmap, industry benchmarks, and concrete steps to improve your score."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("tu@email.com", "you@email.com")}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:opacity-25 outline-none focus:border-[#00BFA6]/50 transition-all"
              />
              <button
                onClick={() => {
                  if (email.includes("@")) setEmailSent(true)
                }}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
              >
                {t("Enviar reporte", "Send report")}
              </button>
            </div>
            <p className="opacity-20 text-xs mt-4">
              {t("O agenda una auditoría con nuestro equipo → ", "Or book an audit with our team → ")}
              <a href="/contacto" className="underline hover:opacity-40 transition-colors">
                {t("Hablar con un experto", "Talk to an expert")}
              </a>
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-[#00BFA6]/30 p-8 text-center"
            style={{ background: "rgba(0,191,166,0.06)" }}
          >
            <CheckCircle2 size={40} className="text-[#00BFA6] mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 font-display">
              {t("Reporte en camino", "Report on its way")}
            </h4>
            <p className="opacity-55 text-sm">
              {t(
                "En las próximas 24h recibirás tu análisis completo UXGreen™ con el plan de acción personalizado.",
                "Within 24h you'll receive your full UXGreen™ analysis with a personalized action plan."
              )}
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-black hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #00BFA6, #00A891)" }}
            >
              {t("Agendar sesión de revisión", "Book a review session")}
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    )
  }

  return null
}
