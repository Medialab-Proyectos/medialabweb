import type { Metadata } from "next"
import { BancaContent } from "@/components/industrias/banca-content"

export const metadata: Metadata = {
  title: "Diseño UX para banca: experiencias digitales que generan confianza",
  description:
    "Diseño UX y conductual para banca digital: confianza, accesibilidad y omnicanalidad. Modernizamos la experiencia bancaria con investigación, psicología del consumidor e IA.",
  alternates: {
    canonical: "/industrias/banca",
    languages: {
      es: "/industrias/banca",
      en: "/en/industrias/banca",
      "x-default": "/industrias/banca",
    },
  },
  openGraph: {
    title: "Diseño UX para banca | MediaLab Ingeniería",
    description:
      "Experiencias bancarias que eliminan la ansiedad del usuario. UX + diseño conductual + IA para banca digital.",
    type: "article",
    url: "/industrias/banca",
    images: [{ url: "/images/industry_banca.jpg", width: 1200, height: 630, alt: "Diseño UX para banca" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_banca.jpg"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño UX para banca",
  name: "Diseño UX y conductual para banca digital",
  url: "https://medialab.design/industrias/banca",
  description:
    "Diseño de experiencias para banca digital: confianza y seguridad percibida, omnicanalidad, accesibilidad e inclusión, y modernización incremental de flujos críticos respetando cumplimiento y sistemas legados.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [{ "@type": "BusinessAudience", audienceType: "Bancos y entidades financieras" }],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Por qué la UX es crítica en banca?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque la banca maneja el dinero y la tranquilidad de las personas. Una experiencia confusa no solo frustra: erosiona la confianza en la institución. Una buena UX reduce la ansiedad, baja la carga en canales de soporte y aumenta la adopción de canales digitales.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo modernizan un banco establecido sin romper la operación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trabajamos de forma incremental: priorizamos los flujos de mayor impacto, rediseñamos y validamos por fases, y respetamos los sistemas legados y los requisitos regulatorios. La meta es mejorar la experiencia sin arriesgar la estabilidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el diseño conductual aplicado a banca?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es aplicar psicología del consumidor para guiar decisiones financieras de forma clara y ética: reducir la ansiedad en transferencias, hacer entendibles productos complejos y dar al cliente sensación de control en cada paso.",
      },
    },
    {
      "@type": "Question",
      name: "¿Consideran accesibilidad y cumplimiento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Diseñamos siguiendo pautas de accesibilidad (WCAG) e integramos los requisitos regulatorios desde el inicio, para que la experiencia sea inclusiva y conforme sin sentirse como un trámite.",
      },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Industrias", item: "https://medialab.design/servicios" },
    { "@type": "ListItem", position: 3, name: "Banca", item: "https://medialab.design/industrias/banca" },
  ],
}

export default function BancaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BancaContent />
    </>
  )
}
