import type { Metadata } from "next"
import { PortfolioContent } from "../../portafolio/portfolio-content"

export const metadata: Metadata = {
  title: "Portfolio | Success Stories in UX, AI, and Digital Products",
  description:
    "See how MediaLab Ingeniería has transformed digital products for B2B and B2C companies. Real success stories with measurable results in UX/UI, AI, and software development.",
  alternates: {
    canonical: "/en/portafolio",
    languages: {
      es: "/portafolio",
      en: "/en/portafolio",
      "x-default": "/portafolio",
    },
  },
  openGraph: {
    title: "MediaLab Portfolio | Digital Products That Deliver Results",
    description:
      "40+ products designed with data, consumer psychology, and AI. See how we've helped companies increase conversion, retention, and user satisfaction.",
    locale: "en_US",
    url: "/en/portafolio",
    images: [{ url: "/images/portfolio-hero.png", width: 1200, height: 630 }],
  },
}

export default function PortafolioEnPage() {
  return <PortfolioContent />
}
