"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"
import { BookingModal } from "./booking-modal"

export function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 40% of viewport height
      const threshold = window.innerHeight * 0.4
      setVisible(window.scrollY > threshold)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (dismissed || !visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none md:hidden">
      <div className="relative flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-foreground text-background shadow-2xl pointer-events-auto">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold">¿Listo para empezar?</p>
          <p className="text-xs opacity-70">Agenda una llamada gratuita</p>
        </div>
        <div className="flex items-center gap-2">
          <BookingModal>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--magenta)] text-white hover:brightness-110 transition-all active:scale-95"
            >
              Hablemos
              <ArrowRight size={14} />
            </button>
          </BookingModal>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-full hover:bg-background/10 transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} className="opacity-60" />
          </button>
        </div>
      </div>
    </div>
  )
}
