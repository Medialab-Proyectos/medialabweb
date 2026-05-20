import type { Metadata } from "next"
import ServiciosPage from "../../servicios/page"

export const metadata: Metadata = {
  title: "Services — UX/UI Design, AI & Software Development",
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
  },
}

export default ServiciosPage
