import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fintech UX Design: experiences that build trust",
  description:
    "UX and behavioral design for fintech, banking, payments, and lending. We reduce friction and anxiety in onboarding and KYC with research, consumer psychology, and AI.",
  alternates: {
    canonical: "/en/industrias/fintech",
    languages: {
      es: "/industrias/fintech",
      en: "/en/industrias/fintech",
      "x-default": "/industrias/fintech",
    },
  },
  openGraph: {
    title: "Fintech UX Design | MediaLab Ingeniería",
    description:
      "Financial experiences where trust is felt. UX + behavioral design + AI for fintech, banking, and payments.",
    type: "article",
    locale: "en_US",
    url: "/en/industrias/fintech",
    images: [{ url: "/images/industry_fintech.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_fintech.jpg"] },
}

export { default } from "../../../industrias/fintech/page"
