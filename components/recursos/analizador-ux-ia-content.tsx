"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts"
import {
  Sparkles, ChevronRight, ChevronLeft, ArrowRight, CheckCircle2, Lock,
  Loader2, Gauge, Target, Cpu, Zap, TrendingUp, AlertTriangle, Lightbulb,
  Rocket, Download, BarChart3,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

type Phase = "intro" | "quiz" | "analyzing" | "result"
type DimId = "claridad" | "friccion" | "ia" | "diferenciacion" | "conversion"

const ACCENT = "#E8751A"

export function AnalizadorUxIaContent() {
  const { t, localized } = useLanguage()

  const [phase, setPhase] = useState<Phase>("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<DimId, number>>({} as Record<DimId, number>)
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState("")
  const [goal, setGoal] = useState("")
  const [sending, setSending] = useState(false)
  const [gateError, setGateError] = useState("")

  const questions: { id: DimId; dim: string; q: string; options: { label: string; score: number }[] }[] = [
    {
      id: "claridad", dim: t("Claridad de producto", "Product clarity"),
      q: t("¿Qué tan claro tienes el problema que resuelve tu producto?", "How clear is the problem your product solves?"),
      options: [
        { label: t("Aún lo estoy definiendo", "Still defining it"), score: 25 },
        { label: t("Tengo una hipótesis", "I have a hypothesis"), score: 55 },
        { label: t("Lo tengo claro y validado", "Clear and validated"), score: 90 },
      ],
    },
    {
      id: "friccion", dim: t("Experiencia (UX)", "Experience (UX)"),
      q: t("¿Cómo describes la experiencia actual de tu producto?", "How would you describe your product's current experience?"),
      options: [
        { label: t("Confusa, con abandonos", "Confusing, with drop-offs"), score: 25 },
        { label: t("Funciona, pero mejorable", "Works, but improvable"), score: 55 },
        { label: t("Fluida y medida", "Smooth and measured"), score: 90 },
      ],
    },
    {
      id: "ia", dim: t("IA readiness", "AI readiness"),
      q: t("¿Cómo usas IA hoy en tu producto o proceso?", "How do you use AI in your product or process today?"),
      options: [
        { label: t("Todavía no la uso", "Not using it yet"), score: 25 },
        { label: t("Experimentos sueltos", "Scattered experiments"), score: 55 },
        { label: t("Integrada con criterio", "Integrated with judgment"), score: 90 },
      ],
    },
    {
      id: "diferenciacion", dim: t("Diferenciación", "Differentiation"),
      q: t("¿Qué tan claro es tu diferenciador frente a competidores?", "How clear is your differentiator vs competitors?"),
      options: [
        { label: t("No lo tengo claro", "Not clear"), score: 25 },
        { label: t("Algo, pero no lo comunico", "Somewhat, but uncommunicated"), score: 55 },
        { label: t("Claro y bien comunicado", "Clear and well communicated"), score: 90 },
      ],
    },
    {
      id: "conversion", dim: t("Conversión", "Conversion"),
      q: t("¿Sabes dónde pierdes usuarios o conversión?", "Do you know where you lose users or conversion?"),
      options: [
        { label: t("No lo mido", "I don't measure it"), score: 25 },
        { label: t("Tengo una idea", "I have an idea"), score: 55 },
        { label: t("Lo mido y optimizo", "I measure and optimize it"), score: 90 },
      ],
    },
  ]

  const total = questions.length
  const answeredCount = Object.keys(answers).length
  const progress = phase === "result" ? 100 : Math.round((answeredCount / total) * 100)

  const overall = useMemo(() => {
    const vals = Object.values(answers)
    if (!vals.length) return 0
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [answers])

  const radarData = questions.map((q) => ({ dim: q.dim, value: answers[q.id] ?? 0 }))

  const maturity = useMemo(() => {
    if (overall >= 80) return { label: t("Listo para escalar", "Ready to scale"), color: "#22c55e" }
    if (overall >= 65) return { label: t("En forma", "In shape"), color: "#2AABB3" }
    if (overall >= 45) return { label: t("En construcción", "Under construction"), color: ACCENT }
    return { label: t("Zona de intuición", "Intuition zone"), color: "#ef4444" }
  }, [overall, t])

  const dimAdvice: Record<DimId, { blocker: string; rec: string; strength: string }> = {
    claridad: {
      blocker: t("El problema y el público aún no están definidos con evidencia.", "The problem and audience aren't defined with evidence yet."),
      rec: t("Corre un discovery con IA para convertir la idea en un brief accionable.", "Run an AI discovery to turn the idea into an actionable brief."),
      strength: t("Tienes una base clara de producto sobre la cual diseñar.", "You have a clear product base to design on."),
    },
    friccion: {
      blocker: t("Hay fricción que está costando usuarios en momentos clave.", "There's friction costing users at key moments."),
      rec: t("Audita los flujos críticos y rediseña los puntos de abandono.", "Audit critical flows and redesign the drop-off points."),
      strength: t("Tu experiencia fluye y la estás midiendo.", "Your experience flows and you're measuring it."),
    },
    ia: {
      blocker: t("La IA aún no acelera tu producto ni tu proceso.", "AI isn't accelerating your product or process yet."),
      rec: t("Integra IA con criterio en discovery y flujos de alto valor.", "Integrate AI with judgment in discovery and high-value flows."),
      strength: t("Usas IA como copiloto, no como moda.", "You use AI as a copilot, not a trend."),
    },
    diferenciacion: {
      blocker: t("Tu diferenciador no está claro ni comunicado.", "Your differentiator isn't clear or communicated."),
      rec: t("Define y comunica tu ángulo único en cada punto de contacto.", "Define and communicate your unique angle at every touchpoint."),
      strength: t("Tu diferenciación está clara y comunicada.", "Your differentiation is clear and communicated."),
    },
    conversion: {
      blocker: t("No tienes visibilidad de dónde se fuga la conversión.", "You lack visibility into where conversion leaks."),
      rec: t("Mide el embudo y optimiza por impacto, no por intuición.", "Measure the funnel and optimize by impact, not intuition."),
      strength: t("Mides y optimizas tu conversión.", "You measure and optimize your conversion."),
    },
  }

  const blockers = questions.filter((q) => (answers[q.id] ?? 0) <= 35).map((q) => ({ dim: q.dim, text: dimAdvice[q.id].blocker }))
  const strengths = questions.filter((q) => (answers[q.id] ?? 0) >= 80).map((q) => ({ dim: q.dim, text: dimAdvice[q.id].strength }))
  const quickWins = [...questions]
    .sort((a, b) => (answers[a.id] ?? 0) - (answers[b.id] ?? 0))
    .slice(0, 3)
    .map((q) => ({ dim: q.dim, text: dimAdvice[q.id].rec }))

  const choose = (score: number) => {
    const q = questions[step]
    const next = { ...answers, [q.id]: score }
    setAnswers(next)
    if (step < total - 1) {
      setStep(step + 1)
    } else {
      setPhase("analyzing")
      setTimeout(() => setPhase("result"), 2400)
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setGateError(t("Escribe un correo válido para ver el resultado completo.", "Enter a valid email to see the full result."))
      return
    }
    setSending(true); setGateError("")
    const details = questions.map((q) => `${q.dim}: ${answers[q.id] ?? 0}`).join(" · ")
    try {
      await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, goal, score: overall, details, source: "UX + AI Discovery Analyzer" }),
      })
      setUnlocked(true)
    } catch {
      setUnlocked(true) // no bloquear el valor por un fallo de red
    } finally { setSending(false) }
  }

  const goals = [
    { id: "validar", label: t("Validar una idea", "Validate an idea") },
    { id: "mejorar", label: t("Mejorar mi producto", "Improve my product") },
    { id: "aprender", label: t("Aprender la metodología", "Learn the methodology") },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* ───── Interactive analyzer ───── */}
      <section className="relative pt-28 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden min-h-[80vh] flex items-center" aria-labelledby="analyzer-h1">
        <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="absolute -bottom-32 left-0 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ background: "radial-gradient(circle, #2AABB3 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "38px 38px" }} aria-hidden="true" />

        <div className="relative z-10 max-w-3xl mx-auto w-full">
          {/* progress (visible once started) */}
          {phase !== "intro" && (
            <div className="mb-8 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>{phase === "result" ? t("Diagnóstico completo", "Diagnosis complete") : t("Diagnóstico en progreso", "Diagnosis in progress")}</span>
                <span className="font-semibold" style={{ color: ACCENT }}>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
                  style={{ background: "linear-gradient(90deg, #E8751A, #2AABB3)" }} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* INTRO */}
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="flex flex-col items-center text-center gap-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                  style={{ color: "#fff", borderColor: "rgba(232,117,26,0.25)", background: "rgba(232,117,26,0.08)" }}>
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: ACCENT }} /><span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ACCENT }} /></span>
                  {t("Diagnóstico gratuito · 5 preguntas", "Free diagnosis · 5 questions")}
                </div>
                <h1 id="analyzer-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
                  {t("UX + AI Discovery Analyzer", "UX + AI Discovery Analyzer")}
                </h1>
                <p className="text-lg text-white/65 max-w-xl leading-relaxed">
                  {t(
                    "Responde 5 preguntas y descubre qué tan listo está tu producto digital en claridad, UX, IA, diferenciación y conversión. Resultado al instante.",
                    "Answer 5 questions and discover how ready your digital product is in clarity, UX, AI, differentiation, and conversion. Instant result."
                  )}
                </p>
                <button onClick={() => setPhase("quiz")} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 hover:brightness-110"
                  style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)", boxShadow: "0 8px 30px rgba(232,117,26,0.3)" }}>
                  <Sparkles size={17} /> {t("Comenzar diagnóstico", "Start diagnosis")}
                </button>
                <p className="text-xs text-white/40">{t("Toma 60 segundos · Sin pedir tu correo para empezar", "Takes 60 seconds · No email needed to start")}</p>
              </motion.div>
            )}

            {/* QUIZ */}
            {phase === "quiz" && (
              <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                className="flex flex-col gap-6">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
                  {questions[step].dim} · {step + 1}/{total}
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white text-balance leading-tight">{questions[step].q}</h2>
                <div className="flex flex-col gap-3">
                  {questions[step].options.map((o) => (
                    <button key={o.label} onClick={() => choose(o.score)}
                      className="group flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-left text-white/85 hover:border-[var(--orange)] hover:bg-white/[0.08] transition-all">
                      <span className="text-sm font-medium">{o.label}</span>
                      <ChevronRight size={16} className="text-white/30 group-hover:text-[var(--orange)] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 w-fit">
                    <ChevronLeft size={13} /> {t("Anterior", "Previous")}
                  </button>
                )}
              </motion.div>
            )}

            {/* ANALYZING */}
            {phase === "analyzing" && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center gap-5 py-16">
                <Loader2 size={36} className="animate-spin" style={{ color: ACCENT }} />
                <h2 className="font-display font-bold text-2xl text-white">{t("Analizando patrones…", "Analyzing patterns…")}</h2>
                <p className="text-sm text-white/55 max-w-sm">{t("Cruzando tus respuestas con patrones de producto, UX e IA.", "Cross-referencing your answers with product, UX, and AI patterns.")}</p>
              </motion.div>
            )}

            {/* RESULT */}
            {phase === "result" && (
              <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                {/* Score + radar */}
                <div className="grid md:grid-cols-2 gap-6 items-center rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{t("Tu score de madurez", "Your maturity score")}</span>
                    <div className="flex items-end gap-2">
                      <span className="font-display font-bold text-6xl" style={{ color: ACCENT }}>{overall}</span>
                      <span className="text-white/40 text-xl mb-2">/100</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${maturity.color}22`, color: maturity.color }}>{maturity.label}</span>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius="72%">
                        <PolarGrid stroke="rgba(255,255,255,0.12)" />
                        <PolarAngleAxis dataKey="dim" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10 }} />
                        <Radar dataKey="value" stroke={ACCENT} fill={ACCENT} fillOpacity={0.35} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Teaser (always visible) */}
                <div className="rounded-2xl border p-5 flex items-start gap-3" style={{ borderColor: "rgba(232,117,26,0.25)", background: "rgba(232,117,26,0.08)" }}>
                  <Lightbulb size={18} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                  <p className="text-sm text-white/80">
                    {blockers.length
                      ? t(`Tu mayor oportunidad ahora mismo: ${blockers[0].dim.toLowerCase()}.`, `Your biggest opportunity right now: ${blockers[0].dim.toLowerCase()}.`)
                      : t("Tu producto tiene una base sólida. Hay margen fino de optimización.", "Your product has a solid base. There's fine-tuning room.")}
                    {!unlocked && t(" Desbloquea el análisis completo abajo.", " Unlock the full analysis below.")}
                  </p>
                </div>

                {/* Locked / Unlocked full result */}
                {!unlocked ? (
                  <div className="relative">
                    {/* blurred preview */}
                    <div className="grid sm:grid-cols-2 gap-4 blur-[6px] select-none pointer-events-none" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-2xl border border-white/10 bg-white/5" />
                      ))}
                    </div>
                    {/* gate overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <form onSubmit={handleUnlock} className="w-full max-w-md rounded-3xl border border-white/15 bg-[var(--surface-dark)]/90 backdrop-blur-xl p-7 flex flex-col gap-4 shadow-2xl">
                        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: ACCENT }}>
                          <Lock size={15} /> {t("Desbloquea tu resultado completo", "Unlock your full result")}
                        </div>
                        <p className="text-sm text-white/60">{t("Insights, bloqueadores, quick wins y un roadmap personalizado. Te enviamos también una copia a tu correo.", "Insights, blockers, quick wins, and a personalized roadmap. We also email you a copy.")}</p>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setGateError("") }}
                          placeholder={t("nombre@empresa.com", "name@company.com")}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--orange)] text-sm" required />
                        <div className="flex flex-wrap gap-2">
                          {goals.map((g) => (
                            <button key={g.id} type="button" onClick={() => setGoal(g.id)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                              style={{ background: goal === g.id ? "rgba(232,117,26,0.15)" : "transparent", color: goal === g.id ? "#fff" : "rgba(255,255,255,0.6)", borderColor: goal === g.id ? "rgba(232,117,26,0.5)" : "rgba(255,255,255,0.12)" }}>
                              {g.label}
                            </button>
                          ))}
                        </div>
                        {gateError && <p className="text-xs text-red-400 font-medium">{gateError}</p>}
                        <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
                          style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
                          {sending ? <Loader2 size={15} className="animate-spin" /> : <>{t("Ver mi resultado completo", "See my full result")} <ArrowRight size={15} /></>}
                        </button>
                        <p className="text-[11px] text-white/40 text-center">{t("Sin spam. Solo tu resultado y seguimiento útil.", "No spam. Just your result and useful follow-up.")}</p>
                      </form>
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                    {/* Blockers + strengths */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white"><AlertTriangle size={15} className="text-red-400" /> {t("Bloqueadores", "Blockers")}</div>
                        {blockers.length ? blockers.map((b) => (
                          <p key={b.dim} className="text-xs text-white/65 leading-relaxed"><b className="text-white/85">{b.dim}:</b> {b.text}</p>
                        )) : <p className="text-xs text-white/50">{t("Sin bloqueadores críticos. Buen punto de partida.", "No critical blockers. Good starting point.")}</p>}
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white"><TrendingUp size={15} style={{ color: "#22c55e" }} /> {t("Fortalezas", "Strengths")}</div>
                        {strengths.length ? strengths.map((s) => (
                          <p key={s.dim} className="text-xs text-white/65 leading-relaxed"><b className="text-white/85">{s.dim}:</b> {s.text}</p>
                        )) : <p className="text-xs text-white/50">{t("Aún sin fortalezas marcadas — todo es oportunidad de mejora.", "No standout strengths yet — all is room to grow.")}</p>}
                      </div>
                    </div>

                    {/* Quick wins / roadmap */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white"><Zap size={15} style={{ color: ACCENT }} /> {t("Quick wins recomendados", "Recommended quick wins")}</div>
                      <ol className="flex flex-col gap-2.5">
                        {quickWins.map((w, i) => (
                          <li key={w.dim} className="flex items-start gap-3 text-sm text-white/75">
                            <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: ACCENT }}>{i + 1}</span>
                            <span><b className="text-white/90">{w.dim}:</b> {w.text}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* CTAs */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Link href={localized("/servicios/discovery-con-ia")} className="flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
                        style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
                        <span className="flex items-center gap-2"><Rocket size={16} /> {t("Aplicarlo a mi producto", "Apply it to my product")}</span> <ArrowRight size={15} />
                      </Link>
                      <Link href={localized("/curso")} className="flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-medium border border-white/15 text-white/85 hover:text-white transition-all">
                        <span className="flex items-center gap-2"><Cpu size={16} /> {t("Aprender la metodología", "Learn the methodology")}</span> <ArrowRight size={15} />
                      </Link>
                    </div>

                    <button onClick={() => { if (typeof window !== "undefined") window.print() }}
                      className="flex items-center justify-center gap-2 text-xs text-white/45 hover:text-white/75 transition-colors mx-auto">
                      <Download size={13} /> {t("Guardar mi resultado en PDF", "Save my result as PDF")}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ───── SEO / AEO indexable content ───── */}
      <section className="py-20 px-6 bg-background" aria-labelledby="que-es">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="que-es" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué es el UX + AI Discovery Analyzer?", "What is the UX + AI Discovery Analyzer?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Es un diagnóstico interactivo gratuito que evalúa la madurez de tu producto digital en cinco dimensiones —claridad de producto, experiencia (UX), preparación para IA, diferenciación y conversión— y te entrega un score, tus bloqueadores y un roadmap de quick wins. Está diseñado por MediaLab combinando UX, IA y psicología del consumidor.",
              "It's a free interactive diagnosis that evaluates your digital product's maturity across five dimensions —product clarity, experience (UX), AI readiness, differentiation, and conversion— and gives you a score, your blockers, and a quick-wins roadmap. Built by MediaLab combining UX, AI, and consumer psychology."
            )}
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-mide">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-mide" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué mide el diagnóstico?", "What does the diagnosis measure?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Target, t: t("Claridad de producto", "Product clarity"), d: t("Qué tan claro está el problema, el usuario y la propuesta de valor.", "How clear the problem, user, and value proposition are.") },
              { icon: Gauge, t: t("Experiencia (UX)", "Experience (UX)"), d: t("Cuánta fricción enfrenta el usuario y dónde abandona.", "How much friction the user faces and where they drop off.") },
              { icon: Cpu, t: t("IA readiness", "AI readiness"), d: t("Si la IA acelera tu producto y proceso, o aún no.", "Whether AI accelerates your product and process, or not yet.") },
              { icon: BarChart3, t: t("Diferenciación y conversión", "Differentiation & conversion"), d: t("Qué tan claro es tu diferenciador y si mides dónde conviertes.", "How clear your differentiator is and whether you measure conversion.") },
            ].map((f) => (
              <div key={f.t} className="flex gap-4 p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>
                  <f.icon size={18} className="text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-bold text-base text-foreground">{f.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background" aria-labelledby="faq">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <h2 id="faq" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("Preguntas frecuentes", "Frequently asked questions")}
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { q: t("¿Cuánto tarda el diagnóstico?", "How long does the diagnosis take?"), a: t("Menos de 60 segundos. Son 5 preguntas visuales y el resultado es inmediato.", "Under 60 seconds. It's 5 visual questions with an instant result.") },
              { q: t("¿Necesito dejar mi correo para empezar?", "Do I need to leave my email to start?"), a: t("No. Puedes hacer el diagnóstico y ver tu score sin dar tu correo. Solo lo pedimos para desbloquear el análisis completo (insights, bloqueadores y roadmap).", "No. You can take the diagnosis and see your score without giving your email. We only ask for it to unlock the full analysis (insights, blockers, and roadmap).") },
              { q: t("¿Es realmente gratis?", "Is it really free?"), a: t("Sí. Es un recurso gratuito de MediaLab para ayudarte a entender la madurez de tu producto digital.", "Yes. It's a free MediaLab resource to help you understand your digital product's maturity.") },
              { q: t("¿Qué hago con el resultado?", "What do I do with the result?"), a: t("Puedes aplicarlo tú con los quick wins, o agendar una sesión para que MediaLab lo aterrice contigo con discovery, diseño y desarrollo.", "You can apply it yourself with the quick wins, or book a session for MediaLab to land it with you through discovery, design, and development.") },
            ].map((f) => (
              <div key={f.q} className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-display font-bold text-lg text-foreground">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
