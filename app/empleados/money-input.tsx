"use client"

/**
 * Campo de dinero: solo dígitos, sin stepper, formatea con puntos de miles/millones
 * al estilo colombiano (1.750.905) mientras escribes. Guarda el valor como número.
 */
function fmt(n: number): string {
  if (!n) return ""
  return Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export function MoneyInput({
  value,
  onChange,
  className,
  placeholder = "0",
  id,
}: {
  value: number
  onChange: (n: number) => void
  className?: string
  placeholder?: string
  id?: string
}) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={fmt(value)}
      placeholder={placeholder}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "")
        onChange(digits ? parseInt(digits, 10) : 0)
      }}
      className={className}
    />
  )
}
