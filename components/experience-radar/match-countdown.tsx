"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock3 } from "lucide-react"

const LIVE_WINDOW_MS = 2 * 60 * 60 * 1000

export function MatchCountdown({ kickoffAt, overlay = false }: { kickoffAt: string; overlay?: boolean }) {
  const kickoff = useMemo(() => new Date(kickoffAt).getTime(), [kickoffAt])
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (!Number.isFinite(kickoff) || now === null) return null

  const remaining = kickoff - now
  const isLive = remaining <= 0 && now < kickoff + LIVE_WINDOW_MS

  if (remaining <= 0) {
    return (
      <div className={overlay
        ? "inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/25 bg-black/80 px-4 py-2 text-sm font-semibold text-[#fff] shadow-lg backdrop-blur-md"
        : "mt-4 inline-flex items-center gap-2 rounded-xl border border-[#F97316]/40 bg-[#F97316]/10 px-4 py-2 text-sm font-semibold text-[#F97316]"}>
        <Clock3 size={16} /> {isLive ? "Partido en vivo" : "El partido ya comenzó"}
      </div>
    )
  }

  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  return (
    <div className={overlay
      ? "inline-block w-fit max-w-full rounded-xl border border-white/20 bg-black/80 px-3 py-2 text-[#fff] shadow-xl backdrop-blur-md"
      : "mt-4 rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.06] px-4 py-3"}>
      <p className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide ${overlay ? "text-[#fff]" : "text-[var(--cyan)]"}`}>
        <Clock3 size={13} /> El partido comienza en
      </p>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums" aria-live="polite">
        {days > 0 && <TimeUnit value={days} label={days === 1 ? "día" : "días"} overlay={overlay} />}
        <TimeUnit value={hours} label="h" overlay={overlay} />
        <TimeUnit value={minutes} label="min" overlay={overlay} />
        <TimeUnit value={seconds} label="s" overlay={overlay} />
      </div>
    </div>
  )
}

function TimeUnit({ value, label, overlay }: { value: number; label: string; overlay: boolean }) {
  return (
    <span className={`text-xs ${overlay ? "text-[#fff]/80" : "text-muted-foreground"}`}>
      <strong className={`text-base sm:text-lg ${overlay ? "text-[#fff]" : "text-foreground"}`}>{String(value).padStart(2, "0")}</strong> {label}
    </span>
  )
}
