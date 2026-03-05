"use client"

import { useEffect, useRef, useState } from "react"

const countries = [
  { name: "España", code: "ES", x: 48, y: 38, projects: 15 },
  { name: "México", code: "MX", x: 18, y: 45, projects: 8 },
  { name: "Colombia", code: "CO", x: 24, y: 55, projects: 6 },
  { name: "Chile", code: "CL", x: 26, y: 72, projects: 4 },
  { name: "Argentina", code: "AR", x: 28, y: 70, projects: 3 },
  { name: "Estados Unidos", code: "US", x: 20, y: 38, projects: 3 },
  { name: "Perú", code: "PE", x: 23, y: 60, projects: 1 },
]

export function WorldMapSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-[var(--surface-dark)] text-white overflow-hidden"
      aria-labelledby="map-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div
          className={`flex flex-col gap-4 items-center text-center max-w-2xl mx-auto transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)]">
            Presencia Global
          </span>
          <h2
            id="map-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-white text-balance"
          >
            Proyectos en 7 países
          </h2>
          <p className="text-base text-white/60 leading-relaxed">
            Hemos trabajado con empresas de distintos países de América y Europa, adaptando nuestras soluciones a diversos contextos culturales y de mercado.
          </p>
        </div>

        {/* Map container */}
        <div
          className={`relative transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Map SVG - simplified world outline */}
          <div className="relative w-full aspect-[2/1] max-w-4xl mx-auto">
            <svg
              viewBox="0 0 100 50"
              className="w-full h-full"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,200,220,0.1))" }}
            >
              {/* Simplified continents as paths */}
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--magenta)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* North America */}
              <path
                d="M5,15 Q15,10 25,15 Q30,20 25,30 Q20,35 15,35 Q10,30 5,25 Z"
                fill="url(#mapGradient)"
                stroke="var(--cyan)"
                strokeWidth="0.3"
                strokeOpacity="0.4"
              />
              
              {/* South America */}
              <path
                d="M20,38 Q25,40 28,45 Q30,55 28,65 Q25,75 22,70 Q18,60 20,50 Z"
                fill="url(#mapGradient)"
                stroke="var(--cyan)"
                strokeWidth="0.3"
                strokeOpacity="0.4"
              />
              
              {/* Europe */}
              <path
                d="M42,15 Q50,12 55,15 Q58,20 55,25 Q50,28 45,25 Q42,20 42,15 Z"
                fill="url(#mapGradient)"
                stroke="var(--cyan)"
                strokeWidth="0.3"
                strokeOpacity="0.4"
              />
              
              {/* Africa */}
              <path
                d="M45,28 Q52,30 55,35 Q58,45 52,55 Q48,58 45,55 Q42,45 45,35 Z"
                fill="url(#mapGradient)"
                stroke="var(--cyan)"
                strokeWidth="0.3"
                strokeOpacity="0.3"
              />
              
              {/* Asia */}
              <path
                d="M58,12 Q70,10 82,15 Q90,20 88,30 Q80,35 70,32 Q60,28 58,20 Z"
                fill="url(#mapGradient)"
                stroke="var(--cyan)"
                strokeWidth="0.3"
                strokeOpacity="0.3"
              />
              
              {/* Australia */}
              <path
                d="M78,42 Q85,40 88,45 Q88,50 82,52 Q78,50 78,45 Z"
                fill="url(#mapGradient)"
                stroke="var(--cyan)"
                strokeWidth="0.3"
                strokeOpacity="0.3"
              />
              
              {/* Grid lines */}
              {[...Array(5)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={10 + i * 10}
                  x2="100"
                  y2={10 + i * 10}
                  stroke="var(--cyan)"
                  strokeWidth="0.1"
                  strokeOpacity="0.15"
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 10}
                  y1="0"
                  x2={i * 10}
                  y2="50"
                  stroke="var(--cyan)"
                  strokeWidth="0.1"
                  strokeOpacity="0.15"
                />
              ))}
            </svg>

            {/* Country markers */}
            {countries.map((country, i) => (
              <div
                key={country.code}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{
                  left: `${country.x}%`,
                  top: `${country.y}%`,
                  transitionDelay: `${300 + i * 100}ms`,
                }}
                onMouseEnter={() => setHoveredCountry(country.code)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Pulse ring */}
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: "var(--magenta)",
                    opacity: 0.3,
                    animationDuration: "2s",
                  }}
                />
                {/* Marker dot */}
                <div
                  className="relative w-3 h-3 rounded-full cursor-pointer transition-transform duration-200 hover:scale-150"
                  style={{
                    background: "linear-gradient(135deg, var(--magenta), var(--orange))",
                    boxShadow: "0 0 12px var(--magenta)",
                  }}
                />
                {/* Tooltip */}
                {hoveredCountry === country.code && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 whitespace-nowrap z-10"
                  >
                    <p className="text-xs font-semibold text-white">{country.name}</p>
                    <p className="text-[10px] text-white/60">{country.projects} proyectos</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Country list below map */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {countries.map((country) => (
              <div
                key={country.code}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--magenta)" }}
                />
                <span className="text-sm text-white/80">{country.name}</span>
                <span className="text-xs text-white/40">({country.projects})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
