import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Throne of Decision: AI, Human Autonomy, and Ethical Design",
  description:
    "In the age of AI agents, the greatest risk isn't privacy — it's the infantilization of the user. Discover Agentic Experience Design (AXD). Original article in Spanish.",
  alternates: {
    canonical: "/en/blog/trono-de-la-decision",
    languages: {
      es: "/blog/trono-de-la-decision",
      en: "/en/blog/trono-de-la-decision",
      "x-default": "/blog/trono-de-la-decision",
    },
  },
  openGraph: {
    title: "The Throne of Decision — MediaLab Ingeniería",
    description: "AI, human autonomy, and ethical design in the agentic era.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/trono-de-la-decision",
    images: [{ url: "/images/blog-zero-ui-decision.png", width: 1200, height: 630, alt: "The throne of decision" }],
  },
}

export { default } from "../../../blog/trono-de-la-decision/page"
