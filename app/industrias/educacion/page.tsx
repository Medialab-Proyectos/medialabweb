import type { Metadata } from "next"
import { EducacionContent } from "@/components/industrias/educacion-content"

export const metadata: Metadata = {
  title: "Diseño UX para educación: plataformas que aumentan la finalización",
  description:
    "Diseño UX y conductual para educación, e-learning y LMS. Aumentamos la motivación y la finalización de cursos con investigación, psicología del consumidor e IA.",
  alternates: {
    canonical: "/industrias/educacion",
    languages: {
      es: "/industrias/educacion",
      en: "/en/industrias/educacion",
      "x-default": "/industrias/educacion",
    },
  },
  openGraph: {
    title: "Diseño UX para educación | MediaLab Ingeniería",
    description:
      "Plataformas donde aprender se siente natural. UX + diseño conductual + IA para e-learning, LMS y capacitación.",
    type: "article",
    url: "/industrias/educacion",
    images: [{ url: "/images/industry_educacion.jpg", width: 1200, height: 630, alt: "Diseño UX para educación" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_educacion.jpg"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño UX para educación",
  name: "Diseño UX y conductual para educación",
  url: "https://medialab.design/industrias/educacion",
  description:
    "Diseño de experiencias para plataformas educativas, e-learning, LMS y capacitación corporativa: motivación y finalización, aprendizaje sin fricción, formación de hábito y experiencias multi-rol.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [
    { "@type": "Audience", audienceType: "Instituciones educativas" },
    { "@type": "BusinessAudience", audienceType: "EdTech y empresas con capacitación" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Por qué la UX importa en plataformas educativas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque la mayor pérdida en educación digital es el abandono. Si la plataforma es confusa o desmotivante, el estudiante no vuelve. Una buena UX reduce la fricción, sostiene la motivación y aumenta las tasas de finalización.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo aumentan la finalización de cursos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aplicamos diseño conductual: progreso visible, metas alcanzables, refuerzo positivo y recordatorios que motivan sin culpar. Combinado con investigación de los estudiantes reales, rediseñamos los momentos donde la gente abandona.",
      },
    },
    {
      "@type": "Question",
      name: "¿Diseñan para LMS y e-learning corporativo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Hemos diseñado plataformas de capacitación y motores de aprendizaje para instituciones y empresas, con soporte multi-rol, seguimiento de progreso y evaluación de desempeño.",
      },
    },
    {
      "@type": "Question",
      name: "¿Trabajan con instituciones y con EdTech?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ambos. Con instituciones entendemos la complejidad de necesidades académicas y administrativas; con EdTech priorizamos validación rápida y experiencias que retienen y convierten.",
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
    { "@type": "ListItem", position: 3, name: "Educación", item: "https://medialab.design/industrias/educacion" },
  ],
}

export default function EducacionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <EducacionContent />
    </>
  )
}
