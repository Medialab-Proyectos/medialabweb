import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "E-commerce UX design: shopping experiences that convert",
  description:
    "UX, behavioral design, and CRO for e-commerce. We reduce cart abandonment and increase conversion and repurchase with research, consumer psychology, and AI.",
  alternates: {
    canonical: "/en/industrias/ecommerce",
    languages: {
      es: "/industrias/ecommerce",
      en: "/en/industrias/ecommerce",
      "x-default": "/industrias/ecommerce",
    },
  },
  openGraph: {
    title: "E-commerce UX design | MediaLab Ingeniería",
    description:
      "Shopping experiences that turn visitors into loyal customers. UX + behavioral design + CRO.",
    type: "article",
    locale: "en_US",
    url: "/en/industrias/ecommerce",
    images: [{ url: "/images/industry_ecommerce.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_ecommerce.jpg"] },
}

export { default } from "../../../industrias/ecommerce/page"
