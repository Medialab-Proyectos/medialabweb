"use client"

import { Globe, Clock, Users, Package } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

function MetricCard({
  value,
  suffix,
  label,
  icon: Icon,
}: {
  value: number
  suffix: string
  label: string
  icon: React.ElementType
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 group">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ background: "linear-gradient(135deg, #E8751A 0%, #c65a10 100%)" }}
      >
        <Icon size={22} color="white" strokeWidth={1.75} />
      </div>
      <div className="font-[family-name:var(--font-metrics)] font-bold text-4xl md:text-5xl text-foreground tabular-nums">
        {value}
        <span className="text-[var(--magenta)]">{suffix}</span>
      </div>
      <p className="text-sm text-muted-foreground text-center font-medium">{label}</p>
    </div>
  )
}

export function TrustMetrics() {
  const { t } = useLanguage()

  const metrics = [
    { value: 50, suffix: "+", label: t("Proyectos entregados", "Projects delivered"), icon: Package },
    { value: 98, suffix: "%", label: t("Clientes que repiten", "Returning clients"), icon: Users },
    { value: 7, suffix: "", label: t("Países con impacto", "Countries impacted"), icon: Globe },
    { value: 75, suffix: "%", label: t("Discovery más rápido", "Faster discovery"), icon: Clock },
  ]

  return (
    <section
      className="pt-16 md:pt-24 pb-20 px-6 bg-background"
      aria-label="Trust metrics"
    >
      <div className="max-w-6xl mx-auto">
        {/* Separador artístico entre marcas e indicadores */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-10" aria-hidden="true">
          <span className="h-px w-16 sm:w-40" style={{ background: "linear-gradient(to right, transparent, color-mix(in oklab, var(--magenta) 45%, transparent))" }} />
          <span className="w-2 h-2 rotate-45 rounded-[2px]" style={{ background: "linear-gradient(135deg, var(--magenta), var(--cyan))", boxShadow: "0 0 12px color-mix(in oklab, var(--magenta) 45%, transparent)" }} />
          <span className="h-px w-16 sm:w-40" style={{ background: "linear-gradient(to left, transparent, color-mix(in oklab, var(--cyan) 45%, transparent))" }} />
        </div>
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-12">
          {t(
            "Resultados reales de equipos que dejaron de adivinar y empezaron a diseñar con evidencia",
            "Real results from teams that stopped guessing and started designing with evidence"
          )}
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
        <p className="mt-4 max-w-3xl mx-auto text-center text-xs italic text-muted-foreground leading-relaxed">
          {t(
            "Estas cifras son promedios internos y resultados reportados por clientes en proyectos entregados; en cada propuesta definimos la línea base, la muestra y la métrica que vamos a mover.",
            "These figures are internal averages and client-reported results from shipped projects; in every proposal we define the baseline, sample, and metric we aim to move."
          )}
        </p>
      </div>
    </section>
  )
}
