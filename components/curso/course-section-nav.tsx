"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseSectionNav() {
  const [active, setActive] = useState("")
  const [visible, setVisible] = useState(false)
  const sectionRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map())
  const navScrollRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const { t } = useLanguage()

  const sections = [
    { id: "problema", label: t("El Problema", "The Problem") },
    { id: "objetivo", label: t("Objetivo", "Objective") },
    { id: "audiencia", label: t("¿Para quién?", "Who's it for?") },
    { id: "testimonios", label: t("Testimonios", "Testimonials") },
    { id: "diferencia", label: t("La Diferencia", "The Difference") },
    { id: "programa", label: t("Programa", "Program") },
    { id: "transformacion", label: t("Resultado", "Outcome") },
    { id: "herramientas", label: t("Herramientas", "Tools") },
    { id: "faq", label: "FAQ" },
    { id: "comunidad", label: t("Comunidad", "Community") },
    { id: "registro", label: t("Reservar", "Reserve") },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll nav to active item
  useEffect(() => {
    if (!active || !navScrollRef.current) return
    const linkEl = linkRefs.current.get(active)
    if (!linkEl) return
    const nav = navScrollRef.current
    const navRect = nav.getBoundingClientRect()
    const linkRect = linkEl.getBoundingClientRect()
    const scrollLeft = linkRect.left - navRect.left - navRect.width / 2 + linkRect.width / 2 + nav.scrollLeft
    nav.scrollTo({ left: scrollLeft, behavior: "smooth" })
  }, [active])

  // IntersectionObserver for accurate section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRefs.current.set(entry.target.id, entry)
        })

        const sectionOrder = sections.map((s) => s.id)
        let bestId = ""
        let bestTop = -Infinity

        sectionRefs.current.forEach((entry, id) => {
          if (entry.isIntersecting) {
            const top = entry.boundingClientRect.top
            if (top <= 140 && top > bestTop) {
              bestTop = top
              bestId = id
            }
          }
        })

        if (!bestId) {
          let closestDist = Infinity
          sectionRefs.current.forEach((entry, id) => {
            if (entry.isIntersecting) {
              const dist = Math.abs(entry.boundingClientRect.top)
              if (dist < closestDist) {
                closestDist = dist
                bestId = id
              }
            }
          })
        }

        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
          bestId = sectionOrder[sectionOrder.length - 1]
        }

        if (bestId) setActive(bestId)
      },
      {
        rootMargin: "-100px 0px -20% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const navbarHeight = 120
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight
      window.scrollTo({ top, behavior: "smooth" })
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 md:top-20 left-0 right-0 z-40 border-b border-foreground/[0.1] backdrop-blur-xl bg-background/90"
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="flex items-center gap-1 py-2.5">
              {/* Back to top — mobile */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label={t("Volver al inicio", "Back to top")}
                className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-foreground/[0.1] bg-foreground/[0.05] text-foreground/60 hover:text-foreground hover:bg-foreground/[0.1] transition-all"
              >
                <ArrowUp size={14} />
              </button>

              {/* Nav links */}
              <div ref={navScrollRef} className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    ref={(el) => { if (el) linkRefs.current.set(section.id, el) }}
                    href={`#${section.id}`}
                    onClick={(e) => handleClick(e, section.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-300 ${
                      active === section.id
                        ? "text-foreground bg-foreground/[0.12] dark:bg-white/[0.12]"
                        : "text-foreground/55 dark:text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
