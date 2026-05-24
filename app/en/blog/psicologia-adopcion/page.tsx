import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "The Psychology of Digital Adoption",
  description:
    "How to apply consumer psychology principles to accelerate adoption of B2B and B2C digital products. Original article in Spanish.",
  alternates: {
    canonical: "/en/blog/psicologia-adopcion",
    languages: {
      es: "/blog/psicologia-adopcion",
      en: "/en/blog/psicologia-adopcion",
      "x-default": "/blog/psicologia-adopcion",
    },
  },
  openGraph: {
    title: "The Psychology of Digital Adoption",
    description: "How to apply consumer psychology to accelerate digital adoption.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/psicologia-adopcion",
    images: [{ url: "/images/blog-behavioral.jpg", width: 1200, height: 630 }],
  },
}

export { default } from "../../../blog/psicologia-adopcion/page"
