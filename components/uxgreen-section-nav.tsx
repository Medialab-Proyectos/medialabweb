"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function UXGreenSectionNav() {
  const [active, setActive] = useState("")
  const [visible, setVisible] = useState(false)
  const sectionRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map())
  const navScrollRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const { t } = useLanguage()

  const sections = [
    { id: "manifesto", label: t("El problema", "The problem") },
    { id: "pillars", label: t("Dimensiones", "Dimensions") },
    { id: "calculator", label: "Analyzer" },
    { id: "process", label: t("Proceso", "Process") },
    { id: "faq", label: "FAQ" },
    { id: "cta", label: t("Empezar", "Start") },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll nav to keep active item in view
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {/* Back to top */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label={t("Volver al inicio", "Back to top")}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#00BFA6]/30 bg-[#00BFA6]/[0.08] text-[#00BFA6] hover:bg-[#00BFA6]/[0.16] transition-all"
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
                        ? "text-[#00BFA6] bg-[#00BFA6]/[0.12]"
                        : "text-foreground/55 dark:text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.06]"
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
