"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Minus } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const faqs = [
    {
      question: t("¿Qué es UXBox y por qué debería importarme?", "What is UXBox and why should I care?"),
      answer: t(
        "UXBox es nuestra herramienta de IA que toma tu idea de producto y genera una propuesta estructurada — con requisitos, estrategia UX y conceptos de diseño — en días en lugar de meses. Si alguna vez sentiste que tu equipo lleva semanas definiendo sin avanzar, esto es para ti.",
        "UXBox is our AI tool that takes your product idea and generates a structured proposal — with requirements, UX strategy, and design concepts — in days instead of months. If you've ever felt your team has spent weeks defining without progress, this is for you."
      ),
    },
    {
      question: t("¿Cuánto tiempo toma empezar a ver resultados reales?", "How long does it take to start seeing real results?"),
      answer: t(
        "Con UXBox, puedes tener claridad sobre tu producto en 3-5 días. Un primer prototipo validado, en 2-4 semanas. No te vamos a decir que todo toma meses — porque no tiene por qué.",
        "With UXBox, you can have clarity about your product in 3-5 days. A first validated prototype, in 2-4 weeks. We won't tell you everything takes months — because it doesn't have to."
      ),
    },
    {
      question: t("¿Trabajan con empresas de mi industria?", "Do you work with companies in my industry?"),
      answer: t(
        "Trabajamos con equipos en Fintech, Banca, Movilidad, Startups, Educación, E-commerce, Sostenibilidad y Plataformas Digitales. Si tu producto tiene usuarios — humanos que necesitan sentir confianza — podemos ayudarte.",
        "We work with teams in Fintech, Banking, Mobility, Startups, Education, E-commerce, Sustainability, and Digital Platforms. If your product has users — humans who need to feel trust — we can help you."
      ),
    },
    {
      question: t("¿Pueden construir mi producto completo o solo diseñan?", "Can you build my full product or just design?"),
      answer: t(
        "Ambas. Hacemos todo el camino: investigación, diseño UX/UI y desarrollo de software a medida. Si solo necesitas diseño o solo desarrollo, también funciona. Nos adaptamos a lo que tu equipo necesite.",
        "Both. We do the whole path: research, UX/UI design, and custom software development. If you only need design or only development, that works too. We adapt to what your team needs."
      ),
    },
    {
      question: t("¿Cómo empiezo si todavía no tengo claro lo que necesito?", "How do I start if I'm not yet clear on what I need?"),
      answer: t(
        "Ese es justo el punto de partida perfecto. Haz clic en 'Quiero transformar mi producto' y te contactaremos en 24h para una sesión de discovery gratuita de 30 minutos. Saldrás con más claridad de la que tienes ahora. Sin compromiso.",
        "That's exactly the perfect starting point. Click 'I want to transform my product' and we'll contact you within 24h for a free 30-minute discovery session. You'll leave with more clarity than you have now. No commitment."
      ),
    },
    {
      question: t("¿Puedo integrarlos como parte de mi equipo?", "Can I integrate you as part of my team?"),
      answer: t(
        "Sí, muchos de nuestros clientes nos integran como su equipo de producto externo. Trabajamos dentro de tus sprints, con tus herramientas y junto a tus desarrolladores. Es como tener un equipo senior de UX + Desarrollo sin el costo de contratación.",
        "Yes — many of our clients integrate us as their external product team. We work inside your sprints, with your tools, alongside your developers. It's like having a senior UX + Development team without the cost of hiring."
      ),
    },
    {
      question: t("¿Cómo sé que no van a diseñar algo bonito que nadie use?", "How do I know you won't design something pretty no one uses?"),
      answer: t(
        "Porque empezamos investigando a tus usuarios, no dibujando pantallas. Cada decisión de diseño está respaldada por datos de comportamiento real. Diseñamos para que funcione primero — y que se vea increíble después.",
        "Because we start by researching your users, not drawing screens. Every design decision is backed by real behavioral data. We design for it to work first — and look incredible second."
      ),
    },
    {
      question: t("¿Qué los hace diferentes de otras agencias UX?", "What makes you different from other UX agencies?"),
      answer: t(
        "Tres cosas: (1) UXBox — IA que comprime tu discovery 10x, (2) investigamos cómo piensan tus usuarios antes de diseñar, y (3) hacemos todo end-to-end: investigación, diseño y desarrollo. No pasamos el trabajo a un tercero.",
        "Three things: (1) UXBox — AI that compresses your discovery 10x, (2) we research how your users think before designing, and (3) we do everything end-to-end: research, design, and development. We don't pass the work to a third party."
      ),
    },
  ]

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
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">{t("Preguntas frecuentes", "Frequently asked questions")}</span>
          <h2
            id="faq-heading"
            className="font-display font-bold text-3xl md:text-4xl leading-tight text-foreground text-balance"
          >
            {t(
              "Estas son las preguntas que nos hacen los equipos que terminan trabajando con nosotros",
              "These are the questions teams that end up working with us ask"
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {t(
              "Si la tuya no está aquí, escríbenos. Respondemos en menos de 24 horas.",
              "If yours isn't here, write to us. We reply in under 24 hours."
            )}
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
