import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "UX in Fintech: Designing for Trust",
  description:
    "UX design strategies specific to fintech products that need to build trust from the first touch. Original article in Spanish.",
  alternates: {
    canonical: "/en/blog/ux-fintech",
    languages: {
      es: "/blog/ux-fintech",
      en: "/en/blog/ux-fintech",
      "x-default": "/blog/ux-fintech",
    },
  },
  openGraph: {
    title: "UX in Fintech",
    description: "Designing for trust in financial products.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/ux-fintech",
    images: [{ url: "/images/blog-fintech.jpg", width: 1200, height: 630 }],
  },
}

export { default } from "../../../blog/ux-fintech/page"
