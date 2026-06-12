"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts"
import {
  Activity, Award, Heart, MessageSquare, AlertTriangle, Lightbulb, Zap, HelpCircle, RefreshCw, Send, CheckCircle2, ChevronRight
} from "lucide-react"
import { SignalWaves, ScoreRing } from "./radar-visuals"

const TEAL = "#2AABB3"
const ACCENT = "#E8751A"
const MAGENTA = "#D83A6F"

interface Evidence {
  title: string
  url: string
  sourceName: string
}

interface ExperienceInsight {
  id: string
  title: string
  category: string
  insight: string
  risk: string
  opportunity: string
  recommendation: string
  evidence: Evidence[]
  impactScore: number
}

interface DailyRadarReport {
  worldExperienceIndex: number
  topInsights: ExperienceInsight[]
  article: {
    whatFansSay: string
  }
}

export function SpanishRadarDashboard({ report }: { report: DailyRadarReport }) {
  const { topInsights, worldExperienceIndex, article } = report

  // 1. Calcular dinámicamente las variables del radar basadas en los insights del día
  const variables = useMemo(() => {
    const BASE = 88 // Base óptima
    const vars = {
      clarity: BASE,
      speed: BASE,
      trust: BASE,
      accessibility: BASE,
      continuity: BASE,
      cognitiveLoad: BASE,
      fanEmotion: BASE,
      errorRecovery: BASE,
    }

    topInsights.forEach((insight) => {
      const category = insight.category.toUpperCase()
      const penalty = Math.round((insight.impactScore / 100) * 18)

      if (category.includes("UX")) {
        vars.clarity = Math.max(35, vars.clarity - penalty)
      } else if (category.includes("TRAFFIC") || category.includes("TRÁFICO")) {
        vars.speed = Math.max(35, vars.speed - penalty)
        vars.cognitiveLoad = Math.max(35, vars.cognitiveLoad - Math.round(penalty / 1.5))
      } else if (category.includes("STREAMING")) {
        vars.continuity = Math.max(35, vars.continuity - penalty)
      } else if (category.includes("TICKETING")) {
        vars.trust = Math.max(35, vars.trust - penalty)
      } else if (category.includes("ACCESIBILIDAD") || category.includes("ACCESSIBILITY")) {
        vars.accessibility = Math.max(35, vars.accessibility - penalty)
      } else if (category.includes("MOBILE") || category.includes("MÓVIL")) {
        vars.continuity = Math.max(35, vars.continuity - penalty)
        vars.speed = Math.max(40, vars.speed - Math.round(penalty / 2))
      } else if (category.includes("IA") || category.includes("AI")) {
        vars.trust = Math.max(35, vars.trust - penalty)
      } else if (category.includes("TRUST") || category.includes("CONFIANZA")) {
        vars.trust = Math.max(35, vars.trust - penalty)
      } else if (category.includes("ERROR") || category.includes("RECUPERACIÓN")) {
        vars.errorRecovery = Math.max(35, vars.errorRecovery - penalty)
        vars.cognitiveLoad = Math.max(35, vars.cognitiveLoad - Math.round(penalty / 1.5))
      } else if (category.includes("FAN") || category.includes("EXPERIENCE")) {
        vars.fanEmotion = Math.max(35, vars.fanEmotion - penalty)
      }
    })

    return vars
  }, [topInsights])

  const chartData = [
    { k: "Claridad", v: variables.clarity },
    { k: "Velocidad", v: variables.speed },
    { k: "Confianza", v: variables.trust },
    { k: "Accesibilidad", v: variables.accessibility },
    { k: "Continuidad", v: variables.continuity },
    { k: "Carga cognitiva", v: variables.cognitiveLoad },
    { k: "Emoción del fan", v: variables.fanEmotion },
    { k: "Recuperación", v: variables.errorRecovery },
  ]

  // 2. Estado para el quiz interactivo
  const [userSpeed, setUserSpeed] = useState(70)
  const [userClarity, setUserClarity] = useState(75)
  const [userStability, setUserStability] = useState(80)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const handleCalculateScore = (e: React.FormEvent) => {
    e.preventDefault()
    const score = Math.round((userSpeed + userClarity + userStability) / 3)
    setQuizScore(score)
    setQuizSubmitted(true)
  }

  // 3. Obtener el mensaje personalizado para el quiz
  const quizFeedback = useMemo(() => {
    const diff = quizScore - worldExperienceIndex
    const relativeText = diff > 0 
      ? `un ${diff}% mejor que la media del radar (${worldExperienceIndex}%)`
      : diff < 0 
      ? `un ${Math.abs(diff)}% por debajo de la media del radar (${worldExperienceIndex}%)`
      : `exactamente igual a la media del radar (${worldExperienceIndex}%)`

    if (quizScore >= 80) {
      return {
        title: "¡Experiencia Fluida!",
        text: `Tu experiencia hoy califica con ${quizScore}%, lo cual es ${relativeText}. Has navegado bajo condiciones óptimas. Sin embargo, recuerda que en picos de demanda del Mundial, millones de usuarios en redes móviles inestables experimentan altas latencias y bloqueos. Diseñar para el caso extremo es la clave.`,
        color: TEAL,
      }
    } else if (quizScore >= 60) {
      return {
        title: "Fricción Moderada",
        text: `Tu experiencia hoy califica con ${quizScore}%, lo cual es ${relativeText}. Esto es consistente con la mayoría de los usuarios en eventos masivos: retrasos esporádicos en streaming o carga de información. Para un equipo de producto, optimizar la persistencia de estado evita la frustración del reintento.`,
        color: ACCENT,
      }
    } else {
      return {
        title: "Fricción Crítica",
        text: `Tu experiencia hoy califica con ${quizScore}%, lo cual es ${relativeText}. Has experimentado los dolores típicos del colapso de infraestructura o mala UX operacional. Esto demuestra por qué el radar prioriza la recuperación ante errores e idempotencia en los flujos transaccionales.`,
        color: MAGENTA,
      }
    }
  }, [quizScore, worldExperienceIndex])

  // 4. Determinar los valores fijos del Pulso Emocional basado en el análisis diario
  const emotionMetrics = useMemo(() => {
    const containsFrustration = article.whatFansSay.toLowerCase().includes("frustracion") || article.whatFansSay.toLowerCase().includes("frustración") || article.whatFansSay.toLowerCase().includes("error")
    const containsAnxiety = article.whatFansSay.toLowerCase().includes("ansiedad") || article.whatFansSay.toLowerCase().includes("espera") || article.whatFansSay.toLowerCase().includes("perdida")
    
    return [
      { name: "Euforia y Expectativa", value: 85, color: TEAL, icon: Zap },
      { name: "Ansiedad Digital", value: containsAnxiety ? 72 : 45, color: ACCENT, icon: Activity },
      { name: "Frustración por Fricción", value: containsFrustration ? 68 : 30, color: MAGENTA, icon: AlertTriangle },
      { name: "Confianza en Plataformas", value: containsFrustration ? 48 : 75, color: TEAL, icon: Heart }
    ]
  }, [article.whatFansSay])

  return (
    <div className="space-y-12">
      {/* ───────────────── SECCIÓN: WORLD EXPERIENCE INDEX INTERACTIVO ───────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-[var(--surface-dark)] p-6 md:p-8">
        <SignalWaves className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-30" />
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)]/10 px-3 py-1 text-xs font-semibold text-[var(--cyan)]">
              <Award size={13} /> Análisis Multivariable
            </span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">World Experience Index</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Un índice inteligente de 0 a 100 que evalúa la salud de la experiencia digital del usuario final en tiempo real. Se calcula ponderando el impacto de las señales de fricción detectadas hoy en 8 variables clave de usabilidad.
            </p>
            
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4">
                <ScoreRing value={worldExperienceIndex} size={84} stroke={8} />
                <div>
                  <p className="text-3xl font-extrabold tabular-nums">
                    {worldExperienceIndex}
                    <span className="text-lg text-muted-foreground font-normal">/100</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Puntuación de Salud Global</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card/60 px-4 py-3 text-xs">
                <span className="font-semibold text-foreground">Estado Operacional:</span>
                <span className={`ml-2 font-bold ${
                  worldExperienceIndex >= 80 ? "text-[var(--cyan)]" : worldExperienceIndex >= 60 ? "text-[#f4a261]" : "text-[var(--magenta)]"
                }`}>
                  {worldExperienceIndex >= 80 ? "Estable" : worldExperienceIndex >= 60 ? "Degradación Moderada" : "Fricción Crítica"}
                </span>
                <p className="mt-1 text-muted-foreground">Derivado de {topInsights.length} hallazgos principales.</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center h-[300px] w-full bg-card/40 rounded-xl border border-border/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="70%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Radar dataKey="v" stroke={TEAL} fill={TEAL} fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ───────────────── SECCIÓN: PULSO EMOCIONAL Y QUIZ DE ENGAGEMENT ───────────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* PANEL: PULSO EMOCIONAL DE LA TRIBUNA */}
        <section className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--cyan)]">
              <Heart size={14} className="text-[var(--magenta)]" /> Pulso Emocional de la Tribuna
            </div>
            <h3 className="mt-2 text-xl font-bold">La Voz del Aficionado</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Análisis del sentimiento de la conversación digital en redes y feedback de aplicaciones móviles durante el encuentro masivo.
            </p>

            <div className="mt-6 space-y-4">
              {emotionMetrics.map((emotion) => (
                <div key={emotion.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-foreground/90">
                      <emotion.icon size={13} style={{ color: emotion.color }} />
                      {emotion.name}
                    </span>
                    <span className="font-semibold tabular-nums" style={{ color: emotion.color }}>{emotion.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${emotion.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: emotion.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--cyan)] flex items-center gap-1">
              <MessageSquare size={11} /> Conversación Dominante
            </span>
            <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
              "{article.whatFansSay}"
            </p>
          </div>
        </section>

        {/* PANEL: WIDGET INTERACTIVO (QUIZ) */}
        <section className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--cyan)]">
              <Zap size={14} /> Pon a Prueba tu Experiencia
            </div>
            <h3 className="mt-2 text-xl font-bold">Simulador de Experiencia</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Califica las plataformas que usaste hoy para comparar tu experiencia con el World Experience Index global.
            </p>

            {!quizSubmitted ? (
              <form onSubmit={handleCalculateScore} className="mt-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="speed-slider" className="font-medium text-muted-foreground">Velocidad de Carga (Streaming/Datos)</label>
                    <span className="font-bold tabular-nums text-[var(--cyan)]">{userSpeed}%</span>
                  </div>
                  <input
                    id="speed-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={userSpeed}
                    onChange={(e) => setUserSpeed(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[var(--cyan)]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="clarity-slider" className="font-medium text-muted-foreground">Claridad del Contenido e Interfaz</label>
                    <span className="font-bold tabular-nums text-[var(--cyan)]">{userClarity}%</span>
                  </div>
                  <input
                    id="clarity-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={userClarity}
                    onChange={(e) => setUserClarity(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[var(--cyan)]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="stability-slider" className="font-medium text-muted-foreground">Estabilidad Operacional (Sin errores/bloqueos)</label>
                    <span className="font-bold tabular-nums text-[var(--cyan)]">{userStability}%</span>
                  </div>
                  <input
                    id="stability-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={userStability}
                    onChange={(e) => setUserStability(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[var(--cyan)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background transition-colors hover:bg-[var(--cyan)] hover:text-white"
                >
                  <Send size={12} /> Calcular Mi UX Score
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 rounded-xl border border-border/80 bg-muted/30 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Tu UX Score:</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-[var(--cyan)]" />
                    <span className="text-xl font-black text-foreground tabular-nums">{quizScore}%</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: quizFeedback.color }}>
                    {quizFeedback.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {quizFeedback.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setQuizSubmitted(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--cyan)] hover:text-foreground transition-colors"
                >
                  <RefreshCw size={11} /> Volver a evaluar
                </button>
              </motion.div>
            )}
          </div>

          <div className="mt-4 text-[10px] text-muted-foreground text-center">
            Este simulador corre localmente en tu cliente móvil o web. No se recopilan datos personales.
          </div>
        </section>
      </div>
    </div>
  )
}
