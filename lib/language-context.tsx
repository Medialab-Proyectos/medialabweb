"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Lang = "es" | "en"

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (es: string, en: string) => string
}

const LangContext = createContext<LangContextValue>({
  lang: "es",
  setLang: () => {},
  t: (es) => es,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es")
  const t = (es: string, en: string) => (lang === "es" ? es : en)
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LangContext)
}
