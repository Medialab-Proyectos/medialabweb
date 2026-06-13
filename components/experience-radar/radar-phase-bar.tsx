"use client"

import { Target, Zap, Brain } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRadarPhase } from "./radar-phase-context"
import type { RadarViewMode } from "./match-phase-radar"

/**
 * Barra inferior de la NOTA: botones de fase (Antes del partido / Durante el partido
 * / Predicción) que cambian el radar en sitio, sin hacer scroll. Reemplaza al
 * RadarFloatingMenu dentro de la nota. Las fases no disponibles (p. ej. predicción en
 * una previa) se muestran deshabilitadas. Fija abajo-centro, móvil y desktop.
 */
const ITEMS: Array<{ key: RadarViewMode; es: string; en: string; icon: typeof Target }> = [
  { key: "expectativa", es: "Antes del partido", en: "Before the match", icon: Target },
  { key: "realidad", es: "Durante el partido", en: "During the match", icon: Zap },
  { key: "percepcion", es: "Predicción", en: "Prediction", icon: Brain },
]

export function RadarPhaseBar() {
  const { t } = useLanguage()
  const ctx = useRadarPhase()
  if (!ctx) return null
  const { phase, setPhase, available } = ctx

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/85 p-1.5 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
        {ITEMS.map(({ key, es, en, icon: Icon }) => {
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
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                isActive
                  ? "bg-[var(--cyan)] text-white shadow-md"
                  : disabled
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "text-foreground/80 hover:bg-[var(--cyan)]/15 hover:text-[var(--cyan)]"
              }`}
            >
              <Icon size={15} />
              <span className={isActive ? "" : "hidden sm:inline"}>{t(es, en)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
