"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"

const recentActivities = [
  { company: "Startup fintech", action: "completó sprint de discovery", time: "hace 2 horas" },
  { company: "Cliente enterprise", action: "lanzó nueva plataforma", time: "ayer" },
  { company: "Empresa de salud", action: "inició auditoría UX", time: "hace 2 días" },
  { company: "Marca de retail", action: "desplegó app móvil", time: "hace 3 días" },
]

export function SocialProofBar() {
  const [current, setCurrent] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show after scroll
    const handleScroll = () => {
      if (window.scrollY > 600 && !show) setShow(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [show])

  useEffect(() => {
    if (!show) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % recentActivities.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [show])

  if (!show) return null

  const activity = recentActivities[current]

  return (
    <div
      className="fixed bottom-6 left-6 z-40 animate-slide-up hidden md:block"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border shadow-xl max-w-xs">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
        >
          <CheckCircle2 size={18} className="text-white" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {activity.company} <span className="text-muted-foreground font-normal">{activity.action}</span>
          </p>
          <p className="text-xs text-muted-foreground">{activity.time}</p>
        </div>
      </div>
    </div>
  )
}
