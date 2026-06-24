"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

// TODO: Replace placeholder names with real client names + logos when available
const logos = [
  { id: 1, src: "/images/1.svg", alt: "Client logo — FinTech" },
  { id: 2, src: "/images/2.svg", alt: "Client logo — SaaS B2B" },
  { id: 3, src: "/images/3.svg", alt: "Client logo — E-commerce" },
  { id: 4, src: "/images/4.svg", alt: "Client logo — HealthTech" },
  { id: 5, src: "/images/5.svg", alt: "Client logo — Banking" },
  { id: 6, src: "/images/6.svg", alt: "Client logo — Mobility" },
  { id: 7, src: "/images/7.svg", alt: "Client logo — Education" },
  { id: 8, src: "/images/8.svg", alt: "Client logo — Sustainability" },
  { id: 9, src: "/images/9.svg", alt: "Client logo — Retail" },
  { id: 10, src: "/images/10.svg", alt: "Client logo — Startup" },
  { id: 11, src: "/images/11.svg", alt: "Client logo — Enterprise" },
]

export function ClientLogos() {
  const { t } = useLanguage()
  // Duplicamos para que el bucle del marquee sea continuo
  const loop = [...logos, ...logos]

  return (
    <section
      className="py-14 px-6 bg-background"
      aria-label={t("La confianza de empresas líderes", "Trusted by leading companies")}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {t(
            "Equipos que dejaron de adivinar y empezaron a diseñar con evidencia",
            "Teams that stopped guessing and started designing with evidence"
          )}
        </p>

        {/* Carrusel lento de marcas (con desvanecido en los bordes) */}
        <div
          className="relative overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
            maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <div className="flex w-max items-center gap-x-12 md:gap-x-16 animate-marquee" style={{ animationDuration: "55s" }}>
            {loop.map((logo, i) => (
              <div key={`${logo.id}-${i}`} className="flex items-center justify-center shrink-0" aria-hidden={i >= logos.length}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={44}
                  className="client-logo"
                  style={{ width: "auto", height: "38px", maxWidth: "130px", objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scoped styles to handle light/dark logo appearance */}
      <style>{`
        /* Light mode: logos are nearly white → invert + grayscale = dark gray */
        .client-logo {
          filter: grayscale(1) invert(1) brightness(0.55);
          opacity: 0.78;
          transition: opacity 0.25s ease, filter 0.25s ease;
        }
        .client-logo:hover {
          filter: grayscale(1) invert(1) brightness(0.3);
          opacity: 1;
        }

        /* Dark / Pure-dark mode: keep logos light so they read on dark backgrounds */
        .dark .client-logo,
        .pure-dark .client-logo {
          filter: grayscale(1) brightness(1.6) contrast(1.05);
          opacity: 0.85;
        }
        .dark .client-logo:hover,
        .pure-dark .client-logo:hover {
          filter: grayscale(1) brightness(2) contrast(1.1);
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
