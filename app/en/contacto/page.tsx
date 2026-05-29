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
    images: [{ url: "/images/og-contact.png", width: 1200, height: 630, alt: "Contact MediaLab — Schedule a Free Discovery Session" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | MediaLab Ingeniería",
    description:
      "Tell us what you want to build. We reply within 24 hours.",
    images: ["/images/og-contact.png"],
  },
}

export default ContactoPage
