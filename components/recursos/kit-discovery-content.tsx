"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sparkles, ChevronRight, CheckCircle2, Gauge, Layers, Wand2, FileText,
  ArrowRight, Brain, Target, Rocket, Loader2,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function KitDiscoveryContent() {
  const { t, localized } = useLanguage()

  const [email, setEmail] = useState("")
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const goals = [
    { id: "validar", label: t("Validar una idea", "Validate an idea") },
    { id: "mejorar", label: t("Mejorar un producto", "Improve a product") },
    { id: "aprender", label: t("Aprender la metodología", "Learn the methodology") },
  ]

  const includes = [
    { icon: Gauge, title: t("Scorecard de claridad", "Clarity scorecard"), desc: t("Un chequeo rápido para medir qué tan clara está hoy tu idea.", "A quick check to measure how clear your idea is today.") },
    { icon: Layers, title: t("Framework HEM", "HEM framework"), desc: t("Un canvas simple para pensar en Humano, Emocional y Medible.", "A simple canvas to think Human, Emotional, and Measurable.") },
    { icon: Wand2, title: t("Prompt pack", "Prompt pack"), desc: t("5 prompts listos para convertir intuición en un primer brief útil.", "5 ready prompts to turn intuition into a first useful brief.") },
    { icon: FileText, title: t("Plantilla de brief", "Brief template"), desc: t("Un formato de una página para pasar de idea a priorización.", "A one-page format to go from idea to prioritization.") },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("Escribe un correo válido para enviarte el kit.", "Enter a valid email to send you the kit."))
      return
    }
    if (!goal) {
      setError(t("Elige qué quieres lograr hoy.", "Choose what you want to achieve today."))
      return
    }
    setLoading(true); setError("")
    try {
      await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, goal, source: "Kit Discovery UX + IA" }),
      })
      setDone(true)
    } catch {
      setError(t("Hubo un problema. Intenta de nuevo.", "Something went wrong. Try again."))
    } finally { setLoading(false) }
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[rgba(232,117,26,0.25)] text-sm transition-all"

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero + capture */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="kit-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: copy */}
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
              <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
              <ChevronRight size={12} />
              <span className="text-white/40">{t("Recursos", "Resources")}</span>
              <ChevronRight size={12} />
              <span className="text-white/80">{t("Kit de Discovery", "Discovery Kit")}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
              style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
              <Sparkles size={14} /> {t("Recurso gratuito", "Free resource")}
            </div>

            <h1 id="kit-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.08] text-balance">
              {t("Kit de Discovery UX + IA en 24 horas", "UX + AI Discovery Kit in 24 hours")}
            </h1>

            <p className="text-lg text-white/70 max-w-xl leading-relaxed">
              {t(
                "Convierte una idea vaga en un brief accionable con un scorecard, el framework HEM, prompts listos y una plantilla. Diseñado para avanzar rápido sin perder criterio humano.",
                "Turn a vague idea into an actionable brief with a scorecard, the HEM framework, ready-to-use prompts, and a template. Built to move fast without losing human judgment."
              )}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><Brain size={13} style={{ color: "#E8751A" }} /> {t("Menos de 1 hora de lectura", "Under 1 hour to read")}</span>
              <span className="flex items-center gap-1.5"><Target size={13} style={{ color: "#E8751A" }} /> {t("Para founders, PMs y diseñadores", "For founders, PMs, and designers")}</span>
            </div>
          </div>

          {/* Right: capture card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 lg:mt-4">
            {!done ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h2 className="font-display font-bold text-xl text-white">{t("Recíbelo en tu correo", "Get it in your email")}</h2>
                  <p className="text-sm text-white/55">{t("Te toma menos de un minuto. Sin spam.", "Takes less than a minute. No spam.")}</p>
                </div>
                <input type="email" value={email} disabled={loading}
                  onChange={(e) => { setEmail(e.target.value); setError("") }}
                  placeholder={t("nombre@empresa.com", "name@company.com")} className={inputClass} required />
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">{t("¿Qué quieres lograr hoy?", "What do you want to achieve today?")}</span>
                  <div className="grid grid-cols-1 gap-2">
                    {goals.map((g) => (
                      <button key={g.id} type="button" onClick={() => { setGoal(g.id); setError("") }}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium border text-left transition-all"
                        style={{
                          background: goal === g.id ? "rgba(232,117,26,0.12)" : "rgba(255,255,255,0.03)",
                          color: goal === g.id ? "#fff" : "rgba(255,255,255,0.7)",
                          borderColor: goal === g.id ? "rgba(232,117,26,0.5)" : "rgba(255,255,255,0.1)",
                        }}>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
                  {loading ? (<><Loader2 size={15} className="animate-spin" /> {t("Enviando…", "Sending…")}</>) : (<>{t("Enviarme el kit", "Send me the kit")} <ArrowRight size={15} /></>)}
                </button>
                <p className="text-[11px] text-white/40 text-center">{t("Al enviarlo aceptas recibir este recurso y comunicaciones relacionadas. Puedes salirte cuando quieras.", "By submitting you agree to receive this resource and related communications. You can opt out anytime.")}</p>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(232,117,26,0.12)", color: "#E8751A" }}>
                  <CheckCircle2 size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-display font-bold text-xl text-white">{t("¡Listo! Tu kit va en camino", "Done! Your kit is on its way")}</h2>
                  <p className="text-sm text-white/55">{t("Revisa tu correo en unos minutos. Mientras tanto, elige tu siguiente paso:", "Check your email in a few minutes. Meanwhile, choose your next step:")}</p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Link href={localized("/servicios/discovery-con-ia")} className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                    style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
                    {t("Aplicarlo a mi producto", "Apply it to my product")} <ArrowRight size={15} />
                  </Link>
                  <Link href={localized("/curso")} className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-medium border border-white/15 text-white/80 hover:text-white transition-all">
                    {t("Aprender la metodología completa", "Learn the full methodology")} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-20 px-6 bg-background" aria-labelledby="incluye">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="incluye" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué incluye el kit?", "What's inside the kit?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {includes.map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>
                  <f.icon size={18} className="text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-bold text-base text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién + diferenciación */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="para-quien">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="para-quien" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué este recurso no se parece a la mayoría?", "Why isn't this resource like most?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Porque no parte de features, sino de fricción humana. No te pide enamorarte de la IA, sino usarla con criterio. Y no te deja en teoría: te deja con una salida concreta — un brief de una página que sí puedes discutir con tu equipo, validar con usuarios o llevar a diseño.",
              "Because it doesn't start from features — it starts from human friction. It doesn't ask you to fall in love with AI, but to use it with judgment. And it doesn't leave you in theory: it leaves you with a concrete output — a one-page brief you can actually discuss with your team, validate with users, or take to design."
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("¿Prefieres que lo apliquemos contigo? Mira el ", "Prefer us to apply it with you? See ")}
            <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium hover:underline">{t("discovery de producto con IA", "AI product discovery")}</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
