"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const logos = [
  { id: 1, src: "/images/1.svg", alt: "Brand 1" },
  { id: 2, src: "/images/2.svg", alt: "Brand 2" },
  { id: 3, src: "/images/3.svg", alt: "Brand 3" },
  { id: 4, src: "/images/4.svg", alt: "Brand 4" },
  { id: 5, src: "/images/5.svg", alt: "Brand 5" },
  { id: 6, src: "/images/6.svg", alt: "Brand 6" },
  { id: 7, src: "/images/7.svg", alt: "Brand 7" },
  { id: 8, src: "/images/8.svg", alt: "Brand 8" },
  { id: 9, src: "/images/9.svg", alt: "Brand 9" },
  { id: 10, src: "/images/10.svg", alt: "Brand 10" },
  { id: 11, src: "/images/11.svg", alt: "Brand 11" },
]

export function ClientLogos() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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
      aria-label="La confianza de empresas líderes"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Equipos que dejaron de adivinar y empezaron a diseñar con evidencia
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

        /* Dark mode: logos are nearly white → push to near-white so brands like
           Kupi / Vinnove are clearly readable on the dark background */
        .dark .client-logo {
          filter: grayscale(1) brightness(1.6) contrast(1.05);
          opacity: 0.85;
        }
        .dark .client-logo:hover {
          filter: grayscale(1) brightness(2) contrast(1.1);
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
