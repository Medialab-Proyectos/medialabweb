import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CRO for SaaS: conversion optimization with data and AI",
  description:
    "Conversion rate optimization (CRO) for SaaS: activation, retention, and expansion. More conversion without spending more on traffic, with data, UX, and AI.",
  alternates: {
    canonical: "/en/servicios/cro-saas",
    languages: {
      es: "/servicios/cro-saas",
      en: "/en/servicios/cro-saas",
      "x-default": "/servicios/cro-saas",
    },
  },
  openGraph: {
    title: "CRO for SaaS | MediaLab Ingeniería",
    description:
      "Convert more without spending more on traffic. Activation, retention, and expansion optimization with data and AI.",
    type: "article",
    locale: "en_US",
    url: "/en/servicios/cro-saas",
    images: [{ url: "/images/ux-research.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ux-research.jpg"] },
}

export { default } from "../../../servicios/cro-saas/page"
