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
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden bg-[var(--surface-dark)] pt-28 pb-16 md:pt-36 md:pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        {/* Animación de fondo SOLO en desktop (en móvil genera ruido). */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-16 hidden h-72 w-72 rounded-full border border-[var(--cyan)]/15 md:block"
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.38, 0.18] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-[-9rem] hidden h-96 w-96 rounded-full bg-[var(--magenta)]/[0.06] blur-3xl md:block"
          animate={{ x: [0, -28, 0], y: [0, -18, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-[46%] top-12 hidden h-32 w-32 rounded-full bg-[var(--cyan)]/[0.08] blur-2xl md:block"
          animate={{ y: [0, 24, 0], scale: [1, 1.18, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">
              <ScanLine size={13} /> {t("Señales · Emoción · Comportamiento", "Signals · Emotion · Behavior")}
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.03] tracking-tight md:text-6xl">Experience Radar</h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-foreground/90 md:text-xl">
              {t(
                "Un radar de señales, emociones y comportamiento humano para entender cómo reaccionan las personas ante grandes eventos.",
                "A radar of signals, emotions, and human behavior to understand how people react to major events.",
              )}
            </p>
            <p className="mt-3 max-w-xl text-sm font-medium text-foreground/80">
              {t("No seguimos el marcador. Analizamos la experiencia.", "We don't follow the score. We analyze the experience.")}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={localized("/experience-radar/mundial-2026")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-[var(--magenta)] hover:text-white sm:w-auto"
              >
                {t("Ver análisis del Mundial 2026", "View World Cup 2026 analysis")} <ArrowRight size={16} />
              </Link>
              <Link
                href="#especiales"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[var(--cyan)]/50 sm:w-auto"
              >
                {t("Ver especiales", "See specials")}
              </Link>
            </div>

            <p className="mt-6 max-w-md text-xs leading-relaxed text-muted-foreground">
              {t(
                "Contenido editorial e investigativo independiente. No somos patrocinadores oficiales del torneo.",
                "Independent editorial and research content. We are not official sponsors of the tournament.",
              )}
            </p>
          </div>

          {/* Radar SOLO en desktop: en móvil se oculta por completo (no aporta y hace ruido). */}
          <div className="relative z-10 mx-auto hidden w-full max-w-sm md:block">
            <RadarSweep className="h-auto w-full" />
            <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
              {t("El Mundial como laboratorio de comportamiento digital.", "The World Cup as a digital behavior lab.")}
            </p>
          </div>
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
