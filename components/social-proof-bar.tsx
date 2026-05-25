"use client"

import { useEffect, useState, useRef } from "react"
import { X, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

// Doherty Threshold: toda interacción visible en < 400ms
const ENTER_MS       = 250   // entrada spring
const LEAVE_MS       = 200   // salida ease-in
const FIRST_DELAY_MS = 5000  // delay post-scroll (primera aparición)
const REAPPEAR_MS    = 40000 // espera entre notificaciones — no invasivo
const AUTO_HIDE_MS   = 10000 // auto-dismiss si el usuario lo ignora

const POOL: [string, string][] = [
  ["Startup en México: el doble de usuarios activos desde el primer día",       "Mexico startup doubled its active users from day one"],
  ["Plataforma financiera lanzó nuevas funciones cuatro veces más rápido",      "Fintech platform launched new features four times faster"],
  ["App de salud llegó a sus primeros clientes reales en solo 8 semanas",       "Health app reached its first real customers in just 8 weeks"],
  ["Tienda online en Chile: un tercio más de visitantes completaron su compra", "Chilean online store: a third more visitors completed their purchase"],
  ["Plataforma educativa: 28% más de nuevos usuarios terminaron el tutorial",   "Ed-tech: 28% more new users completed the onboarding tutorial"],
  ["Startup en Argentina triplicó los usuarios que renovaron su suscripción",   "Argentine startup tripled the users who renewed their subscription"],
  ["Fintech en Colombia pasó de quejas a recomendaciones en 60 días",           "Colombian fintech turned complaints into referrals in 60 days"],
  ["Empresa B2B: sus clientes ven resultados un 40% más rápido que antes",      "B2B company: clients see results 40% faster than before"],
  ["Startup de México: de idea a clientes pagando en solo 6 semanas",           "Mexico startup: from idea to paying customers in just 6 weeks"],
  ["App de bienestar: más de la mitad de usuarios siguen activos al 3er mes",   "Wellness app: more than half of users still active at month three"],
]

const INDICES = POOL.map((_, i) => i)

function pickRandom(exclude: number): number {
  const pool = INDICES.filter(i => i !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function SocialProofBar() {
  const [phase, setPhase]     = useState<"idle" | "shown" | "leaving">("idle")
  const [idx, setIdx]         = useState(0)
  const [entered, setEntered] = useState(false)
  const lastIdxRef            = useRef(-1)
  const hasShownRef           = useRef(false)
  const { t } = useLanguage()

  // Idle: primera vez → espera scroll; luego → espera REAPPEAR_MS automáticamente
  useEffect(() => {
    if (phase !== "idle") return

    if (hasShownRef.current) {
      const timer = setTimeout(() => {
        const next = pickRandom(lastIdxRef.current)
        lastIdxRef.current = next
        setIdx(next)
        setPhase("shown")
      }, REAPPEAR_MS)
      return () => clearTimeout(timer)
    }

    let timer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      if (window.scrollY > 600) {
        window.removeEventListener("scroll", onScroll)
        timer = setTimeout(() => {
          hasShownRef.current = true
          const next = pickRandom(lastIdxRef.current)
          lastIdxRef.current = next
          setIdx(next)
          setPhase("shown")
        }, FIRST_DELAY_MS)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      clearTimeout(timer)
    }
  }, [phase])

  // Shown: doble RAF para animar entrada + auto-dismiss
  useEffect(() => {
    if (phase !== "shown") return
    setEntered(false)
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true))
    )
    const timer = setTimeout(() => setPhase("leaving"), AUTO_HIDE_MS)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [phase, idx])

  // Leaving: animar salida → volver a idle (idle se encarga del reappear)
  useEffect(() => {
    if (phase !== "leaving") return
    setEntered(false)
    const timer = setTimeout(() => setPhase("idle"), LEAVE_MS)
    return () => clearTimeout(timer)
  }, [phase])

  const dismiss = () => {
    if (phase === "shown") setPhase("leaving")
  }

  if (phase === "idle") return null

  const [es, en] = POOL[idx]
  const isLeaving = phase === "leaving"

  const wrapperStyle: React.CSSProperties = {
    opacity:   entered ? 1 : 0,
    transform: entered ? "translateY(0)" : isLeaving ? "translateY(6px)" : "translateY(16px)",
    transition: isLeaving
      ? `opacity ${LEAVE_MS}ms ease-in, transform ${LEAVE_MS}ms ease-in`
      : `opacity ${ENTER_MS}ms cubic-bezier(0.22,1,0.36,1), transform ${ENTER_MS}ms cubic-bezier(0.22,1,0.36,1)`,
  }

  return (
    <div
      className="fixed bottom-6 left-6 z-40 hidden md:flex"
      style={wrapperStyle}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={t("Caso de éxito verificado", "Verified success case")}
    >
      <div
        className="flex items-center gap-2 px-3.5 py-2 rounded-full shadow-2xl"
        style={{
          background: "oklch(0.18 0 0)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
          aria-hidden="true"
        >
          <TrendingUp size={10} className="text-white" />
        </div>

        <p className="text-xs font-medium whitespace-nowrap" style={{ color: "rgba(255,255,255,0.88)" }}>
          {t(es, en)}
        </p>

        <button
          onClick={dismiss}
          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-0.5"
          style={{
            color: "rgba(255,255,255,0.4)",
            transition: "color 120ms ease, background 120ms ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)" }}
          aria-label={t("Cerrar", "Close")}
        >
          <X size={9} />
        </button>
      </div>
    </div>
  )
}
