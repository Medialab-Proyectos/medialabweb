import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Banking UX design: digital experiences that build trust",
  description:
    "UX and behavioral design for digital banking: trust, accessibility, and omnichannel. We modernize the banking experience with research, consumer psychology, and AI.",
  alternates: {
    canonical: "/en/industrias/banca",
    languages: {
      es: "/industrias/banca",
      en: "/en/industrias/banca",
      "x-default": "/industrias/banca",
    },
  },
  openGraph: {
    title: "Banking UX design | MediaLab Ingeniería",
    description:
      "Banking experiences that remove user anxiety. UX + behavioral design + AI for digital banking.",
    type: "article",
    locale: "en_US",
    url: "/en/industrias/banca",
    images: [{ url: "/images/industry_banca.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_banca.jpg"] },
}

export { default } from "../../../industrias/banca/page"
