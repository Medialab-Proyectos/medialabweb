import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contacto — Agenda una Llamada de Discovery Gratis",
  description:
    "Agenda una sesión de discovery gratuita de 30 minutos con MediaLab Ingeniería. Hablemos de tu producto digital, UX/UI, IA o desarrollo de software.",
  alternates: {
    canonical: "/contacto",
    languages: {
      es: "/contacto",
      en: "/en/contacto",
      "x-default": "/contacto",
    },
  },
  openGraph: {
    title: "Contacto MediaLab — Agenda tu Discovery Gratis",
    description:
      "30 minutos para explorar cómo transformar tu producto digital. Sin compromiso. Respuesta en 24 horas.",
    url: "/contacto",
  },
}

export default function ContactoPage() {
  return (
    <main id="main-content">
      <Navbar />
      <div className="pt-20" />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  )
}
