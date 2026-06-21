"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, RotateCcw, User, Mail, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Asistente conversacional de UXGreen™.
 * Responde sobre el estándar, las 8 dimensiones, el analyzer, SEO,
 * certificación y permite pedir una asesoría gratuita.
 * Misma mecánica que el asistente del home, con marca UXGreen (teal).
 */

interface Message {
  role: "guide" | "user"
  text: string
}

const ADA_OPEN = "/images/asistente/ada-open.png"
const ACCENT = "#00BFA6"
const GRADIENT = "linear-gradient(135deg, #00BFA6 0%, #0a6b56 100%)"

interface QA {
  keywords: string[]
  es: string
  en: string
}

const uxgreenQA: QA[] = [
  {
    keywords: ["qué es", "que es", "uxgreen", "what is", "estándar", "estandar", "standard"],
    es: "UXGreen™ es el estándar de MediaLab que mide la eficiencia digital total de tu sitio: performance, Core Web Vitals, huella de carbono, accesibilidad, IA, carga cognitiva y UX — en un solo score. Optimizar puede reducir el CO₂ por visita hasta un 80% y mejorar tu posicionamiento.",
    en: "UXGreen™ is MediaLab's standard that measures the total digital efficiency of your site: performance, Core Web Vitals, carbon footprint, accessibility, AI, cognitive load, and UX — in a single score. Optimizing can cut CO₂ per visit by up to 80% and improve your ranking.",
  },
  {
    keywords: ["dimensiones", "8 dimensiones", "qué mide", "que mide", "mide", "measure", "dimensions"],
    es: "UXGreen™ evalúa 8 dimensiones: Performance, Core Web Vitals, Carbon Efficiency, UX Efficiency, Accessibility, AI Efficiency, Cognitive Load y Sustainable UX. Cada una afecta tu experiencia, tu impacto ambiental y tu ranking.",
    en: "UXGreen™ evaluates 8 dimensions: Performance, Core Web Vitals, Carbon Efficiency, UX Efficiency, Accessibility, AI Efficiency, Cognitive Load, and Sustainable UX. Each one affects your experience, environmental impact, and ranking.",
  },
  {
    keywords: ["analizar", "analyzer", "analizador", "score", "cómo funciona", "como funciona", "calculadora", "how does", "how it works"],
    es: "El UXGreen™ Analyzer mide tu sitio en tiempo real con Google PageSpeed Insights y Website Carbon API. Ingresas tu dominio y en menos de 30 segundos obtienes tu score en las 8 dimensiones, insights y recomendaciones. Es gratis y sin registro — pruébalo en esta misma página.",
    en: "The UXGreen™ Analyzer measures your site in real time with Google PageSpeed Insights and the Website Carbon API. Enter your domain and in under 30 seconds you get your score across the 8 dimensions, insights, and recommendations. It's free and no sign-up — try it on this page.",
  },
  {
    keywords: ["certificación", "certificacion", "certificado", "certified", "badge", "sello", "niveles", "levels", "elite", "foundation"],
    es: "Hay 3 niveles: UXGreen™ Foundation (60-74), Certified (75-89) y Elite (90+). Cada nivel incluye un badge verificable para mostrar en tu sitio que cumples el estándar UXGreen™ by MediaLab.",
    en: "There are 3 levels: UXGreen™ Foundation (60-74), Certified (75-89), and Elite (90+). Each level includes a verifiable badge to show on your site that you meet the UXGreen™ by MediaLab standard.",
  },
  {
    keywords: ["seo", "google", "ranking", "posicionamiento", "posicion", "core web vitals", "cwv", "vitals"],
    es: "Core Web Vitals y performance son señales de ranking directas en Google. Mejorar de 45 a 80+ puede subir tu posicionamiento orgánico 15-35% y reducir el bounce rate. Google penaliza los sitios lentos e ineficientes.",
    en: "Core Web Vitals and performance are direct ranking signals in Google. Improving from 45 to 80+ can raise your organic ranking 15-35% and reduce bounce rate. Google penalizes slow, inefficient sites.",
  },
  {
    keywords: ["carbono", "carbon", "co2", "co₂", "huella", "sostenib", "sustainab", "verde", "green", "ambiental", "environment"],
    es: "La web global emite más CO₂ que la industria aérea. Un sitio optimizado puede ser hasta 80% más limpio que el promedio. UXGreen™ mide tu huella por visita y te muestra cómo reducirla — eficiencia y sostenibilidad son la misma optimización.",
    en: "The global web emits more CO₂ than the airline industry. An optimized site can be up to 80% cleaner than average. UXGreen™ measures your footprint per visit and shows how to reduce it — efficiency and sustainability are the same optimization.",
  },
  {
    keywords: ["precio", "costo", "cuánto", "cuanto", "gratis", "free", "price", "cost", "vale"],
    es: "El análisis con el UXGreen™ Analyzer es totalmente gratuito y sin registro. Si quieres que MediaLab ejecute la auditoría completa e implemente las mejoras, te damos una propuesta personalizada — pide tu asesoría gratuita aquí abajo.",
    en: "The UXGreen™ Analyzer is completely free with no sign-up. If you want MediaLab to run the full audit and implement the improvements, we'll give you a personalized proposal — request your free audit below.",
  },
  {
    keywords: ["mejorar", "implementar", "auditoría", "auditoria", "ayuda", "ayúdame", "ayudame", "help", "audit", "implement", "optimizar"],
    es: "MediaLab puede ejecutar la auditoría UXGreen™ completa e implementar todas las optimizaciones: performance, accesibilidad, IA y sostenibilidad. Pide tu asesoría gratuita y revisamos tu sitio contigo.",
    en: "MediaLab can run the full UXGreen™ audit and implement every optimization: performance, accessibility, AI, and sustainability. Request your free audit and we'll review your site with you.",
  },
  {
    keywords: ["contacto", "asesor", "asesoría", "asesoria", "hablar", "contact", "advisor", "llamada", "call", "meeting", "reunión", "reunion"],
    es: "¡Claro! Usa el botón 'Pedir asesoría gratuita' aquí abajo y déjanos tus datos. Revisamos tu sitio y te mostramos exactamente cómo mejorar tu eficiencia y posicionamiento.",
    en: "Of course! Use the 'Request a free audit' button below and leave us your details. We'll review your site and show you exactly how to improve your efficiency and ranking.",
  },
]

function findResponse(input: string, lang: "es" | "en"): string {
  const lower = input.toLowerCase()
  for (const qa of uxgreenQA) {
    for (const kw of qa.keywords) {
      if (lower.includes(kw)) {
        return lang === "es" ? qa.es : qa.en
      }
    }
  }
  return lang === "es"
    ? "¡Buena pregunta! Puedo contarte sobre las 8 dimensiones, el analyzer, la certificación o cómo mejorar tu sitio. O pide una asesoría gratuita aquí abajo y lo revisamos contigo."
    : "Great question! I can tell you about the 8 dimensions, the analyzer, certification, or how to improve your site. Or request a free audit below and we'll review it with you."
}

const quickActions = [
  { id: "que-es", labelEs: "🌿 ¿Qué es UXGreen™?", labelEn: "🌿 What is UXGreen™?" },
  { id: "dimensiones", labelEs: "📊 ¿Qué mide? (8 dimensiones)", labelEn: "📊 What does it measure?" },
  { id: "analyzer", labelEs: "⚡ ¿Cómo funciona el Analyzer?", labelEn: "⚡ How does the Analyzer work?" },
  { id: "seo", labelEs: "🔍 ¿Mejora mi SEO?", labelEn: "🔍 Does it improve my SEO?" },
  { id: "certificacion", labelEs: "🏅 Certificación UXGreen™", labelEn: "🏅 UXGreen™ certification" },
  { id: "asesoria", labelEs: "📞 Pedir asesoría gratuita", labelEn: "📞 Request a free audit" },
]

const quickMap: Record<string, string> = {
  "que-es": "qué es",
  dimensiones: "dimensiones",
  analyzer: "analyzer",
  seo: "seo",
  certificacion: "certificación",
}

export function UXGreenChatAssistant() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const [showAsesoriaForm, setShowAsesoriaForm] = useState(false)
  const [asesoriaName, setAsesoriaName] = useState("")
  const [asesoriaSite, setAsesoriaSite] = useState("")
  const [asesoriaEmail, setAsesoriaEmail] = useState("")
  const [asesoriaSending, setAsesoriaSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const lang = t("es", "en") as "es" | "en"

  const welcomeMsg = t(
    "Hola 👋 Soy Ada. Te ayudo con UXGreen™: qué es, qué mide, cómo analizar tu sitio y cómo mejorar tu eficiencia y posicionamiento. ¿Qué quieres saber?",
    "Hi 👋 I'm Ada. I help you with UXGreen™: what it is, what it measures, how to analyze your site, and how to improve your efficiency and ranking. What would you like to know?"
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem("uxgreen-chat-dismissed") === "1") return
    const id = window.setTimeout(() => setTeaser(true), 5000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (open) {
      if (messages.length === 0) {
        setMessages([{ role: "guide", text: welcomeMsg }])
        setShowQuick(true)
      }
      setTimeout(() => inputRef.current?.focus(), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const hasInteracted = useRef(false)
  useEffect(() => {
    if (!hasInteracted.current) {
      scrollRef.current?.scrollTo({ top: 0 })
      if (messages.length > 1) hasInteracted.current = true
      return
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, thinking])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const openPanel = () => { setTeaser(false); setOpen(true) }

  const dismissTeaser = () => {
    setTeaser(false)
    if (typeof window !== "undefined") sessionStorage.setItem("uxgreen-chat-dismissed", "1")
  }

  const sendMessage = (text: string) => {
    if (!text.trim() || thinking) return
    setMessages((m) => [...m, { role: "user", text: text.trim() }])
    setInput("")
    setShowQuick(false)
    setThinking(true)
    setTimeout(() => {
      const response = findResponse(text, lang)
      setMessages((m) => [...m, { role: "guide", text: response }])
      setThinking(false)
    }, 800 + Math.random() * 600)
  }

  const handleQuickAction = (id: string) => {
    const action = quickActions.find((a) => a.id === id)
    if (!action) return
    const userText = t(action.labelEs, action.labelEn)
    setMessages((m) => [...m, { role: "user", text: userText }])
    setShowQuick(false)

    if (id === "asesoria") {
      setThinking(true)
      setTimeout(() => {
        setMessages((m) => [...m, { role: "guide", text: t(
          "¡Genial! Déjanos tu sitio y tu correo. Analizamos tu eficiencia y te contactamos para tu asesoría gratuita.",
          "Great! Leave us your site and email. We'll analyze your efficiency and contact you for your free audit."
        ) }])
        setThinking(false)
        setShowAsesoriaForm(true)
      }, 600)
      return
    }

    setThinking(true)
    setTimeout(() => {
      const response = findResponse(quickMap[id], lang)
      setMessages((m) => [...m, { role: "guide", text: response }])
      setThinking(false)
    }, 800 + Math.random() * 600)
  }

  const handleAsesoriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asesoriaName.trim() || !asesoriaSite.trim() || !asesoriaEmail.trim()) return
    setAsesoriaSending(true)
    try {
      await fetch("/api/uxgreen-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: asesoriaName,
          url: asesoriaSite,
          email: asesoriaEmail,
          source: "chatbot-uxgreen",
        }),
      })
    } catch {}
    setShowAsesoriaForm(false)
    setMessages((m) => [...m, { role: "guide", text: t(
      `¡Listo, ${asesoriaName.split(" ")[0]}! Analizaremos tu sitio y te contactaremos pronto con tu primer reporte gratuito. ¿Algo más que quieras saber?`,
      `Done, ${asesoriaName.split(" ")[0]}! We'll analyze your site and contact you soon with your first free report. Anything else you'd like to know?`
    ) }])
    setAsesoriaName(""); setAsesoriaSite(""); setAsesoriaEmail("")
    setAsesoriaSending(false)
    setShowQuick(true)
  }

  const resetConversation = () => {
    setMessages([{ role: "guide", text: welcomeMsg }])
    setShowQuick(true)
    setShowAsesoriaForm(false)
    setAsesoriaName(""); setAsesoriaSite(""); setAsesoriaEmail("")
    setInput("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* Teaser */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 right-6 z-[60] max-w-[16rem] hidden md:block"
          >
            <div className="relative rounded-2xl rounded-br-sm border border-border bg-card shadow-xl p-3.5 pr-8">
              <button type="button" onClick={dismissTeaser} aria-label={t("Cerrar", "Close")}
                className="absolute top-1.5 right-1.5 p-1 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
                <X size={14} />
              </button>
              <button type="button" onClick={openPanel} className="text-left">
                <p className="text-sm text-foreground/80 leading-snug">
                  {t("¿Dudas sobre la eficiencia de tu sitio? Pregúntame 🌿", "Questions about your site's efficiency? Ask me 🌿")}
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      {!open && (
        <button type="button" onClick={openPanel}
          aria-label={t("Abrir chat UXGreen", "Open UXGreen chat")}
          className="fixed bottom-20 md:bottom-5 right-4 sm:right-6 z-[60] w-16 h-16 rounded-full shadow-xl overflow-hidden ring-[3px] ring-[#00BFA6] ring-offset-2 ring-offset-[var(--background)] hover:scale-105 active:scale-95 transition-transform">
          <Image src={ADA_OPEN} alt="" width={200} height={200} sizes="200px" quality={100}
            className="w-full h-full object-cover object-center scale-[1.35]" />
        </button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            role="dialog" aria-modal="true"
            aria-label={t("Chat de UXGreen", "UXGreen chat")}
            className="fixed z-[70] inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-5 sm:right-6 flex flex-col w-full sm:w-[24rem] h-[88dvh] sm:h-[34rem] sm:max-h-[80dvh] rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
          >
            {/* Top bar */}
            <div className="relative h-10 shrink-0 flex items-center justify-between px-3" style={{ background: GRADIENT }}>
              <p className="text-xs text-white/90 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Ada · UXGreen™
              </p>
              <button type="button" onClick={() => setOpen(false)}
                aria-label={t("Cerrar", "Close")}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 1 && showQuick && (
                <div className="flex flex-col items-center gap-2 pt-1 pb-3">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg ring-2 ring-[#00BFA6]/40">
                    <Image src={ADA_OPEN} alt="Ada" fill sizes="256px" quality={100} className="object-cover object-center scale-[1.1]" />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("Tu guía UXGreen™", "Your UXGreen™ guide")}</p>
                </div>
              )}

              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-white shadow-sm" style={{ background: ACCENT }}>
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start gap-2">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 mt-1">
                      <Image src={ADA_OPEN} alt="" fill sizes="96px" quality={100} className="object-cover object-center scale-[1.15]" />
                    </div>
                    <div className="max-w-[78%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm bg-card border border-border text-foreground/85 shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                ),
              )}

              {thinking && (
                <div className="flex justify-start gap-2">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 mt-1">
                    <Image src={ADA_OPEN} alt="" fill sizes="96px" quality={100} className="object-cover object-center scale-[1.15]" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm bg-card border border-border text-muted-foreground shadow-sm flex items-center gap-1.5">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}

              {showQuick && !thinking && !showAsesoriaForm && (
                <div className="space-y-1.5 pt-1">
                  {quickActions.map((action) => (
                    <button key={action.id} type="button" onClick={() => handleQuickAction(action.id)}
                      className="w-full text-left px-3.5 py-2 rounded-xl border border-border bg-card hover:border-[#00BFA6]/40 hover:bg-[#00BFA6]/[0.05] transition-all text-sm text-foreground/85">
                      {t(action.labelEs, action.labelEn)}
                    </button>
                  ))}
                </div>
              )}

              {showAsesoriaForm && !thinking && (
                <form onSubmit={handleAsesoriaSubmit} className="space-y-2.5 rounded-xl border border-border bg-card p-3.5">
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input type="text" value={asesoriaName} onChange={(e) => setAsesoriaName(e.target.value)}
                      placeholder={t("Tu nombre", "Your name")} required
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#00BFA6]/50" />
                  </div>
                  <div className="relative">
                    <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input type="text" value={asesoriaSite} onChange={(e) => setAsesoriaSite(e.target.value)}
                      placeholder={t("Tu sitio web", "Your website")} required
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#00BFA6]/50" />
                  </div>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input type="email" value={asesoriaEmail} onChange={(e) => setAsesoriaEmail(e.target.value)}
                      placeholder={t("tu@email.com", "your@email.com")} required
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#00BFA6]/50" />
                  </div>
                  <button type="submit" disabled={asesoriaSending}
                    className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
                    style={{ background: ACCENT }}>
                    {asesoriaSending ? t("Enviando...", "Sending...") : t("Pedir asesoría gratuita", "Request free audit")}
                  </button>
                </form>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-border p-3 bg-secondary/50">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("Escribe tu pregunta...", "Type your question...")}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-[#00BFA6]/50 transition-colors"
                  disabled={thinking}
                />
                <button type="submit" disabled={!input.trim() || thinking}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-all duration-200 disabled:opacity-30"
                  style={{ background: ACCENT }}>
                  <Send size={16} />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2">
                <a href={t(
                    "https://wa.me/573054009505?text=Hola%2C%20quiero%20info%20sobre%20UXGreen",
                    "https://wa.me/573054009505?text=Hi%2C%20I%20want%20info%20about%20UXGreen"
                  )}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/50 hover:text-foreground/70 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" className="shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t("Hablar con una persona", "Talk to a person")}
                </a>
                <button type="button" onClick={resetConversation}
                  className="inline-flex items-center gap-1 text-[11px] text-foreground/50 hover:text-foreground/70 transition-colors">
                  <RotateCcw size={11} />
                  {t("Reiniciar", "Reset")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
