"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "¿Qué es UXBox y cómo ayuda a mi negocio?",
    answer:
      "UXBox es nuestra plataforma inteligente de descubrimiento de producto potenciada por IA. Analiza tu idea y genera una propuesta de producto estructurada — incluyendo requisitos, estrategia UX y conceptos de diseño — en días en lugar de meses. Ideal tanto para líderes B2B que necesitan validar rápidamente como para fundadores B2C que quieren llegar antes al mercado.",
  },
  {
    question: "¿Cuánto tiempo toma el discovery de producto?",
    answer:
      "Con UXBox, el discovery de producto puede completarse en tan solo 3-5 días. Los procesos tradicionales toman semanas o meses. Nuestro enfoque acelerado por IA comprime ese tiempo dramáticamente, permitiendo a equipos B2B y B2C tomar decisiones informadas más rápido.",
  },
  {
    question: "¿Con qué industrias y modelos de negocio trabajan?",
    answer:
      "Trabajamos con empresas B2B (SaaS, plataformas enterprise, fintech corporativa) y marcas B2C (e-commerce, apps de consumo, movilidad). Nuestras industrias incluyen Fintech, Banca, Movilidad, Startups, Educación, E-commerce, Sostenibilidad y Plataformas Digitales.",
  },
  {
    question: "¿Construyen plataformas digitales completas?",
    answer:
      "Sí. Ofrecemos servicios end-to-end desde discovery y diseño UX/UI hasta desarrollo de software a medida. Construimos dashboards B2B, apps móviles B2C, MVPs para startups y plataformas empresariales escalables usando React, Next.js, Node.js e infraestructura cloud.",
  },
  {
    question: "¿Cómo inicio un proyecto con MediaLab?",
    answer:
      "La forma más fácil es hacer clic en \"Agenda tu llamada gratuita\" y contarnos sobre tu idea. También puedes usar UXBox para enviar un brief estructurado. Nuestro equipo te contactará en 24 horas para una sesión de discovery gratuita — sin compromiso.",
  },
  {
    question: "¿Puedo contratar a MediaLab como equipo de producto externo?",
    answer:
      "Absolutamente. Muchos clientes B2B nos integran como su equipo dedicado de diseño y desarrollo. Trabajamos junto a tus equipos internos u operamos de forma independiente. Es ideal para startups sin capacidad de diseño interna y para corporaciones que necesitan escalar su equipo digital rápidamente.",
  },
  {
    question: "¿Cómo garantizan que la experiencia conecte emocionalmente con mis usuarios?",
    answer:
      "Aplicamos principios de diseño conductual y psicología del consumidor en cada proyecto. Realizamos investigación de usuarios reales, mapeo de emociones (emotion mapping), pruebas de usabilidad y análisis de microinteracciones para asegurar que cada touchpoint genere confianza, satisfacción y engagement genuino.",
  },
  {
    question: "¿Qué diferencia a MediaLab de otras agencias UX?",
    answer:
      "Tres cosas nos hacen únicos: (1) Nuestra plataforma UXBox con IA que acelera el discovery 10x, (2) Nuestro enfoque en diseño conductual basado en psicología real del consumidor, y (3) Nuestra capacidad end-to-end de llevar un producto desde la idea hasta producción — todo bajo un mismo equipo.",
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
            Preguntas frecuentes sobre diseño UX, IA y productos digitales
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Todo lo que necesitas saber sobre cómo MediaLab Ingeniería puede transformar tu experiencia digital B2B o B2C.
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
