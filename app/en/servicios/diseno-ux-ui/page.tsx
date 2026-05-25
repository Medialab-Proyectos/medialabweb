import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "UX/UI Design with AI and consumer psychology",
  description:
    "UX/UI design agency with AI, user research, and behavioral design. We build B2B and B2C digital products people understand, use, and recommend.",
  alternates: {
    canonical: "/en/servicios/diseno-ux-ui",
    languages: {
      es: "/servicios/diseno-ux-ui",
      en: "/en/servicios/diseno-ux-ui",
      "x-default": "/servicios/diseno-ux-ui",
    },
  },
  openGraph: {
    title: "UX/UI Design with AI | MediaLab Ingeniería",
    description:
      "User research, behavioral design, and AI for experiences that connect and convert.",
    type: "article",
    locale: "en_US",
    url: "/en/servicios/diseno-ux-ui",
    images: [{ url: "/images/ux-research.png", width: 1200, height: 630, alt: "UX/UI Design with AI — MediaLab Ingeniería" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ux-research.png"] },
}

export { default } from "../../../servicios/diseno-ux-ui/page"
