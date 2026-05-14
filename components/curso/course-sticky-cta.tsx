"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

export function CourseStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.4
      setVisible(window.scrollY > threshold)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById("registro")
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="px-4 py-3">
        <a
          href="#registro"
          onClick={handleClick}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[var(--magenta)] text-white text-[15px] font-semibold shadow-[0_10px_28px_-8px_rgba(232,117,26,0.55)] active:scale-[0.98] transition-transform"
        >
          Inscribirme al curso
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  )
}
