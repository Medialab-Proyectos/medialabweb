"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Props {
  pageEs: string
  pageEn: string
}

export function StickyServiceBreadcrumb({ pageEs, pageEn }: Props) {
  const { t, localized } = useLanguage()

  return (
    <div className="mt-16 md:mt-20 sticky top-16 md:top-20 z-40 bg-[var(--surface-dark)]/95 backdrop-blur-sm border-b border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-6 py-2.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
          <Link href={localized("/") + "#services"} className="hover:text-white transition-colors">
            {t("Inicio", "Home")}
          </Link>
          <ChevronRight size={11} className="text-white/30" />
          <Link href={localized("/servicios")} className="hover:text-white transition-colors">
            {t("Servicios", "Services")}
          </Link>
          <ChevronRight size={11} className="text-white/30" />
          <span className="text-white/80">{t(pageEs, pageEn)}</span>
        </nav>
      </div>
    </div>
  )
}
