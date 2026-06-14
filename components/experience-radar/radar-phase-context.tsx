"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { RadarViewMode } from "./match-phase-radar"

interface RadarPhaseContextValue {
  phase: RadarViewMode
  setPhase: (phase: RadarViewMode) => void
  /** Fases disponibles para esta nota (según su estado). */
  available: RadarViewMode[]
  /** Hinchada seleccionada (país) — compartida entre el radar y el journey. */
  team: string | null
  setTeam: (team: string) => void
  /** Selecciones del partido, en orden. */
  teams: string[]
}

const RadarPhaseContext = createContext<RadarPhaseContextValue | null>(null)

/**
 * Provee la fase activa (expectativa / realidad / percepción) y la HINCHADA seleccionada,
 * compartidas entre el radar (`MatchPhaseRadar`), la barra inferior de fases
 * (`RadarPhaseBar`) y el journey emocional. Así, tocar una bandera o un botón de fase
 * actualiza todo a la vez y sin scroll.
 */
export function RadarPhaseProvider({
  available,
  teams,
  children,
}: {
  available: RadarViewMode[]
  teams: string[]
  children: ReactNode
}) {
  const [phase, setPhase] = useState<RadarViewMode>(available[0] ?? "expectativa")
  const [team, setTeam] = useState<string | null>(teams[0] ?? null)

  const value = useMemo<RadarPhaseContextValue>(
    () => ({
      phase,
      // No permite seleccionar una fase que aún no existe (p. ej. percepción en previa).
      setPhase: (next) => available.includes(next) && setPhase(next),
      available,
      team,
      setTeam: (next) => teams.includes(next) && setTeam(next),
      teams,
    }),
    [phase, available, team, teams],
  )

  return <RadarPhaseContext.Provider value={value}>{children}</RadarPhaseContext.Provider>
}

/** Devuelve el contexto de fase si existe; null fuera del provider (fallback local). */
export function useRadarPhase(): RadarPhaseContextValue | null {
  return useContext(RadarPhaseContext)
}
