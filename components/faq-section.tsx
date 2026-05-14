"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "¿Qué es UXBox y por qué debería importarme?",
    answer:
      "UXBox es nuestra herramienta de IA que toma tu idea de producto y genera una propuesta estructurada — con requisitos, estrategia UX y conceptos de diseño — en días en lugar de meses. Si alguna vez sentiste que tu equipo lleva semanas definiendo sin avanzar, esto es para ti.",
  },
  {
    question: "¿Cuánto tiempo toma empezar a ver resultados reales?",
    answer:
      "Con UXBox, puedes tener claridad sobre tu producto en 3-5 días. Un primer prototipo validado, en 2-4 semanas. No te vamos a decir que todo toma meses — porque no tiene por qué.",
  },
  {
    question: "¿Trabajan con empresas de mi industria?",
    answer:
      "Trabajamos con equipos en Fintech, Banca, Movilidad, Startups, Educación, E-commerce, Sostenibilidad y Plataformas Digitales. Si tu producto tiene usuarios — humanos que necesitan sentir confianza — podemos ayudarte.",
  },
  {
    question: "¿Pueden construir mi producto completo o solo diseñan?",
    answer:
      "Ambas. Hacemos todo el camino: investigación, diseño UX/UI y desarrollo de software a medida. Si solo necesitas diseño o solo desarrollo, también funciona. Nos adaptamos a lo que tu equipo necesite.",
  },
  {
    question: "¿Cómo empiezo si todavía no tengo claro lo que necesito?",
    answer:
      "Ese es justo el punto de partida perfecto. Haz clic en 'Quiero transformar mi producto' y te contactaremos en 24h para una sesión de discovery gratuita de 30 minutos. Saldrás con más claridad de la que tienes ahora. Sin compromiso.",
  },
  {
    question: "¿Puedo integrarlos como parte de mi equipo?",
    answer:
      "Sí, muchos de nuestros clientes nos integran como su equipo de producto externo. Trabajamos dentro de tus sprints, con tus herramientas y junto a tus desarrolladores. Es como tener un equipo senior de UX + Desarrollo sin el costo de contratación.",
  },
  {
    question: "¿Cómo sé que no van a diseñar algo bonito que nadie use?",
    answer:
      "Porque empezamos investigando a tus usuarios, no dibujando pantallas. Cada decisión de diseño está respaldada por datos de comportamiento real. Diseñamos para que funcione primero — y que se vea increíble después.",
  },
  {
    question: "¿Qué los hace diferentes de otras agencias UX?",
    answer:
      "Tres cosas: (1) UXBox — IA que comprime tu discovery 10x, (2) investigamos cómo piensan tus usuarios antes de diseñar, y (3) hacemos todo end-to-end: investigación, diseño y desarrollo. No pasamos el trabajo a un tercero.",
  },
]

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="faq"
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">Antes de decidir, resuelve tus dudas</span>
          <h2
            id="faq-heading"
            className="font-display font-bold text-3xl md:text-4xl leading-tight text-foreground text-balance"
          >
            Todo lo que querías preguntar (y algunas cosas que no sabías que necesitabas saber)
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Si tu pregunta no está aquí, escríbenos. Respondemos en menos de 24 horas.
          </p>
        </div>

        {/* Items */}
        <div
          className={`flex flex-col transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="border-b border-border last:border-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span
                    className={`font-semibold text-base transition-colors duration-200 ${isOpen ? "text-[var(--magenta)]" : "text-foreground group-hover:text-[var(--magenta)]"}`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isOpen ? "var(--magenta)" : "var(--secondary)",
                      color: isOpen ? "white" : "var(--muted-foreground)",
                    }}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 pb-5" : "max-h-0"}`}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
