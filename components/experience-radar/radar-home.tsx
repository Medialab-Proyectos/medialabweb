"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ScanLine, ArrowRight, Radio, Archive } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { RadarSweep } from "./radar-visuals"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

/**
 * Página 1 de Experience Radar: HERO + sección "Especiales".
 *
 * Mantiene el hero (marca + radar animado a la derecha) y debajo presenta los
 * especiales como tarjetas que entran al portal del especial (/mundial-2026).
 * El portal con la nota destacada, buscador y filtros vive en la Página 2.
 * Bilingüe vía useLanguage; mobile-first; respeta prefers-reduced-motion (RadarSweep).
 */
export function RadarHome() {
  const { t, localized } = useLanguage()

  return (
    <>
      {/* ───────────────── HERO (estructura tipo home) ───────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[var(--surface-dark)] text-foreground">
        {/* Rejilla de puntos */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          aria-hidden
        />
        {/* Viñeta */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, var(--vignette-color) 100%)" }}
          aria-hidden
        />
        {/* Halos animados SOLO en desktop */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-24 hidden h-72 w-72 rounded-full border border-[var(--cyan)]/15 md:block"
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.38, 0.18] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-[-6rem] hidden h-96 w-96 rounded-full bg-[var(--magenta)]/[0.07] blur-3xl md:block"
          animate={{ x: [0, -28, 0], y: [0, -18, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/3 top-16 hidden h-40 w-40 rounded-full bg-[#E8751A]/[0.08] blur-2xl md:block"
          animate={{ y: [0, 24, 0], scale: [1, 1.18, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Barrido de radar animado, sutil, centrado detrás del titular */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(120vw,820px)] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.14] md:opacity-[0.22]"
        >
          <RadarSweep className="h-auto w-full" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pt-28 pb-20 text-center">
          {/* Chip */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-3.5 py-1.5 text-xs font-medium text-foreground/75 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/75">
            <ScanLine size={13} style={{ color: "var(--cyan)" }} />
            {t("Señales · Emoción · Comportamiento humano", "Signals · Emotion · Human behavior")}
          </div>

          {/* Titular */}
          <h1 className="font-display text-5xl font-bold leading-[1.04] text-balance text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] dark:text-white">
            Experience{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #E8772E 0%, #1A8A9E 100%)" }}
            >
              Radar
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl dark:text-white/65">
            {t(
              "Un radar de señales, emociones y comportamiento humano para entender cómo reaccionan las personas ante grandes eventos. No seguimos el marcador: analizamos la experiencia.",
              "A radar of signals, emotions and human behavior to understand how people react to major events. We don't follow the score: we analyze the experience.",
            )}
          </p>

          {/* CTAs (mismo estilo que la home) */}
          <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href={localized("/experience-radar/mundial-2026")}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-semibold text-[#fff] shadow-lg transition-all duration-200 hover:brightness-110 active:scale-95 sm:w-auto"
              style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}
            >
              {t("Ver análisis del Mundial 2026", "View World Cup 2026 analysis")} <ArrowRight size={16} />
            </Link>
            <a
              href="#especiales"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/15 px-8 py-4 text-[15px] font-semibold text-foreground/75 transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground active:scale-95 sm:w-auto dark:border-white/15 dark:text-white/75 dark:hover:border-white/30 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {t("Ver especiales", "See specials")}
            </a>
          </div>

          {/* Línea editorial */}
          <p className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--magenta)] motion-safe:animate-pulse" />
            {t(
              "Contenido editorial independiente · No somos patrocinadores oficiales del torneo.",
              "Independent editorial content · We are not official sponsors of the tournament.",
            )}
          </p>
        </div>
      </section>

      {/* ───────────────── ESPECIALES ───────────────── */}
      <section id="especiales" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
            {t("Especiales", "Specials")}
          </p>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">
            {t("Eventos que el radar está analizando", "Events the radar is tracking")}
          </h2>
        </div>

        <Carousel opts={{ align: "start" }} className="mt-7">
          <CarouselContent>
          {/* Card 1 · Especial Mundial 2026 (EN VIVO) */}
          <CarouselItem className="md:basis-1/2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <Link
              href={localized("/experience-radar/mundial-2026")}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--cyan)]/30 bg-card transition-colors hover:border-[var(--cyan)]/70 hover:shadow-lg hover:shadow-[var(--cyan)]/[0.02]"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src="/images/radar-event-mundial.png"
                  alt={t("Especial Mundial 2026", "World Cup 2026 Special")}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--magenta)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                  <Radio size={12} className="motion-safe:animate-pulse" /> {t("En vivo", "Live")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold group-hover:text-[var(--cyan)] transition-colors">
                  {t("Especial Mundial 2026", "World Cup 2026 Special")}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t(
                    "El Mundial explicado desde noticias, emociones, sesgos cognitivos, IA y comportamiento de los aficionados.",
                    "The World Cup explained through news, emotions, cognitive biases, AI and fan behavior.",
                  )}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--cyan)]">
                  {t("Ver análisis y notas", "View analysis and notes")}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
          </CarouselItem>

          {/* Card 2 · Especiales de archivo */}
          <CarouselItem className="md:basis-1/2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-border bg-card/40"
          >
            <div className="relative h-44 w-full overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <Image
                src="/images/radar-event-archivo.png"
                alt={t("Especiales de archivo", "Archived specials")}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                <Archive size={12} /> {t("Archivo", "Archive")}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-foreground/80">
                {t("Especiales de archivo", "Archived specials")}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Aquí se guardarán los especiales de otros grandes eventos a medida que el radar los analice y archive.",
                  "Specials from other major events will be stored here as the radar analyzes and archives them.",
                )}
              </p>
              <span className="mt-5 text-xs font-medium text-muted-foreground">
                {t("Próximamente", "Coming soon")}
              </span>
            </div>
          </motion.div>
          </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="-top-11 left-auto right-11" />
          <CarouselNext className="-top-11 right-0" />
        </Carousel>
      </section>
    </>
  )
}
