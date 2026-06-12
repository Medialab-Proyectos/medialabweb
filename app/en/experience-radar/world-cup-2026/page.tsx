import type { Metadata } from "next"
import ExperienceRadarMundialPage from "@/app/experience-radar/mundial-2026/page"

/**
 * Ruta en inglés del PORTAL del especial. Renderiza la misma página: los
 * componentes detectan el idioma por la ruta `/en` vía useLanguage y muestran el
 * chrome/framing de MediaLab en inglés.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "World Cup 2026 Special — Experience Radar | MediaLab",
  description:
    "The 2026 World Cup as a digital behavior lab: fan emotion, digital experience and MediaLab UX learnings. We don't follow the score: we analyze the experience.",
  alternates: {
    canonical: "/experience-radar/mundial-2026",
    languages: {
      es: "/experience-radar/mundial-2026",
      en: "/en/experience-radar/world-cup-2026",
      "x-default": "/experience-radar/mundial-2026",
    },
  },
  robots: { index: false, follow: true },
}

export default function WorldCupSpecialEnPage() {
  return <ExperienceRadarMundialPage />
}
