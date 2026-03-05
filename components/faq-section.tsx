"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "¿Qué es UXBox?",
    answer:
      "UXBox es nuestra plataforma inteligente de descubrimiento de producto. Usa inteligencia artificial para analizar tu idea y generar una propuesta de producto estructurada — incluyendo requisitos, enfoques de UX y conceptos de diseño iniciales — en días en lugar de meses.",
  },
  {
    question: "¿Cuánto tiempo toma el discovery de producto?",
    answer:
      "Con UXBox, el discovery de producto puede completarse en tan solo 3-5 días. Los procesos de discovery tradicionales pueden tomar semanas o meses. Nuestro enfoque acelerado por IA comprime ese tiempo dramáticamente mientras mantiene la profundidad y calidad.",
  },
  {
    question: "¿Con qué industrias trabajan?",
    answer:
      "Trabajamos en Fintech, Banca, Movilidad, Startups, Educación, E-commerce, Soluciones Ambientales y Plataformas Digitales. Nuestro enfoque centrado en el humano es aplicable a cualquier industria donde la experiencia de usuario y la innovación digital sean prioridades.",
  },
  {
    question: "¿Construyen plataformas digitales completas?",
    answer:
      "Sí. Ofrecemos servicios de principio a fin desde discovery y diseño UX hasta desarrollo de software a medida. Construimos plataformas web, MVPs para startups, plataformas empresariales y productos digitales escalables usando React, Node.js, PHP e infraestructura cloud.",
  },
  {
    question: "¿Cómo inicio un proyecto?",
    answer:
      "La forma más fácil es hacer clic en \"Iniciar proyecto\" y contarnos sobre tu idea. También puedes usar UXBox para enviar un brief de proyecto estructurado. Nuestro equipo te contactará en 24 horas para agendar una llamada de discovery.",
  },
  {
    question: "¿Puedo contratar a MediaLab como equipo de producto externo?",
    answer:
      "Absolutamente. Muchos de nuestros clientes nos integran como su equipo dedicado de diseño y desarrollo de producto. Trabajamos junto a tus equipos internos u operamos de forma independiente, según tus necesidades. Esto es ideal para startups y organizaciones sin capacidad de diseño interna.",
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
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">Preguntas Frecuentes</span>
          <h2
            id="faq-heading"
            className="font-display font-bold text-3xl md:text-4xl leading-tight text-foreground text-balance"
          >
            Preguntas frecuentes
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Todo lo que necesitas saber sobre trabajar con MediaLab Ingeniería.
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
