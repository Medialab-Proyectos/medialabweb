import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: { absolute: "The Architecture of Perception | MediaLab" },
  description:
    "Users don't abandon products for lack of logic but because of invisible emotional friction. Discover MediaLab's Conscious Experience Design (CXD). Original article in Spanish.",

  openGraph: {
    title: "The Architecture of Perception",
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
