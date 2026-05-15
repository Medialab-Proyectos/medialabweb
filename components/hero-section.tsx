"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, Package } from "lucide-react"
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

    const blobs = [
      { x: 0.15, y: 0.25, r: 0.5, color: "rgba(232,117,26,0.22)", dx: 0.00005, dy: 0.00003 },
      { x: 0.8, y: 0.55, r: 0.45, color: "rgba(42,171,179,0.18)", dx: -0.00003, dy: 0.00004 },
      { x: 0.5, y: 0.85, r: 0.4, color: "rgba(232,117,26,0.14)", dx: 0.00003, dy: -0.00005 },
      { x: 0.65, y: 0.15, r: 0.3, color: "rgba(42,171,179,0.1)", dx: -0.00002, dy: 0.00003 },
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--surface-dark)] text-[var(--surface-dark-fg)]"
      aria-label="Hero"
    >
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-20 pb-28">
        {/* Badge with social proof */}
        <div
          className={`inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs sm:text-sm font-medium text-white/75 transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "0ms" }}
        >
          <span className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles size={13} style={{ color: "var(--magenta)" }} />
            {t("40+ productos que conectan y convierten", "40+ products that connect & convert")}
          </span>
          <span className="hidden sm:inline w-px h-4 bg-white/20" aria-hidden="true" />
          <a
            href="https://a.co/d/069qLWdY"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-xs font-semibold hover:underline transition-colors"
            style={{ color: "var(--cyan)" }}
          >
            {t("Autores de 'Bienvenidos al Zero UI' →", "Authors of 'Welcome to Zero UI' →")}
          </a>
        </div>

        {/* Headline */}
        <h1
          className={`font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.07] text-balance text-white transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "100ms" }}
        >
          {t("Tu producto merece", "Your product deserves")}{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #E8751A, #2AABB3)" }}>
            {t("usuarios que lo amen.", "users who love it.")}
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg md:text-xl text-white/65 max-w-2xl leading-relaxed text-pretty transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "200ms" }}
        >
          {t(
            "Diseño UX + IA + psicología del consumidor. Creamos experiencias digitales que posicionan, conectan y convierten.",
            "UX design + AI + consumer psychology. We create digital experiences that rank, connect, and convert."
          )}
        </p>

        <div
          className={`flex flex-col items-center gap-4 mt-2 transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <BookingModal>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-[15px] text-white transition-colors duration-200 active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}
              >
                {t("Quiero transformar mi producto", "I want to transform my product")}
              </button>
            </BookingModal>
            <Link
              href="#uxbox"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              <Package size={16} />
              {t("Probar UXBox gratis →", "Try UXBox free →")}
            </Link>
          </div>
          <p className="text-xs text-white/40 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t("30 min gratis · Sin compromiso · Respuesta en 24h", "30 min free · No commitment · Response in 24h")}
          </p>
        </div>


      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 animate-bounce-slow">
        <span className="text-xs tracking-widest uppercase">{t("Explorar", "Explore")}</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
      </div>
    </section>
  )
}
