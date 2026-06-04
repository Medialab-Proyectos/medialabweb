"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, RotateCcw, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Asistente conversacional orientado al home.
 * El usuario puede escribir libremente y recibir respuestas
 * sobre los servicios de MediaLab basadas en keywords.
 */

interface Message {
  role: "guide" | "user"
  text: string
}

const ADA_OPEN = "/images/asistente/ada-open.png"
const GRADIENT = "linear-gradient(135deg, #E8772E 0%, #1A8A9E 100%)"

interface QA {
  keywords: string[]
  es: string
  en: string
}

const homeQA: QA[] = [
  {
    keywords: ["uxbox", "brief", "discovery", "diagnóstico gratis", "diagnostico gratis", "free brief", "free diagnosis"],
    es: "UXBox es nuestro discovery de producto con IA — en días, no meses. Recibes un brief estratégico con análisis de usuarios, benchmarks y oportunidades. Es gratuito y sin compromiso. Puedes probarlo desde la sección UXBox más abajo en esta página.",
    en: "UXBox is our AI-powered product discovery — in days, not months. You get a strategic brief with user analysis, benchmarks, and opportunities. It's free with no commitment. You can try it from the UXBox section below on this page.",
  },
  {
    keywords: ["uxfactory", "factory", "desarrollo", "construir producto", "build product", "development", "custom", "a medida"],
    es: "UXFactory es nuestro servicio de diseño y desarrollo de productos digitales a medida. Combinamos UX research, diseño de interfaz e ingeniería en un solo equipo. Desde la idea hasta el producto en producción.",
    en: "UXFactory is our custom digital product design and development service. We combine UX research, interface design, and engineering in one team. From idea to product in production.",
  },
  {
    keywords: ["servicio", "qué hacen", "que hacen", "ofrecen", "service", "what do you do", "what you offer"],
    es: "En MediaLab tenemos 3 líneas: UXBox (discovery de producto con IA, gratuito), UXFactory (diseño y desarrollo a medida) y UXSchool (formación profesional en UX + IA). También ofrecemos consultoría CRO para optimizar conversiones en productos existentes.",
    en: "At MediaLab we have 3 lines: UXBox (AI product discovery, free), UXFactory (custom design & development), and UXSchool (professional training in UX + AI). We also offer CRO consulting to optimize conversions in existing products.",
  },
  {
    keywords: ["precio", "costo", "cuánto", "cuanto", "inversión", "inversion", "tarifa", "price", "cost", "how much", "rate", "budget"],
    es: "Cada proyecto es único, así que los precios varían según alcance y complejidad. Lo que sí puedo decirte: UXBox (discovery) es gratuito, y para UXFactory trabajamos con sprints que se adaptan a tu presupuesto. Te recomiendo hablar con un asesor para una cotización personalizada.",
    en: "Each project is unique, so pricing varies by scope and complexity. What I can tell you: UXBox (discovery) is free, and for UXFactory we work in sprints that adapt to your budget. I recommend talking to an advisor for a personalized quote.",
  },
  {
    keywords: ["curso", "school", "uxschool", "aprender", "formación", "formacion", "capacitación", "capacitacion", "course", "learn", "training"],
    es: "UXSchool es nuestra área de formación. Tenemos el curso AI UX Architect — 8 semanas para dominar UX, IA y psicología de adopción digital. 9 módulos, proyecto real, certificación y comunidad de por vida. Puedes ver todos los detalles en nuestra página del curso.",
    en: "UXSchool is our training division. We have the AI UX Architect course — 8 weeks to master UX, AI, and digital adoption psychology. 9 modules, real project, certification, and lifetime community. You can see all the details on our course page.",
  },
  {
    keywords: ["ux", "experiencia de usuario", "user experience", "diseño", "design", "interfaz", "interface", "ui"],
    es: "UX (experiencia de usuario) es el proceso de diseñar productos que realmente funcionan para las personas. En MediaLab combinamos investigación de usuarios, psicología del consumidor e IA para crear experiencias que convierten y que las personas aman.",
    en: "UX (user experience) is the process of designing products that truly work for people. At MediaLab we combine user research, consumer psychology, and AI to create experiences that convert and that people love.",
  },
  {
    keywords: ["ia", "ai", "inteligencia artificial", "artificial intelligence", "chatgpt", "claude", "automatización", "automatizacion", "automation"],
    es: "Usamos IA en todo lo que hacemos: desde el discovery con UXBox hasta el diseño con herramientas como Figma + AI, ChatGPT, Claude y más. No es moda — es una ventaja real que reduce tiempos y mejora resultados.",
    en: "We use AI in everything we do: from discovery with UXBox to design with tools like Figma + AI, ChatGPT, Claude, and more. It's not a trend — it's a real advantage that reduces timelines and improves results.",
  },
  {
    keywords: ["metodología", "metodologia", "cómo trabajan", "como trabajan", "proceso", "method", "methodology", "how you work", "process"],
    es: "Trabajamos con nuestra metodología 90-10: 90% productividad, 10% esfuerzo. Cada sprint produce entregables reales — nada de presentaciones vacías. Investigación de usuarios, diseño, prototipado y validación en ciclos cortos.",
    en: "We work with our 90-10 methodology: 90% productivity, 10% effort. Each sprint produces real deliverables — no empty presentations. User research, design, prototyping, and validation in short cycles.",
  },
  {
    keywords: ["portafolio", "portfolio", "proyectos", "trabajos", "cases", "work", "examples", "clientes", "clients"],
    es: "Hemos trabajado con más de 40 equipos en sectores como salud, fintech, educación, retail y más. Puedes ver algunos de nuestros productos en la sección de portafolio más abajo, o hablar con un asesor para casos específicos de tu industria.",
    en: "We've worked with 40+ teams across sectors like health, fintech, education, retail, and more. You can see some of our products in the portfolio section below, or talk to an advisor for cases specific to your industry.",
  },
  {
    keywords: ["mi producto", "no funciona", "no convierte", "conversión", "conversion", "mejorar", "optimizar", "cro", "improve", "optimize", "not working", "not converting"],
    es: "Si tu producto ya existe pero no convierte como esperas, te recomiendo empezar con UXBox — es gratuito y te damos un diagnóstico claro de qué mejorar. También ofrecemos consultoría CRO enfocada en aumentar conversiones con datos reales.",
    en: "If your product already exists but isn't converting as expected, I recommend starting with UXBox — it's free and we give you a clear diagnosis of what to improve. We also offer CRO consulting focused on increasing conversions with real data.",
  },
  {
    keywords: ["idea", "emprender", "startup", "emprendimiento", "tengo una idea", "i have an idea", "nuevo producto", "new product", "validar", "validate"],
    es: "¡Genial que tengas una idea! El primer paso es validarla antes de construir. Con UXBox puedes recibir un brief estratégico gratuito que te dice si tu idea tiene viabilidad y cómo abordarla. Si decides avanzar, UXFactory te acompaña de la idea al producto.",
    en: "Great that you have an idea! The first step is to validate it before building. With UXBox you can get a free strategic brief that tells you if your idea is viable and how to approach it. If you decide to move forward, UXFactory takes you from idea to product.",
  },
  {
    keywords: ["whatsapp", "contacto", "hablar", "asesor", "contact", "talk", "advisor", "call", "reunión", "reunion", "meeting"],
    es: "¡Claro! Puedes hablar directamente con uno de nuestros asesores usando el botón 'Hablar con una persona' aquí abajo. Están disponibles para resolver cualquier duda.",
    en: "Of course! You can talk directly to one of our advisors using the 'Talk to a person' button below. They're available to answer any question.",
  },
  {
    keywords: ["bogotá", "bogota", "colombia", "ubicación", "ubicacion", "dónde", "donde", "location", "where"],
    es: "Estamos en Bogotá, Colombia, pero trabajamos con equipos de todo el mundo. Nuestros proyectos son remotos y nuestros clientes están en Latinoamérica, Estados Unidos y Europa.",
    en: "We're based in Bogotá, Colombia, but we work with teams worldwide. Our projects are remote and our clients are across Latin America, the US, and Europe.",
  },
]

function findResponse(input: string, lang: "es" | "en"): string {
  const lower = input.toLowerCase()
  for (const qa of homeQA) {
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
  { id: "idea", labelEs: "💡 Tengo una idea de producto", labelEn: "💡 I have a product idea" },
  { id: "producto", labelEs: "🔧 Mi producto no convierte", labelEn: "🔧 My product isn't converting" },
  { id: "servicios", labelEs: "🧩 ¿Qué servicios ofrecen?", labelEn: "🧩 What services do you offer?" },
  { id: "uxbox", labelEs: "📦 ¿Qué es UXBox?", labelEn: "📦 What is UXBox?" },
  { id: "curso", labelEs: "🎓 Quiero aprender UX + IA", labelEn: "🎓 I want to learn UX + AI" },
]

const quickMap: Record<string, string> = {
  idea: "tengo una idea",
  producto: "no convierte",
  servicios: "servicio",
  uxbox: "uxbox",
  curso: "curso",
}

export function HomeChatAssistant() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const lang = t("es", "en") as "es" | "en"

  const welcomeMsg = t(
    "Hola 👋 Soy Ada, tu guía en MediaLab. ¿Tienes una idea, un producto que mejorar, o quieres aprender? Cuéntame y te oriento.",
    "Hi 👋 I'm Ada, your guide at MediaLab. Have an idea, a product to improve, or want to learn? Tell me and I'll point you in the right direction."
  )

  // Teaser
  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem("home-chat-dismissed") === "1") return
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

  useEffect(() => {
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
    if (typeof window !== "undefined") sessionStorage.setItem("home-chat-dismissed", "1")
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
    setThinking(true)

    setTimeout(() => {
      const response = findResponse(quickMap[id], lang)
      setMessages((m) => [...m, { role: "guide", text: response }])
      setThinking(false)
    }, 800 + Math.random() * 600)
  }

  const resetConversation = () => {
    setMessages([{ role: "guide", text: welcomeMsg }])
    setShowQuick(true)
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
            className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-[60] max-w-[16rem]"
          >
            <div className="relative rounded-2xl rounded-br-sm border border-border bg-card shadow-xl p-3.5 pr-8">
              <button type="button" onClick={dismissTeaser} aria-label={t("Cerrar", "Close")}
                className="absolute top-1.5 right-1.5 p-1 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
                <X size={14} />
              </button>
              <button type="button" onClick={openPanel} className="text-left">
                <p className="text-sm text-foreground/80 leading-snug">
                  {t("¿Necesitas ayuda con tu producto digital? Pregúntame 💬", "Need help with your digital product? Ask me 💬")}
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      {!open && (
        <button type="button" onClick={openPanel}
          aria-label={t("Abrir chat", "Open chat")}
          className="fixed bottom-20 md:bottom-5 right-4 sm:right-6 z-[60] w-16 h-16 rounded-full shadow-xl overflow-hidden ring-[3px] ring-[#E8751A] ring-offset-2 ring-offset-[var(--background)] hover:scale-105 active:scale-95 transition-transform">
          <Image src={ADA_OPEN} alt="" width={200} height={200}
            className="w-full h-full object-cover object-center scale-[1.35]" unoptimized />
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
            aria-label={t("Chat de MediaLab", "MediaLab chat")}
            className="fixed z-[70] inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-5 sm:right-6 flex flex-col w-full sm:w-[24rem] h-[88dvh] sm:h-[34rem] sm:max-h-[80dvh] rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
          >
            {/* Top bar */}
            <div className="relative h-10 shrink-0 flex items-center justify-between px-3" style={{ background: GRADIENT }}>
              <p className="text-xs text-white/80 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-pulse" />
                Ada · MediaLab
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
                    <Image src={ADA_OPEN} alt="Ada" fill sizes="128px" className="object-cover object-center scale-[1.1]" unoptimized />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("Tu guía en MediaLab", "Your MediaLab guide")}</p>
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
                      <Image src={ADA_OPEN} alt="" fill sizes="36px" className="object-cover object-center scale-[1.15]" unoptimized />
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
                    <Image src={ADA_OPEN} alt="" fill sizes="36px" className="object-cover object-center scale-[1.15]" unoptimized />
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
              {showQuick && !thinking && (
                <div className="space-y-1.5 pt-1">
                  {quickActions.map((action) => (
                    <button key={action.id} type="button" onClick={() => handleQuickAction(action.id)}
                      className="w-full text-left px-3.5 py-2 rounded-xl border border-border bg-card hover:border-[#E8772E]/40 hover:bg-[#E8772E]/[0.04] transition-all text-sm text-foreground/85">
                      {t(action.labelEs, action.labelEn)}
                    </button>
                  ))}
                </div>
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
                <a href={t(
                    "https://wa.me/573054009505?text=Hola%2C%20quiero%20info%20sobre%20MediaLab",
                    "https://wa.me/573054009505?text=Hi%2C%20I%20want%20info%20about%20MediaLab"
                  )}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-foreground/50 hover:text-foreground/70 transition-colors">
                  <MessageCircle size={11} />
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
