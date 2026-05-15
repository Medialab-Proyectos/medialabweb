"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowDown, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function PortfolioHero() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)

    // Dot grid wave animation — unique to portfolio
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let frame = 0
    const spacing = 40
    const baseRadius = 1.2
    const maxRadius = 2.8

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      frame += 1

      const cols = Math.ceil(w / spacing) + 1
      const rows = Math.ceil(h / spacing) + 1
      const time = frame * 0.015

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing
          const y = row * spacing

          // Two wave sources for organic feel
          const dist1 = Math.sqrt((x - w * 0.3) ** 2 + (y - h * 0.4) ** 2)
          const dist2 = Math.sqrt((x - w * 0.7) ** 2 + (y - h * 0.6) ** 2)
          const wave1 = Math.sin(dist1 * 0.008 - time) * 0.5 + 0.5
          const wave2 = Math.sin(dist2 * 0.006 - time * 0.7) * 0.5 + 0.5
          const wave = (wave1 + wave2) * 0.5

          const r = baseRadius + wave * (maxRadius - baseRadius)
          const alpha = 0.04 + wave * 0.08

          // Color shifts between magenta and cyan based on position
          const colorMix = (x / w + y / h) * 0.5
          const red = Math.round(232 * (1 - colorMix) + 42 * colorMix)
          const green = Math.round(117 * (1 - colorMix) + 171 * colorMix)
          const blue = Math.round(26 * (1 - colorMix) + 179 * colorMix)

          ctx.fillStyle = `rgba(${red},${green},${blue},${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      clearTimeout(t)
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/portfolio-hero.png" alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        aria-hidden="true"
      />

      <div className={`relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-8 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--magenta)]/30 bg-[var(--magenta)]/10 text-sm">
          <Sparkles size={14} className="text-[var(--magenta)]" />
          <span className="text-[var(--magenta)] font-semibold">{t("40+ productos entregados", "40+ products delivered")}</span>
        </div>

        <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground text-balance">
          {t("Estos productos", "These products")}{" "}
          <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
            {t("ya están generando resultados.", "are already driving results.")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {t(
            "No son mockups. Son productos en producción con usuarios reales y ",
            "These aren't mockups. They are products in production with real users and "
          )}
          <strong className="text-foreground">{t("métricas que lo demuestran", "metrics that prove it")}</strong>.
        </p>

        <a href="#cases" className="group mt-4 flex flex-col items-center gap-2 text-muted-foreground hover:text-[var(--magenta)] transition-colors">
          <span className="text-sm font-medium">{t("Ver casos de éxito", "View case studies")}</span>
          <ArrowDown size={20} className="animate-bounce-slow" />
        </a>
      </div>
    </section>
  )
}
