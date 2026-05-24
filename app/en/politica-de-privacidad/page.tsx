import type { Metadata } from "next"
import { PrivacyContent } from "../../politica-de-privacidad/privacy-content"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Privacy Policy",
  description:
    "MediaLab Ingeniería privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/en/politica-de-privacidad",
    languages: {
      es: "/politica-de-privacidad",
      en: "/en/politica-de-privacidad",
      "x-default": "/politica-de-privacidad",
    },
  },
}

export default function PrivacyEn() {
  return <PrivacyContent />
}
