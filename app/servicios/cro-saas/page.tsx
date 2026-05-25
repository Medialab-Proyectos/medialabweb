import type { Metadata } from "next"
import { CroSaasContent } from "@/components/servicios/cro-saas-content"

export const metadata: Metadata = {
  title: "CRO para SaaS: optimización de conversión con datos e IA",
  description:
    "Optimización de la tasa de conversión (CRO) para SaaS: activación, retención y expansión. Más conversión sin gastar más en tráfico, con datos, UX e IA.",
  alternates: {
    canonical: "/servicios/cro-saas",
    languages: {
      es: "/servicios/cro-saas",
      en: "/en/servicios/cro-saas",
      "x-default": "/servicios/cro-saas",
    },
  },
  openGraph: {
    title: "CRO para SaaS | MediaLab Ingeniería",
    description:
      "Convierte más sin gastar más en tráfico. Optimización de activación, retención y expansión con datos e IA.",
    type: "article",
    url: "/servicios/cro-saas",
    images: [{ url: "/images/cro-saas.png", width: 1200, height: 630, alt: "CRO para SaaS — optimización de conversión con datos e IA — MediaLab Ingeniería" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/cro-saas.png"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Optimización de conversión (CRO) para SaaS",
  name: "CRO para SaaS",
  url: "https://medialab.design/servicios/cro-saas",
  description:
    "Servicio de optimización de la tasa de conversión para productos SaaS: optimización de embudos de activación y onboarding, pricing y checkout, retención y expansión, con experimentación A/B basada en datos.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [{ "@type": "BusinessAudience", audienceType: "Empresas SaaS y B2B" }],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es el CRO (optimización de conversión)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El CRO es el proceso de aumentar el porcentaje de visitantes que realizan la acción deseada (registrarse, pagar, activar) mejorando la experiencia en lugar de comprar más tráfico. Combina análisis de datos, investigación de usuarios y experimentación.",
      },
    },
    {
      "@type": "Question",
      name: "¿En qué se diferencia el CRO para SaaS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En SaaS la conversión no termina en el registro: importa la activación, la retención y la expansión a planes superiores. Optimizamos todo el ciclo de vida, no solo la landing, porque un usuario que se registra pero no activa no genera valor.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo usan los datos y la IA en el CRO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Analizamos comportamiento real (analítica, mapas de calor, grabaciones) para encontrar dónde y por qué se pierde la conversión, y usamos IA para acelerar el análisis y generar hipótesis. Cada cambio se valida con experimentos, no con suposiciones.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda en verse resultados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las primeras mejoras de fricción pueden verse en semanas; los experimentos significativos dependen de tu volumen de tráfico para alcanzar significancia estadística. El CRO es un proceso continuo de mejora, no un arreglo único.",
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
    { "@type": "ListItem", position: 3, name: "CRO para SaaS", item: "https://medialab.design/servicios/cro-saas" },
  ],
}

export default function CroSaasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CroSaasContent />
    </>
  )
}
