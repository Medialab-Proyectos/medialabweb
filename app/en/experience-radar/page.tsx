import type { Metadata } from "next"
import ExperienceRadarPage from "@/app/experience-radar/page"

/**
 * Ruta en inglés de la landing de Experience Radar. Renderiza la misma página: los
 * componentes detectan el idioma por la ruta `/en` vía useLanguage y muestran el
 * chrome/framing de MediaLab en inglés.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Experience Radar — Signals, emotions and human behavior | MediaLab",
  description:
    "A radar of signals, emotions, and human behavior to understand how people react to major events. We don't follow the score: we analyze the experience.",
  alternates: {
    canonical: "/en/experience-radar",
    languages: {
      es: "/experience-radar",
      en: "/en/experience-radar",
      "x-default": "/experience-radar",
    },
  },
  robots: { index: true, follow: true },
}

export default function ExperienceRadarEnPage() {
  return <ExperienceRadarPage />
}
