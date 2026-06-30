import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: { absolute: "The Goal on Pause: VAR and Fan Emotion | MediaLab" },
  description:
    "A solution can be technically correct and emotionally damaging. How VAR is changing fan emotion, attention, and behavior — and what it teaches us about designing technology. Original article in Spanish.",

  openGraph: {
    title: "The Goal on Pause: How VAR Is Changing Fan Emotion",
    description: "When technology obsesses over being right, it can forget how it feels to use it. VAR as a case study in human experience.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/el-gol-en-pausa",
    images: [{ url: "/images/blog-gol-en-pausa.png", width: 1200, height: 630, alt: "The goal on pause: VAR and fan emotion" }],
  },
}

export { default } from "../../../blog/el-gol-en-pausa/page"
