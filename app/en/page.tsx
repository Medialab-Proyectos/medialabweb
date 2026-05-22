import type { Metadata } from "next"
import Home from "../page"

export const metadata: Metadata = {
  title: "Digital Product Engineering",
  description:
    "We design and build digital products people understand, use, and recommend. UX, AI, software, and technical SEO for B2B and B2C companies.",
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
    title: "MediaLab Ingeniería | Digital Product Engineering",
    description:
      "UX, AI, software, and technical SEO for digital products people understand, use, and recommend.",
    url: "https://medialab.design/en",
    locale: "en_US",
    alternateLocale: ["es_CO"],
    images: [
      {
        url: "/images/team-collaboration.png",
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
    description: "We design and build clear, useful, measurable digital products for B2B and B2C companies.",
    images: ["/images/team-collaboration.png"],
  },
}

export default Home
