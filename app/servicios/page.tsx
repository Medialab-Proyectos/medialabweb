import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { ServicesSection } from "@/components/services-section"
import { ExperienceDesignSection } from "@/components/experience-design-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Servicios — Diseño UX/UI, IA y Desarrollo de Software",
  description:
    "Diseño UX/UI conductual, discovery de producto con IA (UXBox), SEO técnico, CRO y desarrollo de software a medida para empresas B2B y marcas B2C.",
  alternates: {
    canonical: "/servicios",
    languages: {
      es: "/servicios",
      en: "/en/servicios",
      "x-default": "/servicios",
    },
  },
  openGraph: {
    title: "Servicios MediaLab — UX/UI, IA, SEO y Desarrollo",
    description:
      "Investigamos cómo piensan tus usuarios, diseñamos lo que necesitan sentir y construimos el producto que tu negocio necesita.",
    url: "/servicios",
  },
}

export default function ServiciosPage() {
  return (
    <main id="main-content">
      <Navbar />
      <div className="pt-20" />
      <ServicesSection />
      <ExperienceDesignSection />
      <CTASection />
      <Footer />
    </main>
  )
}
