import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Digital Product Development with AI & custom software",
  description:
    "Custom software development: B2B web platforms, B2C apps, MVPs, and scalable architectures with React, Next.js, Node.js, and AI integration.",
  alternates: {
    canonical: "/en/servicios/desarrollo-producto-digital",
    languages: {
      es: "/servicios/desarrollo-producto-digital",
      en: "/en/servicios/desarrollo-producto-digital",
      "x-default": "/servicios/desarrollo-producto-digital",
    },
  },
  openGraph: {
    title: "Digital Product Development with AI | MediaLab Ingeniería",
    description:
      "Web platforms, apps, and MVPs with clean code, scalable architecture, and AI integration.",
    type: "article",
    locale: "en_US",
    url: "/en/servicios/desarrollo-producto-digital",
    images: [{ url: "/images/team-collaboration.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/team-collaboration.png"] },
}

export { default } from "../../../servicios/desarrollo-producto-digital/page"
