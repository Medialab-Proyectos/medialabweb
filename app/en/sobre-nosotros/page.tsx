import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { AboutSection } from "@/components/about-section"
import { TrustMetrics } from "@/components/trust-metrics"
import { MethodSection } from "@/components/method-section"
import { WorldPresence } from "@/components/world-presence"
import { WhyUsSection } from "@/components/why-us-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About MediaLab — UX/UI & AI Design",
  description:
    "Meet MediaLab Ingeniería: UX/UI design, AI and digital product development agency founded in 2020 by Christian Benavides, author of Zero UI. 40+ products shipped, 7 countries.",
  alternates: {
    canonical: "/en/sobre-nosotros",
    languages: {
      es: "/sobre-nosotros",
      en: "/en/sobre-nosotros",
      "x-default": "/sobre-nosotros",
    },
  },
  openGraph: {
    title: "About MediaLab Ingeniería — Design with Data, Not Assumptions",
    description:
      "We research how your users think, design what they need to feel, and build the product your business needs. 40+ products, 7 countries, 98% client retention.",
    url: "/en/sobre-nosotros",
    locale: "en_US",
    images: [{ url: "/images/og-about.png", width: 1200, height: 630, alt: "About MediaLab Ingeniería — Digital Product Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About MediaLab Ingeniería — Design with Data, Not Assumptions",
    description:
      "40+ products, 7 countries, 98% client retention. We research, design, and build digital products.",
    images: ["/images/og-about.png"],
  },
}

export default function EnSobreNosotrosPage() {
  return (
    <main id="main-content">
      <Navbar />
      <div className="pt-20" />
      <h1 className="sr-only">About Us — MediaLab Ingeniería</h1>
      <AboutSection />
      <TrustMetrics />
      <MethodSection />
      <WorldPresence />
      <WhyUsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
