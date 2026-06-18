import type { Metadata } from "next"
import { BlogIndexContent } from "../../blog/blog-index-content"
import { BLOG_POSTS } from "@/lib/blog-posts"

export const metadata: Metadata = {
  title: "Blog on UX, AI, and Digital Product",
  description:
    "Ideas on UX design, artificial intelligence, consumer psychology, and B2B/B2C digital products by MediaLab Ingeniería. Reads for founders, designers, and product managers.",
  alternates: {
    canonical: "/en/blog",
    languages: {
      es: "/blog",
      en: "/en/blog",
      "x-default": "/blog",
    },
  },
  openGraph: {
    title: "MediaLab Blog — UX, AI, and Digital Product",
    description: "Signed articles on conscious design, AI applied to product, and human behavior.",
    type: "website",
    locale: "en_US",
    url: "/en/blog",
    images: [{ url: "/images/og-blog.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaLab Blog — UX, AI, and Digital Product",
    description: "Signed articles on conscious design, AI applied to product, and human behavior.",
    images: ["/images/og-blog.png"],
  },
}

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "MediaLab Ingeniería Blog",
  url: "https://medialab.design/en/blog",
  description: "Articles on UX, AI, and B2B/B2C digital product design.",
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  inLanguage: "en",
}

const articles = BLOG_POSTS.map((p) => ({ slug: p.slug, title: p.titleEn }))

export default function BlogIndexEn() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://medialab.design/en/blog/${a.slug}`,
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
