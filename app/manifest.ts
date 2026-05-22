import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MediaLab Ingeniería",
    short_name: "MediaLab",
    description:
      "Ingeniería de producto digital: UX, IA, software y SEO técnico para empresas B2B y B2C.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#E8751A",
    lang: "es-CO",
    dir: "ltr",
    categories: ["business", "design", "education", "productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon-dark-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
