"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Submenú de contenido de la NOTA de partido (igual patrón que el home): sticky bajo el
 * header, aparece al hacer scroll, resalta la sección activa y hace scroll suave hacia el
 * ancla. «Radar» lleva a la gráfica; «Predicción» lleva a la Ruta emocional del hincha (más
 * abajo). Solo muestra las secciones que existen en el DOM (p. ej. «Aprendizajes» solo en
 * notas finalizadas).
 */
export function MatchNoteNav() {
  const { t } = useLanguage()
  const [active, setActive] = useState("")
  const [visible, setVisible] = useState(false)
  const [ids, setIds] = useState<string[]>([])
  const navScrollRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const entriesRef = useRef<Map<string, IntersectionObserverEntry>>(new Map())

  const sections = [
    { id: "resumen", label: t("Resumen", "Summary") },
    { id: "radar", label: t("Radar", "Radar") },
    { id: "prediccion", label: t("Predicción", "Prediction") },
    { id: "hinchadas", label: t("Hinchadas", "Fans") },
    { id: "aprendizajes", label: t("Aprendizajes", "Lessons") },
    { id: "fuentes", label: t("Fuentes", "Sources") },
  ]

  // Solo conserva las secciones que de verdad existen en esta nota (orden estable).
  useEffect(() => {
    setIds(sections.filter((s) => document.getElementById(s.id)).map((s) => s.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shown = sections.filter((s) => ids.includes(s.id))

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Centra el item activo dentro del carrusel horizontal del menú.
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

  // Detección de sección activa por IntersectionObserver.
  useEffect(() => {
    if (!ids.length) return
    const observer = new IntersectionObserver(
      (obsEntries) => {
        obsEntries.forEach((e) => entriesRef.current.set(e.target.id, e))
        let bestId = ""
        let bestTop = -Infinity
        entriesRef.current.forEach((e, id) => {
          if (e.isIntersecting && e.boundingClientRect.top <= 160 && e.boundingClientRect.top > bestTop) {
            bestTop = e.boundingClientRect.top
            bestId = id
          }
        })
        if (!bestId) {
          let closest = Infinity
          entriesRef.current.forEach((e, id) => {
            if (e.isIntersecting && Math.abs(e.boundingClientRect.top) < closest) {
              closest = Math.abs(e.boundingClientRect.top)
              bestId = id
            }
          })
        }
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
          bestId = ids[ids.length - 1]
        }
        if (bestId) setActive(bestId)
      },
      { rootMargin: "-120px 0px -20% 0px", threshold: [0, 0.1, 0.25, 0.5] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 110
    window.scrollTo({ top, behavior: "smooth" })
  }, [])

  if (shown.length < 2) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 md:top-20 left-0 right-0 z-40 border-b border-foreground/[0.1] bg-background/95 md:bg-background/90 md:backdrop-blur-xl"
        >
          <div className="mx-auto max-w-3xl px-2 sm:px-4">
            <div className="flex items-center gap-1 py-2.5">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label={t("Volver al inicio", "Back to top")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/[0.1] bg-foreground/[0.05] text-foreground/60 transition-all hover:bg-foreground/[0.1] hover:text-foreground sm:hidden"
              >
                <ArrowUp size={14} />
              </button>
              <div ref={navScrollRef} className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
                {shown.map((section) => (
                  <a
                    key={section.id}
                    ref={(el) => {
                      if (el) linkRefs.current.set(section.id, el)
                    }}
                    href={`#${section.id}`}
                    onClick={(e) => handleClick(e, section.id)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-300 ${
                      active === section.id
                        ? "bg-foreground/[0.12] text-foreground dark:bg-white/[0.12]"
                        : "text-foreground/55 hover:bg-foreground/[0.06] hover:text-foreground/80 dark:text-foreground/50 dark:hover:bg-white/[0.06]"
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
