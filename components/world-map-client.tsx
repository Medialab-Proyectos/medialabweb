"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const markers = [
  { name: "Bogotá", country: "Colombia", coords: [-74.08, 4.71] as [number, number], isHQ: true },
  { name: "Medellín", country: "Colombia", coords: [-75.56, 6.25] as [number, number], isHQ: false },
  { name: "Cali", country: "Colombia", coords: [-76.52, 3.43] as [number, number], isHQ: false },
  { name: "Miami", country: "USA", coords: [-80.19, 25.77] as [number, number], isHQ: false },
  { name: "New York", country: "USA", coords: [-74.0, 40.71] as [number, number], isHQ: false },
  { name: "Los Angeles", country: "USA", coords: [-118.24, 34.05] as [number, number], isHQ: false },
  { name: "Ciudad de México", country: "México", coords: [-99.13, 19.43] as [number, number], isHQ: false },
  { name: "Quito", country: "Ecuador", coords: [-78.5, -0.22] as [number, number], isHQ: false },
  { name: "Lima", country: "Perú", coords: [-77.03, -12.05] as [number, number], isHQ: false },
  { name: "Santiago", country: "Chile", coords: [-70.65, -33.46] as [number, number], isHQ: false },
  { name: "Madrid", country: "España", coords: [-3.7, 40.42] as [number, number], isHQ: false },
  { name: "London", country: "UK", coords: [-0.12, 51.51] as [number, number], isHQ: false },
  { name: "Panamá", country: "Panamá", coords: [-79.52, 8.99] as [number, number], isHQ: false },
  { name: "Tegucigalpa", country: "Honduras", coords: [-87.2, 14.09] as [number, number], isHQ: false },
  { name: "Toronto", country: "Canada", coords: [-79.38, 43.65] as [number, number], isHQ: false },
]

interface Props {
  tooltip: { name: string; country: string } | null
  setTooltip: (v: { name: string; country: string } | null) => void
}

export function WorldMap({ tooltip, setTooltip }: Props) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10" style={{ background: "#0a1628" }}>
      {tooltip && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg pointer-events-none whitespace-nowrap"
          style={{ background: "#E8751A" }}>
          {tooltip.name}, {tooltip.country}
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [-20, 15] }}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
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
          {markers.map((m) => (
            <Marker
              key={m.name}
              coordinates={m.coords}
              onMouseEnter={() => setTooltip({ name: m.name, country: m.country })}
              onMouseLeave={() => setTooltip(null)}
            >
              {m.isHQ ? (
                <>
                  <circle r={10} fill="#E8751A" fillOpacity={0.25} />
                  <circle r={6} fill="#E8751A" />
                  <circle r={2.5} fill="white" />
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
      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white"
        style={{ background: "rgba(10,22,40,0.85)", border: "1px solid rgba(232,117,26,0.4)" }}>
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "#E8751A" }} />
        Casa Matriz — Bogotá, Colombia
      </div>
    </div>
  )
}
