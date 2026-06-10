"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Users, Star, BookOpen, GraduationCap, Download } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
}

/*
 * Interactive constellation — particles float freely; when the cursor
 * approaches, nearby nodes light up and form connections.
 * Metaphor: "You guide, AI connects." Reinforces the course message.
 * On mobile (no hover), particles self-organise in slow waves.
 */
function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })

  const onMove = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const pt = "touches" in e ? e.touches[0] : e
    mouse.current = { x: pt.clientX - rect.left, y: pt.clientY - rect.top }
  }, [])

  const onLeave = useCallback(() => {
    mouse.current = { x: -1000, y: -1000 }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("touchmove", onMove, { passive: true })
    canvas.addEventListener("mouseleave", onLeave)

    /* Theme detection */
    const html = document.documentElement
    const isPureDark = html.classList.contains("pure-dark")
    const isDark = isPureDark || html.classList.contains("dark")
    const isWarm = html.classList.contains("warm")

    /* Alphas: idle (dim) → hover (bright). Light/warm need much higher
       values because particles compete with a near-white background. */
    const idleAlpha = isPureDark ? 0.14 : isDark ? 0.18 : isWarm ? 0.30 : 0.45
    const hoverAlpha = isPureDark ? 0.55 : isDark ? 0.65 : isWarm ? 0.70 : 0.85
    const lineIdleAlpha = isPureDark ? 0.05 : isDark ? 0.06 : isWarm ? 0.12 : 0.18
    const lineHoverAlpha = isPureDark ? 0.30 : isDark ? 0.35 : isWarm ? 0.40 : 0.50

    const CYAN = [42, 171, 179]
    const MAGENTA = [232, 117, 26]

    /* Particles */
    type Node = { x: number; y: number; vx: number; vy: number; r: number; color: number[] }
    const nodes: Node[] = []
    const count = Math.min(55, Math.floor((canvas.width * canvas.height) / 18000))
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 2.0 + 1.0,
        color: i % 3 === 0 ? MAGENTA : CYAN,
      })
    }

    const INTERACT_RADIUS = 180
    const CONNECT_RADIUS = 130
    let frame = 0

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      frame++

      const mx = mouse.current.x
      const my = mouse.current.y
      const hasHover = mx > -500

      /* Move */
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1

        /* Gentle attraction towards cursor */
        if (hasHover) {
          const dx = mx - n.x
          const dy = my - n.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < INTERACT_RADIUS && dist > 5) {
            n.vx += (dx / dist) * 0.012
            n.vy += (dy / dist) * 0.012
          }
        }

        /* Speed cap */
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (speed > 0.6) {
          n.vx *= 0.98
          n.vy *= 0.98
        }
      })

      /* Connections */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > CONNECT_RADIUS) continue

          /* Proximity to cursor boosts visibility */
          const midX = (nodes[i].x + nodes[j].x) / 2
          const midY = (nodes[i].y + nodes[j].y) / 2
          let cursorProx = 0
          if (hasHover) {
            const dmc = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2)
            cursorProx = Math.max(0, 1 - dmc / INTERACT_RADIUS)
          }

          const proximity = 1 - dist / CONNECT_RADIUS
          const alpha = lineIdleAlpha + (lineHoverAlpha - lineIdleAlpha) * cursorProx
          const c = (i + j) % 3 === 0 ? MAGENTA : CYAN
          ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha * proximity})`
          ctx.lineWidth = 0.6 + cursorProx * 0.6
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }

      /* Draw nodes */
      nodes.forEach((n) => {
        let cursorProx = 0
        if (hasHover) {
          const d = Math.sqrt((n.x - mx) ** 2 + (n.y - my) ** 2)
          cursorProx = Math.max(0, 1 - d / INTERACT_RADIUS)
        }
        const alpha = idleAlpha + (hoverAlpha - idleAlpha) * cursorProx
        const r = n.r + cursorProx * 1.2

        /* Glow on hover */
        if (cursorProx > 0.3) {
          ctx.fillStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${alpha * 0.15})`
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${alpha})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("touchmove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
    }
  }, [onMove, onLeave])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}

/*
 * Orbital animation — 2 rings with 4 labels that glow when a dot
 * passes their quadrant. Labels are bilingual via t().
 *
 * Outer ring: 50s per revolution  → dot at top   = 0°, right = 90°, etc.
 * Inner ring: 35s per revolution (counter-clockwise)
 *
 * Each label "lights up" when a dot is within ±40° of its position.
 * top=0°  right=90°  bottom=180°  left=270°
 */
function OrbitalGraphic() {
  const { t } = useLanguage()
  const elapsed = useRef(0)
  /* "off" | "cyan" | "magenta" per label position */
  const [active, setActive] = useState<Record<string, string>>({ top: "off", right: "off", bottom: "off", left: "off" })

  useEffect(() => {
    let animId: number
    let last = performance.now()

    /* Each dot: { angle, color } */
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      elapsed.current += dt

      const outerAngle = ((elapsed.current / 50) * 360) % 360
      const innerAngle = (360 - ((elapsed.current / 35) * 360) % 360) % 360

      const dots = [
        { angle: outerAngle, color: "cyan" },                        // outer dot 1 — cyan
        { angle: (outerAngle + 210) % 360, color: "magenta" },       // outer dot 2 — magenta
        { angle: (innerAngle + 90) % 360, color: "magenta" },        // inner dot 1 — magenta
        { angle: (innerAngle + 330) % 360, color: "cyan" },          // inner dot 2 — cyan
      ]

      const threshold = 40

      const nearestColor = (target: number): string => {
        let best = "off"
        let bestDiff = threshold
        for (const d of dots) {
          const diff = Math.abs(((d.angle - target + 540) % 360) - 180)
          if (diff < bestDiff) {
            bestDiff = diff
            best = d.color
          }
        }
        return best
      }

      setActive({ top: nearestColor(0), right: nearestColor(90), bottom: nearestColor(180), left: nearestColor(270) })
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  const labelBase = "text-[9px] tracking-[0.18em] uppercase font-medium transition-colors duration-500"
  const labelDim = "dark:text-white/20 text-foreground/25"

  const labelColor = (state: string) => {
    if (state === "cyan") return "text-[var(--cyan)]"
    if (state === "magenta") return "text-[var(--magenta)]"
    return labelDim
  }

  return (
    <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] mx-auto">
      <span className={`absolute -top-7 left-1/2 -translate-x-1/2 ${labelBase} ${labelColor(active.top)}`}>
        {t("Descubrir", "Discover")}
      </span>
      <span className={`absolute top-1/2 -right-12 md:-right-14 -translate-y-1/2 rotate-90 ${labelBase} ${labelColor(active.right)}`}>
        {t("Diseñar", "Design")}
      </span>
      <span className={`absolute -bottom-7 left-1/2 -translate-x-1/2 ${labelBase} ${labelColor(active.bottom)}`}>
        {t("Construir", "Build")}
      </span>
      <span className={`absolute top-1/2 -left-12 md:-left-14 -translate-y-1/2 -rotate-90 ${labelBase} ${labelColor(active.left)}`}>
        {t("Validar", "Validate")}
      </span>

      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border dark:border-white/[0.20] border-[var(--cyan)]/25"
      >
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{ background: 'var(--cyan)', boxShadow: '0 0 30px 6px var(--cyan)' }} />
        <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
          className="absolute -bottom-1.5 left-1/3 w-3 h-3 rounded-full"
          style={{ background: 'var(--magenta)', boxShadow: '0 0 22px 5px var(--magenta)' }} />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-14 md:inset-[4.5rem] rounded-full border dark:border-white/[0.22] border-[var(--magenta)]/20"
      >
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-1/2 -right-2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
          style={{ background: 'var(--magenta)', boxShadow: '0 0 26px 5px var(--magenta)' }} />
        <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute -top-1.5 left-1/3 w-2.5 h-2.5 rounded-full"
          style={{ background: 'var(--cyan)', boxShadow: '0 0 20px 4px var(--cyan)' }} />
      </motion.div>

      {/* Center */}
      <div className="absolute inset-[5rem] md:inset-[6.5rem] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[9px] tracking-[0.2em] uppercase dark:text-white/60 text-muted-foreground mb-2">{t("Resultado", "Result")}</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--cyan)' }}>90%</p>
          <p className="text-[11px] dark:text-white/65 text-muted-foreground mb-2">{t("productividad", "productivity")}</p>
          <p className="text-3xl md:text-4xl font-bold font-display leading-none" style={{ color: 'var(--magenta)' }}>10%</p>
          <p className="text-[11px] dark:text-white/65 text-muted-foreground">{t("esfuerzo", "effort")}</p>
        </div>
      </div>

      {/* Background glow — visible in all themes */}
      <motion.div
        animate={{ opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-1/4 rounded-full blur-[50px]"
        style={{ background: 'linear-gradient(135deg, var(--cyan), var(--magenta))' }}
      />
    </div>
  )
}

export function CourseHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.7], [0, 80])
  const { t } = useLanguage()

  const trustBadges = [
    { icon: Users, text: t("40+ productos construidos", "40+ products built") },
    { icon: Star, text: t("Metodología 90-10", "90-10 methodology") },
    { icon: BookOpen, text: t("Autores de 'Zero UI'", "Authors of 'Zero UI'") },
    { icon: GraduationCap, text: t("12+ carreras afines", "12+ related programs") },
  ]

  return (
    <section ref={ref} className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[var(--surface-dark)] text-foreground transition-colors duration-300">
      {/* Layer 1: slow-moving aura behind everything */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ x: ["0%", "15%", "-10%", "0%"], y: ["0%", "-10%", "5%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[25%] -left-[15%] w-[65%] h-[110%] rounded-full blur-[120px] course-aura"
          style={{ background: 'radial-gradient(ellipse at center, var(--cyan), transparent 70%)' }}
        />
        <motion.div
          animate={{ x: ["0%", "-12%", "8%", "0%"], y: ["0%", "8%", "-6%", "0%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[90%] rounded-full blur-[100px] course-aura"
          style={{ background: 'radial-gradient(ellipse at center, var(--magenta), transparent 70%)' }}
        />
      </div>

      {/* Layer 2: interactive constellation */}
      <div className="absolute inset-0">
        <ConstellationBackground />
        <div className="absolute inset-0 course-hero-overlay" />
      </div>

      <motion.div style={{ opacity, y }} className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pt-24 md:pt-32 pb-20 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
          {/* Left — Text */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center sm:items-start">
            {/* Eyebrow — capsule on desktop, text on mobile */}
            <motion.div variants={fadeUp} className="hidden sm:flex items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.1]">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--cyan)' }} />
                <span className="text-[11px] tracking-[0.12em] uppercase font-medium" style={{ color: 'var(--cyan)' }}>
                  {t("Curso Arquitecto de Experiencia de Usuario con IA", "AI User Experience Architect Course")}
                </span>
              </div>
            </motion.div>

            {/* Headline — centrado y más grande en mobile */}
            <motion.h1 variants={fadeUp} className="text-[2.25rem] sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold tracking-tight leading-[1.1] dark:text-white text-foreground mb-5 font-display text-center sm:text-left">
              {t("La IA construye.", "AI builds.")}
              <br />
              <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
                {t(
                  "Tú diseñas la experiencia y la estrategia.",
                  "You design the experience and strategy."
                )}
              </span>
            </motion.h1>

            {/* Course name — mobile only, debajo del título con más espacio */}
            <motion.p variants={fadeUp} className="sm:hidden text-xs tracking-[0.10em] uppercase font-semibold mb-8 text-center" style={{ color: 'var(--cyan)' }}>
              {t("Curso · Arquitecto de Experiencia de Usuario con IA", "Course · AI User Experience Architect")}
            </motion.p>

            {/* Value prop — 2 líneas max */}
            <motion.p variants={fadeUp} className="text-base md:text-lg dark:text-white/80 text-muted-foreground leading-relaxed mb-8 sm:mb-4 max-w-md text-center sm:text-left">
              {t(
                "Aprende a estructurar, validar y optimizar productos digitales funcionales con IA en 8 semanas.",
                "Learn to structure, validate, and optimize functional digital products with AI in 8 weeks."
              )}
            </motion.p>

            {/* CTAs — stacked full-width on mobile, side-by-side on desktop */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-3 mb-4 sm:mb-2 w-full sm:w-auto">
              <a
                href="#registro"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_10px_32px_-8px_rgba(232,117,26,0.65)]"
                style={{ background: 'var(--magenta)' }}
              >
                {t("Inscribirme →", "Enroll now →")}
              </a>
              <a
                href="/images/curso/Curso2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 border dark:border-[var(--cyan)]/50 border-[var(--cyan)]/30 dark:text-[var(--cyan)] text-teal-800 hover:bg-[var(--cyan)]/15 hover:text-foreground dark:hover:text-[var(--cyan)]"
              >
                <Download size={16} />
                {t("Descargar currículo", "Download curriculum")}
              </a>
            </motion.div>

            {/* Price anchor — visible before full scroll */}
            <motion.p variants={fadeUp} className="text-xs dark:text-white/50 text-muted-foreground mb-6 sm:mb-4 text-center sm:text-left">
              {t("Desde $89/semana · Horario diurno y nocturno · Garantía semana 1", "From $89/week · Day & evening schedule · Week 1 guarantee")}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs dark:text-white/60 text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-pulse" />
                {t("Cohorte 02 · 30 cupos", "Cohort 02 · 30 seats")}
              </span>
              <span className="hidden sm:inline dark:text-white/20 text-foreground/20">|</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" style={{ color: 'var(--magenta)' }} />
                {t("Satisfacción 4.7/5", "4.7/5 satisfaction")}
              </span>
            </motion.div>

            {/* Role pills */}
            <motion.div variants={fadeUp} className="hidden sm:flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[10px] tracking-[0.12em] uppercase dark:text-white/65 text-muted-foreground font-medium mr-1">{t("Sales como:", "You become:")}</span>
              <span className="px-3 py-1 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.1] text-[11px] font-semibold" style={{ color: 'var(--cyan)' }}>
                {t("Arquitecto UX con IA", "AI UX Architect")}
              </span>
              <span className="px-3 py-1 rounded-full border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.1] text-[11px] font-semibold" style={{ color: 'var(--magenta)' }}>
                UX Prompt Designer
              </span>
              <span className="px-3 py-1 rounded-full border dark:border-white/20 border-foreground/20 dark:bg-white/[0.06] bg-foreground/[0.06] text-[11px] font-semibold dark:text-white/70 text-foreground/70">
                {t("Estratega de Producto", "Product Strategist")}
              </span>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="hidden sm:flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pt-4 border-t dark:border-white/[0.12] border-foreground/[0.12]">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 dark:text-white/65 text-muted-foreground" />
                    <span className="text-xs dark:text-white/60 text-muted-foreground">{badge.text}</span>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right — Orbital graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="hidden md:block -mt-10"
          >
            <OrbitalGraphic />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-5 h-7 rounded-full border dark:border-white/20 border-foreground/20 flex justify-center pt-1">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-0.5 h-1.5 rounded-full" style={{ background: 'var(--magenta)' }} />
        </div>
      </motion.div>
    </section>
  )
}
