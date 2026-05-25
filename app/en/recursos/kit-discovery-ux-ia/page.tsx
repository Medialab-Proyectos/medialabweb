import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "UX + AI Discovery Kit in 24 hours (free)",
  description:
    "Download the free UX + AI Discovery Kit: clarity scorecard, HEM framework, prompts, and a brief template to turn a vague idea into an actionable brief.",
  alternates: {
    canonical: "/en/recursos/kit-discovery-ux-ia",
    languages: {
      es: "/recursos/kit-discovery-ux-ia",
      en: "/en/recursos/kit-discovery-ux-ia",
      "x-default": "/recursos/kit-discovery-ux-ia",
    },
  },
  openGraph: {
    title: "UX + AI Discovery Kit in 24 hours | MediaLab Ingeniería",
    description:
      "Scorecard, HEM framework, prompts, and a brief template. From vague idea to actionable brief, without losing human judgment.",
    type: "article",
    locale: "en_US",
    url: "/en/recursos/kit-discovery-ux-ia",
    images: [{ url: "/images/ai-discovery.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ai-discovery.jpg"] },
}

export { default } from "../../../recursos/kit-discovery-ux-ia/page"
