"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Radar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Menú secundario de secciones para Experience Radar. Como en el home:
 *  - NO es una miga de pan; es un menú de las secciones de la página.
 *  - Solo aparece cuando se hace scroll hacia abajo (oculto al inicio).
 *  Sticky bajo el header. Bilingüe.
 */
export function StickyRadarNav() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links: { label: string; href: string }[] = [
    { label: t("El momento", "The moment"), href: "#momento" },
    { label: t("Índice de experiencia", "Experience index"), href: "#indice" },
    { label: t("El sentir del fan", "How fans felt"), href: "#sentir" },
    { label: t("La lección", "The lesson"), href: "#leccion" },
    { label: t("Especiales", "Specials"), href: "#especiales" },
  ]

  return (
    <div
      className={`sticky top-16 md:top-20 z-40 border-b border-border/60 bg-[var(--surface-dark)]/95 backdrop-blur-sm transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-2.5">
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-foreground/80">
          <Radar size={13} className="text-[var(--cyan)]" /> Experience Radar
        </span>
        <nav
          aria-label={t("Secciones de la página", "Page sections")}
          className="flex items-center gap-4 overflow-x-auto"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-xs font-medium text-muted-foreground transition-colors hover:text-[var(--cyan)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
