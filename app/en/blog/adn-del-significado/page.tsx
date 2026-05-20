import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The DNA of Meaning: Why Motivation Isn't Enough to Retain Users",
  description:
    "Motivation starts the action, but meaning sustains the habit. 4 noetic design patterns to create products that transcend. Original article in Spanish.",
  alternates: {
    canonical: "/en/blog/adn-del-significado",
    languages: {
      es: "/blog/adn-del-significado",
      en: "/en/blog/adn-del-significado",
      "x-default": "/blog/adn-del-significado",
    },
  },
  openGraph: {
    title: "The DNA of Meaning",
    description: "Why some products become identity, and others get abandoned.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/adn-del-significado",
    images: [{ url: "/images/blog-zero-ui-significado.png", width: 1200, height: 630, alt: "The DNA of Meaning" }],
  },
}

export { default } from "../../../blog/adn-del-significado/page"
