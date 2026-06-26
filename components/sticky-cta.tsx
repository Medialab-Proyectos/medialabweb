"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { BookingModal } from "./booking-modal"
import { useLanguage } from "@/lib/language-context"

interface StickyCTAProps {
  /** When set, renders as an anchor to this ID instead of opening the BookingModal */
  scrollToId?: string
  labelEs?: string
  labelEn?: string
}

export function StickyCTA({ scrollToId, labelEs, labelEn }: StickyCTAProps) {
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.4
      setVisible(window.scrollY > threshold)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  const label = t(
    labelEs ?? "Agenda 30 min gratis",
    labelEn ?? "Book 30 min free"
  )

  const btnClass =
    "flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[var(--magenta)] text-white text-[15px] font-semibold shadow-[0_10px_28px_-8px_rgba(232,117,26,0.55)] active:scale-[0.98] transition-transform"

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!scrollToId) return
    const el = document.getElementById(scrollToId)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="px-4 py-3">
        {scrollToId ? (
          <a href={`#${scrollToId}`} onClick={handleAnchorClick} title={label} className={btnClass}>
            {label}
            <ArrowRight size={16} />
          </a>
        ) : (
          <BookingModal>
            <button type="button" className={btnClass}>
              {label}
              <ArrowRight size={16} />
            </button>
          </BookingModal>
        )}
      </div>
    </div>
  )
}
