import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "From MVP to Scale",
  description:
    "How to design an MVP that not only validates your idea but is also ready to scale without technical debt. Original article in Spanish.",

  openGraph: {
    title: "From MVP to Scale",
    description: "Architecture decisions that matter.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/mvp-escala",
    images: [{ url: "/images/blog-mvp.jpg", width: 1200, height: 630 }],
  },
}

export { default } from "../../../blog/mvp-escala/page"
