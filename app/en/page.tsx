import type { Metadata } from "next"
import Home from "../page"

export const metadata: Metadata = {
  title: "UX/UI, AI & Digital Products Agency — Bogotá",
  description:
    "UX/UI design agency with AI, technical SEO, CRO, and digital product development for B2B and B2C companies. We research, design, and build human, indexable, and measurable experiences from Bogotá for the world.",
  keywords: [
    "UX UI agency Colombia", "AI product design", "behavioral design",
    "UX agency Bogotá", "B2B B2C digital product development",
    "UXBox AI discovery", "digital innovation consulting",
    "MVP for startups", "fintech UX design", "CRO conversion optimization",
    "technical SEO for SaaS", "emotional design B2C", "B2B experience",
    "AEO answer engine optimization", "GEO generative engine optimization",
    "AI UX course", "AI User Experience Architect",
    "Zero UI Christian Benavides",
  ],
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
    images: [
      {
        url: "/images/ux-research.jpg",
        width: 1200,
        height: 630,
        alt: "MediaLab Ingeniería — UX, AI & Behavioral Design Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@MediaLabIng",
    creator: "@MediaLabIng",
    title: "MediaLab Ingeniería | UX, AI, SEO & Digital Products",
    description: "We create B2B and B2C experiences that rank, connect emotionally, and convert with human-centered design.",
    images: ["/images/ux-research.jpg"],
  },
}

export default Home
