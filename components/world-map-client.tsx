"use client"

import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { RotateCcw } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Colombia ISO 3166-1 numeric code in world-atlas topojson
const COLOMBIA_ID = "170"

// Line exists at runtime but is absent from auto-inferred types in this version
type LineProps = {
  from: [number, number]
  to: [number, number]
  stroke?: string
  strokeWidth?: number
  strokeLinecap?: string
  strokeDasharray?: string
  fill?: string
  style?: React.CSSProperties
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Line = (require("react-simple-maps") as { Line: React.ComponentType<LineProps> }).Line

const HQ: [number, number] = [-74.08, 4.71] // Bogotá — Casa Matriz

const markers: {
  name: string
  country: string
  coords: [number, number]
  isHQ: boolean
}[] = [
  { name: "Bogotá",          country: "Colombia", coords: HQ,                isHQ: true  },
  { name: "Medellín",        country: "Colombia", coords: [-75.56,  6.25],   isHQ: false },
  { name: "Cali",            country: "Colombia", coords: [-76.52,  3.43],   isHQ: false },
  { name: "Miami",           country: "USA",      coords: [-80.19, 25.77],   isHQ: false },
  { name: "New York",        country: "USA",      coords: [-74.0,  40.71],   isHQ: false },
  { name: "Los Angeles",     country: "USA",      coords: [-118.24, 34.05],  isHQ: false },
  { name: "Ciudad de México",country: "México",   coords: [-99.13, 19.43],   isHQ: false },
  { name: "Quito",           country: "Ecuador",  coords: [-78.5,  -0.22],   isHQ: false },
  { name: "Lima",            country: "Perú",     coords: [-77.03,-12.05],   isHQ: false },
  { name: "Santiago",        country: "Chile",    coords: [-70.65,-33.46],   isHQ: false },
  { name: "Madrid",          country: "España",   coords: [ -3.7,  40.42],   isHQ: false },
  { name: "London",          country: "UK",       coords: [ -0.12, 51.51],   isHQ: false },
  { name: "Panamá",          country: "Panamá",   coords: [-79.52,  8.99],   isHQ: false },
  { name: "Tegucigalpa",     country: "Honduras", coords: [-87.2,  14.09],   isHQ: false },
  { name: "Toronto",         country: "Canada",   coords: [-79.38, 43.65],   isHQ: false },
]

// Connections only to cities outside Colombia
const connections = markers.filter(m => !m.isHQ && m.country !== "Colombia")

// HQ rendered separately and last so it sits on top of all other markers
const nonHQMarkers = markers.filter(m => !m.isHQ)
const hqMarker = markers.find(m => m.isHQ)!

interface Props {
  tooltip: { name: string; country: string } | null
  setTooltip: (v: { name: string; country: string } | null) => void
}

const DEFAULT_POS: { coordinates: [number, number]; zoom: number } = { coordinates: [0, 0], zoom: 1 }

// ZoomableGroup runtime supports center/onMoveEnd, but they're absent from the inferred types
const ZG = ZoomableGroup as unknown as React.ComponentType<{
  zoom?: number
  center?: [number, number]
  minZoom?: number
  maxZoom?: number
  onMoveEnd?: (pos: { coordinates: [number, number]; zoom: number }) => void
  children?: React.ReactNode
}>

export function WorldMap({ tooltip, setTooltip }: Props) {
  const { t } = useLanguage()
  const [position, setPosition] = useState(DEFAULT_POS)
  const moved = position.zoom !== 1 || position.coordinates[0] !== 0 || position.coordinates[1] !== 0

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-white/10"
      style={{ background: "#0a1628" }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg pointer-events-none whitespace-nowrap"
          style={{ background: "#E8751A", color: "white" }}
        >
          {tooltip.name}, {tooltip.country}
        </div>
      )}

      {/* Botón para centrar / resetear el mapa */}
      {moved && (
        <button
          type="button"
          onClick={() => setPosition(DEFAULT_POS)}
          aria-label={t("Centrar mapa", "Reset map")}
          className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95"
          style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(232,117,26,0.4)", color: "white" }}
        >
          <RotateCcw size={13} /> {t("Centrar", "Reset")}
        </button>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [-20, 15] }}
        style={{ width: "100%", height: "auto" }}
      >
        <ZG
          zoom={position.zoom}
          center={position.coordinates}
          minZoom={1}
          maxZoom={4}
          onMoveEnd={(pos) => setPosition({ coordinates: pos.coordinates, zoom: pos.zoom })}
        >

          {/* Countries — Colombia highlighted as HQ country */}
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: unknown[] }) =>
              (geographies as Array<{ rsmKey: string; id: string }>).map((geo) => {
                const isColombia = geo.id === COLOMBIA_ID
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: isColombia ? "#E8751A" : "#2AABB3", stroke: "#0a1628", strokeWidth: 0.5, outline: "none" },
                      hover:   { fill: isColombia ? "#f08a35" : "#38c5ce", stroke: "#0a1628", strokeWidth: 0.5, outline: "none" },
                      pressed: { fill: isColombia ? "#d06010" : "#1e8f97", stroke: "#0a1628", strokeWidth: 0.5, outline: "none" },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Static base trail — very faint */}
          {connections.map((city) => (
            <Line
              key={`base-${city.name}`}
              from={HQ}
              to={city.coords}
              stroke="rgba(232,117,26,0.10)"
              strokeWidth={0.8}
              fill="none"
            />
          ))}

          {/* Animated flowing dots — travel from Bogotá outward */}
          {connections.map((city, i) => (
            <Line
              key={`flow-${city.name}`}
              from={HQ}
              to={city.coords}
              stroke="rgba(232,117,26,0.60)"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeDasharray="4 16"
              fill="none"
              style={{
                animation: "flowDots 2.2s linear infinite",
                animationDelay: `${(i * 0.32) % 2.2}s`,
              }}
            />
          ))}

          {/* Non-HQ markers */}
          {nonHQMarkers.map((m) => (
            <Marker
              key={m.name}
              coordinates={m.coords}
              onMouseEnter={() => setTooltip({ name: m.name, country: m.country })}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle r={5} fill="#E8751A" />
              <circle r={2} fill="white" />
            </Marker>
          ))}

          {/* HQ marker — white so it pops against the orange Colombia fill; rendered last = on top */}
          <Marker
            key={hqMarker.name}
            coordinates={hqMarker.coords}
            onMouseEnter={() => setTooltip({ name: hqMarker.name, country: hqMarker.country })}
            onMouseLeave={() => setTooltip(null)}
          >
            <circle r={20} fill="white" fillOpacity={0.07} />
            <circle r={12} fill="white" fillOpacity={0.14} />
            <circle r={7} fill="white" />
            <circle r={2.5} fill="#E8751A" />
          </Marker>

        </ZG>
      </ComposableMap>

      {/* Legend */}
      <div
        className="absolute bottom-4 left-4 flex flex-col gap-2 px-3 py-2.5 rounded-lg text-xs font-medium"
        style={{ background: "rgba(10,22,40,0.88)", border: "1px solid rgba(232,117,26,0.35)" }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="-8 -8 16 16" aria-hidden="true">
            <circle r={7} fill="white" />
            <circle r={2.5} fill="#E8751A" />
          </svg>
          <span style={{ color: "white" }}>Casa Matriz — Bogotá</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="-6 -6 12 12" aria-hidden="true">
            <circle r={5} fill="#E8751A" />
            <circle r={2} fill="white" />
          </svg>
          <span style={{ color: "rgba(255,255,255,0.65)" }}>Presencia activa</span>
        </div>
      </div>
    </div>
  )
}
