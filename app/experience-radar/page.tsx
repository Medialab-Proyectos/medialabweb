import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { RadarHome } from "@/components/experience-radar/radar-home"

/**
 * Página 1 — landing de Experience Radar: hero + tarjetas de Especiales.
 * El portal del especial (nota destacada, grilla, buscador, filtros) vive en
 * /experience-radar/mundial-2026. Espejo en inglés: /en/experience-radar.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Experience Radar — Señales, emociones y comportamiento humano | MediaLab",
  description:
    "Un radar de señales, emociones y comportamiento humano para entender cómo reaccionan las personas ante grandes eventos. No seguimos el marcador: analizamos la experiencia.",
  alternates: {
    canonical: "/experience-radar",
    languages: {
      es: "/experience-radar",
      en: "/en/experience-radar",
      "x-default": "/experience-radar",
    },
  },
  robots: { index: true, follow: true },
}

export default function ExperienceRadarPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <RadarHome />
      <Footer />
    </main>
  )
}
