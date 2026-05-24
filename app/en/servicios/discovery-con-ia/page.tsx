import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Product Discovery for Startups & B2B Teams",
  description:
    "Accelerate your product discovery with AI, UX research, and human judgment. From vague idea to actionable roadmap in days, with MediaLab.",
  alternates: {
    canonical: "/en/servicios/discovery-con-ia",
    languages: {
      es: "/servicios/discovery-con-ia",
      en: "/en/servicios/discovery-con-ia",
      "x-default": "/servicios/discovery-con-ia",
    },
  },
  openGraph: {
    title: "AI Product Discovery | MediaLab Ingeniería",
    description:
      "From vague idea to actionable roadmap in days. AI + user research + consumer psychology.",
    type: "article",
    locale: "en_US",
    url: "/en/servicios/discovery-con-ia",
    images: [{ url: "/images/ai-discovery.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ai-discovery.jpg"] },
}

export { default } from "../../../servicios/discovery-con-ia/page"
