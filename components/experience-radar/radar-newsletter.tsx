"use client"

import { useState } from "react"
import { Mail, Check, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Bloque de suscripción del Experience Radar: solo pide el correo y avisa de nuevas
 * notas/noticias. Publica en `/api/experience-radar/subscribe`. Bilingüe.
 */
export function RadarNewsletter() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === "loading") return
    setState("loading")
    try {
      const res = await fetch("/api/experience-radar/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "experience-radar-nota" }),
      })
      setState(res.ok ? "done" : "error")
    } catch {
      setState("error")
    }
  }

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-[var(--cyan)]/30 bg-gradient-to-br from-card to-[var(--cyan)]/[0.06] p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)]">
          <Mail size={18} />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold">
            {t("Suscríbete al radar", "Subscribe to the radar")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "Déjanos tu correo y te avisamos cuando publiquemos nuevas notas y noticias de interés.",
              "Leave your email and we'll let you know when we publish new notes and news of interest.",
            )}
          </p>
        </div>
      </div>

      {state === "done" ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#16A34A]">
          <Check size={16} /> {t("¡Listo! Te avisaremos de nuevas notas.", "Done! We'll notify you about new notes.")}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("tu@correo.com", "you@email.com")}
            aria-label={t("Tu correo", "Your email")}
            className="w-full flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--cyan)]"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--cyan)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
          >
            {state === "loading" ? <Loader2 size={15} className="animate-spin" /> : null}
            {t("Suscribirme", "Subscribe")}
          </button>
        </form>
      )}

      {state === "error" && (
        <p className="mt-2 text-xs text-[#DC2626]">
          {t("No pudimos registrar tu correo. Intenta de nuevo.", "We couldn't save your email. Please try again.")}
        </p>
      )}

      <p className="mt-3 text-[11px] text-muted-foreground/70">
        {t(
          "Sin spam. Solo nuevas notas del radar y aprendizajes de experiencia.",
          "No spam. Only new radar notes and experience learnings.",
        )}
      </p>
    </section>
  )
}
