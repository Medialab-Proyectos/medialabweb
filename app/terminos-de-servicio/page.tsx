import type { Metadata } from "next"
import { TermsContent } from "./terms-content"

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description:
    "Términos y condiciones de uso de los servicios de MediaLab Ingeniería.",
  alternates: {
    canonical: "/terminos-de-servicio",
    languages: {
      es: "/terminos-de-servicio",
      en: "/en/terminos-de-servicio",
      "x-default": "/terminos-de-servicio",
    },
  },
}

export default function TerminosDeServicio() {
  return <TermsContent />
}
