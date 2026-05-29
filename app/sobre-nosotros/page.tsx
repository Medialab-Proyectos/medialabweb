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
  title: "Sobre Nosotros — Agencia UX/UI y Productos Digitales",
  description:
    "Conoce a MediaLab Ingeniería: agencia de diseño UX/UI, IA y desarrollo de productos digitales fundada en 2020 por Christian Benavides, autor de Zero UI. 40+ productos entregados, 7 países.",
  alternates: {
    canonical: "/sobre-nosotros",
    languages: {
      es: "/sobre-nosotros",
      en: "/en/sobre-nosotros",
      "x-default": "/sobre-nosotros",
    },
  },
  openGraph: {
    title: "Sobre MediaLab Ingeniería — Diseño con Datos, No Suposiciones",
    description:
      "Investigamos cómo piensan tus usuarios, diseñamos lo que necesitan sentir y construimos el producto que tu negocio necesita. 40+ productos, 7 países, 98% retención de clientes.",
    url: "/sobre-nosotros",
    images: [{ url: "/images/og-about.png", width: 1200, height: 630, alt: "Sobre MediaLab Ingeniería — Equipo de Producto Digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre MediaLab Ingeniería — Diseño con Datos, No Suposiciones",
    description: "40+ productos, 7 países, 98% retención. Investigamos, diseñamos y construimos productos digitales.",
    images: ["/images/og-about.png"],
  },
}

export default function SobreNosotrosPage() {
  return (
    <main id="main-content">
      <Navbar />
      <div className="pt-20" />
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
