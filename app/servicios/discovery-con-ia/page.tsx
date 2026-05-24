import type { Metadata } from "next"
import { DiscoveryConIAContent } from "@/components/servicios/discovery-con-ia-content"

export const metadata: Metadata = {
  title: "Discovery de producto con IA para startups y equipos B2B",
  description:
    "Acelera tu discovery de producto con IA, investigación UX y criterio humano. De idea vaga a roadmap accionable en días, con MediaLab.",
  alternates: {
    canonical: "/servicios/discovery-con-ia",
    languages: {
      es: "/servicios/discovery-con-ia",
      en: "/en/servicios/discovery-con-ia",
      "x-default": "/servicios/discovery-con-ia",
    },
  },
  openGraph: {
    title: "Discovery de producto con IA | MediaLab Ingeniería",
    description:
      "De idea vaga a roadmap accionable en días. IA + investigación de usuarios + psicología del consumidor.",
    type: "article",
    url: "/servicios/discovery-con-ia",
    images: [{ url: "/images/ai-discovery.jpg", width: 1200, height: 630, alt: "Discovery de producto con IA" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ai-discovery.jpg"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Discovery de producto con IA",
  name: "Discovery de producto con IA",
  url: "https://medialab.design/servicios/discovery-con-ia",
  description:
    "Servicio de discovery de producto asistido por IA que convierte una idea en un brief accionable (problema, usuarios, requisitos y enfoque de diseño) en días, validado con investigación de usuarios y criterio humano.",
  provider: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    url: "https://medialab.design",
  },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [
    { "@type": "Audience", audienceType: "Startups y founders" },
    { "@type": "BusinessAudience", audienceType: "Equipos de producto B2B y SaaS" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es el discovery de producto con IA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es el proceso de transformar una idea de producto en una definición estructurada — problema, usuarios, requisitos y enfoque de diseño — usando inteligencia artificial para acelerar el análisis, y validándola con investigación de usuarios y criterio humano. Reduce semanas de workshops a días.",
      },
    },
    {
      "@type": "Question",
      name: "¿La IA reemplaza la investigación de usuarios?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. La IA acelera el análisis y genera hipótesis, pero la investigación con usuarios reales y la psicología del consumidor siguen siendo el filtro que evita construir el producto equivocado. Usamos IA como copiloto, no como reemplazo del criterio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tiempo toma un discovery con IA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un primer brief estructurado puede estar listo en días, no meses. El alcance exacto depende de la complejidad, pero el objetivo es darte claridad accionable rápido para que puedas validar o diseñar sin perder tiempo.",
      },
    },
    {
      "@type": "Question",
      name: "¿En qué se diferencia de UXBox?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UXBox es la herramienta de IA que genera el brief inicial al instante. El servicio de discovery con IA es el acompañamiento completo: toma ese punto de partida y lo lleva a una definición validada con expertos, investigación y un plan de siguiente paso.",
      },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Servicios", item: "https://medialab.design/servicios" },
    { "@type": "ListItem", position: 3, name: "Discovery con IA", item: "https://medialab.design/servicios/discovery-con-ia" },
  ],
}

export default function DiscoveryConIAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DiscoveryConIAContent />
    </>
  )
}
