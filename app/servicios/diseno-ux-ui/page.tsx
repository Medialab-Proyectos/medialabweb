import type { Metadata } from "next"
import { DisenoUxUiContent } from "@/components/servicios/diseno-ux-ui-content"

export const metadata: Metadata = {
  title: "Diseño UX/UI con IA y psicología del consumidor",
  description:
    "Agencia de diseño UX/UI con IA, investigación de usuarios y diseño conductual. Creamos productos digitales B2B y B2C que las personas entienden, usan y recomiendan.",
  alternates: {
    canonical: "/servicios/diseno-ux-ui",
    languages: {
      es: "/servicios/diseno-ux-ui",
      en: "/en/servicios/diseno-ux-ui",
      "x-default": "/servicios/diseno-ux-ui",
    },
  },
  openGraph: {
    title: "Diseño UX/UI con IA | MediaLab Ingeniería",
    description:
      "Investigación de usuarios, diseño conductual e IA para experiencias que conectan y convierten.",
    type: "article",
    url: "/servicios/diseno-ux-ui",
    images: [{ url: "/images/ux-research.png", width: 1200, height: 630, alt: "Diseño UX/UI con IA y psicología del consumidor — MediaLab Ingeniería" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ux-research.png"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño UX/UI",
  name: "Diseño UX/UI con IA y psicología del consumidor",
  url: "https://medialab.design/servicios/diseno-ux-ui",
  description:
    "Servicio de diseño UX/UI: investigación de usuarios, arquitectura de información, diseño de interacción, sistemas de diseño, diseño conductual y optimización de conversión para productos digitales B2B y B2C.",
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
      name: "¿Cuál es la diferencia entre UX y UI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UX (experiencia de usuario) es cómo funciona y se siente el producto: la investigación, los flujos y la lógica detrás de cada decisión. UI (interfaz de usuario) es lo visual: tipografía, color, componentes e interacción. Un buen producto necesita ambas alineadas, y en MediaLab las trabajamos juntas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo aplican IA al diseño UX/UI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Usamos IA para acelerar el discovery, generar hipótesis de usuarios y explorar variaciones de diseño más rápido. Las decisiones finales nacen de investigación real y criterio humano: la IA es un copiloto, no un reemplazo del juicio de diseño.",
      },
    },
    {
      "@type": "Question",
      name: "¿Solo diseñan o también desarrollan el producto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hacemos el camino completo: investigación, diseño UX/UI y desarrollo de software. Si solo necesitas diseño, también funciona. Nos integramos como tu equipo de producto end-to-end o en la fase que necesites.",
      },
    },
    {
      "@type": "Question",
      name: "¿Trabajan con startups y con empresas establecidas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Con startups priorizamos velocidad y validación; con empresas, rediseñamos productos existentes y construimos sistemas de diseño que escalan sin perder coherencia.",
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
    { "@type": "ListItem", position: 3, name: "Diseño UX/UI", item: "https://medialab.design/servicios/diseno-ux-ui" },
  ],
}

export default function DisenoUxUiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DisenoUxUiContent />
    </>
  )
}
