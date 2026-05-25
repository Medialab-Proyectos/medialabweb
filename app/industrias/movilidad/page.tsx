import type { Metadata } from "next"
import { MovilidadContent } from "@/components/industrias/movilidad-content"

export const metadata: Metadata = {
  title: "Diseño UX para movilidad: apps de transporte simples y seguras",
  description:
    "Diseño UX y conductual para movilidad, transporte y logística. Experiencias en tiempo real, seguras y claras para usuarios y operadores, con investigación e IA.",
  alternates: {
    canonical: "/industrias/movilidad",
    languages: {
      es: "/industrias/movilidad",
      en: "/en/industrias/movilidad",
      "x-default": "/industrias/movilidad",
    },
  },
  openGraph: {
    title: "Diseño UX para movilidad | MediaLab Ingeniería",
    description:
      "Interfaces que hacen que moverte sea simple y seguro. UX + diseño conductual + IA para movilidad y transporte.",
    type: "article",
    url: "/industrias/movilidad",
    images: [{ url: "/images/industry_movilidad.jpg", width: 1200, height: 630, alt: "Diseño UX para movilidad" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_movilidad.jpg"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño UX para movilidad",
  name: "Diseño UX y conductual para movilidad",
  url: "https://medialab.design/industrias/movilidad",
  description:
    "Diseño de experiencias para movilidad, transporte y logística: diseño para el contexto real en movimiento, información en tiempo real, confianza y seguridad, y experiencias para conductores y pasajeros.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [
    { "@type": "Audience", audienceType: "Apps de movilidad y transporte" },
    { "@type": "BusinessAudience", audienceType: "Empresas de logística y movilidad" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Por qué la UX es crítica en apps de movilidad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque el usuario las usa en movimiento, con prisa y atención dividida. Cada segundo de confusión es frustración y a veces riesgo. Una buena UX hace que la información correcta aparezca en el momento exacto, con el mínimo esfuerzo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo diseñan para el uso en movimiento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Priorizamos lo esencial, usamos objetivos táctiles grandes, jerarquía clara y feedback inmediato. Reducimos la carga cognitiva para que el usuario actúe casi sin pensar, incluso con una sola mano.",
      },
    },
    {
      "@type": "Question",
      name: "¿Diseñan para conductores y pasajeros?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La movilidad es un producto de dos caras: la experiencia de quien se mueve y la de quien opera. Diseñamos ambas para que el sistema completo funcione con fluidez.",
      },
    },
    {
      "@type": "Question",
      name: "¿Consideran seguridad y tiempo real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Integramos estados en vivo, señales de seguridad e identidad, y diseñamos para situaciones límite (sin señal, retrasos, cancelaciones) para que el usuario nunca se sienta perdido.",
      },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Industrias", item: "https://medialab.design/industrias/movilidad" },
    { "@type": "ListItem", position: 3, name: "Movilidad", item: "https://medialab.design/industrias/movilidad" },
  ],
}

export default function MovilidadPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <MovilidadContent />
    </>
  )
}
