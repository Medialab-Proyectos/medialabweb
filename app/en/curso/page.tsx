import { default as CursoPage } from "../../curso/page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI UX Architect Course",
  description:
    "Master UX, digital adoption psychology, and AI in 8 weeks. Become an AI UX Architect and design digital products people love and algorithms prioritize.",
  alternates: {
    canonical: "/en/curso",
    languages: {
      es: "/curso",
      en: "/en/curso",
      "x-default": "/curso",
    },
  },
  openGraph: {
    title: "AI UX Architect Course | MediaLab Ingeniería",
    description:
      "UX + AI + digital adoption psychology in 8 weeks. For designers, PMs, and founders who want to build high-impact digital products.",
    url: "/en/curso",
    siteName: "MediaLab Ingeniería",
    locale: "en_US",
    images: [{ url: "/images/og-curso.png", width: 1200, height: 630, alt: "AI UX Architect Certification Course — MediaLab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI UX Architect Course — UX with AI in 8 weeks | MediaLab",
    description:
      "Master UX, digital adoption psychology, and AI. Certify as an AI UX Architect.",
    images: ["/images/og-curso.png"],
  },
}

export default function EnCursoPage() {
  return <CursoPage lang="en" />
}
