import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Cuéntanos qué quieres construir o mejorar. MediaLab Ingeniería te responde en 24 horas para revisar tu producto, idea o plataforma digital.",
  alternates: {
    canonical: "/contacto",
    languages: {
      es: "/contacto",
      en: "/en/contacto",
      "x-default": "/contacto",
    },
  },
  openGraph: {
    title: "Contacto | MediaLab Ingeniería",
    description:
      "Hablemos de tu producto digital, tus usuarios y el siguiente paso para hacerlo claro, útil y medible.",
    url: "/contacto",
    siteName: "MediaLab Ingeniería",
    images: [{ url: "/images/og-contact.png", width: 1200, height: 630, alt: "Contacto MediaLab — Agenda tu Discovery Gratuito" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | MediaLab Ingeniería",
    description:
      "Cuéntanos qué quieres construir. Respondemos en menos de 24 horas.",
    images: ["/images/og-contact.png"],
  },
}

export default function ContactoPage() {
  return (
    <main id="main-content">
      <Navbar />
      <div className="pt-20" />
      <h1 className="sr-only">Contacto — Agenda tu Discovery Gratuito con MediaLab</h1>
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  )
}
