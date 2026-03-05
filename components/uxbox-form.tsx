"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, Sparkles, Mail, Lightbulb, Rocket } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type Step = 1 | 2 | 3

export function UXBoxForm() {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState("")
  const [idea, setIdea] = useState("")
  const [industry, setIndustry] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)

  const industries = [
    t("Fintech / Banca", "Fintech / Banking"),
    t("Salud", "Healthcare"),
    t("Educación", "Education"),
    t("Retail / E-commerce", "Retail / E-commerce"),
    t("Gobierno", "Government"),
    t("Otro", "Other"),
  ]

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setEmailError(t("Ingresa un email válido", "Enter a valid email"))
      return
    }
    setEmailError("")
    setStep(2)
  }

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setStep(3)
  }

  const steps = [
    { icon: Mail,      labelEs: "Tu email",   labelEn: "Your email" },
    { icon: Lightbulb, labelEs: "Tu idea",    labelEn: "Your idea"  },
    { icon: Rocket,    labelEs: "Listo",      labelEn: "Ready"      },
  ]

  return (
    <section
      id="uxbox"
      className="relative py-20 md:py-32 px-6 overflow-hidden"
      aria-labelledby="uxbox-heading"
      style={{ background: "linear-gradient(180deg, var(--background) 0%, rgba(232,117,26,0.04) 50%, var(--background) 100%)" }}
    >
      {/* Background accents */}
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute -bottom-32 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #2AABB3 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
            style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.06)" }}>
            <Sparkles size={14} />
            UXBox Discovery
          </div>
          <h2 id="uxbox-heading" className="font-display font-bold text-4xl md:text-5xl text-foreground text-balance leading-tight">
            {t("Valida tu idea en 30 días", "Validate your idea in 30 days")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            {t(
              "Un proceso estructurado para descubrir si tu idea tiene potencial real de mercado.",
              "A structured process to discover if your idea has real market potential."
            )}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10" aria-label="Progress">
          {steps.map((s, i) => {
            const num = (i + 1) as Step
            const Icon = s.icon
            const done = step > num
            const active = step === num
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300"
                    style={{
                      background: done ? "#E8751A" : active ? "#E8751A" : "var(--secondary)",
                      color: done || active ? "white" : "var(--muted-foreground)",
                      boxShadow: active ? "0 0 0 4px rgba(232,117,26,0.2)" : "none",
                    }}
                  >
                    {done ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                  </div>
                  <span className="text-[10px] font-medium text-center hidden sm:block"
                    style={{ color: active ? "var(--magenta)" : done ? "var(--muted-foreground)" : "var(--muted-foreground)" }}>
                    {t(s.labelEs, s.labelEn)}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-16 md:w-24 h-px mx-2 mb-5 transition-all duration-500"
                    style={{ background: step > i + 1 ? "#E8751A" : "var(--border)" }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xl p-8 md:p-10 max-w-xl mx-auto">

          {/* Step 1 — Email */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  {t("¿Cuál es tu email de trabajo?", "What is your work email?")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Te enviaremos el acceso al proceso de discovery.", "We'll send you access to the discovery process.")}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
                  placeholder={t("nombre@empresa.com", "name@company.com")}
                  className="w-full px-4 py-3.5 rounded-xl border text-foreground bg-background placeholder:text-muted-foreground focus:outline-none transition-all text-sm"
                  style={{
                    borderColor: emailError ? "#ef4444" : "var(--border)",
                    boxShadow: emailError ? "0 0 0 3px rgba(239,68,68,0.15)" : "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#E8751A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,117,26,0.15)" }}
                  onBlur={(e) => { if (!emailError) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none" } }}
                  required
                />
                {emailError && <p className="text-xs text-red-500 font-medium">{emailError}</p>}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
                style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}
              >
                {t("Continuar", "Continue")}
                <ArrowRight size={16} />
              </button>
              <p className="text-xs text-muted-foreground text-center">
                {t("Sin tarjeta de crédito · Respuesta en 24h", "No credit card · Response in 24h")}
              </p>
            </form>
          )}

          {/* Step 2 — Project idea + industry */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  {t("Cuéntanos tu idea", "Tell us about your idea")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("En 1-2 oraciones, ¿qué problema resuelve tu producto?", "In 1-2 sentences, what problem does your product solve?")}
                </p>
              </div>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t("Ej: Una app que ayuda a pequeñas empresas a gestionar sus cobros sin complicaciones...", "E.g: An app that helps small businesses manage collections without complications...")}
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl border border-border text-foreground bg-background placeholder:text-muted-foreground focus:outline-none resize-none text-sm transition-all"
                onFocus={(e) => { e.currentTarget.style.borderColor = "#E8751A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,117,26,0.15)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none" }}
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">{t("¿En qué industria?", "What industry?")}</label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                      style={{
                        background: industry === ind ? "#E8751A" : "var(--background)",
                        color: industry === ind ? "white" : "var(--muted-foreground)",
                        borderColor: industry === ind ? "#E8751A" : "var(--border)",
                      }}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:text-foreground transition-all"
                >
                  {t("Atrás", "Back")}
                </button>
                <button
                  type="submit"
                  disabled={!idea.trim()}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-all active:scale-95"
                  style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}
                >
                  {t("Iniciar mi Discovery", "Start my Discovery")}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-6 py-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(232,117,26,0.12)", border: "2px solid rgba(232,117,26,0.3)" }}>
                <CheckCircle2 size={32} style={{ color: "#E8751A" }} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-2xl text-foreground">
                  {t("¡Bienvenido a UXBox!", "Welcome to UXBox!")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    `Revisamos tu idea y te contactamos en menos de 24 horas. Revisa tu bandeja: ${email}`,
                    `We'll review your idea and contact you within 24 hours. Check your inbox: ${email}`
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                {[
                  t("Análisis inicial de tu idea", "Initial analysis of your idea"),
                  t("Sesión de discovery con tu equipo", "Discovery session with your team"),
                  t("Roadmap validado en 30 días", "Validated roadmap in 30 days"),
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 size={16} style={{ color: "#E8751A" }} className="shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setStep(1); setEmail(""); setIdea(""); setIndustry("") }}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                {t("Registrar otra idea", "Register another idea")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
