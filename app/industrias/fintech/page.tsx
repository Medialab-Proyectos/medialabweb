import type { Metadata } from "next"
import { FintechContent } from "@/components/industrias/fintech-content"

export const metadata: Metadata = {
  title: "Diseño UX para Fintech: experiencias que generan confianza",
  description:
    "Diseño UX y conductual para fintech, banca, pagos y crédito. Reducimos fricción y ansiedad en onboarding y KYC con investigación, psicología del consumidor e IA.",
  alternates: {
    canonical: "/industrias/fintech",
    languages: {
      es: "/industrias/fintech",
      en: "/en/industrias/fintech",
      "x-default": "/industrias/fintech",
    },
  },
  openGraph: {
    title: "Diseño UX para Fintech | MediaLab Ingeniería",
    description:
      "Experiencias financieras donde la confianza se siente. UX + diseño conductual + IA para fintech, banca y pagos.",
    type: "article",
    url: "/industrias/fintech",
    images: [{ url: "/images/industry_fintech.jpg", width: 1200, height: 630, alt: "Diseño UX para Fintech" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_fintech.jpg"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño UX para Fintech",
  name: "Diseño UX y conductual para Fintech",
  url: "https://medialab.design/industrias/fintech",
  description:
    "Diseño de experiencias para productos fintech, banca, pagos y crédito: onboarding sin fricción, cumplimiento KYC/AML usable y diseño conductual ético para reducir la ansiedad del usuario.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [
    { "@type": "Audience", audienceType: "Startups fintech" },
    { "@type": "BusinessAudience", audienceType: "Bancos y entidades financieras" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Por qué la UX en fintech es diferente?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque el usuario arriesga su dinero. La fricción emocional —miedo a equivocarse, desconfianza, ansiedad— pesa más que en otros sectores. Diseñar fintech es diseñar confianza: cada interacción debe reducir la percepción de riesgo y dar control al usuario.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el diseño conductual aplicado a fintech?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es aplicar psicología del consumidor —sesgos, anclas de decisión, momentos de fricción— para guiar al usuario hacia decisiones financieras informadas y seguras, de forma ética. No es manipular: es respetar cómo las personas realmente deciden bajo incertidumbre.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo reducen el abandono en el onboarding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mapeamos cada paso del registro y KYC, identificamos dónde y por qué el usuario duda, y rediseñamos esos momentos: dividir tareas, mostrar progreso, anticipar objeciones y dar señales de seguridad justo donde aparece la ansiedad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Trabajan con startups fintech y con bancos establecidos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Con startups aceleramos el discovery y la validación antes de invertir en desarrollo; con bancos y entidades establecidas rediseñamos flujos críticos y modernizamos experiencias sin romper la operación.",
      },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Industrias", item: "https://medialab.design/industrias/fintech" },
    { "@type": "ListItem", position: 3, name: "Fintech", item: "https://medialab.design/industrias/fintech" },
  ],
}

export default function FintechPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <FintechContent />
    </>
  )
}
