import type { Metadata } from "next"
import { PortfolioContent } from "./portfolio-content"

export const metadata: Metadata = {
  title: "Portafolio — Casos de Éxito en UX, IA y Productos Digitales",
  description:
    "Descubre cómo MediaLab Ingeniería ha transformado productos digitales para empresas B2B y B2C, incluyendo SinDeudas para finanzas conductuales y Electrolineras para movilidad eléctrica.",
  keywords: [
    "SinDeudas",
    "Electrolineras",
    "finanzas conductuales",
    "psicologia del dinero",
    "vehiculos electricos",
    "carga electrica",
    "autonomia vehiculos electricos",
    "ansiedad de carga",
    "productos digitales B2C",
    "UX para fintech",
    "UX para movilidad electrica",
  ],
  openGraph: {
    title: "Portafolio MediaLab | Productos Digitales que Generan Resultados",
    description:
      "40+ productos diseñados con datos, psicología del consumidor e IA. Incluye SinDeudas para mejorar la relación psicológica con el dinero y Electrolineras para planificar energía, autonomía y carga.",
    url: "/portafolio",
    images: [{ url: "/images/og-portfolio.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portafolio MediaLab | Productos Digitales que Generan Resultados",
    description:
      "40+ productos diseñados con UX, IA y psicología del consumidor. Resultados medibles en conversión y retención.",
    images: ["/images/og-portfolio.png"],
  },
  alternates: {
    canonical: "/portafolio",
    languages: {
      es: "/portafolio",
      en: "/en/portafolio",
      "x-default": "/portafolio",
    },
  },
}

export default function PortafolioPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Productos digitales propios de MediaLab Ingenieria",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SoftwareApplication",
          name: "SinDeudas",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web, iOS, Android",
          creator: {
            "@type": "Organization",
            name: "MediaLab Ingenieria",
            url: "https://medialab.design",
          },
          description:
            "SinDeudas ayuda a las personas a manejar sus finanzas de forma eficiente entendiendo el rol psicologico del dinero. Combina finanzas conductuales, psicologia del consumidor y herramientas digitales para transformar la relacion del usuario con sus deudas.",
          keywords:
            "SinDeudas, finanzas personales, finanzas conductuales, psicologia del dinero, manejo de deudas, UX financiero",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "SoftwareApplication",
          name: "Electrolineras",
          applicationCategory: "TravelApplication",
          operatingSystem: "Web, iOS, Android",
          creator: {
            "@type": "Organization",
            name: "MediaLab Ingenieria",
            url: "https://medialab.design",
          },
          description:
            "Electrolineras ayuda a conductores de vehiculos electricos a moverse con tranquilidad, tomar decisiones inteligentes sobre energia, autonomia y carga, y reducir la ansiedad y el tiempo invertido en planificar desplazamientos.",
          keywords:
            "Electrolineras, vehiculos electricos, estaciones de carga, autonomia, energia, movilidad electrica, ansiedad de carga",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <PortfolioContent />
    </>
  )
}
