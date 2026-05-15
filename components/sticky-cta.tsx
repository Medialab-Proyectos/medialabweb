"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { BookingModal } from "./booking-modal"
import { useLanguage } from "@/lib/language-context"

export function StickyCTA() {
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

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="px-4 py-3">
        <BookingModal>
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[var(--magenta)] text-white text-[15px] font-semibold shadow-[0_10px_28px_-8px_rgba(232,117,26,0.55)] active:scale-[0.98] transition-transform"
          >
            {t("Agenda 30 min gratis", "Book 30 min free")}
            <ArrowRight size={16} />
          </button>
        </BookingModal>
      </div>
    </div>
  )
}
