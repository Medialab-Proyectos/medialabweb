import type { Metadata } from "next"
import { BlogIndexContent } from "./blog-index-content"

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog MediaLab — UX, IA y Producto Digital",
    description:
      "Ideas sobre UX, IA y psicología del consumidor para diseñadores, PMs y founders.",
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

const articles = [
  { slug: "arquitectura-percepcion", title: "La Arquitectura de la Percepción: Tus Usuarios No Navegan Flujos, Sino Estados Emocionales" },
  { slug: "adn-del-significado", title: "El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios" },
  { slug: "trono-de-la-decision", title: "El Trono de la Decisión: IA, Autonomía Humana y Diseño Ético" },
  { slug: "influencia-sin-erosion", title: "Influencia sin Erosión: Diseño de Comportamiento Sostenible sin Manipular" },
  { slug: "psicologia-adopcion", title: "Psicología de la Adopción Digital" },
  { slug: "discovery-ia", title: "Discovery de Producto con IA" },
  { slug: "ux-fintech", title: "UX en Fintech: Diseñar para la Confianza" },
  { slug: "mvp-escala", title: "Del MVP a la Escala" },
]

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
