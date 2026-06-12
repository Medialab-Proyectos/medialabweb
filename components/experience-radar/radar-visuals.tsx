"use client"

/**
 * Experience Radar — visuales abstractos.
 *
 * Solo datos, ondas, señales y patrones. Sin balones, escudos, trofeos ni logos
 * oficiales. Aislado: estos componentes no afectan estilos globales.
 */

import { motion, useReducedMotion } from "framer-motion"

const ACCENT = "#E8751A"
const TEAL = "#2AABB3"

/** Barrido de radar concéntrico con señales animadas. Decorativo. */
export function RadarSweep({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion()
  const rings = [1, 0.72, 0.46, 0.24]
  const blips = [
    { cx: 78, cy: 60, r: 2.6, delay: 0 },
    { cx: 128, cy: 92, r: 2, delay: 0.6 },
    { cx: 64, cy: 120, r: 2.2, delay: 1.1 },
    { cx: 138, cy: 138, r: 1.8, delay: 1.6 },
    { cx: 96, cy: 150, r: 2.4, delay: 2.1 },
  ]

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Visualización abstracta de radar de señales"
    >
      <defs>
        <radialGradient id="radar-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.18" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="radar-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="radar-trail" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
          <stop offset="58%" stopColor={ACCENT} stopOpacity="0.03" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0.2" />
        </linearGradient>
        <filter id="radar-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r="96" fill="url(#radar-fade)" />
      {rings.map((scale, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={96 * scale}
          fill="none"
          stroke={TEAL}
          strokeOpacity={0.22}
          strokeWidth="0.8"
        />
      ))}
      <line x1="100" y1="4" x2="100" y2="196" stroke={TEAL} strokeOpacity="0.14" strokeWidth="0.6" />
      <line x1="4" y1="100" x2="196" y2="100" stroke={TEAL} strokeOpacity="0.14" strokeWidth="0.6" />

      {/* Barrido giratorio */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "center" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      >
        <path
          d="M100 100 L38 18 A94 94 0 0 1 188 84 Z"
          fill="url(#radar-trail)"
          filter="url(#radar-glow)"
        />
        <path d="M100 100 L100 6 A94 94 0 0 1 188 84 Z" fill="url(#radar-sweep)" />
        <line x1="100" y1="100" x2="100" y2="6" stroke={ACCENT} strokeOpacity="0.6" strokeWidth="1" />
      </motion.g>

      {/* Señales detectadas (blips) */}
      {blips.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill={ACCENT}
          animate={reduce ? undefined : { opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: b.delay }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
    </svg>
  )
}

/** Anillo de score 0–100. Decorativo + dato. */
export function ScoreRing({
  value,
  size = 56,
  stroke = 5,
  label,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
}) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const pct = Math.min(100, Math.max(0, value))
  const offset = circ - (pct / 100) * circ
  const color = pct >= 85 ? ACCENT : pct >= 65 ? "#f4a261" : TEAL

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-sm font-bold tabular-nums">{Math.round(pct)}</span>
        {label && <span className="text-[8px] uppercase tracking-wide text-muted-foreground mt-0.5">{label}</span>}
      </div>
    </div>
  )
}

/** Banda de ondas/señal sutil para fondos de sección. Decorativo. */
export function SignalWaves({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 600 120" className={className} preserveAspectRatio="none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d="M0 60 Q 75 20 150 60 T 300 60 T 450 60 T 600 60"
          fill="none"
          stroke={i === 1 ? ACCENT : TEAL}
          strokeOpacity={0.12 + i * 0.04}
          strokeWidth="1.2"
          animate={reduce ? undefined : { d: [
            "M0 60 Q 75 20 150 60 T 300 60 T 450 60 T 600 60",
            "M0 60 Q 75 90 150 60 T 300 60 T 450 60 T 600 60",
            "M0 60 Q 75 20 150 60 T 300 60 T 450 60 T 600 60",
          ] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  )
}
