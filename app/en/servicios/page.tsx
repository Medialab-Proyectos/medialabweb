import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { ServicesSection } from "@/components/services-section"
import { ExperienceDesignSection } from "@/components/experience-design-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "UX/UI Design & AI Services",
  description:
    "Behavioral UX/UI design, AI-powered product discovery (UXBox), technical SEO, CRO and custom software development for B2B and B2C companies.",
  alternates: {
    canonical: "/en/servicios",
    languages: {
      es: "/servicios",
      en: "/en/servicios",
      "x-default": "/servicios",
    },
  },
  openGraph: {
    title: "MediaLab Services — UX/UI, AI, SEO & Development",
    description:
      "We research how your users think, design what they need to feel, and build the product your business needs.",
    url: "/en/servicios",
    locale: "en_US",
    images: [{ url: "/images/og-services.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaLab Services — UX/UI, AI, SEO & Development",
    description:
      "Behavioral UX/UI design, AI discovery, CRO and software development for B2B and B2C companies.",
    images: ["/images/og-services.png"],
  },
}

export default function EnServiciosPage() {
  return (
    <main id="main-content">
      <Navbar />
      <div className="pt-20" />
      <h1 className="sr-only">UX/UI Design, AI and Software Development Services — MediaLab</h1>
      <ServicesSection />
      <ExperienceDesignSection />
      <CTASection />
      <Footer />
    </main>
  )
}
