import type { Metadata } from "next"
import Home from "../page"

export const metadata: Metadata = {
  title: "MediaLab Ingeniería | UX/UI, AI & Digital Products Agency in 2026",
  description:
    "UX/UI design agency with AI, technical SEO, CRO, and digital product development for B2B and B2C companies. We research, design, and build human, indexable, and measurable experiences from Bogotá for the world.",
  alternates: {
    canonical: "/en",
    languages: {
      "es-CO": "/",
      "es": "/",
      "en": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "MediaLab Ingeniería | Digital products that rank, connect, and convert",
    description:
      "UX/UI design, AI, technical SEO, and software development for B2B and B2C experiences that are human, indexable, and conversion-oriented.",
    url: "https://medialab.design/en",
    locale: "en_US",
    alternateLocale: ["es_CO"],
  },
}

export default Home
