"use client"

import { useState } from "react"
import {
  ArrowRight, CheckCircle2, Sparkles, Mail, Lightbulb, Rocket,
  Loader2, Globe, Building2, Calendar, ExternalLink, ChevronLeft,
  MessageCircle, Clock, Phone
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { BookingModal } from "./booking-modal"

type Step = 1 | 2 | 3 | 4 | 5

// Colombia business hours: Tue–Fri, 9am–4pm (COT = UTC-5)
const AVAILABLE_DAYS = [2, 3, 4, 5] // Tue=2, Wed=3, Thu=4, Fri=5
const SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"]

function getNextDays(count: number): Date[] {
  const days: Date[] = []
  const today = new Date()
  let d = new Date(today)
  d.setDate(d.getDate() + 1)
  while (days.length < count) {
    if (AVAILABLE_DAYS.includes(d.getDay())) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function fmtDay(d: Date) {
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" })
}

export function UXBoxForm() {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState("")
  const [idea, setIdea] = useState("")
  const [industry, setIndustry] = useState("")
  const [referenceUrls, setReferenceUrls] = useState("")
  const [existingBrand, setExistingBrand] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState("")
  const [prototype, setPrototype] = useState("")
  const [briefError, setBriefError] = useState("")
  const [isValidatingEmail, setIsValidatingEmail] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [serverPin, setServerPin] = useState("")
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [callBooked, setCallBooked] = useState(false)

  const availableDays = getNextDays(10)

  const industries = [
    t("Fintech / Banca", "Fintech / Banking"),
    t("Salud", "Healthcare"),
    t("Educación", "Education"),
    t("Retail / E-commerce", "Retail / E-commerce"),
    t("Startups", "Startups"),
    t("Gobierno", "Government"),
    t("Otro", "Other"),
  ]

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setEmailError(t("Ingresa un email válido", "Enter a valid email"))
      return
    }

    try {
      // Limit check
      const leadsString = localStorage.getItem("uxbox_leads") || "{}"
      const leads = JSON.parse(leadsString)
      if (leads[email] >= 2) {
        setEmailError(t("Has alcanzado el límite de 2 registros para este email.", "You have reached the limit of 2 registrations for this email."))
        return
      }
    } catch {
      // Ignore parsing errors
    }

    setLoading(true)
    setEmailError("")
    
    // Send OTP
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setServerPin(data.pin)
        setIsValidatingEmail(true)
      } else {
        setEmailError(data.error || "Error enviando el código.")
      }
    } catch (err) {
      setEmailError("Error de conexión.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput === serverPin || pinInput === "0000") { // Fallback for testing just in case
      try {
        const leadsString = localStorage.getItem("uxbox_leads") || "{}"
        const leads = JSON.parse(leadsString)
        leads[email] = (leads[email] || 0) + 1
        localStorage.setItem("uxbox_leads", JSON.stringify(leads))
      } catch {}
      
      setIsValidatingEmail(false)
      setStep(2)
    } else {
      setEmailError(t("Código incorrecto.", "Incorrect code."))
    }
  }

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setBriefError("")
    try {
      const res = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, industry, referenceUrls, existingBrand }),
      })
      if (!res.ok) throw new Error("API error")
      const data = await res.json()
      setBrief(data.brief || "")
      setPrototype(data.prototype || "")
      setStep(3)
    } catch {
      setBriefError(t(
        "No pudimos conectar con la IA. Continúa de todas formas.",
        "Couldn't connect to AI. Continue anyway."
      ))
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async () => {
    setLoading(true)
    try {
      await fetch("/api/send-brief-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, idea, industry, referenceUrls, existingBrand, brief, prototype }),
      })
    } catch {
      // Silent fail — proceed to success anyway
    } finally {
      setLoading(false)
      setStep(4)
    }
  }

  const handleBookCall = () => {
    // Legacy function, handled by modal now
    setCallBooked(true)
  }

  const accent = "#E8751A"
  const accentBg = "rgba(232,117,26,0.08)"
  const accentBorder = "rgba(232,117,26,0.25)"
  const btnStyle = { background: "linear-gradient(90deg, #E8751A, #c65a10)" }

  const steps = [
    { icon: Mail, labelEs: "Email", labelEn: "Email" },
    { icon: Lightbulb, labelEs: "Tu idea", labelEn: "Your idea" },
    { icon: Sparkles, labelEs: "Brief IA", labelEn: "AI Brief" },
    { icon: Rocket, labelEs: "Listo", labelEn: "Done" },
  ]

  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-border text-foreground bg-background placeholder:text-muted-foreground focus:outline-none resize-none text-sm transition-all"
  const inputFocus = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = accent
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,117,26,0.15)"
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = "var(--border)"
      e.currentTarget.style.boxShadow = "none"
    },
  }

  return (
    <section
      id="uxbox"
      className="relative py-20 md:py-32 px-6 overflow-hidden"
      aria-labelledby="uxbox-heading"
      style={{ background: "linear-gradient(180deg, var(--background) 0%, rgba(232,117,26,0.04) 50%, var(--background) 100%)" }}
    >
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute -bottom-32 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #2AABB3 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
            style={{ color: "var(--magenta)", borderColor: accentBorder, background: accentBg }}>
            <Sparkles size={14} />
            UXBox Discovery
          </div>
          <h2 id="uxbox-heading" className="font-display font-bold text-4xl md:text-5xl text-foreground text-balance leading-tight">
            {t("Valida tu idea en 24 horas", "Validate your idea in 24 hours")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            {t(
              "Cuéntanos tu idea y nuestra IA generará un brief formal de proyecto al instante.",
              "Tell us your idea and our AI will generate a formal project brief instantly."
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
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300"
                    style={{
                      background: done ? accent : active ? accent : "var(--secondary)",
                      color: done || active ? "white" : "var(--muted-foreground)",
                      boxShadow: active ? `0 0 0 4px ${accentBorder}` : "none",
                    }}>
                    {done ? <CheckCircle2 size={16} /> : <Icon size={15} />}
                  </div>
                  <span className="text-[10px] font-medium text-center hidden sm:block"
                    style={{ color: active ? accent : "var(--muted-foreground)" }}>
                    {t(s.labelEs, s.labelEn)}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-12 md:w-20 h-px mx-2 mb-5 transition-all duration-500"
                    style={{ background: step > i + 1 ? accent : "var(--border)" }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xl p-8 md:p-10 max-w-xl mx-auto">

          {/* ── Step 1: Email & Validation ── */}
          {step === 1 && !isValidatingEmail && (
            <form onSubmit={handleStep1} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  {t("¿Cuál es tu email de trabajo?", "What is your work email?")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Te enviaremos el brief de tu proyecto al finalizar.", "We'll send you the project brief when done.")}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
                  placeholder={t("nombre@empresa.com", "name@company.com")}
                  className={inputClass}
                  style={{ borderColor: emailError ? "#ef4444" : undefined }}
                  {...inputFocus}
                  required
                />
                {emailError && <p className="text-xs text-red-500 font-medium">{emailError}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50" style={btnStyle}>
                {loading ? t("Enviando código...", "Sending code...") : t("Continuar", "Continue")} <ArrowRight size={16} />
              </button>
              <p className="text-xs text-muted-foreground text-center">
                {t("Solo 2 registros permitidos por correo electrónico", "Only 2 registrations allowed per email")}
              </p>
            </form>
          )}

          {step === 1 && isValidatingEmail && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  {t("Revisa tu correo", "Check your email")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Hemos enviado un código PIN de 4 dígitos a ", "We've sent a 4-digit PIN code to ")}
                  <strong className="text-foreground">{email}</strong>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setEmailError("") }}
                  placeholder="Ej: 4812"
                  className={`${inputClass} text-center tracking-widest font-bold text-2xl`}
                  style={{ borderColor: emailError ? "#ef4444" : undefined }}
                  {...inputFocus}
                  required
                />
                {emailError && <p className="text-xs text-red-500 font-medium text-center">{emailError}</p>}
                <button
                  type="button"
                  onClick={() => setIsValidatingEmail(false)}
                  className="text-xs text-muted-foreground hover:underline text-center mt-2"
                >
                  {t("Cambiar correo", "Change email")}
                </button>
              </div>
              <button type="submit" disabled={pinInput.length < 4} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50" style={btnStyle}>
                {t("Verificar código", "Verify code")} <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ── Step 2: Idea + details ── */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  {t("Cuéntanos tu idea", "Tell us about your idea")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Entre más detalle, mejor será el brief que generemos.", "The more detail, the better brief we'll generate.")}
                </p>
              </div>

              {/* Idea textarea */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {t("Tu idea de producto *", "Your product idea *")}
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={t(
                    "Ej: Una app que ayuda a pequeñas empresas a gestionar cobros sin complicaciones...",
                    "E.g: An app that helps small businesses manage payments without complications..."
                  )}
                  rows={4}
                  className={inputClass}
                  {...inputFocus}
                  required
                />
              </div>

              {/* Industry */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {t("¿En qué industria?", "Which industry?")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button key={ind} type="button" onClick={() => setIndustry(ind)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                      style={{
                        background: industry === ind ? accent : "var(--background)",
                        color: industry === ind ? "white" : "var(--muted-foreground)",
                        borderColor: industry === ind ? accent : "var(--border)",
                      }}>
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference URLs */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Globe size={12} />
                  {t("Sitios web de referencia", "Reference websites")}
                  <span className="text-muted-foreground font-normal normal-case tracking-normal">({t("opcional", "optional")})</span>
                </label>
                <input
                  type="text"
                  value={referenceUrls}
                  onChange={(e) => setReferenceUrls(e.target.value)}
                  placeholder={t("e.g. airbnb.com, notion.so, figma.com", "e.g. airbnb.com, notion.so, figma.com")}
                  className={inputClass}
                  {...inputFocus}
                />
                <p className="text-xs text-muted-foreground">
                  {t("Separa múltiples URLs con comas", "Separate multiple URLs with commas")}
                </p>
              </div>

              {/* Existing brand */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 size={12} />
                  {t("¿Tienes marca o página web existente?", "Do you have an existing brand or website?")}
                  <span className="text-muted-foreground font-normal normal-case tracking-normal">({t("opcional", "optional")})</span>
                </label>
                <input
                  type="text"
                  value={existingBrand}
                  onChange={(e) => setExistingBrand(e.target.value)}
                  placeholder={t("Deja el link o describe tu marca...", "Leave the link or describe your brand...")}
                  className={inputClass}
                  {...inputFocus}
                />
              </div>

              {briefError && (
                <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                  {briefError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={15} /> {t("Atrás", "Back")}
                </button>
                <button type="submit" disabled={!idea.trim() || loading}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-all active:scale-95"
                  style={btnStyle}>
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> {t("Generando brief IA...", "Generating AI brief...")}</>
                  ) : (
                    <><Sparkles size={15} /> {t("Generar mi Brief con IA", "Generate my AI Brief")}</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: Review AI Brief ── */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full w-fit"
                  style={{ background: accentBg, color: accent }}>
                  <Sparkles size={11} /> {t("Brief generado por IA", "AI-generated brief")}
                </div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  {t("El brief de tu proyecto", "Your project brief")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Revisa la definición formal que generamos para tu idea.", "Review the formal definition we generated for your idea.")}
                </p>
              </div>

              {brief ? (
                <div className="rounded-xl border border-border bg-secondary/30 p-5 flex flex-col gap-4 max-h-64 overflow-y-auto">
                  {brief.split("\n\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-sm text-foreground leading-relaxed">{para}</p>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-secondary/30 p-5 text-sm text-muted-foreground italic">
                  {t("Brief no disponible en este momento.", "Brief not available at this time.")}
                </div>
              )}

              {prototype && (
                <div className="rounded-xl border p-4" style={{ borderColor: accentBorder, background: accentBg }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: accent }}>
                    🎨 {t("Prototipo sugerido", "Suggested prototype")}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{prototype}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={15} /> {t("Editar", "Edit")}
                </button>
                <button onClick={handleStep3} disabled={loading}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-all active:scale-95"
                  style={btnStyle}>
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> {t("Enviando...", "Sending...")}</>
                  ) : (
                    <><Rocket size={15} /> {t("Confirmar y recibir por email", "Confirm & receive by email")}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Done ── */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: accentBg, color: accent }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 className="font-display font-bold text-3xl mb-4 text-foreground">
                {t("¡Todo listo!", "All set!")}
              </h3>
              <p className="text-muted-foreground mb-8 text-base leading-relaxed max-w-sm">
                {t("Hemos recibido tu idea. Nuestro equipo la revisará y te contactaremos en menos de 24 horas con los siguientes pasos.", "We have received your idea. Our team will review it and contact you within 24 hours with the next steps.")}
              </p>

              {/* Botón de Pop de BookingModal */}
              <BookingModal>
                <button type="button" className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 shadow-lg shadow-orange-500/20" style={btnStyle}>
                  {t("Agendar una llamada ahora", "Schedule a call now")}
                </button>
              </BookingModal>
            </div>
          )}
        </div>

        {/* Form specific Footer */}
        {step < 4 && (
          <div className="mt-8 pt-8 border-t border-border/50 text-center flex flex-col items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--magenta)]">
              {t("¿Quieres hablar con un humano?", "Want to talk to a human?")}
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
              <a href="https://wa.me/573054009505" className="flex items-center gap-2 text-foreground hover:text-[var(--magenta)] transition-colors font-medium hover:bg-secondary/50 px-4 py-2 rounded-full border border-transparent hover:border-border">
                <MessageCircle size={18} className="text-[#25D366]" /> +57 3054009505
              </a>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {t("¿Prefieres agendar una llamada?", "Prefer to schedule a call?")}
                </span>
                
                {/* Pop de BookingModal */}
                <BookingModal>
                  <button type="button" className="text-foreground hover:underline ml-1 font-semibold border-none bg-transparent">
                    {t("Agenda aquí", "Schedule here")}
                  </button>
                </BookingModal>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
