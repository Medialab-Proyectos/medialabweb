import type { Metadata } from "next"
import { PrivacyContent } from "./privacy-content"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de MediaLab Ingeniería. Conoce cómo recopilamos, usamos y protegemos tu información personal.",
  alternates: {
    canonical: "/politica-de-privacidad",
    languages: {
      es: "/politica-de-privacidad",
      en: "/en/politica-de-privacidad",
      "x-default": "/politica-de-privacidad",
    },
  },
}

export default function PoliticaDePrivacidad() {
  return <PrivacyContent />
}
