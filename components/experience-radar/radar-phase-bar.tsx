"use client"

import { useState } from "react"
import Link from "next/link"
import { Target, Zap, Brain, Share2, Check, Newspaper } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRadarPhase } from "./radar-phase-context"
import type { RadarViewMode } from "./match-phase-radar"

/**
 * Barra inferior flotante de la NOTA. Contiene:
 *  - Las fases (Antes / Durante / Predicción) que cambian el radar EN SITIO (sin scroll);
 *    el botón activo toma el color de su polígono en la gráfica.
 *  - Un botón de compartir (menú nativo; respaldo: copiar enlace).
 *  - Un botón para volver al portal del especial.
 * Las fases no disponibles (p. ej. predicción en una previa) salen deshabilitadas.
 */
const PHASE_ITEMS: Array<{
  key: RadarViewMode
  es: string
  en: string
  icon: typeof Target
  color: string
}> = [
  { key: "expectativa", es: "Antes del partido", en: "Before", icon: Target, color: "#14B8A6" },
  { key: "realidad", es: "Durante el partido", en: "During", icon: Zap, color: "#F97316" },
  { key: "percepcion", es: "Pronóstico", en: "Forecast", icon: Brain, color: "#8B5CF6" },
]

export function RadarPhaseBar({ shareTitle }: { shareTitle: string }) {
  const { t, localized } = useLanguage()
  const ctx = useRadarPhase()
  const [copied, setCopied] = useState(false)
  if (!ctx) return null
  const { phase, setPhase, available } = ctx

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const data = { title: shareTitle, text: `${shareTitle} — Experience Radar`, url }
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El usuario canceló o el navegador no lo permitió.
    }
  }

  const pill =
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:text-sm"

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3">
      <div className="flex max-w-[calc(100vw-1.5rem)] items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/95 p-1.5 shadow-2xl ring-1 ring-black/10 backdrop-blur-md dark:border-white/15 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PHASE_ITEMS.map(({ key, es, en, icon: Icon, color }) => {
          const disabled = !available.includes(key)
          const isActive = phase === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => !disabled && setPhase(key)}
              disabled={disabled}
              aria-pressed={isActive}
              title={disabled ? t("Disponible cuando avance el partido", "Available as the match progresses") : t(es, en)}
              className={`${pill} ${
                isActive
                  ? "text-white shadow-md"
                  : disabled
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "text-foreground/80 hover:bg-muted"
              }`}
              style={isActive ? { backgroundColor: color } : undefined}
            >
              <Icon size={15} />
              <span className={isActive ? "" : "hidden sm:inline"}>{t(es, en)}</span>
            </button>
          )
        })}

        <span className="mx-0.5 h-6 w-px shrink-0 bg-border" aria-hidden />

        <button
          type="button"
          onClick={share}
          title={t("Compartir", "Share")}
          aria-label={t("Compartir", "Share")}
          className={`${pill} text-foreground/80 hover:bg-[var(--cyan)]/15 hover:text-[var(--cyan)]`}
        >
          {copied ? <Check size={15} className="text-[#16A34A]" /> : <Share2 size={15} />}
          <span className="hidden sm:inline">{copied ? t("Copiado", "Copied") : t("Compartir", "Share")}</span>
        </button>

        <Link
          href={localized("/experience-radar/mundial-2026")}
          title={t("Volver al especial", "Back to the special")}
          aria-label={t("Volver al especial", "Back to the special")}
          className={`${pill} text-foreground/80 hover:bg-[var(--cyan)]/15 hover:text-[var(--cyan)]`}
        >
          <Newspaper size={15} />
          <span className="hidden sm:inline">{t("Especial", "Special")}</span>
        </Link>
      </div>
    </div>
  )
}
