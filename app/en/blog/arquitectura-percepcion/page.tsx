import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Architecture of Perception: Why Your Users Don't Navigate Flows, They Navigate Emotional States",
  description:
    "Users don't abandon products for lack of logic but because of invisible emotional friction. Discover MediaLab's Conscious Experience Design (CXD). Original article in Spanish.",
  alternates: {
    canonical: "/en/blog/arquitectura-percepcion",
    languages: {
      es: "/blog/arquitectura-percepcion",
      en: "/en/blog/arquitectura-percepcion",
      "x-default": "/blog/arquitectura-percepcion",
    },
  },
  openGraph: {
    title: "The Architecture of Perception — MediaLab Ingeniería",
    description: "Users move through emotional states, not logical flows. Learn to design from conscious perception.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/arquitectura-percepcion",
    images: [
      { url: "/images/blog-zero-ui-percepcion.png", width: 1200, height: 630, alt: "Architecture of perception" },
    ],
  },
}

export { default } from "../../../blog/arquitectura-percepcion/page"
