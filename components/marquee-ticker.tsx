const items = [
  "Investigación de Usuarios",
  "Diseño Emocional",
  "IA aplicada al Producto",
  "Código que Escala",
  "SEO que Posiciona",
  "Psicología del Consumidor",
  "Experiencias B2B",
  "Productos B2C",
  "Conversión Medible",
  "Criterio Humano",
]

export function MarqueeTicker() {
  // Duplicate items to create seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden py-4 bg-[var(--surface-dark)] border-y border-white/5"
      aria-hidden="true"
    >
      <div className="animate-marquee">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-xs font-semibold uppercase tracking-widest text-white/30 shrink-0"
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
