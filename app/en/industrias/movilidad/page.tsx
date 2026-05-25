import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mobility UX design: simple, safe transport apps",
  description:
    "UX and behavioral design for mobility, transport, and logistics. Real-time, safe, and clear experiences for users and operators, with research and AI.",
  alternates: {
    canonical: "/en/industrias/movilidad",
    languages: {
      es: "/industrias/movilidad",
      en: "/en/industrias/movilidad",
      "x-default": "/industrias/movilidad",
    },
  },
  openGraph: {
    title: "Mobility UX design | MediaLab Ingeniería",
    description:
      "Interfaces that make getting around simple and safe. UX + behavioral design + AI for mobility and transport.",
    type: "article",
    locale: "en_US",
    url: "/en/industrias/movilidad",
    images: [{ url: "/images/industry_movilidad.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_movilidad.jpg"] },
}

export { default } from "../../../industrias/movilidad/page"
