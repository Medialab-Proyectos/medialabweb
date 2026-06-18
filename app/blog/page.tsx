import type { Metadata } from "next"
import { BlogIndexContent } from "./blog-index-content"
import { BLOG_POSTS } from "@/lib/blog-posts"

export const metadata: Metadata = {
  title: "Blog de UX, IA y Producto Digital",
  description:
    "Ideas sobre diseño UX, inteligencia artificial, psicología del consumidor y productos digitales B2B/B2C por MediaLab Ingeniería. Lecturas para fundadores, diseñadores y product managers.",
  alternates: {
    canonical: "/blog",
    languages: {
      es: "/blog",
      en: "/en/blog",
      "x-default": "/blog",
    },
  },
  openGraph: {
    title: "Blog MediaLab — UX, IA y Producto Digital",
    description: "Artículos firmados sobre diseño consciente, IA aplicada al producto y comportamiento humano.",
    type: "website",
    url: "/blog",
    images: [{ url: "/images/og-blog.png", width: 1200, height: 630, alt: "Blog MediaLab — UX, IA y Diseño Conductual" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog MediaLab — UX, IA y Producto Digital",
    description:
      "Ideas sobre UX, IA y psicología del consumidor para diseñadores, PMs y founders.",
    images: ["/images/og-blog.png"],
  },
}

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog MediaLab Ingeniería",
  url: "https://medialab.design/blog",
  description: "Artículos sobre UX, IA y diseño de productos digitales B2B/B2C.",
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  inLanguage: "es-CO",
}

const articles = BLOG_POSTS.map((p) => ({ slug: p.slug, title: p.titleEs }))

export default function BlogIndex() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://medialab.design/blog/${a.slug}`,
      name: a.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <BlogIndexContent />
    </>
  )
}
