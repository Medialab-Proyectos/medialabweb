"use client"

import { useEffect, useRef, useState } from "react"
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
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-14 px-6 bg-background border-b border-border"
      aria-label={t("La confianza de empresas líderes", "Trusted by leading companies")}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {t(
            "Equipos que dejaron de adivinar y empezaron a diseñar con evidencia",
            "Teams that stopped guessing and started designing with evidence"
          )}
        </p>

        <div
          className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {logos.map((logo, i) => (
            <div
              key={logo.id}
              className="flex items-center justify-center"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/*
                Light mode: logos are very light/white → invert to make them dark gray
                Dark mode:  logos are very light/white → keep as-is but dim slightly
                grayscale(1) ensures no color
                invert(1) in light mode makes white → black
              */}
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={44}
                className="client-logo"
                style={{
                  width: "auto",
                  height: "38px",
                  maxWidth: "130px",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
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
