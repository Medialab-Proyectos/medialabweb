import type { Metadata } from "next"
import SobreNosotrosPage from "../../sobre-nosotros/page"

export const metadata: Metadata = {
  title: "About Us — UX/UI & Digital Products Agency",
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

export default SobreNosotrosPage
