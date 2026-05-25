"use client"

import { useLanguage } from "@/lib/language-context"

export function MarqueeTicker() {
  const { t } = useLanguage()

  const items = [
    t("Investigación de Usuarios", "User Research"),
    t("Diseño Emocional", "Emotional Design"),
    t("IA aplicada al Producto", "AI Applied to Product"),
    t("Código que Escala", "Code that Scales"),
    t("SEO que Posiciona", "SEO that Ranks"),
    t("Psicología del Consumidor", "Consumer Psychology"),
    t("Experiencias B2B", "B2B Experiences"),
    t("Productos B2C", "B2C Products"),
    t("Conversión Medible", "Measurable Conversion"),
    t("Criterio Humano", "Human Judgment"),
  ]

  // Duplicate items to create seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden py-4 bg-[var(--surface-dark)] border-y dark:border-white/5 border-foreground/5 transition-colors duration-300"
      aria-hidden="true"
    >
      <div className="animate-marquee">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-xs font-semibold uppercase tracking-widest dark:text-white/30 text-foreground/30 shrink-0"
          >
            {item}
            <span
              className="inline-block w-1 h-1 rounded-full shrink-0"
              style={{ background: i % 3 === 0 ? "var(--magenta)" : i % 3 === 1 ? "var(--cyan)" : "var(--orange)" }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
