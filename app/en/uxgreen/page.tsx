import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UXGreenLanding } from "@/components/uxgreen-landing"

export const metadata: Metadata = {
  title: "UXGreen™ — Sustainable Digital Efficiency Certification | MediaLab",
  description:
    "UXGreen™ is the first standard that unites performance, accessibility, AI efficiency and digital sustainability. Analyze your site and get your free score. Verifiable certification for world-class digital products.",
  alternates: {
    canonical: "/en/uxgreen",
    languages: {
      es: "/uxgreen",
      en: "/en/uxgreen",
      "x-default": "/uxgreen",
    },
  },
  keywords: [
    "UXGreen digital sustainability certification",
    "sustainable web design certification",
    "digital efficiency UX",
    "website carbon footprint analysis",
    "core web vitals certification",
    "web accessibility WCAG certification",
    "green UX framework",
    "AI efficiency website",
    "cognitive load web design",
    "sustainable UX agency",
    "MediaLab UXGreen",
    "digital sustainability certification",
    "performance UX certification",
    "digital carbon calculator",
  ],
  openGraph: {
    title: "UXGreen™ — The Sustainable Digital Efficiency Standard | MediaLab",
    description:
      "Performance + Accessibility + AI + Carbon = UXGreen™. The first standard that measures the real efficiency of your digital product. Analyze your site for free.",
    type: "website",
    url: "/en/uxgreen",
    images: [
      {
        url: "/images/og-uxgreen.png",
        width: 1200,
        height: 630,
        alt: "UXGreen™ — Sustainable digital efficiency certification by MediaLab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UXGreen™ — The Sustainable Digital Efficiency Standard",
    description: "Performance + Accessibility + AI + Carbon. The first score that measures the real efficiency of your site. Free.",
    images: ["/images/og-uxgreen.png"],
  },
}

export default function UXGreenPageEn() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <UXGreenLanding />
      </main>
      <Footer />
    </>
  )
}
