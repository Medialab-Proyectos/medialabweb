import type { Metadata } from "next"
import ContactoPage from "../../contacto/page"

export const metadata: Metadata = {
  title: "Contact — Book a Free Discovery Call",
  description:
    "Book a free 30-minute discovery session with MediaLab Ingeniería. Let's talk about your digital product, UX/UI, AI or software development.",
  alternates: {
    canonical: "/en/contacto",
    languages: {
      es: "/contacto",
      en: "/en/contacto",
      "x-default": "/contacto",
    },
  },
  openGraph: {
    title: "Contact MediaLab — Book Your Free Discovery Call",
    description:
      "30 minutes to explore how to transform your digital product. No strings attached. Response within 24 hours.",
    url: "/en/contacto",
    locale: "en_US",
  },
}

export default ContactoPage
