"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Sparkles, Mail, Loader2, ChevronLeft, RotateCcw,
  CheckCircle2, Circle, Lock, Radar, Target, Layers, Rocket, MessageCircle,
  Cpu, Activity, ShieldCheck, Clock, FileSearch,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { BookingModal } from "./booking-modal"

type Phase = "spark" | "reacting" | "gate" | "otp" | "feed" | "engine" | "return"

type Lab = {
  email?: string
  idea: string
  signals: string[]
  projectName?: string
  references?: string
  objective?: string
  audience?: string
  brief?: string
  prototype?: string
  startedAt?: number
  completedAt?: number
  visits?: number
}

const LAB_KEY = "uxbox_lab"
const ACCENT = "#E8751A"

// Ventana del "análisis profundo" que madura en tiempo real (tunable).
const DEEP_DIVE_MINUTES = 37
const DEEP_DIVE_MS = DEEP_DIVE_MINUTES * 60 * 1000

function fmtCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

/* ── Streaming text (typewriter) ── */
function useTypewriter(text: string, speed = 16) {
  const [out, setOut] = useState("")
  useEffect(() => {
    setOut("")
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

/* ── Client-side idea analysis (mock "AI") ── */
function detectSignals(idea: string): string[] {
  const x = idea.toLowerCase()
  const s: string[] = []
  if (/\b(saas|software|plataforma|dashboard|b2b|herramienta)\b/.test(x)) s.push("SaaS B2B")
  if (/\b(app|m[oó]vil|mobile|aplicaci[oó]n)\b/.test(x)) s.push("Mobile")
  if (/\b(tienda|ecommerce|e-commerce|comprar|venta|carrito|productos)\b/.test(x)) s.push("E-commerce")
  if (/\b(ia|inteligencia artificial|\bai\b|automat|agente)\b/.test(x)) s.push("Automatización con IA")
  if (/\b(pago|finanzas|banco|cr[eé]dito|fintech|inversi[oó]n)\b/.test(x)) s.push("Fintech")
  if (/\b(salud|m[eé]dic|paciente|cl[ií]nica|bienestar)\b/.test(x)) s.push("HealthTech")
  if (/\b(curso|aprend|educa|estudiante|capacit)\b/.test(x)) s.push("EdTech")
  if (s.length === 0) s.push("Producto digital", "Oportunidad de nicho")
  return s.slice(0, 3)
}

const RETURN_INSIGHTS = [
  ["Detecté una oportunidad de automatización que reduce fricción en el onboarding.", "I detected an automation opportunity that reduces onboarding friction."],
  ["Tu idea encaja con una tendencia creciente en búsquedas de producto con IA.", "Your idea fits a growing trend in AI product searches."],
  ["Hay un ángulo de diferenciación por psicología del consumidor sin explotar.", "There's an untapped differentiation angle through consumer psychology."],
  ["Un competidor dejó un hueco claro en la experiencia móvil.", "A competitor left a clear gap in the mobile experience."],
  ["Tu público objetivo responde mejor a flujos guiados con progreso visible.", "Your target audience responds better to guided flows with visible progress."],
]

function loadLab(): Lab | null {
  try {
    const raw = localStorage.getItem(LAB_KEY)
    return raw ? (JSON.parse(raw) as Lab) : null
  } catch {
    return null
  }
}

export function UXBoxForm() {
  const { t } = useLanguage()

  const [phase, setPhase] = useState<Phase>("spark")
  const [lab, setLab] = useState<Lab>({ idea: "", signals: [] })
  const [hydrated, setHydrated] = useState(false)

  // form-local state
  const [idea, setIdea] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [isDemo, setIsDemo] = useState(false)
  const [demoPin, setDemoPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  // feed state
  const [feedStep, setFeedStep] = useState(0)
  const [projectName, setProjectName] = useState("")
  const [references, setReferences] = useState("")
  const [objective, setObjective] = useState("")
  const [audience, setAudience] = useState("")

  // engine state
  const [activeStage, setActiveStage] = useState(0)
  const [brief, setBrief] = useState("")
  const [prototype, setPrototype] = useState("")
  const [returnInsight, setReturnInsight] = useState("")

  const briefRef = useRef("")
  const protoRef = useRef("")
  useEffect(() => { briefRef.current = brief }, [brief])
  useEffect(() => { protoRef.current = prototype }, [prototype])

  // Live clock — drives the time-based deep-dive countdown (Phase 2)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (phase !== "engine" && phase !== "return") return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [phase])

  /* Resume an existing lab on mount */
  useEffect(() => {
    const saved = loadLab()
    setHydrated(true)
    if (saved && saved.completedAt) {
      const insight = RETURN_INSIGHTS[(saved.visits || 0) % RETURN_INSIGHTS.length]
      setReturnInsight(t(insight[0], insight[1]))
      setLab({ ...saved, visits: (saved.visits || 0) + 1 })
      setBrief(saved.brief || "")
      setPrototype(saved.prototype || "")
      setActiveStage(5)
      setPhase("return")
      try { localStorage.setItem(LAB_KEY, JSON.stringify({ ...saved, visits: (saved.visits || 0) + 1 })) } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = (patch: Partial<Lab>) => {
    setLab((prev) => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(LAB_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  /* ── Spark: analyze idea, instant reward ── */
  const reaction = useTypewriter(
    phase === "reacting" && lab.signals.length
      ? t(
          `Detecto señales fuertes de ${lab.signals.join(" + ")}. Hay un ángulo claro para diferenciarte. Asegura tu laboratorio para ver el análisis completo.`,
          `I detect strong signals of ${lab.signals.join(" + ")}. There's a clear angle to differentiate. Secure your lab to see the full analysis.`
        )
      : ""
  )

  const handleSpark = (e: React.FormEvent) => {
    e.preventDefault()
    if (idea.trim().length < 6) {
      setError(t("Cuéntame un poco más sobre tu idea.", "Tell me a bit more about your idea."))
      return
    }
    setError("")
    const signals = detectSignals(idea)
    persist({ idea: idea.trim(), signals })
    setPhase("reacting")
  }

  /* ── Gate: email + OTP ── */
  const sendOtp = async () => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    return { ok: res.ok, data }
  }

  const handleGate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("Ingresa un email válido", "Enter a valid email"))
      return
    }
    if (!consent) {
      setError(t("Necesitamos tu consentimiento para guardar tu laboratorio", "We need your consent to save your lab"))
      return
    }
    setLoading(true); setError("")
    try {
      const { ok, data } = await sendOtp()
      if (ok && data.success) {
        setIsDemo(!!data.demo); setDemoPin(data.pin || "")
        setPhase("otp")
      } else setError(data.error || t("Error enviando el código.", "Error sending the code."))
    } catch { setError(t("Error de conexión.", "Connection error.")) }
    finally { setLoading(false) }
  }

  const handleResend = async () => {
    setResending(true); setError(""); setPinInput("")
    try {
      const { ok, data } = await sendOtp()
      if (ok && data.success) { setIsDemo(!!data.demo); setDemoPin(data.pin || "") }
    } catch {} finally { setResending(false) }
  }

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      })
      const data = await res.json()
      if (data.valid) {
        persist({ email })
        setPhase("feed")
      } else if (data.error === "expired") {
        setError(t("El código expiró. Reenvíalo.", "The code expired. Resend it."))
      } else setError(t("Código incorrecto.", "Incorrect code."))
    } catch { setError(t("Error de conexión.", "Connection error.")) }
    finally { setLoading(false) }
  }

  /* ── Feed: progressive disclosure ── */
  const feedFields = [
    {
      key: "projectName", value: projectName, set: setProjectName,
      label: t("¿Cómo se llama tu proyecto?", "What's your project called?"),
      ai: t("Dale un nombre y empiezo a tratarlo como un producto real.", "Give it a name and I'll start treating it as a real product."),
      placeholder: t("Ej: FlowPay", "E.g: FlowPay"), required: true,
    },
    {
      key: "objective", value: objective, set: setObjective,
      label: t("¿Cuál es el objetivo principal?", "What's the main goal?"),
      ai: t("Con esto detecto mejor las oportunidades y métricas que importan.", "With this I better detect the opportunities and metrics that matter."),
      placeholder: t("Ej: que la gente complete su primer pago sin ayuda", "E.g: people complete their first payment unaided"), required: true,
    },
    {
      key: "audience", value: audience, set: setAudience,
      label: t("¿Para quién es?", "Who is it for?"),
      ai: t("Para entender a tus competidores necesito saber a quién le hablas.", "To map your competitors I need to know who you're talking to."),
      placeholder: t("Ej: freelancers en LatAm", "E.g: freelancers in LatAm"), required: true,
    },
    {
      key: "references", value: references, set: setReferences,
      label: t("¿Algún referente? (opcional)", "Any references? (optional)"),
      ai: t("Productos que admiras me ayudan a calibrar el nivel.", "Products you admire help me calibrate the bar."),
      placeholder: t("Ej: stripe.com, linear.app", "E.g: stripe.com, linear.app"), required: false,
    },
  ]
  const feedProgress = Math.round(25 + (feedStep / feedFields.length) * 75)
  const currentField = feedFields[feedStep]

  const advanceFeed = () => {
    if (currentField.required && !currentField.value.trim()) {
      setError(t("Este dato me ayuda a afinar el análisis.", "This detail helps me sharpen the analysis."))
      return
    }
    setError("")
    if (feedStep < feedFields.length - 1) {
      setFeedStep((s) => s + 1)
    } else {
      persist({ projectName, objective, audience, references, startedAt: Date.now() })
      setPhase("engine")
    }
  }

  /* ── Engine: run the living timeline ── */
  useEffect(() => {
    if (phase !== "engine") return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    ;(async () => {
      try {
        const res = await fetch("/api/generate-brief", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: lab.idea, industry: lab.signals[0] || "", referenceUrls: references,
            existingBrand: projectName, projectType: "", objective, audience,
          }),
        })
        const data = await res.json()
        if (!cancelled) { setBrief(data.brief || ""); setPrototype(data.prototype || "") }
      } catch { /* mock fallback handled visually */ }
    })()

    setActiveStage(0)
    for (let s = 1; s <= 5; s += 1) {
      timers.push(setTimeout(() => { if (!cancelled) setActiveStage(s) }, s * 2300))
    }
    timers.push(setTimeout(() => {
      if (cancelled) return
      persist({ brief: briefRef.current, prototype: protoRef.current, completedAt: Date.now() })
      // notify lead in background (mock-safe; no-op if email not configured)
      fetch("/api/send-brief-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lab.email, idea: lab.idea, industry: lab.signals[0] || "", referenceUrls: references, existingBrand: projectName, brief: briefRef.current, prototype: protoRef.current }),
      }).catch(() => {})
    }, 5 * 2300 + 600))

    return () => { cancelled = true; timers.forEach(clearTimeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const resetLab = () => {
    try { localStorage.removeItem(LAB_KEY) } catch {}
    setLab({ idea: "", signals: [] })
    setIdea(""); setEmail(""); setConsent(false); setPinInput(""); setProjectName("")
    setReferences(""); setObjective(""); setAudience(""); setFeedStep(0); setActiveStage(0)
    setBrief(""); setPrototype(""); setError("")
    setPhase("spark")
  }

  /* ── Timeline definition ── */
  const stages = [
    { icon: Sparkles, label: t("Idea inicial", "Initial idea"), insight: t("Idea capturada y estructurada.", "Idea captured and structured.") },
    { icon: Radar, label: t("Mercado detectado", "Market detected"), insight: t(`Señales: ${lab.signals.join(", ")}.`, `Signals: ${lab.signals.join(", ")}.`) },
    { icon: Target, label: t("Competidores", "Competitors"), insight: t("Mapeando jugadores y huecos del espacio…", "Mapping players and gaps in the space…") },
    { icon: Layers, label: t("Oportunidades UX", "UX opportunities"), insight: t("Encontré ángulos de diferenciación por experiencia.", "I found differentiation angles through experience.") },
    { icon: Cpu, label: t("Blueprint generado", "Blueprint generated"), insight: t("Tu definición de producto está lista.", "Your product definition is ready.") },
    { icon: Rocket, label: t("Listos para hablar", "Ready to talk"), insight: t("Desbloqueado: agenda con un humano.", "Unlocked: book a session with a human.") },
  ]

  // ── Deep-dive: matures in real time across visits (Phase 2) ──
  const labStart = lab.startedAt || lab.completedAt || now
  const deepReadyAt = labStart + DEEP_DIVE_MS
  const deepReady = now >= deepReadyAt
  const deepRemaining = fmtCountdown(deepReadyAt - now)
  const deepFindings = [
    t(`Espacio competitivo en ${lab.signals[0] || "tu categoría"}: hueco claro en la experiencia de onboarding.`, `Competitive space in ${lab.signals[0] || "your category"}: a clear gap in the onboarding experience.`),
    t("Módulo de mayor impacto detectado: automatización del primer flujo de valor.", "Highest-impact module detected: automating the first value flow."),
    t("Riesgo principal a validar: disposición a pagar antes de construir features avanzadas.", "Main risk to validate: willingness to pay before building advanced features."),
  ]

  const accentBg = "rgba(232,117,26,0.08)"
  const accentBorder = "rgba(232,117,26,0.25)"
  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[rgba(232,117,26,0.25)] resize-none text-sm transition-all"

  return (
    <section
      id="uxbox"
      className="relative py-20 md:py-32 px-6 overflow-hidden bg-[var(--surface-dark)] text-white"
      aria-labelledby="uxbox-heading"
    >
      {/* ambient glows */}
      <div className="absolute -top-32 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute -bottom-32 left-0 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, #2AABB3 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "38px 38px" }} aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
            style={{ color: "#fff", borderColor: accentBorder, background: accentBg }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: ACCENT }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ACCENT }} />
            </span>
            {t("Motor de inteligencia de producto · en vivo", "Product intelligence engine · live")}
          </div>
          <h2 id="uxbox-heading" className="font-display font-bold text-4xl md:text-5xl text-white text-balance leading-tight">
            {phase === "return"
              ? t("Bienvenido de vuelta a tu laboratorio", "Welcome back to your lab")
              : t("Enciende tu idea. Mira cómo evoluciona.", "Ignite your idea. Watch it evolve.")}
          </h2>
          {phase === "spark" && (
            <p className="text-lg text-white/55 max-w-xl leading-relaxed">
              {t(
                "UXBox analiza tu idea con IA —mercado, competidores, oportunidades UX y módulos— y te entrega un blueprint accionable. Empieza a verlo en segundos.",
                "UXBox analyzes your idea with AI —market, competitors, UX opportunities, and modules— and delivers an actionable blueprint. Start seeing it in seconds."
              )}
            </p>
          )}
        </div>

        {/* ───────── SPARK ───────── */}
        {phase === "spark" && (
          <form onSubmit={handleSpark} className="flex flex-col gap-4 max-w-xl mx-auto animate-in fade-in duration-500">
            <div className="relative">
              <textarea
                value={idea}
                onChange={(e) => { setIdea(e.target.value); setError("") }}
                placeholder={t("Describe tu idea en una línea…", "Describe your idea in one line…")}
                rows={3}
                autoFocus
                className={`${inputClass} text-base pr-4`}
              />
            </div>
            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-95 hover:brightness-110"
              style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)", boxShadow: "0 8px 30px rgba(232,117,26,0.3)" }}>
              <Sparkles size={17} /> {t("Analizar mi idea", "Analyze my idea")}
            </button>
            <p className="text-xs text-white/40 text-center flex items-center justify-center gap-1.5">
              <Activity size={12} /> {t("173 ideas analizadas esta semana · resultado en minutos", "173 ideas analyzed this week · result in minutes")}
            </p>
          </form>
        )}

        {/* ───────── REACTING (instant reward) ───────── */}
        {phase === "reacting" && (
          <div className="max-w-xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: accentBorder, background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
                <Cpu size={13} /> {t("Reacción de la IA", "AI reaction")}
              </div>
              <p className="text-base text-white/85 leading-relaxed min-h-[3rem]">
                {reaction}<span className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: ACCENT }} />
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {lab.signals.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-white/80">{s}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setPhase("gate")} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-95 hover:brightness-110"
              style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
              <ShieldCheck size={17} /> {t("Asegurar mi laboratorio", "Secure my lab")}
            </button>
            <button onClick={resetLab} className="text-xs text-white/40 hover:text-white/70 transition-colors mx-auto">
              {t("Empezar con otra idea", "Start with another idea")}
            </button>
          </div>
        )}

        {/* ───────── GATE (email) ───────── */}
        {phase === "gate" && (
          <form onSubmit={handleGate} className="max-w-md mx-auto flex flex-col gap-5 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 text-center">
              <h3 className="font-display font-bold text-xl text-white">{t("Asegura tu laboratorio", "Secure your lab")}</h3>
              <p className="text-sm text-white/55">{t("Para no perder este análisis y poder volver cuando quieras.", "So you don't lose this analysis and can return anytime.")}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
              <Mail size={16} className="text-white/40 shrink-0" />
              <input type="email" value={email} disabled={loading}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                placeholder={t("nombre@empresa.com", "name@company.com")}
                className="w-full py-3.5 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-sm" required />
            </div>
            <label className="flex items-start gap-2.5 text-xs text-white/55 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setError("") }} className="mt-0.5 accent-[#E8751A] w-4 h-4 shrink-0" />
              <span>{t("Acepto que MediaLab use mis datos para generar mi análisis, según la ", "I agree to let MediaLab use my data to generate my analysis, per the ")}
                <Link href="/politica-de-privacidad" className="underline hover:text-white">{t("política de privacidad", "privacy policy")}</Link>.</span>
            </label>
            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
              {loading ? t("Enviando llave…", "Sending key…") : t("Entrar a mi laboratorio", "Enter my lab")} <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* ───────── OTP ───────── */}
        {phase === "otp" && (
          <form onSubmit={handleOtp} className="max-w-md mx-auto flex flex-col gap-5 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 text-center">
              <h3 className="font-display font-bold text-xl text-white">{t("Revisa tu correo", "Check your email")}</h3>
              <p className="text-sm text-white/55">{t("Te envié una llave de 4 dígitos a ", "I sent a 4-digit key to ")}<strong className="text-white">{email}</strong></p>
            </div>
            {isDemo && demoPin && (
              <div className="rounded-lg border border-dashed px-4 py-3 text-xs text-center" style={{ borderColor: accentBorder, background: accentBg }}>
                {t("Modo demo — tu llave es ", "Demo mode — your key is ")}<strong className="text-base tracking-widest" style={{ color: ACCENT }}>{demoPin}</strong>
              </div>
            )}
            <input type="text" inputMode="numeric" maxLength={4} value={pinInput}
              onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "")); setError("") }}
              placeholder={t("Ej: 4812", "E.g: 4812")} autoFocus
              className={`${inputClass} text-center tracking-[0.5em] font-bold text-2xl`} required />
            {error && <p className="text-xs text-red-400 font-medium text-center">{error}</p>}
            <div className="flex items-center justify-center gap-4 text-xs">
              <button type="button" onClick={handleResend} disabled={resending} className="flex items-center gap-1.5 text-white/50 hover:text-white disabled:opacity-50">
                <RotateCcw size={12} className={resending ? "animate-spin" : ""} /> {resending ? t("Reenviando…", "Resending…") : t("Reenviar llave", "Resend key")}
              </button>
              <span className="w-px h-3 bg-white/20" />
              <button type="button" onClick={() => { setPhase("gate"); setPinInput(""); setError("") }} className="text-white/50 hover:text-white">{t("Cambiar correo", "Change email")}</button>
            </div>
            <button type="submit" disabled={pinInput.length < 4 || loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
              {loading ? t("Verificando…", "Verifying…") : t("Entrar", "Enter")} <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* ───────── FEED (progressive disclosure) ───────── */}
        {phase === "feed" && (
          <div className="max-w-md mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
            {/* progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>{t("Definiendo tu producto", "Defining your product")}</span>
                <span className="font-semibold" style={{ color: ACCENT }}>{feedProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${feedProgress}%`, background: "linear-gradient(90deg, #E8751A, #2AABB3)" }} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-2 text-xs text-white/55">
                <Cpu size={14} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <span>{currentField.ai}</span>
              </div>
              <label className="font-display font-bold text-lg text-white">{currentField.label}</label>
              <input
                type="text" value={currentField.value} autoFocus
                onChange={(e) => { currentField.set(e.target.value); setError("") }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); advanceFeed() } }}
                placeholder={currentField.placeholder}
                className={inputClass}
              />
              {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
            </div>

            <div className="flex gap-3">
              {feedStep > 0 && (
                <button onClick={() => { setFeedStep((s) => s - 1); setError("") }} className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-white/15 text-white/70 hover:text-white transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={15} /> {t("Atrás", "Back")}
                </button>
              )}
              <button onClick={advanceFeed} className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
                style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
                {feedStep < feedFields.length - 1
                  ? (<>{t("Continuar", "Continue")} <ArrowRight size={15} /></>)
                  : (<><Cpu size={15} /> {t("Encender el motor", "Ignite the engine")}</>)}
              </button>
            </div>
          </div>
        )}

        {/* ───────── ENGINE + RETURN (timeline) ───────── */}
        {(phase === "engine" || phase === "return") && (
          <div className="max-w-2xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
            {phase === "return" && (
              <div className="rounded-2xl border p-5 flex items-start gap-3" style={{ borderColor: accentBorder, background: accentBg }}>
                <Activity size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <div>
                  <p className="text-sm text-white/85 font-medium">{t("Tu idea avanzó mientras no estabas.", "Your idea advanced while you were away.")}</p>
                  <p className="text-sm text-white/55 mt-1">{returnInsight}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="flex flex-col">
              {stages.map((st, i) => {
                const done = i < activeStage || (phase === "return")
                const active = i === activeStage && phase === "engine"
                const locked = i > activeStage && phase === "engine"
                const Icon = st.icon
                return (
                  <div key={st.label} className={`relative flex gap-4 pb-7 ${locked ? "opacity-35 blur-[1px]" : "opacity-100"} transition-all duration-500`}>
                    {/* connector */}
                    {i < stages.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-px" style={{ background: done ? ACCENT : "rgba(255,255,255,0.12)" }} aria-hidden="true" />
                    )}
                    {/* node */}
                    <div className="relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        background: done ? "linear-gradient(135deg, var(--magenta), var(--orange))" : active ? accentBg : "rgba(255,255,255,0.04)",
                        borderColor: done || active ? accentBorder : "rgba(255,255,255,0.1)",
                      }}>
                      {done ? <CheckCircle2 size={18} className="text-white" />
                        : active ? <Loader2 size={16} className="animate-spin" style={{ color: ACCENT }} />
                        : i === stages.length - 1 ? <Lock size={15} className="text-white/40" />
                        : <Circle size={14} className="text-white/30" />}
                      {active && <span className="absolute inset-0 rounded-xl animate-ping" style={{ background: ACCENT, opacity: 0.18 }} />}
                    </div>
                    {/* content */}
                    <div className="flex flex-col gap-1 pt-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon size={13} className="text-white/40" />
                        <h3 className="font-display font-bold text-sm text-white">{st.label}</h3>
                      </div>
                      {(done || active) && (
                        active && i === 4 && !brief
                          ? <div className="mt-1 h-3 w-2/3 rounded bg-white/10 animate-pulse" />
                          : <p className="text-xs text-white/55 leading-relaxed">{st.insight}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Blueprint preview */}
            {(activeStage >= 4 || phase === "return") && brief && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-3 animate-in fade-in duration-500">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest w-fit" style={{ color: ACCENT }}>
                  <Cpu size={12} /> {t("Tu blueprint", "Your blueprint")}
                </div>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-3">
                  {brief.split("\n\n").filter(Boolean).slice(0, 2).map((p, i) => (
                    <p key={i} className="text-sm text-white/75 leading-relaxed">{p}</p>
                  ))}
                </div>
                <p className="text-xs text-white/40 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> {t("Propuesta preliminar generada con IA y revisada por nuestro equipo.", "Preliminary AI-generated proposal, reviewed by our team.")}
                </p>
              </div>
            )}

            {/* Deep-dive — matures in real time across visits (Phase 2) */}
            {(activeStage >= 5 || phase === "return") && (
              deepReady ? (
                <div className="rounded-2xl border p-6 flex flex-col gap-3 animate-in fade-in duration-500" style={{ borderColor: accentBorder, background: accentBg }}>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest w-fit" style={{ color: ACCENT }}>
                    <FileSearch size={12} /> {t("Análisis profundo listo", "Deep analysis ready")}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {deepFindings.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/75 leading-relaxed">
                        <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: ACCENT }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Loader2 size={15} className="animate-spin shrink-0" style={{ color: ACCENT }} />
                      {t("Análisis competitivo profundo en progreso…", "Deep competitive analysis in progress…")}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums shrink-0" style={{ color: ACCENT }}>
                      <Clock size={13} /> {deepRemaining}
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round(((DEEP_DIVE_MS - Math.max(0, deepReadyAt - now)) / DEEP_DIVE_MS) * 100))}%`, background: "linear-gradient(90deg, #E8751A, #2AABB3)" }} />
                  </div>
                  <p className="text-xs text-white/45">
                    {t("Puedes cerrar esta página: el motor sigue trabajando. Vuelve con tu correo y verás el avance.", "You can close this page: the engine keeps working. Return with your email to see the progress.")}
                  </p>
                </div>
              )
            )}

            {/* Unlock CTA */}
            {(activeStage >= 5 || phase === "return") ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-sm text-white/60">{t("Tu análisis está listo. El siguiente paso es humano.", "Your analysis is ready. The next step is human.")}</p>
                <BookingModal>
                  <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                    style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
                    <Rocket size={16} /> {t("Estamos listos para hablar contigo", "We're ready to talk to you")}
                  </button>
                </BookingModal>
                <button onClick={resetLab} className="text-xs text-white/40 hover:text-white/70 transition-colors">{t("Analizar otra idea", "Analyze another idea")}</button>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 flex items-center gap-3 text-sm text-white/60">
                <Loader2 size={15} className="animate-spin shrink-0" style={{ color: ACCENT }} />
                {t("Cruzando tu idea con +2.000 patrones de producto…", "Cross-referencing your idea with 2,000+ product patterns…")}
              </div>
            )}
          </div>
        )}

        {/* Human escape hatch (not during engine run) */}
        {hydrated && phase !== "engine" && (
          <div className="mt-10 pt-8 border-t border-white/10 text-center flex flex-col items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40">{t("¿Prefieres hablar con un humano?", "Prefer to talk to a human?")}</span>
            <div className="flex items-center justify-center gap-5 text-sm">
              <a href="https://wa.me/573054009505" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/75 hover:text-white transition-colors">
                <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
              </a>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <BookingModal>
                <button type="button" className="text-white/75 hover:text-white font-medium">{t("Agendar llamada", "Book a call")}</button>
              </BookingModal>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
