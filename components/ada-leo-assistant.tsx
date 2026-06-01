"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, RotateCcw, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Asistente conversacional Ada & Leo — V1 (quiz guiado, sin IA todavía).
 *
 * Guía al usuario en su propio lenguaje y lo lleva al destino correcto en ≤3 pasos.
 * - Ada: cálida, alentadora (default, para el no-técnico).
 * - Leo: directo, estratégico (para quien quiere eficiencia).
 *
 * Ética: cálido por ser CLARO y ÚTIL, nunca manipulador. Cerrar es fácil y se
 * respeta. No finge ser humano. No pide datos sensibles. Sin urgencia falsa.
 *
 * V2 (futuro): chat con IA real reutilizando este mismo shell.
 */

type Guide = "ada" | "leo"
type Expression = "smile" | "thinking" | "excited" | "laptop"
type Stage = "menu" | "result" | "explain"

interface Message {
  role: "guide" | "user"
  text: string
}

interface PathOption {
  id: string
  emoji: string
  labelEs: string
  labelEn: string
  /** Respuesta del guía (en su personalidad). */
  ada: { es: string; en: string }
  leo: { es: string; en: string }
  ctaEs: string
  ctaEn: string
  href: string
  /** Cuando es true, no es un destino: explica y vuelve al menú. */
  explainOnly?: boolean
}

const AVATARS: Record<Guide, Record<Expression, string>> = {
  ada: {
    smile: "/images/asistente/ada-smile.png",
    thinking: "/images/asistente/ada-thinking.png",
    excited: "/images/asistente/ada-excited.png",
    laptop: "/images/asistente/ada-laptop.png",
  },
  leo: {
    smile: "/images/asistente/leo-smile.png",
    thinking: "/images/asistente/leo-thinking.png",
    excited: "/images/asistente/leo-excited.png",
    laptop: "/images/asistente/leo-laptop.png",
  },
}

const GRADIENT = "linear-gradient(135deg, #E8772E 0%, #1A8A9E 100%)"

export function AdaLeoAssistant() {
  const { t, localized } = useLanguage()
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [guide, setGuide] = useState<Guide>("ada")
  const [stage, setStage] = useState<Stage>("menu")
  const [expression, setExpression] = useState<Expression>("smile")
  const [messages, setMessages] = useState<Message[]>([])
  const [activeCta, setActiveCta] = useState<{ label: string; href: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const options: PathOption[] = [
    {
      id: "idea",
      emoji: "💡",
      labelEs: "Tengo una idea pero no sé si funcionará",
      labelEn: "I have an idea but I'm not sure it'll work",
      ada: {
        es: "¡Qué emoción! Una idea es el mejor punto de partida. Antes de que inviertas, con UXBox armamos tu primer brief gratis y validamos si la gente la usaría. Te lo explicamos en simple, sin tecnicismos.",
        en: "How exciting! An idea is the best starting point. Before you invest, with UXBox we build your first brief for free and check whether people would use it. We explain it in plain words, no jargon.",
      },
      leo: {
        es: "Buena jugada. Lo inteligente es validar antes de gastar. UXBox te da un primer brief gratis con IA que te dice si vale la pena seguir. Cero suposiciones.",
        en: "Smart move. The clever thing is to validate before spending. UXBox gives you a free first brief with AI that tells you whether it's worth pursuing. Zero guessing.",
      },
      ctaEs: "Probar UXBox gratis",
      ctaEn: "Try UXBox free",
      href: "/#uxbox",
    },
    {
      id: "empresa",
      emoji: "🏢",
      labelEs: "Tengo una empresa y quiero un producto digital",
      labelEn: "I have a company and want a digital product",
      ada: {
        es: "¡Genial! En UXFactory diseñamos y construimos tu producto a la medida —web, app o dashboard— pensado para que tus clientes lo usen de verdad. Mira lo que ya hemos hecho:",
        en: "Great! At UXFactory we design and build your custom product —web, app, or dashboard— made so your customers actually use it. Take a look at what we've done:",
      },
      leo: {
        es: "Entendido. UXFactory: diseñamos y construimos tu producto a la medida, listo para validar y crecer. Aquí está el portafolio para que veas resultados reales:",
        en: "Got it. UXFactory: we design and build your custom product, ready to validate and grow. Here's the portfolio so you see real results:",
      },
      ctaEs: "Ver portafolio",
      ctaEn: "See portfolio",
      href: "/portafolio",
    },
    {
      id: "producto",
      emoji: "📉",
      labelEs: "Ya tengo un producto pero no funciona bien",
      labelEn: "I already have a product but it's not working well",
      ada: {
        es: "Tranquilo, eso tiene solución. Hacemos un diagnóstico para encontrar por qué la gente se traba o se va, y te decimos qué arreglar primero —sin que pierdas más tiempo ni plata.",
        en: "Don't worry, that's fixable. We run a diagnosis to find why people get stuck or leave, and tell you what to fix first —so you stop wasting time and money.",
      },
      leo: {
        es: "Claro. Un diagnóstico encuentra dónde pierdes usuarios (y plata) y prioriza qué arreglar primero. Directo al grano.",
        en: "Sure. A diagnosis finds where you're losing users (and money) and prioritizes what to fix first. Straight to the point.",
      },
      ctaEs: "Quiero un diagnóstico",
      ctaEn: "I want a diagnosis",
      href: "/servicios",
    },
    {
      id: "aprender",
      emoji: "🎓",
      labelEs: "Quiero aprender a crear productos",
      labelEn: "I want to learn how to create products",
      ada: {
        es: "¡Me encanta! En UXSchool aprendes a crear productos que la gente ama, con IA y criterio humano. Paso a paso, sin que te pierdas en el camino.",
        en: "I love it! At UXSchool you learn to create products people love, with AI and human judgment. Step by step, without getting lost.",
      },
      leo: {
        es: "Buena decisión. UXSchool te forma como Arquitecto de Experiencias con IA. Práctico y aplicable desde el primer día.",
        en: "Good decision. UXSchool trains you as an AI Experience Architect. Practical and applicable from day one.",
      },
      ctaEs: "Explorar el curso",
      ctaEn: "Explore the course",
      href: "/curso",
    },
    {
      id: "ux",
      emoji: "🤔",
      labelEs: "Solo quiero entender qué es esto de UX",
      labelEn: "I just want to understand what this UX thing is",
      ada: {
        es: "Te lo digo en simple 💬 UX (diseño de experiencia) es lograr que tu producto sea claro y fácil, para que la gente quiera usarlo y vuelva. Nosotros entendemos tu idea, la validamos con datos y la construimos bien. ¿Por dónde te gustaría empezar?",
        en: "Here it is in plain words 💬 UX (experience design) means making your product clear and easy, so people want to use it and come back. We understand your idea, validate it with data, and build it right. Where would you like to start?",
      },
      leo: {
        es: "En simple: UX es que tu producto se entienda y se use sin fricción —eso es lo que hace que venda. Entendemos, validamos con datos y construimos. ¿Por dónde arrancamos?",
        en: "In short: UX means your product is understood and used without friction —that's what makes it sell. We understand, validate with data, and build. Where do we start?",
      },
      ctaEs: "",
      ctaEn: "",
      href: "",
      explainOnly: true,
    },
  ]

  // Reinicia la conversación con el guía actual.
  const resetConversation = (g: Guide = guide) => {
    setStage("menu")
    setExpression("smile")
    setActiveCta(null)
    setMessages([{ role: "guide", text: g === "ada"
      ? t("Hola, soy Ada 👋 ¿te ayudo a empezar? Cuéntame, ¿en qué punto estás hoy?", "Hi, I'm Ada 👋 want help getting started? Tell me, where are you today?")
      : t("Hola, soy Leo 👋 Vamos al grano: ¿en qué punto estás hoy?", "Hi, I'm Leo 👋 Let's get to it: where are you today?") }])
  }

  // Teaser una vez por sesión, a los ~4s (no intrusivo, cerrable).
  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem("adaleo-dismissed") === "1") return
    const id = window.setTimeout(() => setTeaser(true), 4000)
    return () => window.clearTimeout(id)
  }, [])

  // Inicializa el saludo al abrir por primera vez.
  useEffect(() => {
    if (open && messages.length === 0) resetConversation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Auto-scroll al último mensaje.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  // Esc para cerrar.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const openPanel = () => {
    setTeaser(false)
    setOpen(true)
  }

  const dismissTeaser = () => {
    setTeaser(false)
    if (typeof window !== "undefined") sessionStorage.setItem("adaleo-dismissed", "1")
  }

  const switchGuide = (g: Guide) => {
    if (g === guide) return
    setGuide(g)
    resetConversation(g)
  }

  const handleSelect = (opt: PathOption) => {
    const userText = `${opt.emoji} ${t(opt.labelEs, opt.labelEn)}`
    const guideText = guide === "ada" ? t(opt.ada.es, opt.ada.en) : t(opt.leo.es, opt.leo.en)

    if (opt.explainOnly) {
      setExpression("laptop")
      setStage("explain")
      setActiveCta(null)
      setMessages((m) => [...m, { role: "user", text: userText }, { role: "guide", text: guideText }])
      return
    }

    setExpression("excited")
    setStage("result")
    setActiveCta({ label: t(opt.ctaEs, opt.ctaEn), href: opt.href })
    setMessages((m) => [...m, { role: "user", text: userText }, { role: "guide", text: guideText }])
  }

  const guideName = guide === "ada" ? "Ada" : "Leo"
  // En "explain" volvemos a mostrar el menú (con la explicación ya dada).
  const showMenu = stage === "menu" || stage === "explain"

  return (
    <>
      {/* ── Burbuja teaser ── */}
      {teaser && !open && (
        <div className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-[60] max-w-[16rem] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative rounded-2xl rounded-br-sm border border-border bg-card shadow-xl p-3.5 pr-8">
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label={t("Cerrar", "Close")}
              className="absolute top-1.5 right-1.5 p-1 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <X size={14} />
            </button>
            <button type="button" onClick={openPanel} className="text-left">
              <p className="text-sm text-foreground/80 leading-snug">
                {t("Hola, soy Ada 👋 ¿te ayudo a empezar?", "Hi, I'm Ada 👋 want help getting started?")}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          aria-label={t("Abrir asistente Ada y Leo", "Open Ada & Leo assistant")}
          className="fixed bottom-20 md:bottom-5 right-4 sm:right-6 z-[60] w-14 h-14 rounded-full shadow-xl overflow-hidden ring-[3px] ring-[#E8751A] ring-offset-2 ring-offset-[var(--background)] hover:scale-105 active:scale-95 transition-transform"
          style={{ background: GRADIENT }}
        >
          <Image
            src={AVATARS[guide].smile}
            alt=""
            width={56}
            height={56}
            className="w-full h-full object-cover object-top scale-110 translate-y-0.5"
          />
        </button>
      )}

      {/* ── Panel ── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("Asistente Ada y Leo", "Ada & Leo assistant")}
          className="fixed z-[70] inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-5 sm:right-6 flex flex-col w-full sm:w-[24rem] h-[88dvh] sm:h-[34rem] sm:max-h-[80dvh] rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 p-4 text-white" style={{ background: GRADIENT }}>
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/80 shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${guide}-${expression}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={AVATARS[guide][expression]}
                    alt={guideName}
                    fill
                    sizes="44px"
                    className="object-cover object-top scale-110 translate-y-0.5"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight font-display">{guideName}</p>
              <p className="text-[11px] text-white/80 leading-tight">
                {t("Guía virtual de MediaLab", "MediaLab's virtual guide")}
              </p>
            </div>
            {/* Selector de guía */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/15 backdrop-blur-sm">
              {(["ada", "leo"] as Guide[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => switchGuide(g)}
                  aria-pressed={guide === g}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    guide === g ? "bg-white text-[#E8772E]" : "text-white/85 hover:text-white"
                  }`}
                >
                  {g === "ada" ? "Ada" : "Leo"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("Cerrar asistente", "Close assistant")}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-white shadow-sm" style={{ background: "#E8772E" }}>
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm bg-card border border-border text-foreground/85 shadow-sm">
                    {msg.text}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Controles */}
          <div className="border-t border-border p-3 space-y-2 bg-background">
            {showMenu ? (
              <div className="space-y-2 max-h-[12rem] overflow-y-auto">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 rounded-xl border border-border bg-card hover:border-[#E8772E]/50 hover:bg-[#E8772E]/[0.04] transition-colors text-sm text-foreground/85"
                  >
                    <span className="text-base shrink-0" aria-hidden="true">{opt.emoji}</span>
                    <span className="leading-snug">{t(opt.labelEs, opt.labelEn)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {activeCta && (
                  <Link
                    href={localized(activeCta.href)}
                    onClick={() => setOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white shadow-md hover:brightness-110 transition active:scale-[0.98]"
                    style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}
                  >
                    {activeCta.label}
                    <ArrowRight size={16} />
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <Link
                    href={localized("/contacto")}
                    onClick={() => setOpen(false)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-medium border border-border text-foreground/70 hover:text-foreground hover:border-foreground/30 transition"
                  >
                    {t("Hablar con una persona", "Talk to a person")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => resetConversation()}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border text-foreground/70 hover:text-foreground hover:border-foreground/30 transition"
                  >
                    <RotateCcw size={13} />
                    {t("Empezar de nuevo", "Start over")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
