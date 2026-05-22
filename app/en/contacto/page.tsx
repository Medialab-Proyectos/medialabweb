import type { Metadata } from "next"
import ContactoPage from "../../contacto/page"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you want to build or improve. MediaLab Ingeniería replies within 24 hours to review your product, idea, or digital platform.",
  alternates: {
    canonical: "/en/contacto",
    languages: {
      es: "/contacto",
      en: "/en/contacto",
      "x-default": "/contacto",
    },
  },
  openGraph: {
    title: "Contact | MediaLab Ingeniería",
    description:
      "Let's talk about your digital product, your users, and the next step to make it clear, useful, and measurable.",
    url: "/en/contacto",
    siteName: "MediaLab Ingeniería",
    locale: "en_US",
  },
}

export default ContactoPage
