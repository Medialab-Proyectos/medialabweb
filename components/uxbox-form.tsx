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
import { doneStageByElapsed, stageReadyAt, PHASES, STAGE_COUNT } from "@/lib/uxbox-phases"

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
  lang?: "es" | "en"
  lastEmailedStage?: number
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

// Tiempo restante "1h 23m" / "9m" para las fases de larga duración.
function fmtHM(ms: number) {
  const totalMin = Math.max(0, Math.ceil(ms / 60000))
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
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
  ["Mientras no estabas, detecté una oportunidad de automatización que tus competidores aún no han visto. El timing es clave.", "While you were away, I detected an automation opportunity your competitors haven't seen yet. Timing is key."],
  ["Tu idea sigue ganando fuerza: encaja con una tendencia creciente que solo el 12% del mercado está aprovechando.", "Your idea keeps gaining traction: it fits a growing trend only 12% of the market is leveraging."],
  ["Encontré un ángulo de diferenciación por psicología del consumidor que nadie en tu espacio está usando. Esto cambia el juego.", "I found a consumer psychology differentiation angle no one in your space is using. This is a game changer."],
  ["Un competidor clave dejó un hueco enorme en la experiencia móvil. Tu ventana para capitalizarlo se está cerrando.", "A key competitor left a massive gap in mobile experience. Your window to capitalize is closing."],
  ["Nuevo hallazgo: tu público objetivo responde 3x mejor a flujos guiados con progreso visible. Ya tengo la estrategia.", "New finding: your target audience responds 3x better to guided flows with visible progress. I already have the strategy."],
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
  const { t, lang } = useLanguage()

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
  const [retrieveMode, setRetrieveMode] = useState(false)
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false)
  // true cuando el usuario venía a iniciar una idea NUEVA pero su email ya tenía un análisis
  const [existingNotice, setExistingNotice] = useState(false)

  // feed state
  const [feedStep, setFeedStep] = useState(0)
  const [projectName, setProjectName] = useState("")
  const [references, setReferences] = useState("")
  const [objective, setObjective] = useState("")
  const [audience, setAudience] = useState("")

  // engine state
  const [brief, setBrief] = useState("")
  const [prototype, setPrototype] = useState("")
  const [returnInsight, setReturnInsight] = useState("")

  // Contador animado de ideas analizadas — persiste en localStorage
  const IDEAS_COUNT_KEY = "uxbox_ideas_count"
  const IDEAS_COUNT_BASE = 173
  const [ideasCount, setIdeasCount] = useState(IDEAS_COUNT_BASE)
  const [ideasFlash, setIdeasFlash] = useState(false)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(IDEAS_COUNT_KEY)
      if (stored) setIdeasCount(parseInt(stored, 10) || IDEAS_COUNT_BASE)
    } catch {}
  }, [])
  // Incrementa lentamente mientras la sección spark es visible
  useEffect(() => {
    if (phase !== "spark") return
    // Incrementa +1 cada 8–15 segundos (aleatorio para parecer orgánico)
    const tick = () => {
      const delay = 8000 + Math.random() * 7000
      return setTimeout(() => {
        setIdeasCount(prev => {
          const next = prev + 1
          try { localStorage.setItem(IDEAS_COUNT_KEY, String(next)) } catch {}
          return next
        })
        setIdeasFlash(true)
        timerId = tick()
      }, delay)
    }
    let timerId = tick()
    return () => clearTimeout(timerId)
  }, [phase])
  // Apaga el flash después de la transición
  useEffect(() => {
    if (!ideasFlash) return
    const t = setTimeout(() => setIdeasFlash(false), 600)
    return () => clearTimeout(t)
  }, [ideasFlash])

  const labRef = useRef<Lab>(lab)
  useEffect(() => { labRef.current = lab }, [lab])

  // Live clock — drives the time-based deep-dive countdown (Phase 2)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (phase !== "engine" && phase !== "return") return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [phase])

  /* Mark hydrated on mount — no auto-resume; user must enter their email to retrieve analysis */
  useEffect(() => {
    setHydrated(true)
  }, [])

  const persist = (patch: Partial<Lab>) => {
    const next = { ...labRef.current, ...patch }
    labRef.current = next
    setLab(next)
    try { localStorage.setItem(LAB_KEY, JSON.stringify(next)) } catch {}
    // Sincroniza al servidor (no-op si no hay sesión / KV); el cliente no depende de la respuesta.
    fetch("/api/lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }).catch(() => {})
  }

  /* ── Spark: analyze idea, instant reward (personalized without AI) ── */
  const reactionSeed = useRef(Math.random())

  const buildReaction = (): string => {
    if (!lab.signals.length) return ""
    const primary = lab.signals[0]
    const ideaShort = lab.idea.length > 60 ? lab.idea.slice(0, 60).trim() + "…" : lab.idea
    const pick = (arr: [string, string][]) => {
      const idx = Math.floor(reactionSeed.current * arr.length)
      return t(arr[idx][0], arr[idx][1])
    }

    // Múltiples variantes por señal — se elige una al azar para evitar repetición
    const templates: Record<string, [string, string][]> = {
      "SaaS B2B": [
        [
          `"${ideaShort}" — esto es exactamente lo que el mercado está pidiendo. Ya analicé 47 productos en ${primary} esta semana y el tuyo tiene algo que los demás no: un ángulo de diferenciación real. No te lo digo por decirlo — lo veo en los datos. Déjame mostrarte el camino.`,
          `"${ideaShort}" — this is exactly what the market is asking for. I've analyzed 47 products in ${primary} this week and yours has something the others don't: a real differentiation angle. I'm not just saying it — I see it in the data. Let me show you the path.`,
        ],
        [
          `Me gusta "${ideaShort}". El espacio ${primary} está lleno de productos genéricos, pero tu propuesta ataca un ángulo que la mayoría ignora. Ya empecé a mapear a tus competidores y hay brechas claras que puedes capitalizar. Quiero enseñarte dónde están.`,
          `I like "${ideaShort}". The ${primary} space is full of generic products, but your proposal attacks an angle most ignore. I've already started mapping your competitors and there are clear gaps you can capitalize on. I want to show you where they are.`,
        ],
        [
          `"${ideaShort}" cruza ${primary} con una perspectiva que pocos están tomando. Eso no pasa seguido. Ya identifiqué jugadores clave en tu espacio y encontré exactamente dónde puedes posicionarte mejor que ellos. Vamos a verlo juntos.`,
          `"${ideaShort}" crosses ${primary} with a perspective few are taking. That doesn't happen often. I've already identified key players in your space and found exactly where you can position yourself better than them. Let's look at it together.`,
        ],
      ],
      "Mobile": [
        [
          `"${ideaShort}" tiene algo que rara vez veo: timing perfecto. El espacio ${primary} en móvil está creciendo rápido y hay un hueco que nadie ha llenado bien. Ya identifiqué exactamente dónde está tu ventana de oportunidad. Quiero que veas lo que encontré.`,
          `"${ideaShort}" has something I rarely see: perfect timing. The ${primary} mobile space is growing fast and there's a gap no one has filled well. I've already identified exactly where your window of opportunity is. I want you to see what I found.`,
        ],
        [
          `Me gusta "${ideaShort}". En móvil, la experiencia lo es todo, y tu idea apunta justo donde los usuarios sienten más fricción en ${primary}. Hay una oportunidad real aquí. Déjame mostrarte el mapa completo.`,
          `I like "${ideaShort}". On mobile, experience is everything, and your idea points right where users feel the most friction in ${primary}. There's a real opportunity here. Let me show you the full map.`,
        ],
        [
          `"${ideaShort}" en ${primary} — buen ojo. La mayoría de las apps en este espacio resuelven el problema a medias. Tu enfoque tiene el ángulo correcto para diferenciarse. Ya estoy analizando a los competidores clave. Vamos adelante.`,
          `"${ideaShort}" in ${primary} — good eye. Most apps in this space solve the problem halfway. Your approach has the right angle to stand out. I'm already analyzing key competitors. Let's move forward.`,
        ],
      ],
      "E-commerce": [
        [
          `"${ideaShort}" — me gusta mucho esto. En ${primary}, el 80% compite por precio. Tú estás compitiendo por experiencia, y eso es exactamente donde se construyen marcas que dominan. Ya tengo el análisis de tus competidores y hay brechas enormes. Vamos a verlas.`,
          `"${ideaShort}" — I really like this. In ${primary}, 80% compete on price. You're competing on experience, and that's exactly where dominant brands are built. I already have your competitor analysis and there are massive gaps. Let's look at them.`,
        ],
        [
          `"${ideaShort}" apunta a algo clave en ${primary}: la experiencia de compra. Los datos muestran que los usuarios abandonan cuando la experiencia falla, no cuando el precio sube. Tu propuesta entra justo ahí. Quiero mostrarte lo que encontré.`,
          `"${ideaShort}" points to something key in ${primary}: the buying experience. Data shows users drop off when experience fails, not when prices rise. Your proposal enters right there. I want to show you what I found.`,
        ],
      ],
      "Automatización con IA": [
        [
          `"${ideaShort}" toca el área de mayor crecimiento en tecnología ahora mismo: ${primary}. Encontré oportunidades concretas que la mayoría no está viendo porque están distraídos con lo obvio. Tu idea apunta al ángulo correcto. Vamos con todo.`,
          `"${ideaShort}" touches the fastest-growing area in tech right now: ${primary}. I found concrete opportunities most people aren't seeing because they're distracted by the obvious. Your idea points at the right angle. Let's go all in.`,
        ],
        [
          `Me gusta "${ideaShort}". En ${primary}, hay mucho ruido pero poca ejecución real. Tu enfoque se diferencia porque ataca un problema específico, no la categoría entera. Eso es lo que funciona. Déjame mostrarte el análisis.`,
          `I like "${ideaShort}". In ${primary}, there's a lot of noise but little real execution. Your approach stands out because it tackles a specific problem, not the entire category. That's what works. Let me show you the analysis.`,
        ],
        [
          `"${ideaShort}" — esto me llamó la atención. ${primary} está saturado de herramientas genéricas, pero hay nichos sin atender que tu idea puede cubrir directamente. Ya empecé a mapear dónde están esos huecos. Quiero enseñártelos.`,
          `"${ideaShort}" — this caught my attention. ${primary} is saturated with generic tools, but there are underserved niches your idea can cover directly. I've already started mapping where those gaps are. I want to show you.`,
        ],
      ],
      "Fintech": [
        [
          `"${ideaShort}" — pocas veces veo una propuesta tan alineada con lo que el ecosistema ${primary} necesita. Hay brechas claras que tus competidores están ignorando. Ya mapeé el terreno y tengo el blueprint para posicionarte antes que ellos.`,
          `"${ideaShort}" — I rarely see a proposal so aligned with what the ${primary} ecosystem needs. There are clear gaps your competitors are ignoring. I've already mapped the terrain and have the blueprint to position you before them.`,
        ],
        [
          `Me gusta "${ideaShort}". En ${primary}, la confianza del usuario lo decide todo. Tu propuesta tiene un enfoque que genera esa confianza desde el primer contacto. Eso es difícil de encontrar. Ya analicé a los jugadores clave — hay espacio real para ti.`,
          `I like "${ideaShort}". In ${primary}, user trust decides everything. Your proposal has an approach that builds that trust from first contact. That's hard to find. I've already analyzed key players — there's real room for you.`,
        ],
      ],
      "HealthTech": [
        [
          `Tu idea sobre "${ideaShort}" no solo tiene potencial comercial — tiene impacto real. En ${primary}, la experiencia del usuario es donde se ganan las batallas y donde la mayoría falla. Ya identifiqué los puntos exactos donde puedes marcar la diferencia.`,
          `Your idea about "${ideaShort}" doesn't just have commercial potential — it has real impact. In ${primary}, user experience is where battles are won and where most fail. I've already identified the exact points where you can make a difference.`,
        ],
        [
          `"${ideaShort}" — esto me importa. En ${primary}, los productos que ganan son los que ponen al usuario primero, no a la tecnología. Tu enfoque hace exactamente eso. Hay un camino claro aquí y quiero mostrártelo.`,
          `"${ideaShort}" — this matters to me. In ${primary}, the products that win are those that put the user first, not the technology. Your approach does exactly that. There's a clear path here and I want to show it to you.`,
        ],
      ],
      "EdTech": [
        [
          `"${ideaShort}" — esto me enganchó. En ${primary}, el 90% se enfoca en el contenido y olvida la experiencia. Tú ya estás pensando diferente. Encontré ángulos de diferenciación que van a hacer que tu producto sea difícil de ignorar. Vamos.`,
          `"${ideaShort}" — this hooked me. In ${primary}, 90% focus on content and forget the experience. You're already thinking differently. I found differentiation angles that will make your product hard to ignore. Let's go.`,
        ],
        [
          `Me gusta "${ideaShort}". En ${primary}, el valor no está solo en lo que enseñas, sino en cómo lo entregas. Tu idea lo entiende. Ya estoy viendo oportunidades concretas que quiero compartirte. Vamos adelante.`,
          `I like "${ideaShort}". In ${primary}, value isn't just in what you teach, but how you deliver it. Your idea gets that. I'm already seeing concrete opportunities I want to share with you. Let's move forward.`,
        ],
        [
          `"${ideaShort}" en ${primary} — buen enfoque. La mayoría de las plataformas educativas se sienten iguales. La tuya tiene el potencial de romper ese molde. Encontré datos que lo confirman. Déjame mostrarte.`,
          `"${ideaShort}" in ${primary} — good approach. Most educational platforms feel the same. Yours has the potential to break that mold. I found data that confirms it. Let me show you.`,
        ],
      ],
    }

    const match = templates[primary]
    if (match) return pick(match)

    // Default fallback — variantes profesionales y cercanas
    const defaults: [string, string][] = [
      [
        `"${ideaShort}" — me gusta lo que veo aquí. Tu idea cruza ${lab.signals.join(" y ")}, y eso abre un espacio de oportunidad que pocos están atacando bien. Ya empecé a mapear competidores y hay huecos reales. Quiero mostrarte exactamente dónde están.`,
        `"${ideaShort}" — I like what I see here. Your idea crosses ${lab.signals.join(" and ")}, and that opens an opportunity space few are tackling well. I've already started mapping competitors and there are real gaps. I want to show you exactly where they are.`,
      ],
      [
        `"${ideaShort}" tiene un enfoque interesante. Combina ${lab.signals.join(" con ")} de una forma que no veo seguido. Ya estoy analizando el mercado y los primeros hallazgos son prometedores. Vamos a construir tu blueprint.`,
        `"${ideaShort}" has an interesting approach. It combines ${lab.signals.join(" with ")} in a way I don't see often. I'm already analyzing the market and the early findings are promising. Let's build your blueprint.`,
      ],
      [
        `Me gusta "${ideaShort}". Apunta a ${lab.signals.join(" y ")} con una perspectiva fresca. Hay competidores en ese espacio, pero también hay huecos claros que puedes aprovechar. Déjame mostrarte el panorama completo.`,
        `I like "${ideaShort}". It targets ${lab.signals.join(" and ")} with a fresh perspective. There are competitors in that space, but also clear gaps you can leverage. Let me show you the full picture.`,
      ],
    ]
    return pick(defaults)
  }

  const reaction = useTypewriter(
    phase === "reacting" ? buildReaction() : ""
  )

  const handleSpark = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = idea.trim()

    // Máximo 1500 caracteres
    if (trimmed.length > 1500) {
      setError(t(
        "Has superado el límite de 1.500 caracteres. Intenta resumir tu idea.",
        "You've exceeded the 1,500 character limit. Try summarizing your idea."
      ))
      return
    }

    // Mínimo 120 caracteres
    if (trimmed.length < 120) {
      setError(t(
        `Tu idea necesita más detalle para que el análisis sea útil. Describe qué problema resuelve, para quién y cómo. Mínimo 120 caracteres.`,
        `Your idea needs more detail for a useful analysis. Describe what problem it solves, for whom, and how. Minimum 120 characters.`
      ))
      return
    }

    // Validar que no sea texto basura / aleatorio
    const words = trimmed.split(/\s+/).filter(w => w.length > 1)
    const lowerWords = words.map(w => w.toLowerCase())
    const uniqueWords = new Set(lowerWords)

    // Menos de 8 palabras distintas → muy poco contenido real
    if (uniqueWords.size < 8) {
      setError(t("Necesito más contexto. Describe el problema, tu público y cómo lo resuelves.", "I need more context. Describe the problem, your audience, and how you solve it."))
      return
    }
    // Demasiada repetición (más del 50% palabras repetidas) → relleno
    const repetitionRatio = 1 - (uniqueWords.size / words.length)
    if (words.length > 10 && repetitionRatio > 0.5) {
      setError(t("Parece que el texto tiene mucha repetición. Cuéntame de forma natural qué quieres construir.", "The text seems to have a lot of repetition. Tell me naturally what you want to build."))
      return
    }
    // Detectar gibberish: consonantes consecutivas excesivas (ej: "werwerfcwsed")
    // Una palabra real rara vez tiene 4+ consonantes seguidas repetidamente
    const consonantHeavy = /[^aeiouáéíóúüñ\s\d]{4,}/gi
    const gibberishWords = words.filter(w => {
      const hits = w.match(consonantHeavy)
      return hits && hits.join("").length > w.length * 0.5
    })
    if (gibberishWords.length > words.length * 0.3) {
      setError(t("No logro entender tu idea. Intenta describirla como se la explicarías a un colega o amigo.", "I can't understand your idea. Try describing it as you would explain it to a colleague or friend."))
      return
    }
    // Detectar patrones repetitivos dentro de palabras (ej: "werwerwer", "aaabbb")
    const repetitivePattern = /(.{2,})\1{2,}/i
    const repetitiveWords = words.filter(w => repetitivePattern.test(w))
    if (repetitiveWords.length > 2) {
      setError(t("El texto no parece describir una idea real. Cuéntame qué quieres construir y por qué.", "The text doesn't seem to describe a real idea. Tell me what you want to build and why."))
      return
    }
    // Promedio de longitud de palabra < 2.5 → tecleo aleatorio corto
    const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / words.length
    if (avgWordLen < 2.5) {
      setError(t("No logro entender tu idea. Intenta describirla como se la explicarías a un colega.", "I can't understand your idea. Try describing it as you would explain it to a colleague."))
      return
    }
    // Verificar que al menos algunas palabras sean del diccionario común (ES/EN)
    const commonWords = /^(el|la|los|las|un|una|de|del|en|con|para|por|que|es|no|se|su|al|lo|the|a|an|of|in|to|for|and|is|it|on|my|app|web|plataforma|platform|producto|product|idea|usuario|user|cliente|client|servicio|service|problema|problem|mercado|market|negocio|business|vender|sell|crear|create|hacer|make|quiero|want|como|how|donde|where|cuando|when|personas|people|empresa|company|tienda|store|aplicación|sistema|system|herramienta|tool|software|datos|data|automatizar|automate|mejorar|improve|solución|solution|digital|online|móvil|mobile)$/i
    const realWordCount = lowerWords.filter(w => commonWords.test(w)).length
    if (realWordCount < 3) {
      setError(t("Tu texto no parece describir un producto o servicio. Explica tu idea con claridad: ¿qué hace y para quién?", "Your text doesn't seem to describe a product or service. Explain your idea clearly: what does it do and for whom?"))
      return
    }

    setError("")
    const signals = detectSignals(trimmed)
    persist({ idea: trimmed, signals })
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
    if (!retrieveMode && !consent) {
      setError(t("Necesitamos tu consentimiento para guardar tu análisis", "We need your consent to save your analysis"))
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
        const serverLab = data.lab as Lab | null
        if (serverLab && serverLab.startedAt) {
          // Retorno cross-device: análisis en marcha; hidratar desde el servidor.
          // Si NO venía en modo "recuperar", es que intentó iniciar una idea nueva
          // con un email que ya tiene propuesta → avisamos que solo hay una por email.
          setExistingNotice(!retrieveMode)
          const insight = RETURN_INSIGHTS[(serverLab.visits || 0) % RETURN_INSIGHTS.length]
          setReturnInsight(t(insight[0], insight[1]))
          const merged = { ...serverLab, email, visits: (serverLab.visits || 0) + 1 }
          labRef.current = merged
          setLab(merged)
          try { localStorage.setItem(LAB_KEY, JSON.stringify(merged)) } catch {}
          setBrief(serverLab.brief || "")
          setPrototype(serverLab.prototype || "")
          setPhase("return")
          fetch("/api/lab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(merged) }).catch(() => {})
        } else if (serverLab && serverLab.idea) {
          // Tiene propuesta guardada (idea + email) pero el motor no arrancó:
          // reanudar en el feed con lo que ya escribió, en vez de "no encontrado".
          setExistingNotice(!retrieveMode)
          const merged = { ...serverLab, email }
          labRef.current = merged
          setLab(merged)
          try { localStorage.setItem(LAB_KEY, JSON.stringify(merged)) } catch {}
          setProjectName(serverLab.projectName || "")
          setObjective(serverLab.objective || "")
          setAudience(serverLab.audience || "")
          setReferences(serverLab.references || "")
          setFeedStep(0)
          setPhase("feed")
        } else if (retrieveMode) {
          setShowNotFoundPopup(true)
          setPinInput(""); setError("")
        } else {
          persist({ email })
          setPhase("feed")
        }
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
      persist({ projectName, objective, audience, references, startedAt: Date.now(), lang, lastEmailedStage: -1 })
      setPhase("engine")
    }
  }

  /* ── Engine: generate the brief once, then let phases mature in real time ── */
  useEffect(() => {
    if (phase !== "engine") return
    let cancelled = false

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
        if (cancelled) return
        setBrief(data.brief || ""); setPrototype(data.prototype || "")
        // Persistir el brief en KV para que los correos (blueprint/final) lo incluyan.
        persist({ brief: data.brief || "", prototype: data.prototype || "" })
      } catch { /* mock fallback handled visually */ }
      if (cancelled) return
      // Asegurar que el lab (startedAt + brief) esté guardado en KV, luego
      // programar los correos diferidos de cada fase con QStash.
      try {
        await fetch("/api/lab", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(labRef.current),
        })
      } catch {}
      if (cancelled) return
      fetch("/api/uxbox/schedule-phases", { method: "POST" }).catch(() => {})
    })()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  /* ── Catch-up: al entrar al timeline, enviar los correos de las fases ya
     vencidas que falten (red de seguridad sin QStash o por mensajes perdidos). ── */
  useEffect(() => {
    if (phase !== "engine" && phase !== "return") return
    fetch("/api/uxbox/catch-up", { method: "POST" }).catch(() => {})
  }, [phase])

  const resetLab = () => {
    try { localStorage.removeItem(LAB_KEY) } catch {}
    setLab({ idea: "", signals: [] })
    setIdea(""); setEmail(""); setConsent(false); setPinInput(""); setProjectName("")
    setReferences(""); setObjective(""); setAudience(""); setFeedStep(0)
    setBrief(""); setPrototype(""); setError("")
    setRetrieveMode(false); setShowNotFoundPopup(false); setExistingNotice(false)
    setPhase("spark")
  }

  /* ── Timeline definition ── */
  const stages = [
    { icon: Sparkles, label: t("Idea inicial", "Initial idea"), time: "~10 min", insight: t("Idea capturada y estructurada.", "Idea captured and structured.") },
    { icon: Radar, label: t("Mercado detectado", "Market detected"), time: "~2 hrs", insight: t(`Señales: ${lab.signals.join(", ")}.`, `Signals: ${lab.signals.join(", ")}.`) },
    { icon: Target, label: t("Competidores", "Competitors"), time: "~3 hrs", insight: t("Mapeando jugadores y huecos del espacio…", "Mapping players and gaps in the space…") },
    { icon: Layers, label: t("Oportunidades UX", "UX opportunities"), time: "~2 hrs", insight: t("Encontré ángulos de diferenciación por experiencia.", "I found differentiation angles through experience.") },
    { icon: Cpu, label: t("Blueprint generado", "Blueprint generated"), time: "~10 min", insight: t("Tu definición de producto está lista.", "Your product definition is ready.") },
    { icon: Rocket, label: t("Siguiente paso: humano", "Next step: human"), time: "", insight: t("Te contactaremos, o agenda una llamada.", "We'll contact you, or book a call.") },
  ]

  // ── Live timeline: las fases maduran en tiempo real desde startedAt ──
  const engineStart = lab.startedAt
  const liveDone = engineStart ? doneStageByElapsed(engineStart, now) : -1 // última fase completada
  const activeIdx = Math.min(STAGE_COUNT - 1, liveDone + 1) // fase en curso (o final)
  const allDone = engineStart ? liveDone >= STAGE_COUNT - 1 : false
  const prevReadyMs = engineStart ? stageReadyAt(engineStart, liveDone) : now // fin de la fase previa
  const activeDurMs = (PHASES[activeIdx]?.durationMin || 1) * 60 * 1000
  const activeElapsedMs = Math.max(0, now - prevReadyMs)
  const activePct = Math.min(100, Math.round((activeElapsedMs / activeDurMs) * 100))
  const activeRemainMs = Math.max(0, activeDurMs - activeElapsedMs)

  // Registrar la finalización una sola vez (para historial/admin).
  useEffect(() => {
    if (!allDone || !engineStart || lab.completedAt) return
    persist({ completedAt: stageReadyAt(engineStart, STAGE_COUNT - 1) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, engineStart])

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
  const inputClass = "w-full px-4 py-3.5 rounded-xl border dark:border-white/25 border-foreground/20 dark:bg-white/5 bg-foreground/5 dark:text-white text-foreground placeholder:dark:text-white/35 placeholder:text-foreground/35 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[rgba(232,117,26,0.25)] resize-none text-sm transition-all"
  const blueprintItems = [
    {
      icon: FileSearch,
      title: t("Problema validable", "Validatable problem"),
      desc: t("Qué dolor vale la pena resolver primero.", "Which pain is worth solving first."),
    },
    {
      icon: Target,
      title: t("Usuario y contexto", "User and context"),
      desc: t("Para quién es, cuándo aparece la necesidad y qué lo frena.", "Who it is for, when the need appears, and what blocks them."),
    },
    {
      icon: Layers,
      title: t("Prioridades de producto", "Product priorities"),
      desc: t("Requisitos, riesgos y oportunidades ordenadas por impacto.", "Requirements, risks, and opportunities ranked by impact."),
    },
    {
      icon: Rocket,
      title: t("Siguiente experimento", "Next experiment"),
      desc: t("El paso mínimo para aprender antes de invertir en desarrollo.", "The smallest step to learn before investing in development."),
    },
  ]

  return (
    <section
      id="uxbox"
      className="relative py-20 md:py-32 px-6 overflow-hidden bg-[var(--surface-dark)] text-foreground transition-colors duration-300"
      aria-labelledby="uxbox-heading"
    >
      {/* ambient glows (Dark only) — overflow-hidden clips horizontally; vertical position kept inside */}
      <div className="absolute top-12 -right-40 w-[28rem] h-[28rem] rounded-full blur-[120px] pointer-events-none opacity-20 ambient-glow"
        style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute bottom-12 -left-40 w-[28rem] h-[28rem] rounded-full blur-[120px] pointer-events-none opacity-10 ambient-glow"
        style={{ background: "radial-gradient(circle, #2AABB3 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)", backgroundSize: "38px 38px" }} aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
            style={{ color: "var(--foreground)", borderColor: accentBorder, background: accentBg }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: ACCENT }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ACCENT }} />
            </span>
            {t("Motor de inteligencia de producto · en vivo", "Product intelligence engine · live")}
          </div>
          <h2 id="uxbox-heading" className="font-display font-bold text-4xl md:text-5xl dark:text-white text-foreground text-balance leading-tight">
            {phase === "return"
              ? t("Bienvenido de vuelta a tu análisis", "Welcome back to your analysis")
              : t("Enciende tu idea. Mira cómo evoluciona.", "Ignite your idea. Watch it evolve.")}
          </h2>
{/* description moved to spark right column */}
        </div>

        {/* ───────── SPARK ───────── */}
        {phase === "spark" && (
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
            {/* Left: Video + Blueprint cards */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <video autoPlay loop muted playsInline className="w-full h-auto">
                  <source src="/videos/uxbox.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-3">
                {blueprintItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="rounded-2xl border dark:border-white/10 border-foreground/10 dark:bg-white/[0.04] bg-foreground/[0.04] p-4">
                      <Icon size={16} className="mb-3" style={{ color: ACCENT }} />
                      <h3 className="text-sm font-semibold dark:text-white text-foreground">{item.title}</h3>
                      <p className="mt-1 text-xs dark:text-white/45 text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Description + Form */}
            <div className="flex flex-col gap-6">
              <p className="text-base dark:text-white/55 text-muted-foreground leading-relaxed">
                {t(
                  "UXBox es nuestro Generador de Requerimientos con IA y AI UX Brief Generator. Analiza tu idea —mercado, competidores y oportunidades UX— y te entrega un blueprint accionable en segundos.",
                  "UXBox is our AI Product Discovery tool and AI UX Brief Generator. It analyzes your idea —market, competitors, and UX opportunities— and delivers an actionable blueprint in seconds."
                )}
              </p>
              <form onSubmit={handleSpark} className="flex flex-col gap-4 animate-in fade-in duration-500" aria-describedby="spark-desc">
            <p id="spark-desc" className="sr-only">Formulario de inicio para describir y analizar tu idea de producto digital mediante nuestro generador con IA.</p>
            <div className="relative">
              <label htmlFor="spark-idea-input" className="sr-only">{t("Describe tu idea en una línea", "Describe your idea in one line")}</label>
              <textarea
                id="spark-idea-input"
                value={idea}
                maxLength={1500}
                onChange={(e) => { setIdea(e.target.value); setError("") }}
                placeholder={t("Describe tu idea: ¿qué problema resuelve, para quién y cómo funciona?", "Describe your idea: what problem does it solve, for whom, and how does it work?")}
                rows={8}
                className={`${inputClass} text-base pr-4`}
              />
              <span className={`absolute bottom-2.5 right-3.5 text-[11px] tabular-nums pointer-events-none ${idea.length >= 1500 ? "text-red-400" : idea.trim().length < 120 ? "text-orange-400/60" : "dark:text-white/30 text-foreground/30"}`}>
                {idea.length}/1.500 {t("caracteres", "chars")}
              </span>
            </div>
            {error && <p id="spark-error" className="text-xs text-red-400 font-medium" role="alert">{error}</p>}
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-95 hover:brightness-110"
              style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)", boxShadow: "0 8px 30px rgba(232,117,26,0.3)" }}>
              <Sparkles size={17} /> {t("Analizar mi idea", "Analyze my idea")}
            </button>
            <button
              type="button"
              onClick={() => { setRetrieveMode(true); setPhase("gate") }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border dark:border-white/15 border-foreground/15 dark:text-white/65 text-foreground/65 hover:dark:text-white hover:text-foreground hover:dark:border-white/30 hover:border-foreground/30 transition-all active:scale-95"
            >
              {t("Ya tengo una idea en marcha →", "I already have an idea in progress →")}
            </button>
            <p className="text-xs dark:text-white/30 text-muted-foreground/50 text-center">
              {t("Solo una propuesta activa por email", "Only one active proposal per email")}
            </p>
            <p className="text-xs dark:text-white/40 text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Activity size={12} /> <span style={{ color: ideasFlash ? "#E8751A" : "inherit", transition: "color 0.5s ease" }}>{ideasCount}</span> {t("ideas analizadas esta semana · resultado en minutos", "ideas analyzed this week · result in minutes")}
            </p>
              </form>
              {/* Human escape hatch — inside spark form column */}
              <div className="pt-4 border-t dark:border-white/10 border-foreground/10 text-center flex flex-col items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest dark:text-white/40 text-muted-foreground">{t("¿Prefieres hablar con un humano?", "Prefer to talk to a human?")}</span>
                <div className="flex items-center justify-center gap-5 text-sm">
                  <a href="https://wa.me/573054009505" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 dark:text-white/75 text-foreground/75 hover:dark:text-white hover:text-foreground transition-colors">
                    <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                  </a>
                  <span className="w-1 h-1 rounded-full dark:bg-white/20 bg-foreground/20" />
                  <BookingModal>
                    <button type="button" className="dark:text-white/75 text-foreground/75 hover:dark:text-white hover:text-foreground font-medium">{t("Agendar llamada", "Book a call")}</button>
                  </BookingModal>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────── REACTING (instant reward) ───────── */}
        {phase === "reacting" && (
          <div className="max-w-xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="rounded-2xl border p-6 backdrop-blur-sm animate-fade-in-up" style={{ borderColor: accentBorder, background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
                <Cpu size={13} /> {t("Reacción de la IA", "AI reaction")}
              </div>
              <p className="text-base dark:text-white/85 text-foreground leading-relaxed min-h-[3rem]">
                {reaction}<span className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: ACCENT }} />
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {lab.signals.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium border dark:border-white/15 border-foreground/15 dark:bg-white/5 bg-foreground/5 dark:text-white/80 text-foreground/80">{s}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setPhase("gate")} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-95 hover:brightness-110"
              style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
              <ShieldCheck size={17} /> {t("Asegurar mi análisis", "Secure my analysis")}
            </button>
            <button onClick={resetLab} className="text-xs dark:text-white/40 text-muted-foreground hover:dark:text-white hover:text-foreground transition-colors mx-auto">
              {t("Empezar con otra idea", "Start with another idea")}
            </button>
          </div>
        )}

        {/* ───────── GATE (email) ───────── */}
        {phase === "gate" && (
          <form onSubmit={handleGate} className="max-w-md mx-auto flex flex-col gap-5 animate-in fade-in duration-500" aria-describedby="gate-desc">
            <div className="flex flex-col gap-1 text-center">
              <h3 className="font-display font-bold text-xl dark:text-white text-foreground">
                {retrieveMode ? t("Recupera tu análisis", "Retrieve your analysis") : t("Asegura tu análisis", "Secure your analysis")}
              </h3>
              <p id="gate-desc" className="text-sm dark:text-white/55 text-muted-foreground">
                {retrieveMode
                  ? t("Ingresa el email con el que guardaste tu idea.", "Enter the email you used to save your idea.")
                  : t("Para no perder este análisis y poder volver cuando quieras.", "So you don't lose this analysis and can return anytime.")}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border dark:border-white/25 border-foreground/20 dark:bg-white/5 bg-foreground/5 px-3">
              <Mail size={16} className="dark:text-white/40 text-foreground/40 shrink-0" />
              <label htmlFor="gate-email-input" className="sr-only">{t("Correo electrónico", "Email address")}</label>
              <input type="email" id="gate-email-input" value={email} disabled={loading}
                aria-describedby="gate-error"
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                placeholder={t("nombre@empresa.com", "name@company.com")}
                className="w-full py-3.5 bg-transparent dark:text-white text-foreground placeholder:dark:text-white/35 placeholder:text-foreground/35 focus:outline-none text-sm" required />
            </div>
            {!retrieveMode && (
              <label className="flex items-start gap-2.5 text-xs dark:text-white/55 text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setError("") }} className="mt-0.5 accent-[#E8751A] w-4 h-4 shrink-0" />
                <span>{t("Acepto que MediaLab use mis datos para generar mi análisis, según la ", "I agree to let MediaLab use my data to generate my analysis, per the ")}
                  <Link href="/politica-de-privacidad" className="underline hover:dark:text-white hover:text-foreground">{t("política de privacidad", "privacy policy")}</Link>.</span>
              </label>
            )}
            {error && <p id="gate-error" className="text-xs text-red-400 font-medium" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
              {loading
                ? t("Enviando llave…", "Sending key…")
                : retrieveMode ? t("Verificar mi email →", "Verify my email →") : t("Acceder a mi análisis", "Access my analysis")}
              {!loading && <ArrowRight size={15} />}
            </button>
            {retrieveMode && (
              <button type="button" onClick={() => { setRetrieveMode(false); setPhase("spark"); setEmail(""); setError("") }}
                className="text-xs dark:text-white/40 text-muted-foreground hover:dark:text-white hover:text-foreground transition-colors text-center">
                {t("← Crear una idea nueva", "← Create a new idea")}
              </button>
            )}
          </form>
        )}

        {/* ───────── OTP ───────── */}
        {phase === "otp" && (
          <form onSubmit={handleOtp} className="max-w-md mx-auto flex flex-col gap-5 animate-in fade-in duration-500" aria-describedby="otp-desc">
            <div className="flex flex-col gap-1 text-center">
              <h3 className="font-display font-bold text-xl dark:text-white text-foreground">{t("Revisa tu correo", "Check your email")}</h3>
              <p id="otp-desc" className="text-sm dark:text-white/55 text-muted-foreground">{t("Te envié una llave de 4 dígitos a ", "I sent a 4-digit key to ")}<strong className="dark:text-white text-foreground">{email}</strong></p>
            </div>
            {isDemo && demoPin && (
              <div className="rounded-lg border border-dashed px-4 py-3 text-xs text-center" style={{ borderColor: accentBorder, background: accentBg }}>
                {t("Modo demo — tu llave es ", "Demo mode — your key is ")}<strong className="text-base tracking-widest" style={{ color: ACCENT }}>{demoPin}</strong>
              </div>
            )}
            <label htmlFor="otp-pin-input" className="sr-only">{t("Código de verificación de 4 dígitos", "4-digit verification code")}</label>
            <input type="text" id="otp-pin-input" inputMode="numeric" maxLength={4} value={pinInput}
              aria-describedby="otp-error"
              onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "")); setError("") }}
              placeholder={t("Ej: 4812", "E.g: 4812")} autoFocus
              className={`${inputClass} text-center tracking-[0.5em] font-bold text-2xl`} required />
            {error && <p id="otp-error" className="text-xs text-red-400 font-medium text-center" role="alert">{error}</p>}
            <div className="flex items-center justify-center gap-4 text-xs">
              <button type="button" onClick={handleResend} disabled={resending} className="flex items-center gap-1.5 dark:text-white/50 text-foreground/50 hover:dark:text-white hover:text-foreground disabled:opacity-50">
                <RotateCcw size={12} className={resending ? "animate-spin" : ""} /> {resending ? t("Reenviando…", "Resending…") : t("Reenviar llave", "Resend key")}
              </button>
              <span className="w-px h-3 dark:bg-white/20 bg-foreground/20" />
              <button type="button" onClick={() => { setPhase("gate"); setPinInput(""); setError("") }} className="dark:text-white/50 text-foreground/50 hover:dark:text-white hover:text-foreground">{t("Cambiar correo", "Change email")}</button>
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
            {existingNotice && (
              <div className="rounded-xl border p-4 flex items-start gap-2.5" style={{ borderColor: accentBorder, background: accentBg }}>
                <ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <p className="text-xs dark:text-white/70 text-foreground/70 leading-relaxed">
                  {t(
                    "Este correo ya tenía una propuesta, así que continuamos donde la dejaste. Solo permitimos una por email; para una idea distinta usa otro correo.",
                    "This email already had a proposal, so we're continuing where you left off. We allow only one per email; for a different idea use another email.",
                  )}
                </p>
              </div>
            )}
            {/* progress — step indicators */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs dark:text-white/50 text-muted-foreground">
                <span>{t("Definiendo tu producto", "Defining your product")}</span>
                <span className="font-semibold" style={{ color: ACCENT }}>{t(`Paso ${feedStep + 1} de ${feedFields.length}`, `Step ${feedStep + 1} of ${feedFields.length}`)}</span>
              </div>
              <div className="flex gap-1.5">
                {feedFields.map((_, i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden dark:bg-white/10 bg-foreground/10">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: i <= feedStep ? "100%" : "0%", background: "linear-gradient(90deg, #E8751A, #2AABB3)" }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-2 text-xs dark:text-white/55 text-muted-foreground">
                <Cpu size={14} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <span>{currentField.ai}</span>
              </div>
              <label htmlFor={`feed-${currentField.key}-input`} className="font-display font-bold text-lg dark:text-white text-foreground">{currentField.label}</label>
              <input
                type="text" id={`feed-${currentField.key}-input`} value={currentField.value} autoFocus
                aria-describedby="feed-error"
                onChange={(e) => { currentField.set(e.target.value); setError("") }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); advanceFeed() } }}
                placeholder={currentField.placeholder}
                className={inputClass}
              />
              {error && <p id="feed-error" className="text-xs text-red-400 font-medium" role="alert">{error}</p>}
            </div>

            <div className="flex gap-3">
              {feedStep > 0 && (
                <button onClick={() => { setFeedStep((s) => s - 1); setError("") }} className="flex-1 py-3.5 rounded-xl font-semibold text-sm border dark:border-white/15 border-foreground/15 dark:text-white/70 text-foreground/70 hover:dark:text-white hover:text-foreground transition-all flex items-center justify-center gap-2">
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
            {phase === "return" && existingNotice && (
              <div className="rounded-2xl border p-5 flex items-start gap-3" style={{ borderColor: accentBorder, background: accentBg }}>
                <ShieldCheck size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <div>
                  <p className="text-sm dark:text-white/85 text-foreground font-medium">
                    {t("Este correo ya tenía un análisis en marcha.", "This email already had an analysis in progress.")}
                  </p>
                  <p className="text-sm dark:text-white/55 text-muted-foreground mt-1">
                    {t(
                      "Solo permitimos una propuesta activa por email, así que te llevamos a ella. Si quieres analizar una idea distinta, usa otro correo.",
                      "We allow only one active proposal per email, so we brought you to it. To analyze a different idea, use another email.",
                    )}
                  </p>
                </div>
              </div>
            )}
            {phase === "return" && (
              <div className="rounded-2xl border p-5 flex items-start gap-3" style={{ borderColor: accentBorder, background: accentBg }}>
                <Activity size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <div>
                  <p className="text-sm dark:text-white/85 text-foreground font-medium">{t("Tu idea no se detuvo — el motor siguió trabajando por ti.", "Your idea didn't stop — the engine kept working for you.")}</p>
                  <p className="text-sm dark:text-white/55 text-muted-foreground mt-1">{returnInsight}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="flex flex-col">
              {stages.map((st, i) => {
                const done = i <= liveDone
                const active = i === activeIdx && !allDone
                const locked = i > activeIdx
                const Icon = st.icon
                return (
                  <div key={st.label} className={`relative flex gap-4 pb-7 ${locked ? "opacity-35 blur-[1px]" : "opacity-100"} transition-all duration-500`}>
                    {/* connector */}
                    {i < stages.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-px dark:bg-white/12 bg-foreground/12" style={{ background: done ? ACCENT : undefined }} aria-hidden="true" />
                    )}
                    {/* node */}
                    <div className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${done || active ? "" : "dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5"}`}
                      style={{
                        background: done ? "linear-gradient(135deg, var(--magenta), var(--orange))" : active ? accentBg : undefined,
                        borderColor: done || active ? accentBorder : undefined,
                      }}>
                      {done ? <CheckCircle2 size={18} className="text-white" />
                        : active ? <Loader2 size={16} className="animate-spin" style={{ color: ACCENT }} />
                        : i === stages.length - 1 ? <Lock size={15} className="dark:text-white/40 text-foreground/40" />
                        : <Circle size={14} className="dark:text-white/30 text-foreground/30" />}
                      {active && <span className="absolute inset-0 rounded-xl animate-ping" style={{ background: ACCENT, opacity: 0.18 }} />}
                    </div>
                    {/* content */}
                    <div className="flex flex-col gap-1 pt-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon size={13} className="dark:text-white/40 text-foreground/40" />
                        <h3 className="font-display font-bold text-sm dark:text-white text-foreground">{st.label}</h3>
                        {st.time && <span className="text-[10px] dark:text-white/35 text-muted-foreground font-medium">{st.time}</span>}
                      </div>
                      {(done || active) && (
                        active && i === 4 && !brief
                          ? <div className="mt-1 h-3 w-2/3 rounded dark:bg-white/10 bg-foreground/10 animate-pulse" />
                          : <p className="text-xs dark:text-white/55 text-muted-foreground leading-relaxed">{st.insight}</p>
                      )}
                      {active && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full dark:bg-white/10 bg-foreground/10 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${activePct}%`,
                                background: "linear-gradient(90deg, #E8751A, #2AABB3)",
                                transition: "width 1000ms linear",
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono tabular-nums shrink-0" style={{ color: ACCENT }}>
                            {fmtHM(activeRemainMs)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Blueprint preview — teaser con blur + CTA de conversión */}
            {liveDone >= 4 && brief && (() => {
              const paragraphs = brief.split("\n\n").filter(Boolean)
              const firstParagraph = paragraphs[0] || ""
              const restParagraphs = paragraphs.slice(1)
              return (
                <div className="rounded-2xl border dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5 p-6 flex flex-col gap-3 animate-in fade-in duration-500 relative overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest w-fit" style={{ color: ACCENT }}>
                    <Cpu size={12} /> {t("Tu blueprint", "Your blueprint")}
                  </div>
                  {/* Primera línea visible — hook de engagement */}
                  <p className="text-sm dark:text-white/85 text-foreground/85 leading-relaxed font-medium">{firstParagraph}</p>
                  {/* Resto difuso — no legible */}
                  {restParagraphs.length > 0 && (
                    <div className="flex flex-col gap-3 blur-[6px] select-none pointer-events-none" aria-hidden="true">
                      {restParagraphs.slice(0, 4).map((p, i) => (
                        <p key={i} className="text-sm dark:text-white/50 text-foreground/50 leading-relaxed">{p}</p>
                      ))}
                    </div>
                  )}
                  {/* Overlay degradado */}
                  <div className="absolute bottom-0 left-0 right-0 pt-24 pb-6 px-6 flex flex-col items-center gap-3 text-center" style={{ background: "linear-gradient(to bottom, transparent, rgba(var(--surface-dark-rgb, 15,15,15), 0.85) 40%, rgba(var(--surface-dark-rgb, 15,15,15), 0.98))" }}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
                      <Lock size={12} /> {t("Contenido reservado", "Reserved content")}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Deep-dive — matures in real time across visits (Phase 2) — siempre con blur + CTA */}
            {allDone && (
              <div className="rounded-2xl border dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5 p-6 flex flex-col gap-3 relative overflow-hidden animate-in fade-in duration-500">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest w-fit" style={{ color: ACCENT }}>
                  <FileSearch size={12} /> {t("Análisis profundo", "Deep analysis")}
                </div>
                {/* Primera línea visible como teaser */}
                <p className="text-sm dark:text-white/85 text-foreground/85 leading-relaxed font-medium">{deepFindings[0]}</p>
                {/* Resto difuso */}
                <div className="flex flex-col gap-2 blur-[6px] select-none pointer-events-none" aria-hidden="true">
                  {deepFindings.slice(1).map((f) => (
                    <p key={f} className="flex items-start gap-2 text-sm dark:text-white/50 text-foreground/50 leading-relaxed">
                      <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: ACCENT }} /> {f}
                    </p>
                  ))}
                  <p className="text-sm dark:text-white/50 text-foreground/50 leading-relaxed">{t("Estrategia de posicionamiento y modelo de monetización validado con datos de mercado en tiempo real.", "Positioning strategy and monetization model validated with real-time market data.")}</p>
                  <p className="text-sm dark:text-white/50 text-foreground/50 leading-relaxed">{t("Mapa de features priorizadas por impacto vs. esfuerzo con recomendaciones de lanzamiento.", "Feature map prioritized by impact vs. effort with launch recommendations.")}</p>
                </div>
                {/* Progress bar si aún no está listo */}
                {!deepReady && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full dark:bg-white/10 bg-foreground/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.round(((DEEP_DIVE_MS - Math.max(0, deepReadyAt - now)) / DEEP_DIVE_MS) * 100))}%`, background: "linear-gradient(90deg, #E8751A, #2AABB3)" }} />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums shrink-0" style={{ color: ACCENT }}>
                      <Clock size={12} /> {deepRemaining}
                    </div>
                  </div>
                )}
                {/* Overlay degradado */}
                <div className="absolute bottom-0 left-0 right-0 pt-20 pb-6 px-6 flex flex-col items-center gap-3 text-center" style={{ background: "linear-gradient(to bottom, transparent, rgba(var(--surface-dark-rgb, 15,15,15), 0.85) 35%, rgba(var(--surface-dark-rgb, 15,15,15), 0.98))" }}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
                    <Lock size={12} /> {t("Análisis completo reservado", "Full analysis reserved")}
                  </div>
                </div>
              </div>
            )}

            {/* Unlock CTA */}
            {allDone ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-sm dark:text-white/60 text-muted-foreground">
                  {t(
                    "Tu análisis está listo. El siguiente paso es humano, te contactaremos por el correo electrónico que nos dejaste, pero si no quieres esperar, agenda una llamada.",
                    "Your analysis is ready. The next step is human — we'll contact you at the email you left us, but if you don't want to wait, book a call."
                  )}
                </p>
                <BookingModal>
                  <button type="button" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all active:scale-95 hover:brightness-110 shadow-lg"
                    style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)", boxShadow: "0 6px 24px rgba(232,117,26,0.35)" }}>
                    <Rocket size={14} /> {t("Agenda una llamada", "Book a call")}
                  </button>
                </BookingModal>
                <button onClick={resetLab} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm dark:text-white/60 text-foreground/60 border dark:border-white/15 border-foreground/15 hover:dark:text-white hover:text-foreground hover:dark:border-white/30 hover:border-foreground/30 transition-all active:scale-95">
                  {t("Cerrar", "Close")}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5 px-5 py-4 flex items-center gap-3 text-sm dark:text-white/60 text-muted-foreground">
                <Loader2 size={15} className="animate-spin shrink-0" style={{ color: ACCENT }} />
                {t("Cruzando tu idea con +2.000 patrones de producto…", "Cross-referencing your idea with 2,000+ product patterns…")}
              </div>
            )}
          </div>
        )}

        {/* ───────── NOT FOUND POPUP ───────── */}
        {showNotFoundPopup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            onClick={() => setShowNotFoundPopup(false)}
          >
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
            <div
              className="relative z-10 max-w-sm w-full rounded-2xl border p-7 flex flex-col gap-5 text-center"
              style={{ borderColor: accentBorder, background: "var(--surface-dark)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center border"
                style={{ background: accentBg, borderColor: accentBorder }}>
                <Mail size={20} style={{ color: ACCENT }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-lg dark:text-white text-foreground">
                  {t("Email no encontrado", "Email not found")}
                </h3>
                <p className="text-sm dark:text-white/60 text-muted-foreground leading-relaxed">
                  {t(
                    "Tu email está incorrecto o todavía no tienes una idea en marcha. Crea una ahora, es rápido.",
                    "Your email is incorrect or you don't have an active idea yet. Create one now — it's quick."
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => { setShowNotFoundPopup(false); setRetrieveMode(false); setPhase("spark"); setEmail(""); setError("") }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 hover:brightness-110"
                  style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}
                >
                  <Sparkles size={14} /> {t("Crear mi idea ahora", "Create my idea now")}
                </button>
                <button
                  onClick={() => { setShowNotFoundPopup(false); setPinInput(""); setError(""); setPhase("gate") }}
                  className="text-xs dark:text-white/45 text-muted-foreground hover:dark:text-white hover:text-foreground transition-colors"
                >
                  {t("Intentar con otro email", "Try a different email")}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
