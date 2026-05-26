"use client"

import { useEffect, useCallback } from "react"
import { useLanguage } from "@/lib/language-context"

const CALENDLY_URL = "https://calendly.com/hello-medialab/30min"

export function BookingModal({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage()

  useEffect(() => {
    if (document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) return
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.head.appendChild(script)
  }, [])

  const openCalendly = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const locale = lang === "es" ? "es" : "en"
    const url = `${CALENDLY_URL}?primary_color=E8751A&locale=${locale}`

    if (typeof window !== "undefined" && (window as any).Calendly) {
      ;(window as any).Calendly.initPopupWidget({ url })
    } else {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer")
    }
  }, [lang])

  return (
    <span onClick={openCalendly} style={{ cursor: "pointer" }}>
      {children}
    </span>
  )
}
