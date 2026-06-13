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
      // 4 actualizaciones diarias (hora Colombia → UTC, UTC-5):
      //  11:00 a. m. = 16:00 · 4:30 p. m. = 21:30 · 6:00 p. m. = 23:00 · 11:30 p. m. = 04:30
      const schedule = [
        [16, 0],
        [21, 30],
        [23, 0],
        [4, 30],
      ]
      const targets = schedule.map(([hour, minute]) => {
        const target = new Date(now)
        target.setUTCHours(hour, minute, 0, 0)
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
    <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/95 md:top-20">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-1 px-6 py-2 text-xs">
        <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[var(--magenta)]">
          <Radio size={13} className="motion-safe:animate-pulse" />
          {t("Radar en vivo", "Radar live")}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-foreground/70 dark:text-[#fff]/70">
          <Clock size={12} />
          {t("Próximo análisis en", "Next analysis in")}{" "}
          <strong className="tabular-nums text-foreground dark:text-[#fff]">{countdown}</strong>
        </span>
        {updated && (
          <span className="hidden shrink-0 items-center gap-1.5 text-foreground/70 sm:inline-flex dark:text-[#fff]/70">
            <RefreshCw size={12} />
            {t("Última actualización", "Last update")}: <span className="text-foreground dark:text-[#fff]">{updated}</span>
          </span>
        )}
      </div>
    </div>
  )
}
