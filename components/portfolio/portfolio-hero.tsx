"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, Sparkles, Package, TrendingUp, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

function useCountUp(target: number, active: boolean, duration = 1600, decimals = 0) {
  const [count, setCount] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (!active || done.current) return
    done.current = true
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(decimals ? parseFloat(start.toFixed(decimals)) : Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, active, duration, decimals])
  return count
}

function HeroStat({ value, prefix = "", suffix = "", decimals = 0, label, color, icon: Icon, active }: {
  value: number; prefix?: string; suffix?: string; decimals?: number; label: string; color: string; icon: React.ElementType; active: boolean
}) {
  const count = useCountUp(value, active, 1600, decimals)
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-5 sm:px-7">
      <span className="flex items-center justify-center w-9 h-9 rounded-xl mb-0.5" style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}>
        <Icon size={17} strokeWidth={2.2} />
      </span>
      <span className="font-[family-name:var(--font-metrics)] font-bold text-3xl sm:text-4xl lg:text-5xl tabular-nums leading-none" style={{ color }}>
        {prefix}{count}<span>{suffix}</span>
      </span>
      <span className="text-[10px] sm:text-xs text-muted-foreground text-center leading-snug max-w-[10ch]">{label}</span>
    </div>
  )
}

export function PortfolioHero() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const tmo = setTimeout(() => setVisible(true), 100)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    // En móvil no corremos la animación
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    if (!canvas || !ctx || isMobile) return () => clearTimeout(tmo)

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // ── Constelación minimalista (cian/teal) ─────────────────────
    const TEAL = "42,171,179"
    const ORANGE = "232,117,26" // estrella que se forma al unirse los puntos
    const ACCENT = "120,150,200" // azul tenue ocasional, sin morado dominante
    const LINK = 100   // distancia máx. para unir puntos (líneas más cortas)
    const CR = 96      // radio del cursor (menos sensible: solo muy cerca)
    const NEAR_MIN = 0.32 // umbral: solo puntos muy próximos reaccionan

    type P = { x: number; y: number; vx: number; vy: number; dx: number; dy: number; accent: boolean; star: boolean; phase: number }
    let particles: P[] = []
    let starIdx: number[] = []
    // Constelaciones efímeras: nacen, brillan y se desvanecen
    type Constellation = { idx: number[]; links: [number, number][]; life: number; max: number }
    let constellations: Constellation[] = []
    let nextSpawn = 50

    const build = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const w = canvas.width, h = canvas.height
      const count = Math.min(96, Math.max(36, Math.floor((w * h) / 16000)))
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        dx: 0,
        dy: 0,
        accent: i % 6 === 0,
        star: i % 4 === 0,
        phase: Math.random() * Math.PI * 2,
      }))
      starIdx = particles.map((p, i) => (p.star ? i : -1)).filter((i) => i >= 0)
      constellations = []
      nextSpawn = 50
    }
    build()
    window.addEventListener("resize", build)

    const mouse = { x: -9999, y: -9999 }
    let lastMove = -9999
    let frame = 0
    let animId = 0

    const onMove = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = cx - rect.left
      mouse.y = cy - rect.top
      lastMove = frame
    }
    const pointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY)
    const touchMove = (e: TouchEvent) => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY) }
    window.addEventListener("pointermove", pointerMove, { passive: true })
    window.addEventListener("touchmove", touchMove, { passive: true })

    // Pequeño destello en forma de estrella (punto + cruz de rayos)
    const glint = (x: number, y: number, r: number, alpha: number, rgb: string = TEAL) => {
      ctx.fillStyle = `rgba(${rgb},${alpha})`
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = `rgba(${rgb},${alpha * 0.5})`
      ctx.lineWidth = 1
      const ray = r * 2.8
      ctx.beginPath()
      ctx.moveTo(x - ray, y); ctx.lineTo(x + ray, y)
      ctx.moveTo(x, y - ray); ctx.lineTo(x, y + ray)
      ctx.stroke()
    }

    const step = () => {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      frame += 1
      const cursorOn = frame - lastMove < 90

      // 1) Deriva lenta + posición de dibujo (atracción muy leve, reversible)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10
        p.dx = p.x; p.dy = p.y
        if (cursorOn) {
          const ax = mouse.x - p.x, ay = mouse.y - p.y
          const d = Math.hypot(ax, ay)
          if (d < CR && d > 0.001) {
            const f = (1 - d / CR) * 0.1 // máx 10% de desplazamiento
            p.dx += ax * f
            p.dy += ay * f
          }
        }
      }

      // 2) Líneas entre puntos cercanos (la "constelación")
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.dx - b.dx, dy = a.dy - b.dy
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.16
            ctx.strokeStyle = `rgba(${TEAL},${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.dx, a.dy)
            ctx.lineTo(b.dx, b.dy)
            ctx.stroke()
          }
        }
      }

      // 2.5) Titileo sutil de estrellas
      for (const i of starIdx) {
        const p = particles[i]
        const tw = 0.5 + 0.5 * Math.sin(frame * 0.03 + p.phase)
        glint(p.dx, p.dy, 1.1 + tw * 0.7, 0.1 + tw * 0.2)
      }

      // 2.6) Constelaciones efímeras — nacen, brillan y se desvanecen
      if (frame >= nextSpawn && constellations.length < 3 && starIdx.length) {
        nextSpawn = frame + 80 + Math.floor(Math.random() * 130)
        const c = starIdx[Math.floor(Math.random() * starIdx.length)]
        const cp = particles[c]
        const near = particles
          .map((p, i) => ({ i, d: Math.hypot(p.x - cp.x, p.y - cp.y) }))
          .filter((o) => o.i !== c && o.d < 118)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
        if (near.length >= 2) {
          constellations.push({
            idx: [c, ...near.map((o) => o.i)],
            links: near.map((o) => [c, o.i] as [number, number]),
            life: 0,
            max: 200 + Math.floor(Math.random() * 140),
          })
        }
      }
      constellations = constellations.filter((cst) => {
        cst.life += 1
        const env = Math.sin(Math.PI * (cst.life / cst.max)) // 0 → 1 → 0
        for (const [a, b] of cst.links) {
          const pa = particles[a], pb = particles[b]
          ctx.strokeStyle = `rgba(${ORANGE},${env * 0.4})`
          ctx.lineWidth = 1.1
          ctx.beginPath(); ctx.moveTo(pa.dx, pa.dy); ctx.lineTo(pb.dx, pb.dy); ctx.stroke()
        }
        for (const i of cst.idx) {
          const p = particles[i]
          glint(p.dx, p.dy, 1.7, env * 0.6, ORANGE)
        }
        return cst.life < cst.max
      })

      // 3) Interacción con el cursor — solo los puntos MUY cercanos se vuelven naranja
      const orange = new Map<P, number>()
      if (cursorOn) {
        for (const p of particles) {
          const dx = mouse.x - p.dx, dy = mouse.y - p.dy
          const d = Math.hypot(dx, dy)
          if (d < CR) {
            const near = 1 - d / CR
            if (near > NEAR_MIN) orange.set(p, near)
          }
        }
        const arr = [...orange.keys()]
        // Líneas cortas entre los puntos naranjas (se "unen")
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            const a = arr[i], b = arr[j]
            const dx = a.dx - b.dx, dy = a.dy - b.dy
            const d = Math.hypot(dx, dy)
            if (d < LINK) {
              ctx.strokeStyle = `rgba(${ORANGE},${(1 - d / LINK) * 0.4})`
              ctx.lineWidth = 1
              ctx.beginPath(); ctx.moveTo(a.dx, a.dy); ctx.lineTo(b.dx, b.dy); ctx.stroke()
            }
          }
        }
        // Hilo corto hacia el mouse
        orange.forEach((near, p) => {
          ctx.strokeStyle = `rgba(${ORANGE},${near * 0.4})`
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(p.dx, p.dy); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
        })
      }

      // Puntos (naranja si están muy cerca del cursor)
      for (const p of particles) {
        const near = orange.get(p)
        if (near !== undefined) {
          glint(p.dx, p.dy, 1.4 + near * 1.3, 0.45 + near * 0.4, ORANGE)
        } else {
          ctx.fillStyle = p.accent ? `rgba(${ACCENT},0.45)` : `rgba(${TEAL},0.55)`
          ctx.beginPath()
          ctx.arc(p.dx, p.dy, 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!reduced) animId = requestAnimationFrame(step)
    }
    step()

    return () => {
      clearTimeout(tmo)
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", build)
      window.removeEventListener("pointermove", pointerMove)
      window.removeEventListener("touchmove", touchMove)
    }
  }, [])

  const stats = [
    { value: 40, prefix: "+", suffix: "", decimals: 0, label: t("Productos entregados", "Products delivered"), color: "var(--cyan)", icon: Package },
    { value: 3.2, prefix: "", suffix: "x", decimals: 1, label: t("ROI promedio reportado", "Average reported ROI"), color: "var(--magenta)", icon: TrendingUp },
    { value: 75, prefix: "", suffix: "%", decimals: 0, label: t("Más rápido al mercado", "Faster to market"), color: "var(--orange)", icon: Zap },
  ]

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[var(--surface-dark)] text-[var(--surface-dark-fg)] pt-20">
      {/* Base wash — teal muy sutil para dar profundidad */}
      <div
        className="absolute inset-0 z-0 ambient-glow"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 85% 70% at 50% 32%, rgba(42,171,179,0.08), transparent 62%)" }}
      />

      {/* Constelación interactiva — bordes difuminados (sin caja) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[2] portfolio-canvas hidden md:block"
        aria-hidden="true"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 88% 82% at 50% 44%, #000 58%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 88% 82% at 50% 44%, #000 58%, transparent 100%)",
        }}
      />

      {/* Blend inferior hacia la siguiente sección */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-[3] pointer-events-none bg-gradient-to-b from-transparent to-[var(--surface-dark)]" aria-hidden="true" />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className={`relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-8 transition-all duration-1000 pointer-events-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Badge — oculto en móvil */}
        <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 text-sm pointer-events-auto">
          <Sparkles size={14} className="text-[var(--cyan)]" />
          <span className="text-[var(--cyan)] font-semibold">{t("Portafolio MediaLab", "MediaLab Portfolio")}</span>
        </div>

        <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground text-balance">
          {t("Estos productos", "These products")}{" "}
          <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
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

        {/* Indicadores integrados */}
        <div className="grid grid-cols-3 divide-x divide-foreground/10 rounded-2xl border border-foreground/10 bg-foreground/[0.03] backdrop-blur-md shadow-xl shadow-black/5 pointer-events-auto">
          {stats.map((s) => (
            <HeroStat key={s.label} {...s} active={visible} />
          ))}
        </div>

        <a href="#cases" className="group mt-2 flex flex-col items-center gap-2 text-muted-foreground hover:text-[var(--cyan)] transition-colors pointer-events-auto">
          <span className="text-sm font-medium">{t("Ver casos de éxito", "View case studies")}</span>
          <ArrowDown size={20} className="animate-bounce-slow" />
        </a>
      </div>
    </section>
  )
}
