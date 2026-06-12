"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Quote, Flame, ExternalLink, GraduationCap, TrendingUp, Newspaper, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { DailyRadarReport } from "@/src/lib/experience-radar"
import { RadarSweep } from "./radar-visuals"
import { SpanishRadarDashboard } from "./spanish-radar-dashboard"

const GENERIC_IMAGE = "/images/experience-radar-vs.png"

const SOURCE_ORDER: Record<string, number> = {
  fifa: 0,
  latingoles: 1,
  reddit: 2,
  "google-trends": 3,
  "app-review": 4,
  manual: 5,
}

/**
 * Vista editorial de Experience Radar para un fan curioso de UX. Portal:
 * hero con radar → nota destacada (imagen del partido → El momento → World
 * Experience Index con lección de comportamiento → El sentir → La lección →
 * banner). Bilingüe (chrome y framing de MediaLab). La noticia ("El momento")
 * se mantiene en español. Garrett (estrategia→superficie) + nudges éticos.
 */
export function RadarArticleView({ report }: { report: DailyRadarReport }) {
  const { t, lang } = useLanguage()
  const { article, editorialSignals } = report

  const heroSignal = report.signals.find((s) => s.imageUrl)
  const [imgSrc, setImgSrc] = useState(heroSignal?.imageUrl || GENERIC_IMAGE)

  const hasTrendBuzz = report.signals.some((s) => s.rising)
  const orderedSources = [...report.sources].sort(
    (a, b) => (SOURCE_ORDER[a.type] ?? 9) - (SOURCE_ORDER[b.type] ?? 9),
  )

  return (
    <>
      {/* ───────── HERO con radar a la derecha ───────── */}
      <section className="relative overflow-hidden border-b border-border bg-[var(--surface-dark)] pt-10 pb-12 md:pt-14 md:pb-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 md:grid-cols-12">
          <div className="relative z-10 md:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 px-3 py-1 text-xs font-semibold text-[var(--cyan)]">
              {t("Especial Mundial 2026", "World Cup 2026 Special")}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">Experience Radar</h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {t(
                "No seguimos el marcador. Analizamos la experiencia: cómo el Mundial revela el comportamiento del fan, la emoción y la experiencia digital.",
                "We don't follow the score. We analyze the experience: how the World Cup reveals fan behavior, emotion and digital experience.",
              )}
            </p>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[260px] md:col-span-5">
            <RadarSweep className="h-auto w-full" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6">
        {/* ───────── NOTA DESTACADA (la más reciente) ───────── */}
        <article className="pt-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
            {t("Especial · nota más reciente", "Special · latest note")}
          </p>

          {/* Imagen del partido */}
          <figure className="relative mt-3 overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={imgSrc}
              alt={t("Imagen representativa del partido", "Representative image of the match")}
              className="h-60 w-full object-cover md:h-80"
              loading="eager"
              onError={() => setImgSrc(GENERIC_IMAGE)}
            />
            {hasTrendBuzz && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-[#fff] backdrop-blur-sm">
                <TrendingUp size={13} /> {t("Miles de fans buscaron esto hoy", "Thousands of fans searched this today")}
              </span>
            )}
          </figure>

          {/* El momento del que todos hablan — SIEMPRE en español (es la noticia) */}
          <section id="momento" className="mt-8 scroll-mt-32">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Newspaper size={20} className="text-[var(--cyan)]" /> El momento del que todos hablan
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{editorialSignals.matchSummary}</p>
            {editorialSignals.controversyOrHighlight && (
              <blockquote className="mt-4 rounded-xl border-l-4 border-[var(--magenta)] bg-[var(--magenta)]/[0.05] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
                  <Flame size={13} /> Polémica / momento destacado
                </p>
                <p className="mt-2 text-sm leading-relaxed">{editorialSignals.controversyOrHighlight}</p>
              </blockquote>
            )}
            <p className="mt-3 text-[11px] text-muted-foreground">Lo que reporta la fuente — referencia, no copia.</p>
          </section>

          {/* World Experience Index + lección de comportamiento */}
          <section id="indice" className="mt-12 scroll-mt-32">
            <h2 className="text-2xl font-bold">World Experience Index</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "La salud de la experiencia digital del día, de 0 a 100.",
                "The day's digital experience health, from 0 to 100.",
              )}
            </p>
            <div className="mt-5">
              <SpanishRadarDashboard report={report} />
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--cyan)]">
                {t("La lección, más allá de los datos", "The lesson, beyond the data")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(
                  "La emoción colectiva mueve expectativas. Cuando una experiencia frustra o sorprende, el comportamiento del fan se amplifica —y esa misma conducta empuja el ánimo y la conversación alrededor del marcador—. Leerlo enseña algo sobre las personas: bajo incertidumbre reaccionamos en manada, sobrevaloramos lo más reciente y buscamos certeza inmediata. Diseñar para esa conducta, con claridad y estado visible, es lo que separa una experiencia que retiene de una que frustra.",
                  "Collective emotion moves expectations. When an experience frustrates or surprises, fan behavior amplifies —and that same behavior pushes the mood and the conversation around the scoreboard—. Reading it teaches something about people: under uncertainty we react as a herd, overweight what's most recent and crave immediate certainty. Designing for that behavior, with clarity and visible status, is what separates an experience that retains from one that frustrates.",
                )}
              </p>
            </div>
          </section>

          {/* El sentir del fan */}
          <section id="sentir" className="mt-12 scroll-mt-32 rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Heart size={20} className="text-[var(--magenta)]" /> {t("El sentir del fan", "How fans felt")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{article.whatFansSay}</p>
          </section>

          {/* La lección de hoy */}
          <motion.section
            id="leccion"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-12 scroll-mt-32 rounded-2xl border-l-4 border-[var(--cyan)] bg-[var(--cyan)]/[0.06] p-6"
          >
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--cyan)]">
              <Quote size={14} /> {t("La lección de hoy", "Today's lesson")}
            </p>
            <p className="mt-2 text-lg font-medium leading-relaxed">
              {t(
                "Cuando hay incertidumbre, las personas buscan validación inmediata. Las experiencias que muestran contexto y estado claro reducen la frustración y construyen confianza.",
                "Under uncertainty, people seek immediate validation. Experiences that show context and clear status reduce frustration and build trust.",
              )}
            </p>
            {lang === "es" && article.medialabInsight && (
              <p className="mt-3 text-sm italic text-muted-foreground">“{article.medialabInsight}”</p>
            )}
          </motion.section>
        </article>

        {/* ───────── Banner CTA con imagen de fondo ───────── */}
        <aside className="relative mt-12 overflow-hidden rounded-2xl border border-[var(--magenta)]/30">
          <img src={GENERIC_IMAGE} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
          <div className="relative z-10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {t("⚽ Aprende UX observando el Mundial", "⚽ Learn UX by watching the World Cup")}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85">
              {t(
                "Los eventos deportivos más grandes del mundo son laboratorios de comportamiento humano. Aprende UX Research, diseño de producto e IA aplicada con MediaLab.",
                "The world's biggest sporting events are labs of human behavior. Learn UX Research, product design and applied AI with MediaLab.",
              )}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                {t("Promo Mundial · 15% con", "World Cup promo · 15% with")} <strong>MUNDIAL15</strong>
              </span>
              <Link
                href="/curso"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[var(--magenta)] hover:text-white"
              >
                <GraduationCap size={16} /> {t("Quiero aprender UX", "I want to learn UX")}
              </Link>
            </div>
          </div>
        </aside>

        {/* ───────── Fuentes ordenadas ───────── */}
        <section className="mt-12">
          <h2 className="text-xl font-bold">{t("Fuentes consultadas", "Sources")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("Ordenadas por confiabilidad. Referencia y enlace, no copia.", "Ordered by reliability. Reference and link, not a copy.")}
          </p>
          <ol className="mt-4 grid gap-2">
            {orderedSources.map((source, i) => (
              <li key={source.id}>
                <Link
                  href={source.url || "#"}
                  target={source.url ? "_blank" : undefined}
                  rel={source.url ? "noopener noreferrer nofollow" : undefined}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:border-[var(--cyan)]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold tabular-nums text-muted-foreground">{i + 1}.</span>
                    <span className="font-medium">{source.name}</span>
                  </span>
                  {source.url ? <ExternalLink size={12} className="text-muted-foreground" /> : null}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
