import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: { absolute: "Influence Without Erosion | MediaLab" },
  description:
    "Sustained behavior isn't born from pressure. It's born from a respected consciousness. Original article in Spanish.",

  openGraph: {
    title: "Influence Without Erosion",
    description: "Sustainable behavioral design without manipulation.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/influencia-sin-erosion",
    images: [{ url: "/images/blog-zero-ui-influencia.png", width: 1200, height: 630, alt: "Influence without erosion" }],
  },
}

export { default } from "../../../blog/influencia-sin-erosion/page"
