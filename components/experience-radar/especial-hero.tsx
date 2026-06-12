"use client"

import { Radio, Globe2, Users, MapPin, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

/**
 * Hero del PORTAL del especial (/mundial-2026). A diferencia del landing, NO repite
 * la marca ni el radar animado (evita duplicar el radar): presenta el Mundial como
 * contexto —escala, audiencia, sedes— y enmarca qué hace el especial. Bilingüe,
 * mobile-first. La "barra viva" completa (próximo partido + contador) llega en Fase 2.
 */
export function EspecialHero({ updatedAt }: { updatedAt?: string }) {
  const { t, lang } = useLanguage()

  const updated = updatedAt
    ? new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
      }).format(new Date(updatedAt))
    : null

  const stats = [
    { icon: Globe2, value: "48", label: t("selecciones", "teams") },
    { icon: MapPin, value: "3", label: t("países sede", "host nations") },
    { icon: Users, value: t("miles de millones", "billions"), label: t("audiencia estimada", "estimated audience") },
  ]

  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-10 pb-8 text-[#fff] md:pt-14 md:pb-12">
      {/* Background Image with dark overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/experience-radar-vs-var1.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center brightness-[0.4] saturate-[1.1]"
        />
        {/* Gradients to improve contrast and blend with bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/35 to-black/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--magenta)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#fff] shadow-sm">
            <Radio size={12} className="motion-safe:animate-pulse" /> {t("En vivo", "Live")}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">
            {t("Especial Mundial 2026", "World Cup 2026 Special")}
          </span>
        </div>

        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.07] tracking-tight md:text-5xl text-[#fff] drop-shadow-sm">
          {t(
            "El Mundial 2026, leído como comportamiento humano",
            "The 2026 World Cup, read as human behavior",
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
          {t(
            "El evento deportivo más visto del planeta —48 selecciones, sedes en tres países y una audiencia global estimada en miles de millones de personas— se vuelve el mayor laboratorio de emoción y conversación digital de la historia. Aquí no seguimos el marcador: leemos noticias, emociones y sesgos para entender cómo reaccionan las personas.",
            "The most-watched sporting event on the planet —48 teams, venues across three countries and a global audience estimated in the billions— becomes the largest lab of emotion and digital conversation in history. Here we don't follow the score: we read news, emotions and biases to understand how people react.",
          )}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm"
            >
              <s.icon size={16} className="text-[var(--cyan)]" />
              <span className="text-sm">
                <strong className="font-bold text-[#fff]">{s.value}</strong>{" "}
                <span className="text-[#fff]/60">{s.label}</span>
              </span>
            </div>
          ))}
        </div>

        {updated && (
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-[#fff]/60">
            <RefreshCw size={12} /> {t("Última actualización del radar", "Radar last updated")}: <span className="text-[#fff]">{updated}</span>
          </p>
        )}
      </div>
    </section>
  )
}
