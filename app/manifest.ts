import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MediaLab Ingeniería",
    short_name: "MediaLab",
    description: "Agencia de diseño UX, inteligencia artificial y diseño conductual para crear productos digitales extraordinarios.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#E8751A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
