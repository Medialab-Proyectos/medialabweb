import type { Metadata } from "next"
import { EcommerceContent } from "@/components/industrias/ecommerce-content"

export const metadata: Metadata = {
  title: "Diseño UX para e-commerce: experiencias de compra que convierten",
  description:
    "Diseño UX, conductual y CRO para e-commerce. Reducimos el abandono de carrito y aumentamos la conversión y la recompra con investigación, psicología del consumidor e IA.",
  alternates: {
    canonical: "/industrias/ecommerce",
    languages: {
      es: "/industrias/ecommerce",
      en: "/en/industrias/ecommerce",
      "x-default": "/industrias/ecommerce",
    },
  },
  openGraph: {
    title: "Diseño UX para e-commerce | MediaLab Ingeniería",
    description:
      "Experiencias de compra que convierten visitantes en clientes fieles. UX + diseño conductual + CRO.",
    type: "article",
    url: "/industrias/ecommerce",
    images: [{ url: "/images/industry_ecommerce.jpg", width: 1200, height: 630, alt: "Diseño UX para e-commerce" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/industry_ecommerce.jpg"] },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño UX para e-commerce",
  name: "Diseño UX y CRO para e-commerce",
  url: "https://medialab.design/industrias/ecommerce",
  description:
    "Diseño de experiencias de compra para e-commerce: descubrimiento y búsqueda, checkout sin abandono, confianza y prueba social, y recompra y fidelidad, con CRO basado en datos.",
  provider: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  areaServed: ["CO", "MX", "AR", "CL", "PE", "EC", "US", "ES"],
  audience: [
    { "@type": "Audience", audienceType: "Marcas B2C y retail" },
    { "@type": "BusinessAudience", audienceType: "Empresas de e-commerce" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Por qué la UX define las ventas en e-commerce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque en e-commerce cada paso de fricción es dinero que se pierde. Una búsqueda confusa, un checkout largo o una duda no resuelta se traducen en carritos abandonados. Una buena UX aumenta directamente la conversión y el ticket promedio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo reducen el abandono del carrito?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Analizamos dónde y por qué los usuarios abandonan, y rediseñamos el checkout: menos pasos, costos transparentes desde el inicio, métodos de pago claros y señales de confianza. Validamos cada cambio con datos reales.",
      },
    },
    {
      "@type": "Question",
      name: "¿Trabajan con la conversión además del diseño?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El diseño y el CRO van juntos: diseñamos la experiencia y luego medimos y optimizamos cada punto de contacto para que más visitantes compren y vuelvan.",
      },
    },
    {
      "@type": "Question",
      name: "¿Diseñan para tiendas nuevas y existentes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ambas. Para tiendas nuevas definimos la experiencia desde cero; para existentes, auditamos, priorizamos los puntos de mayor fuga y rediseñamos por fases sin frenar las ventas.",
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
    { "@type": "ListItem", position: 3, name: "E-commerce", item: "https://medialab.design/industrias/ecommerce" },
  ],
}

export default function EcommercePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <EcommerceContent />
    </>
  )
}
