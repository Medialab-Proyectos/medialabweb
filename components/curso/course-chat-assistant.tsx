"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, RotateCcw, MessageCircle, User, Mail, Phone } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Asistente conversacional orientado al curso.
 * El usuario puede escribir libremente y recibir respuestas
 * sobre el curso basadas en keywords. También tiene quick-actions.
 */

interface Message {
  role: "guide" | "user"
  text: string
}

const ADA_OPEN = "/images/asistente/ada-open.png"
const ADA_BLINK = "/images/asistente/ada-blink.png"
const GRADIENT = "linear-gradient(135deg, #E8772E 0%, #1A8A9E 100%)"

interface QA {
  keywords: string[]
  es: string
  en: string
}

const courseQA: QA[] = [
  {
    keywords: ["precio", "costo", "cuánto", "cuanto", "inversión", "inversion", "pagar", "price", "cost", "pay", "how much"],
    es: "El curso tiene un precio de prelanzamiento de $995 USD (precio regular $1,500). Puedes pagarlo desde $89/semana con plan fraccionado. Incluye los 9 módulos, certificación, comunidad de por vida y herramientas premium.",
    en: "The course has a pre-launch price of $995 USD (regular $1,500). You can pay from $89/week with installment plans. Includes all 9 modules, certification, lifetime community, and premium tools.",
  },
  {
    keywords: ["duración", "duracion", "semanas", "tiempo", "cuánto dura", "cuanto dura", "duration", "weeks", "how long"],
    es: "El curso dura 8 semanas. Necesitas dedicar entre 6 y 8 horas por semana. Cada módulo construye sobre el anterior, así que al final tienes un producto completo.",
    en: "The course lasts 8 weeks. You need to dedicate 6-8 hours per week. Each module builds on the previous one, so by the end you have a complete product.",
  },
  {
    keywords: ["garantía", "garantia", "devolucion", "devolución", "reembolso", "guarantee", "refund", "money back"],
    es: "Sí, tenemos garantía semana 1. Si después de la primera semana sientes que no es para ti, te devolvemos el 100% sin preguntas.",
    en: "Yes, we have a Week 1 guarantee. If after the first week you feel it's not for you, we refund 100% — no questions asked.",
  },
  {
    keywords: ["módulo", "modulo", "programa", "contenido", "temario", "qué aprendo", "que aprendo", "module", "content", "curriculum", "syllabus", "what will i learn"],
    es: "Son 9 módulos en 3 bloques: Bloque 1 (Diseño Funcional) — de la idea a un producto técnicamente sólido. Bloque 2 (Diseño para Masas) — engagement, hábitos y adopción. Bloque 3 (Validación Humana) — pruebas reales y IA adaptativa. Puedes descargar el currículo completo en PDF desde la sección de programa.",
    en: "There are 9 modules in 3 blocks: Block 1 (Functional Design) — from idea to technically solid product. Block 2 (Design for Masses) — engagement, habits, and adoption. Block 3 (Human Validation) — real testing and adaptive AI. You can download the full curriculum PDF from the program section.",
  },
  {
    keywords: ["requisito", "necesito saber", "experiencia previa", "prerequisite", "requirement", "need to know", "prior experience", "principiante", "beginner"],
    es: "No necesitas experiencia previa en programación. El curso está diseñado para diseñadores, PMs, emprendedores y cualquier persona que quiera crear productos digitales con IA. Lo importante es tener ganas de aprender y construir.",
    en: "No prior coding experience needed. The course is designed for designers, PMs, entrepreneurs, and anyone who wants to create digital products with AI. What matters is your willingness to learn and build.",
  },
  {
    keywords: ["certificación", "certificacion", "certificado", "diploma", "certificate", "certification"],
    es: "Sí, recibes una certificación profesional como Arquitecto de Experiencia de Usuario con IA. En este momento estamos activando la certificación con una institución universitaria para la finalización de esta cohorte. Para más detalles, te recomiendo hablar con uno de nuestros asesores.",
    en: "Yes, you receive a professional certification as AI User Experience Architect. We are currently activating the certification with a university institution for this cohort's completion. For more details, I recommend talking to one of our advisors.",
  },
  {
    keywords: ["herramienta", "tool", "figma", "chatgpt", "claude", "ia", "ai", "software"],
    es: "Usamos herramientas como Figma, ChatGPT, Claude, Perplexity, UXPilot, Maze y más. Todas las herramientas premium están incluidas en tu acceso. Aprendes a usar IA como copiloto, no como muleta.",
    en: "We use tools like Figma, ChatGPT, Claude, Perplexity, UXPilot, Maze, and more. All premium tools are included in your access. You learn to use AI as a copilot, not a crutch.",
  },
  {
    keywords: ["comunidad", "community", "grupo", "network", "red", "acceso de por vida", "lifetime"],
    es: "Al graduarte entras a la comunidad de por vida de MediaLab — discusiones semanales, co-creación, eventos con speakers de la industria, recursos exclusivos y mentoría entre pares. Incluido con tu inscripción.",
    en: "Upon graduation you join MediaLab's lifetime community — weekly discussions, co-creation, industry speaker events, exclusive resources, and peer mentorship. Included with your enrollment.",
  },
  {
    keywords: ["empleo", "trabajo", "salario", "contratar", "job", "employment", "salary", "hire", "career"],
    es: "No prometemos empleo automático — eso sería deshonesto. Lo que sí prometemos: un producto real defendible en tu portafolio, un proceso visible y el criterio para explicar por qué diseñaste lo que diseñaste. Eso es lo que te hace contratable.",
    en: "We don't promise automatic employment — that would be dishonest. What we do promise: a real, defensible product in your portfolio, a visible process, and the judgment to explain why you designed what you designed. That's what makes you hireable.",
  },
  {
    keywords: ["cupo", "inscri", "registro", "cómo me inscribo", "como me inscribo", "enroll", "register", "sign up", "spot", "seat"],
    es: "Solo hay 30 cupos por cohorte para garantizar atención personalizada. Puedes inscribirte desde la sección de registro más abajo, o hablar con un asesor usando el botón de abajo para resolver dudas antes.",
    en: "Only 30 spots per cohort to ensure personalized attention. You can sign up from the registration section below, or talk to an advisor using the button below to resolve questions first.",
  },
  {
    keywords: ["whatsapp", "contacto", "hablar", "asesor", "contact", "talk", "advisor", "call"],
    es: "¡Claro! Puedes hablar directamente con uno de nuestros asesores usando el botón 'Hablar con una persona' aquí abajo. Están disponibles para resolver cualquier duda sobre el curso.",
    en: "Of course! You can talk directly to one of our advisors using the 'Talk to a person' button below. They're available to answer any question about the course.",
  },
  {
    keywords: ["metodología", "metodologia", "90-10", "90 10", "methodology"],
    es: "Usamos la metodología 90-10: 90% productividad, 10% esfuerzo. Cada módulo produce entregables reales que reducen retrabajo en equipos técnicos. No es teoría — es construir un producto real paso a paso.",
    en: "We use the 90-10 methodology: 90% productivity, 10% effort. Each module produces real deliverables that reduce rework for technical teams. It's not theory — it's building a real product step by step.",
  },
]

function findResponse(input: string, lang: "es" | "en"): string {
  const lower = input.toLowerCase()
  for (const qa of courseQA) {
    for (const kw of qa.keywords) {
      if (lower.includes(kw)) {
        return lang === "es" ? qa.es : qa.en
      }
    }
  }
  return lang === "es"
    ? "¡Buena pregunta! Para darte la mejor respuesta, te recomiendo hablar con uno de nuestros asesores — usa el botón 'Hablar con una persona' aquí abajo y te ayudarán con todo."
    : "Great question! To give you the best answer, I recommend talking to one of our advisors — use the 'Talk to a person' button below and they'll help you with everything."
}

const quickActions = [
  { id: "precio", labelEs: "💰 ¿Cuánto cuesta?", labelEn: "💰 How much does it cost?" },
  { id: "modulos", labelEs: "📚 ¿Qué voy a aprender?", labelEn: "📚 What will I learn?" },
  { id: "duracion", labelEs: "⏱️ ¿Cuánto dura?", labelEn: "⏱️ How long is it?" },
  { id: "garantia", labelEs: "🛡️ ¿Tiene garantía?", labelEn: "🛡️ Is there a guarantee?" },
  { id: "requisitos", labelEs: "🎯 ¿Necesito experiencia?", labelEn: "🎯 Do I need experience?" },
  { id: "asesoria", labelEs: "📞 Registrarme a una asesoría 1:1", labelEn: "📞 Book a 1:1 advisory session" },
]

const quickMap: Record<string, string> = {
  precio: "precio",
  modulos: "módulo",
  duracion: "duración",
  garantia: "garantía",
  requisitos: "requisito",
}

export function CourseChatAssistant() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const [showAsesoriaForm, setShowAsesoriaForm] = useState(false)
  const [asesoriaName, setAsesoriaName] = useState("")
  const [asesoriaPhone, setAsesoriaPhone] = useState("")
  const [asesoriaEmail, setAsesoriaEmail] = useState("")
  const [asesoriaSending, setAsesoriaSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const lang = t("es", "en") as "es" | "en"

  const welcomeMsg = t(
    "Hola 👋 Soy Ada, tu guía del curso. Pregúntame lo que quieras — precio, contenido, duración, garantía... ¡estoy aquí para ayudarte!",
    "Hi 👋 I'm Ada, your course guide. Ask me anything — price, content, duration, guarantee... I'm here to help!"
  )

  // Teaser
  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem("course-chat-dismissed") === "1") return
    const id = window.setTimeout(() => setTeaser(true), 4000)
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
    if (typeof window !== "undefined") sessionStorage.setItem("course-chat-dismissed", "1")
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
          "¡Genial! Completa estos datos y te contactaremos para agendar tu asesoría 1:1.",
          "Great! Fill in these details and we'll contact you to schedule your 1:1 advisory session."
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
    if (!asesoriaName.trim() || !asesoriaPhone.trim() || !asesoriaEmail.trim()) return
    setAsesoriaSending(true)
    try {
      await fetch("/api/asesoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: asesoriaName,
          email: asesoriaEmail,
          phone: asesoriaPhone,
          source: "chatbot-curso",
        }),
      })
    } catch {}
    setShowAsesoriaForm(false)
    setMessages((m) => [...m, { role: "guide", text: t(
      `¡Listo, ${asesoriaName.split(" ")[0]}! Te contactaremos pronto para agendar tu asesoría 1:1. ¿Tienes alguna otra pregunta?`,
      `Done, ${asesoriaName.split(" ")[0]}! We'll contact you soon to schedule your 1:1 session. Do you have any other questions?`
    ) }])
    setAsesoriaName(""); setAsesoriaPhone(""); setAsesoriaEmail("")
    setAsesoriaSending(false)
    setShowQuick(true)
  }

  const resetConversation = () => {
    setMessages([{ role: "guide", text: welcomeMsg }])
    setShowQuick(true)
    setShowAsesoriaForm(false)
    setAsesoriaName(""); setAsesoriaPhone(""); setAsesoriaEmail("")
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
                  {t("¿Tienes dudas sobre el curso? Pregúntame 💬", "Questions about the course? Ask me 💬")}
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      {!open && (
        <button type="button" onClick={openPanel}
          aria-label={t("Abrir chat del curso", "Open course chat")}
          className="fixed bottom-20 md:bottom-5 right-4 sm:right-6 z-[60] w-16 h-16 rounded-full shadow-xl overflow-hidden ring-[3px] ring-[#E8751A] ring-offset-2 ring-offset-[var(--background)] hover:scale-105 active:scale-95 transition-transform">
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
            aria-label={t("Chat del curso", "Course chat")}
            className="fixed z-[70] inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-5 sm:right-6 flex flex-col w-full sm:w-[24rem] h-[88dvh] sm:h-[34rem] sm:max-h-[80dvh] rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
          >
            {/* Top bar */}
            <div className="relative h-10 shrink-0 flex items-center justify-between px-3" style={{ background: GRADIENT }}>
              <p className="text-xs text-white/80 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-pulse" />
                Ada · {t("Chat del curso", "Course chat")}
              </p>
              <button type="button" onClick={() => setOpen(false)}
                aria-label={t("Cerrar", "Close")}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Ada intro */}
              {messages.length === 1 && showQuick && (
                <div className="flex flex-col items-center gap-2 pt-1 pb-3">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg ring-2 ring-[#E8772E]/30">
                    <Image src={ADA_OPEN} alt="Ada" fill sizes="256px" quality={100} className="object-cover object-center scale-[1.1]" />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("Tu guía del curso", "Your course guide")}</p>
                </div>
              )}

              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-white shadow-sm" style={{ background: "#E8772E" }}>
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

              {/* Thinking */}
              {thinking && (
                <div className="flex justify-start gap-2">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 mt-1">
                    <Image src={ADA_OPEN} alt="" fill sizes="96px" quality={100} className="object-cover object-center scale-[1.15]" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm bg-card border border-border text-muted-foreground shadow-sm flex items-center gap-1.5">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8772E] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8772E] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8772E] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}

              {/* Quick actions */}
              {showQuick && !thinking && !showAsesoriaForm && (
                <div className="space-y-1.5 pt-1">
                  {quickActions.map((action) => (
                    <button key={action.id} type="button" onClick={() => handleQuickAction(action.id)}
                      className="w-full text-left px-3.5 py-2 rounded-xl border border-border bg-card hover:border-[#E8772E]/40 hover:bg-[#E8772E]/[0.04] transition-all text-sm text-foreground/85">
                      {t(action.labelEs, action.labelEn)}
                    </button>
                  ))}
                </div>
              )}

              {/* Asesoria inline form */}
              {showAsesoriaForm && !thinking && (
                <form onSubmit={handleAsesoriaSubmit} className="space-y-2.5 rounded-xl border border-border bg-card p-3.5">
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input type="text" value={asesoriaName} onChange={(e) => setAsesoriaName(e.target.value)}
                      placeholder={t("Tu nombre", "Your name")} required
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#E8772E]/50" />
                  </div>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input type="email" value={asesoriaEmail} onChange={(e) => setAsesoriaEmail(e.target.value)}
                      placeholder={t("tu@email.com", "your@email.com")} required
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#E8772E]/50" />
                  </div>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input type="tel" value={asesoriaPhone} onChange={(e) => setAsesoriaPhone(e.target.value)}
                      placeholder={t("+57 300 000 0000", "+1 000 000 0000")} required
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#E8772E]/50" />
                  </div>
                  <button type="submit" disabled={asesoriaSending}
                    className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
                    style={{ background: "#E8772E" }}>
                    {asesoriaSending ? t("Enviando...", "Sending...") : t("Enviar", "Submit")}
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
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-[#E8772E]/50 transition-colors"
                  disabled={thinking}
                />
                <button type="submit" disabled={!input.trim() || thinking}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-all duration-200 disabled:opacity-30"
                  style={{ background: "#E8772E" }}>
                  <Send size={16} />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2">
                <a href="https://wa.me/573054009505?text=Hola%2C%20quiero%20info%20sobre%20el%20curso"
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
