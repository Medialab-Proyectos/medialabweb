"use client"

import { createContext, useCallback, useContext, useEffect, ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

type Lang = "es" | "en"

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (es: string, en: string) => string
  /** Prefix a route with `/en` when the current locale is English. */
  localized: (href: string) => string
}

const LangContext = createContext<LangContextValue>({
  lang: "es",
  setLang: () => {},
  t: (es) => es,
  localized: (href) => href,
})

function detectLang(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es"
}

function stripLocale(pathname: string): string {
  if (pathname === "/en") return "/"
  if (pathname.startsWith("/en/")) return pathname.slice(3) // remove "/en"
  return pathname
}

function prefixWithLocale(href: string, lang: Lang): string {
  // Only prefix in-app paths. Hashes and external links pass through.
  if (lang !== "en") return href
  if (!href.startsWith("/")) return href
  if (href.startsWith("/en") && (href.length === 3 || href[3] === "/")) return href
  if (href === "/") return "/en"
  return `/en${href}`
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/"
  const router = useRouter()
  const lang = detectLang(pathname)

  const t = useCallback(
    (es: string, en: string) => (lang === "es" ? es : en),
    [lang]
  )

  const localized = useCallback(
    (href: string) => prefixWithLocale(href, lang),
    [lang]
  )

  const setLang = useCallback(
    (newLang: Lang) => {
      if (newLang === lang) return
      const base = stripLocale(pathname)
      const target = newLang === "en" ? prefixWithLocale(base, "en") : base
      router.push(target)
    },
    [lang, pathname, router]
  )

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t, localized }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LangContext)
}
