"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { RadarViewMode } from "./match-phase-radar"

interface RadarPhaseContextValue {
  phase: RadarViewMode
  setPhase: (phase: RadarViewMode) => void
  /** Fases disponibles para esta nota (según su estado). */
  available: RadarViewMode[]
}

const RadarPhaseContext = createContext<RadarPhaseContextValue | null>(null)

/**
 * Provee la fase activa del radar (expectativa / realidad / percepción) compartida
 * entre el radar de la nota (`MatchPhaseRadar`) y la barra inferior de fases
 * (`RadarPhaseBar`). Así, tocar un botón de la barra cambia el radar en sitio, sin
 * scroll, y ambos controles quedan sincronizados.
 */
export function RadarPhaseProvider({
  available,
  children,
}: {
  available: RadarViewMode[]
  children: ReactNode
}) {
  const [phase, setPhase] = useState<RadarViewMode>(available[0] ?? "expectativa")

  const value = useMemo<RadarPhaseContextValue>(
    () => ({
      phase,
      // No permite seleccionar una fase que aún no existe (p. ej. percepción en previa).
      setPhase: (next) => available.includes(next) && setPhase(next),
      available,
    }),
    [phase, available],
  )

  return <RadarPhaseContext.Provider value={value}>{children}</RadarPhaseContext.Provider>
}

/** Devuelve el contexto de fase si existe; null fuera del provider (fallback local). */
export function useRadarPhase(): RadarPhaseContextValue | null {
  return useContext(RadarPhaseContext)
}
