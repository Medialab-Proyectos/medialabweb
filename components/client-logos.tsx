"use client"

import { useEffect, useRef, useState } from "react"

const clients = [
  { name: "TechCorp", abbr: "TC" },
  { name: "FinanceHub", abbr: "FH" },
  { name: "HealthPlus", abbr: "H+" },
  { name: "RetailPro", abbr: "RP" },
  { name: "EduTech", abbr: "ET" },
  { name: "GreenEnergy", abbr: "GE" },
  { name: "MediaFlow", abbr: "MF" },
  { name: "CloudSync", abbr: "CS" },
]

export function ClientLogos() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-12 px-6 bg-background border-b border-border"
      aria-label="La confianza de empresas líderes"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          La confianza de equipos innovadores en todo el mundo
        </p>

        <div
          className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 transition-all duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {clients.map((client, i) => (
            <div
              key={client.name}
              className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200 cursor-default"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                {client.abbr}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
