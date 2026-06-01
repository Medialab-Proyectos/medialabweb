"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Package } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { BookingModal } from "./booking-modal"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Staggered entrance
    const timer = setTimeout(() => setReady(true), 100)

    const canvas = canvasRef.current
    if (!canvas) return

    // Skip animation on mobile or when user prefers reduced motion
    const isMobile = window.innerWidth < 768
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (isMobile || prefersReducedMotion) return () => clearTimeout(timer)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let frame = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const html = document.documentElement
    const isLight = html.classList.contains("light") || html.classList.contains("warm")
    const a = isLight ? [0.72, 0.65, 0.60, 0.50] : [0.35, 0.30, 0.28, 0.22]

    const blobs = [
      { x: 0.15, y: 0.25, r: 0.5, color: `rgba(232,117,26,${a[0]})`,  dx: 0.00005,  dy: 0.00003  },
      { x: 0.8,  y: 0.55, r: 0.45, color: `rgba(42,171,179,${a[1]})`, dx: -0.00003, dy: 0.00004  },
      { x: 0.5,  y: 0.85, r: 0.4, color: `rgba(232,117,26,${a[2]})`,  dx: 0.00003,  dy: -0.00005 },
      { x: 0.65, y: 0.15, r: 0.3, color: `rgba(42,171,179,${a[3]})`,  dx: -0.00002, dy: 0.00003  },
    ]

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      frame += 1

      blobs.forEach((b) => {
        const cx = (b.x + Math.sin(frame * b.dx * 1000) * 0.08) * w
        const cy = (b.y + Math.cos(frame * b.dy * 1000) * 0.06) * h
        const radius = b.r * Math.min(w, h)
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grad.addColorStop(0, b.color)
        grad.addColorStop(0.6, b.color.replace(/[\d.]+\)$/, "0.05)"))
        grad.addColorStop(1, "transparent")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--surface-dark)] text-foreground transition-colors duration-300"
      aria-label="Hero"
    >
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none hero-canvas"
        aria-hidden="true"
      />

      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, var(--vignette-color) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-20 pb-24">
        {/* Chip — social proof */}
        <div
          className={`flex justify-center transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "0ms" }}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border dark:border-white/10 border-foreground/10 dark:bg-white/5 bg-foreground/5 backdrop-blur-sm text-xs font-medium dark:text-white/75 text-foreground/75">
            <Sparkles size={12} style={{ color: "var(--magenta)" }} />
            {t("40+ productos en producción · 7 países", "40+ products in production · 7 countries")}
          </div>
        </div>

        {/* Headline */}
        <h1
          className={`font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.07] text-balance dark:text-white text-foreground transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "100ms" }}
        >
          {t("Diseñamos ", "We design ")}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #E8772E 0%, #1A8A9E 100%)" }}>
            {t("productos digitales", "digital products")}
          </span>
          {t(" que la gente ama", " people love")}
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg md:text-xl dark:text-white/65 text-muted-foreground max-w-2xl leading-relaxed text-pretty transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "200ms" }}
        >
          {t(
            "Con IA y psicología del consumidor, llevamos tu idea de algo vago a un producto validado con evidencia real — no con suposiciones.",
            "With AI and consumer psychology, we take your idea from something vague to a product validated with real evidence — not assumptions."
          )}
        </p>

        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <BookingModal>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-colors duration-200 active:scale-95 shadow-lg hover:brightness-110 w-full sm:w-auto"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}
              >
                {t("Quiero transformar mi producto", "I want to transform my product")}
              </button>
            </BookingModal>
            <a
              href="#uxbox"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold border dark:border-white/15 border-foreground/15 dark:text-white/75 text-foreground/75 dark:hover:text-white hover:text-foreground dark:hover:border-white/30 hover:border-foreground/30 dark:hover:bg-white/5 hover:bg-foreground/5 transition-all duration-200 active:scale-95 w-full sm:w-auto"
            >
              <Package size={15} />
              {t("Probar UXBox gratis", "Try UXBox free")}
            </a>
          </div>
          <p className="text-xs dark:text-white/60 text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-pulse" />
            {t("UXBox · tu brief de producto con IA en minutos · 30 min gratis, respuesta en 24h", "UXBox · your AI product brief in minutes · 30 min free, reply within 24h")}
          </p>
        </div>

        {/* Logos del ecosistema */}
        <div
          className={`flex flex-col items-center gap-5 pt-8 transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <span className="text-[11px] uppercase tracking-[0.18em] dark:text-white/40 text-foreground/40">
            {t("Somos un ecosistema", "We are one ecosystem")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 md:gap-x-16 gap-y-5">
            {[
              { src: "/images/ecosistema/Factory.svg", alt: "UXFactory", href: "" },
              { src: "/images/ecosistema/lab.svg", alt: "UXLab", href: "" },
              { src: "/images/ecosistema/school.svg", alt: "UXSchool", href: "" },
              { src: "/images/curso/logos/UXGENN34.svg", alt: "UXGreen", href: "/uxgreen" },
              { src: "/images/curso/logos/colorui.fw.png", alt: "ZeroUI", href: "https://www.zeroui.me/" },
            ].map((logo) =>
              logo.href ? (
                <Link key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer" className="opacity-65 hover:opacity-95 transition-opacity">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={150}
                    height={40}
                    className="h-6 sm:h-8 md:h-9 w-auto dark:brightness-0 dark:invert"
                    unoptimized
                  />
                </Link>
              ) : (
                <Image
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={40}
                  className="h-6 sm:h-8 md:h-9 w-auto opacity-65 hover:opacity-95 transition-opacity dark:brightness-0 dark:invert"
                />
              )
            )}
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 dark:text-white/25 text-foreground/25 animate-bounce-slow">
        <span className="text-xs tracking-widest uppercase text-center whitespace-nowrap">{t("Ver cómo trabajamos", "See how we work")}</span>
        <div className="w-px h-10 bg-gradient-to-b dark:from-white/25 from-foreground/25 to-transparent" />
      </div>
    </section>
  )
}
