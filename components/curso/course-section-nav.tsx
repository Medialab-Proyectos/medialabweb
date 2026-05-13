"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero
      setVisible(window.scrollY > window.innerHeight * 0.7)

      // Detect active section
      const scrollPos = window.scrollY + 200
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el && el.offsetTop <= scrollPos) {
          setActive(sections[i].id)
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 md:top-20 left-0 right-0 z-40 border-b border-white/[0.04] bg-[var(--surface-dark)]/90 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-300 ${
                    active === section.id
                      ? "text-white bg-white/[0.08]"
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
