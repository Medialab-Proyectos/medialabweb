import type { Metadata } from "next"
import { KitDiscoveryContent } from "@/components/recursos/kit-discovery-content"

export const metadata: Metadata = {
  title: "Kit de Discovery UX + IA en 24 horas (gratis)",
  description:
    "Descarga gratis el Kit de Discovery UX + IA: scorecard de claridad, framework HEM, prompts y plantilla de brief para convertir una idea vaga en un brief accionable.",
  alternates: {
    canonical: "/recursos/kit-discovery-ux-ia",
    languages: {
      es: "/recursos/kit-discovery-ux-ia",
      en: "/en/recursos/kit-discovery-ux-ia",
      "x-default": "/recursos/kit-discovery-ux-ia",
    },
  },
  openGraph: {
    title: "Kit de Discovery UX + IA en 24 horas | MediaLab Ingeniería",
    description:
      "Scorecard, framework HEM, prompts y plantilla de brief. De idea vaga a brief accionable, sin perder criterio humano.",
    type: "article",
    url: "/recursos/kit-discovery-ux-ia",
    images: [{ url: "/images/ai-discovery.jpg", width: 1200, height: 630, alt: "Kit de Discovery UX + IA" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ai-discovery.jpg"] },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Recursos", item: "https://medialab.design/recursos/kit-discovery-ux-ia" },
    { "@type": "ListItem", position: 3, name: "Kit de Discovery UX + IA", item: "https://medialab.design/recursos/kit-discovery-ux-ia" },
  ],
}

const creativeWorkSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Kit de Discovery UX + IA en 24 horas",
  url: "https://medialab.design/recursos/kit-discovery-ux-ia",
  description:
    "Recurso gratuito de MediaLab: scorecard de claridad, framework HEM (Humano, Emocional, Medible), prompt pack y plantilla de brief para discovery de producto con IA.",
  learningResourceType: "Toolkit",
  inLanguage: "es",
  isAccessibleForFree: true,
  creator: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
}

export default function KitDiscoveryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
      <KitDiscoveryContent />
    </>
  )
}
