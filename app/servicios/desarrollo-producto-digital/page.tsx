import type { Metadata } from "next"
import { DesarrolloProductoDigitalContent } from "@/components/servicios/desarrollo-producto-digital-content"

export const metadata: Metadata = {
  title: "Desarrollo de producto digital con IA y software a medida",
  description:
    "Desarrollo de software a medida: plataformas web B2B, apps B2C, MVPs y arquitecturas escalables con React, Next.js, Node.js e integración de IA.",
  alternates: {
    canonical: "/servicios/desarrollo-producto-digital",
    languages: {
      es: "/servicios/desarrollo-producto-digital",
      en: "/en/servicios/desarrollo-producto-digital",
      "x-default": "/servicios/desarrollo-producto-digital",
    },
  },
  openGraph: {
    title: "Desarrollo de producto digital con IA | MediaLab Ingeniería",
    description:
      "Plataformas web, apps y MVPs con código limpio, arquitectura escalable e integración de IA.",
    type: "article",
    url: "/servicios/desarrollo-producto-digital",
    images: [{ url: "/images/team-collaboration.png", width: 1200, height: 630, alt: "Desarrollo de producto digital con IA" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/team-collaboration.png"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Desarrollo de producto digital",
  name: "Desarrollo de producto digital y software a medida",
  url: "https://medialab.design/servicios/desarrollo-producto-digital",
  description:
    "Desarrollo de software a medida: plataformas web B2B, apps móviles B2C, MVPs, arquitecturas escalables en la nube e integraciones con IA y APIs, conectado a investigación y diseño UX.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [
    { "@type": "Audience", audienceType: "Startups y marcas B2C" },
    { "@type": "BusinessAudience", audienceType: "Empresas B2B y SaaS" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué tecnologías usan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trabajamos principalmente con React, Next.js y Node.js, sobre arquitecturas en la nube, e integramos IA y APIs según el producto. Elegimos el stack según tus necesidades y tu equipo, no al revés.",
      },
    },
    {
      "@type": "Question",
      name: "¿Construyen MVPs para startups?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Construimos el núcleo de valor de tu producto rápido para que valides con usuarios reales antes de invertir en features que quizá nadie use. El objetivo es aprender, no solo entregar código.",
      },
    },
    {
      "@type": "Question",
      name: "¿Integran inteligencia artificial en el producto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, cuando aporta valor real: desde funcionalidades con modelos de lenguaje hasta automatización de flujos. Evitamos meter IA por moda — la usamos cuando resuelve un problema concreto del usuario o del negocio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hacen diseño y desarrollo o solo desarrollo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ambos. Lo ideal es el camino completo (investigación, diseño UX/UI y desarrollo) para que el producto sea coherente de punta a punta. Pero si ya tienes diseño, también desarrollamos a partir de él.",
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
    { "@type": "ListItem", position: 3, name: "Desarrollo de producto digital", item: "https://medialab.design/servicios/desarrollo-producto-digital" },
  ],
}

export default function DesarrolloProductoDigitalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DesarrolloProductoDigitalContent />
    </>
  )
}
