"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const COOKIE_KEY = "cookie_consent"

export function CookieConsent() {
  const { t, localized } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY)
      if (!stored) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try { localStorage.setItem(COOKIE_KEY, "accepted") } catch {}
    setVisible(false)
  }

  const reject = () => {
    try { localStorage.setItem(COOKIE_KEY, "rejected") } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9999] p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-lg mx-auto md:mx-0 md:ml-6 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-sm font-semibold text-foreground">
            {t("Usamos cookies", "We use cookies")}
          </p>
          <button
            onClick={reject}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {t(
            "Este sitio utiliza cookies esenciales y de analítica para mejorar tu experiencia. Puedes leer más en nuestra ",
            "This site uses essential and analytics cookies to improve your experience. You can read more in our "
          )}
          <Link href={localized("/politica-de-privacidad")} className="text-[var(--magenta)] hover:underline">
            {t("política de privacidad", "privacy policy")}
          </Link>.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={accept}
            className="flex-1 rounded-lg bg-[var(--magenta)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {t("Aceptar", "Accept")}
          </button>
          <button
            onClick={reject}
            className="flex-1 rounded-lg border border-border/50 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            {t("Rechazar", "Reject")}
          </button>
        </div>
      </div>
    </div>
  )
}
