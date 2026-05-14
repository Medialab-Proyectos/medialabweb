"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const sections = [
  { id: "problema", label: "El Problema" },
  { id: "diferencia", label: "La Diferencia" },
  { id: "metodologia", label: "Metodología" },
  { id: "programa", label: "Programa" },
  { id: "transformacion", label: "Resultado" },
  { id: "herramientas", label: "Herramientas" },
  { id: "testimonios", label: "Testimonios" },
  { id: "faq", label: "FAQ" },
  { id: "reservar", label: "Reservar" },
]

export function CourseSectionNav() {
  const [active, setActive] = useState("")
  const [visible, setVisible] = useState(false)
  const sectionRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map())

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // IntersectionObserver for accurate section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRefs.current.set(entry.target.id, entry)
        })

        // Find the section most visible in viewport
        let bestId = ""
        let bestRatio = 0

        sectionRefs.current.forEach((entry, id) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestId = id
          }
        })

        // If no section has high ratio, pick the one closest to top
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

        if (bestId) setActive(bestId)
      },
      {
        rootMargin: "-120px 0px -40% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.5],
      }
    )

    // Observe all sections
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 md:top-20 left-0 right-0 z-40 border-b border-white/[0.04] backdrop-blur-xl"
          style={{ background: 'rgba(10,10,14,0.92)' }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-300 ${
                    active === section.id
                      ? "text-white bg-white/[0.1]"
                      : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
