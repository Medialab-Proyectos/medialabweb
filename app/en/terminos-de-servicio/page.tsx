import type { Metadata } from "next"
import { TermsContent } from "../../terminos-de-servicio/terms-content"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using MediaLab Ingeniería's services.",
  alternates: {
    canonical: "/en/terminos-de-servicio",
    languages: {
      es: "/terminos-de-servicio",
      en: "/en/terminos-de-servicio",
      "x-default": "/terminos-de-servicio",
    },
  },
}

export default function TermsEn() {
  return <TermsContent />
}
