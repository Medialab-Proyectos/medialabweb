"use client"

import { useEffect, useState } from "react"
import { Radio, Clock, RefreshCw } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Barra "viva" del especial: sticky bajo el header. Muestra estado del radar,
 * última actualización y un contador al próximo análisis (4:00 a.m. y 11:00 a.m.
 * Colombia, UTC-5). Genera expectativa y retorno. Bilingüe, mobile-first,
 * respeta prefers-reduced-motion.
 */
export function NextMatchBar({ updatedAt }: { updatedAt?: string }) {
  const { t, lang } = useLanguage()
  const [countdown, setCountdown] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      // 4:00 y 11:00 a.m. Colombia = 09:00 y 16:00 UTC.
      const targets = [9, 16].map((hour) => {
        const target = new Date(now)
        target.setUTCHours(hour, 0, 0, 0)
        if (target.getTime() <= now.getTime()) target.setUTCDate(target.getUTCDate() + 1)
        return target
      })
      const target = targets.sort((a, b) => a.getTime() - b.getTime())[0]
      const diff = target.getTime() - now.getTime()
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      setCountdown(`${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`)
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  const updated = updatedAt
    ? new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
      }).format(new Date(updatedAt))
    : null

  return (
    <div className="sticky top-16 z-40 bg-neutral-900/95 backdrop-blur-sm md:top-20">
      <div className="mx-auto flex max-w-5xl items-center gap-x-5 gap-y-1 overflow-x-auto px-6 py-2 text-xs">
        <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[var(--magenta)]">
          <Radio size={13} className="motion-safe:animate-pulse" />
          {t("Radar en vivo", "Radar live")}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[#fff]/70">
          <Clock size={12} />
          {t("Próximo análisis del radar en", "Next radar analysis in")}{" "}
          <strong className="tabular-nums text-[#fff]">{countdown}</strong>
        </span>
        {updated && (
          <span className="hidden shrink-0 items-center gap-1.5 text-[#fff]/70 sm:inline-flex">
            <RefreshCw size={12} />
            {t("Última actualización", "Last update")}: <span className="text-[#fff]">{updated}</span>
          </span>
        )}
      </div>
    </div>
  )
}
