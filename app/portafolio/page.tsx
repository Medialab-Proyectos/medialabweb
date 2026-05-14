import type { Metadata } from "next"
import { PortfolioContent } from "./portfolio-content"

export const metadata: Metadata = {
  title: "Portafolio | Casos de Éxito en UX, IA y Productos Digitales",
  description:
    "Descubre cómo MediaLab Ingeniería ha transformado productos digitales para empresas B2B y B2C. Casos de éxito reales con resultados medibles en UX/UI, IA y desarrollo de software.",
  openGraph: {
    title: "Portafolio MediaLab | Productos Digitales que Generan Resultados",
    description:
      "40+ productos diseñados con datos, psicología del consumidor e IA. Conoce cómo hemos ayudado a empresas a aumentar conversión, retención y satisfacción de usuarios.",
    images: [{ url: "/images/portfolio-hero.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/portafolio",
  },
}

export default function PortafolioPage() {
  return <PortfolioContent />
}
