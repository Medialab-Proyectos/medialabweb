"use client"

import React from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

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

// 4-pointed diamond star — identifies HQ
const STAR = "0,-10 2.4,-2.4 10,0 2.4,2.4 0,10 -2.4,2.4 -10,0 -2.4,-2.4"

interface Props {
  tooltip: { name: string; country: string } | null
  setTooltip: (v: { name: string; country: string } | null) => void
}

export function WorldMap({ tooltip, setTooltip }: Props) {
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

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [-20, 15] }}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>

          {/* Countries */}
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: unknown[] }) =>
              (geographies as Array<{ rsmKey: string }>).map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#2AABB3", stroke: "#0a1628", strokeWidth: 0.5, outline: "none" },
                    hover:   { fill: "#38c5ce", stroke: "#0a1628", strokeWidth: 0.5, outline: "none" },
                    pressed: { fill: "#1e8f97", stroke: "#0a1628", strokeWidth: 0.5, outline: "none" },
                  }}
                />
              ))
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

          {/* Markers */}
          {markers.map((m) => (
            <Marker
              key={m.name}
              coordinates={m.coords}
              onMouseEnter={() => setTooltip({ name: m.name, country: m.country })}
              onMouseLeave={() => setTooltip(null)}
            >
              {m.isHQ ? (
                // Casa Matriz — diamond star marker
                <>
                  <circle r={22} fill="#E8751A" fillOpacity={0.07} />
                  <circle r={14} fill="#E8751A" fillOpacity={0.14} />
                  <polygon points={STAR} fill="#E8751A" />
                  <circle r={3} fill="white" />
                </>
              ) : (
                <>
                  <circle r={5} fill="#E8751A" />
                  <circle r={2} fill="white" />
                </>
              )}
            </Marker>
          ))}

        </ZoomableGroup>
      </ComposableMap>

      {/* Legend — inline color: white works in all color modes */}
      <div
        className="absolute bottom-4 left-4 flex flex-col gap-2 px-3 py-2.5 rounded-lg text-xs font-medium"
        style={{ background: "rgba(10,22,40,0.88)", border: "1px solid rgba(232,117,26,0.35)" }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="-12 -12 24 24" aria-hidden="true">
            <polygon points={STAR} fill="#E8751A" />
            <circle r={2.5} fill="white" />
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
