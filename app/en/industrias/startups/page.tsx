import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "UX & product design for startups: from idea to validated MVP",
  description:
    "We validate, design, and build products for startups with AI discovery, UX, and MVP development. From vague idea to validated product before you run out of runway.",
  alternates: {
    canonical: "/en/industrias/startups",
    languages: {
      es: "/industrias/startups",
      en: "/en/industrias/startups",
      "x-default": "/industrias/startups",
    },
  },
  openGraph: {
    title: "UX & product for startups | MediaLab Ingeniería",
    description:
      "From idea to validated product: AI discovery, UX design, and MVP development for startups.",
    type: "article",
    locale: "en_US",
    url: "/en/industrias/startups",
    images: [{ url: "/images/industry_startups.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_startups.jpg"] },
}

export { default } from "../../../industrias/startups/page"
