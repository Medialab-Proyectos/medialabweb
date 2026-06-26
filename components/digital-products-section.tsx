"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

type Product = {
  name: string
  tagline: string
  description: string
  color: string
  gradient: string
  tags: string[]
  status: string
  image: string
  href?: string
}

export function DigitalProductsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const products: Product[] = [
    {
      name: "SinDeudas",
      tagline: t(
        "Plataforma B2C de Finanzas Conductuales",
        "B2C Behavioral Finance Platform",
      ),
      description: t(
        "Una experiencia B2C disenada para ayudar a las personas a manejar sus finanzas de forma eficiente, entendiendo el rol psicologico del dinero. Combina guia emocional, psicologia del consumidor y herramientas digitales inteligentes para transformar la relacion del usuario con sus finanzas y sus deudas.",
        "A B2C experience designed to help people manage their finances efficiently by understanding the psychological role of money. It combines emotional guidance, consumer psychology, and intelligent digital tools to transform the user's relationship with finances and debt.",
      ),
      color: "var(--magenta)",
      gradient: "linear-gradient(135deg, var(--magenta), oklch(0.45 0.24 300))",
      tags: [t("FinTech B2C", "B2C FinTech"), t("Diseno Conductual", "Behavioral Design"), "Mobile"],
      status: t("En Desarrollo", "In Development"),
      image: "/images/sindeudas (1).png",
    },
    {
      name: "Cumbreva",
      tagline: t(
        "La experiencia que transforma la conduccion electrica",
        "The experience that transforms electric driving",
      ),
      description: t(
        "Disenamos una plataforma que acompana al conductor antes, durante y despues de cada trayecto. Desde la gestion del vehiculo hasta la planificacion inteligente de rutas y carga, Cumbreva convierte informacion compleja en decisiones simples, ofreciendo una experiencia fluida, confiable y centrada en las personas.",
        "We designed a platform that supports the driver before, during, and after every trip. From vehicle management to smart route and charging planning, Cumbreva turns complex information into simple decisions, delivering a fluid, reliable, and people-centered experience.",
      ),
      color: "var(--cyan)",
      gradient: "linear-gradient(135deg, var(--cyan), oklch(0.55 0.18 220))",
      tags: [t("Movilidad Electrica", "Electric Mobility"), "UX/UI", t("Experiencia Digital", "Digital Experience")],
      status: t("En Desarrollo", "In Development"),
      image: "/images/cumbreva.png",
      href: "https://cumbreva.vercel.app/",
    },
  ]

  return (
    <section
      id="products"
      ref={ref}
      className="py-12 md:py-24 px-6 bg-background"
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Image
              src="/images/ecosistema/lab.svg"
              alt="UXLab"
              width={110}
              height={30}
              className="h-7 w-auto dark:brightness-0 dark:invert dark:opacity-60 opacity-70"
            />
            <span className="w-px h-5 bg-border" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
              {t("Nuestros propios productos", "Our own products")}
            </span>
          </div>
          <h2
            id="products-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "No solo disenamos para otros. Tambien ponemos nuestra propia piel en el juego.",
              "We don't just design for others. We also put our own skin in the game.",
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Construimos productos propios porque creemos que la mejor forma de demostrar lo que hacemos es vivirlo. Cada uno aplica los mismos principios que usamos con nuestros clientes.",
              "We build our own products because we believe the best way to demonstrate what we do is to live it. Each one applies the same principles we use with our clients.",
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product, i) => {
            const cardClassName = `group relative flex flex-col gap-6 rounded-3xl overflow-hidden border border-border bg-card hover:border-transparent hover:shadow-2xl transition-all duration-500 ${product.href ? "cursor-pointer" : "cursor-default"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`

            const cardContent = (
              <>
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary to-secondary/50">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.tagline}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `linear-gradient(to top, ${product.color}, transparent)` }}
                  />
                </div>

                <div className="p-8 pt-0 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{
                        borderColor: `${product.color}40`,
                        color: product.color,
                        background: `${product.color}10`,
                      }}
                    >
                      <Clock size={11} />
                      {product.status}
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-muted-foreground group-hover:text-foreground transition-colors"
                      style={{ color: product.color }}
                    />
                  </div>

                  <div>
                    <h3
                      className="font-display font-bold text-2xl text-foreground mb-1"
                      style={{
                        background: product.gradient,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">{product.tagline}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )

            if (product.href) {
              const isExternal = product.href.startsWith("http")
              return (
                <Link
                  key={product.name}
                  href={product.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={cardClassName}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {cardContent}
                </Link>
              )
            }

            return (
              <div
                key={product.name}
                className={cardClassName}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {cardContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
