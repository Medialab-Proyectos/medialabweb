"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

// Load the map only on the client — react-simple-maps uses d3-geo which requires DOM
const WorldMap = dynamic(
  () => import("./world-map-client").then((m) => m.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-2xl border border-white/10 flex items-center justify-center"
        style={{ background: "#0a1628", aspectRatio: "16/7" }}
      >
        <div className="flex flex-col items-center gap-3 text-white/60">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#E8751A] animate-spin" />
          <span className="text-xs">Cargando mapa...</span>
        </div>
      </div>
    ),
  }
)

const stats = [
  { value: "9",   labelEs: "Países",    labelEn: "Countries" },
  { value: "15",  labelEs: "Ciudades",  labelEn: "Cities"    },
  { value: "+20", labelEs: "Clientes",  labelEn: "Clients"   },
  { value: "+50", labelEs: "Proyectos", labelEn: "Projects"  },
]

export function WorldPresence() {
  const [tooltip, setTooltip] = useState<{ name: string; country: string } | null>(null)
  const { t, localized } = useLanguage()

  return (
    <section
      id="presence"
      className="relative py-20 md:py-32 px-6 overflow-hidden bg-[var(--surface-dark)] text-foreground transition-colors duration-300"
      aria-labelledby="presence-heading"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--magenta)" }}>
              {t("Presencia Global", "Global Presence")}
            </span>
            <h2
              id="presence-heading"
              className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground text-balance leading-tight"
            >
              {t("Alcance global para clientes B2B y B2C", "Global reach for B2B and B2C clients")}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
              {t(
                "Casa Matriz en Bogotá, Colombia — con proyectos B2B enterprise y productos B2C en 9 países y 15 ciudades alrededor del mundo.",
                "Headquartered in Bogotá, Colombia — with B2B enterprise projects and B2C products across 9 countries and 15 cities worldwide."
              )}
            </p>
          </div>
          <Link
            href={localized("/portafolio")}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all active:scale-95 hover:brightness-110"
            style={{ background: "var(--magenta)" }}
          >
            {t("Nuestro Portafolio", "Our Portfolio")}
          </Link>
        </div>

        {/* Interactive map — client-only */}
        <WorldMap tooltip={tooltip} setTooltip={setTooltip} />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.value}
              className="flex flex-col items-center gap-2 py-7 rounded-xl border dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5"
            >
              <span
                className="font-display font-bold text-4xl md:text-5xl bg-clip-text text-transparent leading-none"
                style={{ backgroundImage: "linear-gradient(135deg, #F59E0B, #E8751A)" }}
              >
                {s.value}
              </span>
              <span className="text-sm md:text-base font-medium dark:text-white/70 text-muted-foreground">
                {t(s.labelEs, s.labelEn)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
