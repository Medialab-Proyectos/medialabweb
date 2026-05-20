"use client"

import { useLanguage } from "@/lib/language-context"

export function SkipToContent() {
  const { t } = useLanguage()

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg focus:text-sm focus:font-semibold"
    >
      {t("Saltar al contenido principal", "Skip to main content")}
    </a>
  )
}
