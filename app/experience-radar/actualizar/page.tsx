import type { Metadata } from "next"
import { RadarManualUpdate } from "./radar-manual-update"

export const metadata: Metadata = {
  title: "Actualizar Experience Radar | MediaLab",
  robots: { index: false, follow: false },
}

export default function UpdateExperienceRadarPage() {
  return <RadarManualUpdate />
}
