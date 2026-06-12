"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts"
import {
  Activity, AlertTriangle, Lightbulb, Sparkles, Gauge, Filter,
  Signal as SignalIcon, ShieldCheck, ScanLine, Layers, ArrowRight, Mail,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getMockRadar, RADAR_CATEGORIES, type RadarCategory } from "@/lib/radar"
import { RadarSweep, SignalWaves, ScoreRing } from "./radar-visuals"
import { InsightCard } from "./insight-card"
import { CATEGORY_LABELS, countryLabel } from "./labels"

const ACCENT = "#E8751A"
const TEAL = "#2AABB3"

type CategoryFilter = RadarCategory | "all"

export function ExperienceRadarContent() {
  const { t, lang } = useLanguage()

  // Pipeline del radar a partir de datos mock (sin I/O). En producción, el endpoint
  // /api/experience-radar/run alimentaría estos mismos datos tras revisión humana.
  const radar = useMemo(() => getMockRadar(), [])
  const { insights, index, today } = radar

  const [category, setCategory] = useState<CategoryFilter>("all")
  const [country, setCountry] = useState<string>("all")
  const [source, setSource] = useState<string>("all")
  const [minImpact, setMinImpact] = useState<number>(0)

  const countries = useMemo(
    () => Array.from(new Set(insights.map((i) => i.country))),
    [insights],
  )
  const sources = useMemo(
    () => Array.from(new Set(insights.map((i) => i.sourceName))),
    [insights],
  )

  const filtered = useMemo(
    () =>
      insights.filter(
        (i) =>
          (category === "all" || i.category === category) &&
          (country === "all" || i.country === country) &&
          (source === "all" || i.sourceName === source) &&
          i.impactScore >= minImpact,
      ),
    [insights, category, country, source, minImpact],
  )

  const indexData = [
    { k: t("Claridad", "Clarity"), v: index.variables.clarity },
    { k: t("Velocidad", "Speed"), v: index.variables.speed },
    { k: t("Confianza", "Trust"), v: index.variables.trust },
    { k: t("Accesibilidad", "Accessibility"), v: index.variables.accessibility },
    { k: t("Continuidad", "Continuity"), v: index.variables.continuity },
    { k: t("Carga cognitiva", "Cognitive load"), v: index.variables.cognitiveLoad },
    { k: t("Emoción del fan", "Fan emotion"), v: index.variables.fanEmotion },
    { k: t("Recuperación", "Recovery"), v: index.variables.errorRecovery },
  ]

  const methodology = [
    { icon: ScanLine, title: t("Detectamos señales", "We detect signals"), body: t("Recopilamos señales externas autorizadas de eventos de alta demanda.", "We gather authorized external signals from high-demand events.") },
    { icon: Layers, title: t("Clasificamos con IA", "We classify with AI"), body: t("Ordenamos cada señal por tipo de experiencia: UX, IA, accesibilidad y más.", "We sort each signal by experience type: UX, AI, accessibility and more.") },
    { icon: Sparkles, title: t("Convertimos noticias en insights", "We turn news into insights"), body: t("Traducimos la señal en aprendizajes de experiencia, no en marcadores.", "We translate the signal into experience learnings, not scores.") },
    { icon: Gauge, title: t("Priorizamos por impacto", "We prioritize by impact"), body: t("Puntuamos cada hallazgo según su impacto real en los usuarios.", "We score each finding by its real impact on users.") },
    { icon: ShieldCheck, title: t("Publicamos con revisión humana", "We publish with human review"), body: t("La IA propone; una persona valida antes de publicar hallazgos útiles.", "AI proposes; a human validates before publishing useful findings.") },
  ]

  const stat = [
    { label: t("Hallazgos detectados", "Findings detected"), value: today.findings, icon: SignalIcon, color: TEAL },
    { label: t("Riesgos UX", "UX risks"), value: today.uxRisks, icon: AlertTriangle, color: ACCENT },
    { label: t("Oportunidades", "Opportunities"), value: today.opportunities, icon: Lightbulb, color: TEAL },
    { label: t("Señales de comportamiento", "Behavior signals"), value: today.behaviorSignals, icon: Activity, color: ACCENT },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden bg-[var(--surface-dark)] pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--magenta)]/30 bg-[var(--magenta)]/10 px-3 py-1 text-xs font-semibold text-[var(--magenta)]">
              <ScanLine size={13} /> {t("Especial Mundial 2026", "World Cup 2026 Special")}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">Experience Radar</h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {t(
                "Hallazgos automáticos sobre experiencia digital, comportamiento de usuarios e IA durante eventos de alta demanda.",
                "Automated findings on digital experience, user behavior and AI during high-demand events.",
              )}
            </p>
            <p className="mt-3 max-w-xl text-sm font-medium text-foreground/80">
              {t("No seguimos el marcador. Analizamos la experiencia.", "We don't follow the score. We analyze the experience.")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#hallazgos" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-[var(--magenta)] hover:text-white">
                {t("Ver hallazgos de hoy", "See today's findings")} <ArrowRight size={16} />
              </Link>
              <Link href="#metodologia" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[var(--cyan)]/50">
                {t("Ver metodología", "See methodology")}
              </Link>
            </div>

            <p className="mt-6 max-w-md text-xs leading-relaxed text-muted-foreground">
              {t(
                "Contenido editorial e investigativo independiente. No somos patrocinadores oficiales del torneo.",
                "Independent editorial and research content. We are not official sponsors of the tournament.",
              )}
            </p>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-sm">
            <RadarSweep className="h-auto w-full" />
            <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
              {t("El Mundial como laboratorio de comportamiento digital.", "The World Cup as a digital behavior lab.")}
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── PANEL: HOY EN EXPERIENCIA ───────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">{t("De la noticia al insight", "From news to insight")}</p>
            <h2 className="mt-1 text-2xl font-bold md:text-3xl">{t("Hoy en experiencia", "Experience today")}</h2>
          </div>
          <span className="hidden text-sm text-muted-foreground md:block">{today.date}</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {stat.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <s.icon size={18} style={{ color: s.color }} />
              <p className="mt-3 text-3xl font-bold tabular-nums">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-between rounded-2xl border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.06] p-5 lg:col-span-1">
            <div>
              <p className="text-xs text-muted-foreground">{t("Impacto general", "Overall impact")}</p>
              <p className="mt-1 text-2xl font-bold text-[var(--magenta)]">{today.impactLevel}</p>
            </div>
            <Gauge size={22} className="text-[var(--magenta)]" />
          </div>
        </div>
      </section>

      {/* ───────────────── WORLD EXPERIENCE INDEX ───────────────── */}
      <section className="relative overflow-hidden border-y border-border bg-[var(--surface-dark)] py-14 md:py-20">
        <SignalWaves className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-60" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">{t("Índice propio de MediaLab", "MediaLab's own index")}</p>
            <h2 className="mt-1 text-2xl font-bold md:text-3xl">World Experience Index</h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              {t(
                "Un índice 0–100 que resume la salud de la experiencia digital durante el evento, a partir de ocho variables.",
                "A 0–100 index summarizing the health of the digital experience during the event, across eight variables.",
              )}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <ScoreRing value={index.overall} size={92} stroke={8} />
              <div>
                <p className="text-4xl font-bold tabular-nums">{index.overall}<span className="text-xl text-muted-foreground">/100</span></p>
                <p className="text-sm text-muted-foreground">World Experience Index</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-xs text-muted-foreground">
              {t("Aprendizajes UX detectados en eventos de alta demanda.", "UX learnings detected in high-demand events.")}
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={indexData} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Radar dataKey="v" stroke={TEAL} fill={TEAL} fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ───────────────── HALLAZGOS + FILTROS ───────────────── */}
      <section id="hallazgos" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">{t("Cards de insights", "Insight cards")}</p>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">{t("Hallazgos de experiencia", "Experience findings")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t(
              "Cada card incluye qué debería hacer un equipo de producto: Product Designer, UX Research, Product Manager, equipo técnico y negocio.",
              "Each card includes what a product team should do: Product Designer, UX Research, Product Manager, engineering and business.",
            )}
          </p>
        </div>

        {/* Filtros */}
        <div className="mt-7 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Filter size={14} /> {t("Filtrar hallazgos", "Filter findings")}
          </div>

          {/* Categoría (chips) */}
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>{t("Todas", "All")}</FilterChip>
            {RADAR_CATEGORIES.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                {CATEGORY_LABELS[c][lang]}
              </FilterChip>
            ))}
          </div>

          {/* Selects: impacto, país, fuente */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SelectField label={t("Nivel de impacto", "Impact level")} value={String(minImpact)} onChange={(v) => setMinImpact(Number(v))}
              options={[{ v: "0", l: t("Todos", "All") }, { v: "65", l: t("Alto (65+)", "High (65+)") }, { v: "77", l: t("Crítico (77+)", "Critical (77+)") }]} />
            <SelectField label={t("País", "Country")} value={country} onChange={setCountry}
              options={[{ v: "all", l: t("Todos", "All") }, ...countries.map((c) => ({ v: c, l: countryLabel(c, lang) }))]} />
            <SelectField label={t("Fuente", "Source")} value={source} onChange={setSource}
              options={[{ v: "all", l: t("Todas", "All") }, ...sources.map((s) => ({ v: s, l: s }))]} />
          </div>
        </div>

        {/* Grid de cards */}
        {filtered.length > 0 ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((i) => (
              <InsightCard key={i.id} insight={i} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">{t("No hay hallazgos con estos filtros.", "No findings for these filters.")}</p>
        )}
      </section>

      {/* ───────────────── METODOLOGÍA ───────────────── */}
      <section id="metodologia" className="border-y border-border bg-[var(--surface-dark)] py-14 scroll-mt-24 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">{t("Metodología MediaLab", "MediaLab methodology")}</p>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">{t("Cómo trabaja el radar", "How the radar works")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {methodology.map((m, idx) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--cyan)]/10">
                  <m.icon size={18} className="text-[var(--cyan)]" />
                </div>
                <p className="mt-3 text-sm font-semibold">{m.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{m.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── NEWSLETTER ───────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
        <Mail size={26} className="mx-auto text-[var(--cyan)]" />
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">{t("Radar de experiencia", "Experience radar")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          {t(
            "Un resumen semanal con aprendizajes de UX, IA y comportamiento digital detectados durante eventos masivos.",
            "A weekly summary of UX, AI and digital behavior learnings detected during massive events.",
          )}
        </p>
        {/* TODO: conectar a backend de newsletter cuando exista (hoy sin envío). */}
        <form
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
          aria-label={t("Suscripción al radar de experiencia", "Experience radar subscription")}
        >
          <label htmlFor="radar-email" className="sr-only">{t("Email", "Email")}</label>
          <input
            id="radar-email"
            type="email"
            required
            placeholder={t("tu@email.com", "you@email.com")}
            className="flex-1 rounded-full border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--cyan)]/60 focus-visible:ring-2 focus-visible:ring-[var(--cyan)]/40"
          />
          <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-[var(--magenta)] hover:text-white">
            {t("Suscribirme", "Subscribe")}
          </button>
        </form>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {t("Aún sin backend conectado: el formulario no envía datos todavía.", "No backend connected yet: the form does not send data.")}
        </p>
      </section>

      <Footer />
    </div>
  )
}

/* ───────────────── Subcomponentes de UI ───────────────── */

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]/50 ${
        active
          ? "border-[var(--cyan)] bg-[var(--cyan)]/10 text-[var(--cyan)]"
          : "border-border text-muted-foreground hover:border-[var(--cyan)]/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { v: string; l: string }[]
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--cyan)]/60 focus-visible:ring-2 focus-visible:ring-[var(--cyan)]/40"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
    </label>
  )
}
