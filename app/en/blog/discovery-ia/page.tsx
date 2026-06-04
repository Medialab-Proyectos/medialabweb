import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Product Discovery with AI",
  description:
    "How AI is transforming product discovery and shortening definition cycles. Original article in Spanish.",

  openGraph: {
    title: "Product Discovery with AI",
    description: "How AI is transforming product discovery.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/discovery-ia",
    images: [{ url: "/images/blog-ai.jpg", width: 1200, height: 630 }],
  },
}

export { default } from "../../../blog/discovery-ia/page"
