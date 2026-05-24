import type { Metadata } from "next"
import { StartupsContent } from "@/components/industrias/startups-content"

export const metadata: Metadata = {
  title: "UX y diseño de producto para startups: de idea a MVP validado",
  description:
    "Validamos, diseñamos y construimos productos para startups con discovery con IA, UX y desarrollo de MVP. De idea vaga a producto validado antes de quedarte sin runway.",
  alternates: {
    canonical: "/industrias/startups",
    languages: {
      es: "/industrias/startups",
      en: "/en/industrias/startups",
      "x-default": "/industrias/startups",
    },
  },
  openGraph: {
    title: "UX y producto para startups | MediaLab Ingeniería",
    description:
      "De idea a producto validado: discovery con IA, diseño UX y desarrollo de MVP para startups.",
    type: "article",
    url: "/industrias/startups",
    images: [{ url: "/images/industry_startups.jpg", width: 1200, height: 630, alt: "UX y producto para startups" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_startups.jpg"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño y desarrollo de producto para startups",
  name: "UX y producto para startups",
  url: "https://medialab.design/industrias/startups",
  description:
    "Validación, diseño y desarrollo de productos digitales para startups: discovery con IA, diseño UX/UI y construcción de MVP con foco en velocidad y validación.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [{ "@type": "Audience", audienceType: "Startups y founders" }],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Por qué invertir en UX siendo una startup temprana?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque el mayor riesgo de una startup no es construir mal, es construir lo equivocado. La investigación y el diseño temprano evitan que quemes runway en features que nadie usa. Buena UX desde el día 1 acelera la validación y mejora la conversión y retención que tus inversores miran.",
      },
    },
    {
      "@type": "Question",
      name: "¿Me ayudan a validar la idea antes de desarrollar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Con el discovery de producto con IA convertimos tu idea en un brief accionable y hipótesis claras para validar con usuarios, antes de escribir una línea de código.",
      },
    },
    {
      "@type": "Question",
      name: "¿También construyen el MVP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Hacemos investigación, diseño y desarrollo. Construimos un MVP enfocado en el núcleo de valor para que valides rápido y escales solo lo que funciona.",
      },
    },
    {
      "@type": "Question",
      name: "¿Trabajan con founders no técnicos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claro. Traducimos tu visión a producto: nos encargamos de la parte técnica y de diseño, y te damos claridad para tomar decisiones y comunicar a tu equipo e inversores.",
      },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Industrias", item: "https://medialab.design/industrias/startups" },
    { "@type": "ListItem", position: 3, name: "Startups", item: "https://medialab.design/industrias/startups" },
  ],
}

export default function StartupsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <StartupsContent />
    </>
  )
}
