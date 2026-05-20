"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function SocialProofBar() {
  const [current, setCurrent] = useState(0)
  const [show, setShow] = useState(false)
  const { t } = useLanguage()

  const recentActivities = [
    {
      company: t("Equipo FinTech en Bogotá", "FinTech team in Bogotá"),
      action: t("redujo su discovery de 3 meses a 3 semanas", "reduced discovery from 3 months to 3 weeks"),
      time: t("Caso reciente", "Recent case"),
    },
    {
      company: t("SaaS B2B en México", "B2B SaaS in Mexico"),
      action: t("aumentó activación de usuarios 40%", "increased user activation by 40%"),
      time: t("Caso reciente", "Recent case"),
    },
    {
      company: t("HealthTech startup", "HealthTech startup"),
      action: t("validó su MVP con usuarios reales en días", "validated their MVP with real users in days"),
      time: t("Caso reciente", "Recent case"),
    },
    {
      company: t("E-commerce en Chile", "E-commerce in Chile"),
      action: t("mejoró conversión 35% con rediseño UX", "improved conversion 35% with UX redesign"),
      time: t("Caso reciente", "Recent case"),
    },
  ]

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
    }, 8000)
    return () => clearInterval(interval)
  }, [show, recentActivities.length])

  if (!show) return null

  const activity = recentActivities[current]

  return (
    <div
      className="fixed bottom-6 left-6 z-40 animate-slide-up hidden md:block"
      role="complementary"
      aria-label={t("Casos de éxito recientes", "Recent success stories")}
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
