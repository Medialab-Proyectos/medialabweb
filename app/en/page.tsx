import type { Metadata } from "next"
import Home from "../page"

export const metadata: Metadata = {
  title: "AI-Powered UX & Product Discovery Agency",
  description:
    "MediaLab designs digital products people love: UX, AI, and consumer psychology. We accelerate product discovery from months to days, validated with human judgment.",
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
    title: "AI-Powered UX & Product Discovery Agency | MediaLab Ingeniería",
    description:
      "Digital products people love: UX, AI, and consumer psychology. We accelerate product discovery from months to days, validated with human judgment.",
    url: "https://medialab.design/en",
    locale: "en_US",
    alternateLocale: ["es_CO"],
    images: [
      {
        url: "/images/og-main-brand.png",
        width: 1200,
        height: 630,
        alt: "MediaLab Ingeniería — Digital Product Engineering: UX, AI, Software & Technical SEO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@MediaLabIng",
    creator: "@MediaLabIng",
    title: "MediaLab Ingeniería | UX, AI, SEO & Digital Products",
    description: "We design and build clear, useful, measurable digital products for B2B and B2C companies.",
    images: ["/images/og-main-brand.png"],
  },
}

export default Home
