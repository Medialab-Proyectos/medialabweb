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
    images: [{ url: "/images/og-services.png", width: 1200, height: 630, alt: "Servicios MediaLab — Diseño UX/UI, Discovery con IA y Desarrollo de Software" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicios MediaLab — UX/UI, IA y Desarrollo de Producto",
    description:
      "Diseño UX/UI conductual, discovery con IA, CRO para SaaS y desarrollo a medida para empresas B2B y B2C.",
    images: ["/images/og-services.png"],
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
