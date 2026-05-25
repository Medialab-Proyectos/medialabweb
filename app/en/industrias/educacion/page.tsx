import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Education UX design: platforms that increase completion",
  description:
    "UX and behavioral design for education, e-learning, and LMS. We increase motivation and course completion with research, consumer psychology, and AI.",
  alternates: {
    canonical: "/en/industrias/educacion",
    languages: {
      es: "/industrias/educacion",
      en: "/en/industrias/educacion",
      "x-default": "/industrias/educacion",
    },
  },
  openGraph: {
    title: "Education UX design | MediaLab Ingeniería",
    description:
      "Platforms where learning feels natural. UX + behavioral design + AI for e-learning, LMS, and training.",
    type: "article",
    locale: "en_US",
    url: "/en/industrias/educacion",
    images: [{ url: "/images/industry_educacion.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_educacion.jpg"] },
}

export { default } from "../../../industrias/educacion/page"
