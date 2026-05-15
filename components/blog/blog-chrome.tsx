"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, Clock, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function BlogChromeBackLink() {
  const { t, localized } = useLanguage()
  return (
    <Link
      href={localized("/blog")}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft size={14} /> {t("Volver al blog", "Back to blog")}
    </Link>
  )
}

export function BlogChromeMeta({
  dateEs,
  dateEn,
  readMin,
}: {
  dateEs: string
  dateEn: string
  readMin: number
}) {
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
      <span className="flex items-center gap-1">
        <Calendar size={13} /> {t(dateEs, dateEn)}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={13} /> {readMin} {t("min de lectura", "min read")}
      </span>
    </div>
  )
}

export function BlogChromeEnNotice() {
  const { lang } = useLanguage()
  if (lang !== "en") return null
  return (
    <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 px-4 py-3 text-sm text-foreground">
      <Globe size={16} className="text-[var(--cyan)] shrink-0 mt-0.5" />
      <p className="leading-relaxed">
        <span className="font-semibold">English version coming soon.</span>{" "}
        <span className="text-muted-foreground">
          The article below is in Spanish — the original language it was written in. We are working on the English translation.
        </span>
      </p>
    </div>
  )
}

export function BlogChromeAuthorLine() {
  const { t } = useLanguage()
  return (
    <p className="text-sm text-muted-foreground/60 mt-8 italic">
      — {t("Por MediaLab Ingeniería.", "By MediaLab Ingeniería.")}
    </p>
  )
}

export function BlogChromeCTA({
  headlineEs,
  headlineEn,
  subEs,
  subEn,
  ctaEs,
  ctaEn,
  href = "/#contact",
  gradient = "linear-gradient(90deg, #E8751A, #c65a10)",
}: {
  headlineEs: string
  headlineEn: string
  subEs: string
  subEn: string
  ctaEs: string
  ctaEn: string
  href?: string
  gradient?: string
}) {
  const { t, localized } = useLanguage()
  return (
    <div className="rounded-2xl border border-border p-8 flex flex-col md:flex-row items-center gap-6 bg-card">
      <div className="flex-1">
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          {t(headlineEs, headlineEn)}
        </h3>
        <p className="text-sm text-muted-foreground">{t(subEs, subEn)}</p>
      </div>
      <Link
        href={href.startsWith("#") || href.startsWith("http") ? href : localized(href)}
        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white"
        style={{ background: gradient }}
      >
        {t(ctaEs, ctaEn)} <ArrowRight size={14} />
      </Link>
    </div>
  )
}
