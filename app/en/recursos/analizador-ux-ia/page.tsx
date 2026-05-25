import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "UX + AI Discovery Analyzer: diagnose your digital product (free)",
  description:
    "Free interactive diagnosis: measure your product's maturity in clarity, UX, AI, differentiation, and conversion. Score, blockers, and quick wins instantly.",
  alternates: {
    canonical: "/en/recursos/analizador-ux-ia",
    languages: {
      es: "/recursos/analizador-ux-ia",
      en: "/en/recursos/analizador-ux-ia",
      "x-default": "/recursos/analizador-ux-ia",
    },
  },
  openGraph: {
    title: "UX + AI Discovery Analyzer | MediaLab Ingeniería",
    description:
      "Diagnose your digital product's maturity in 60 seconds: UX, AI, clarity, differentiation, and conversion. Result and roadmap instantly.",
    type: "website",
    locale: "en_US",
    url: "/en/recursos/analizador-ux-ia",
    images: [{ url: "/images/ai-discovery.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ai-discovery.jpg"] },
}

export { default } from "../../../recursos/analizador-ux-ia/page"
