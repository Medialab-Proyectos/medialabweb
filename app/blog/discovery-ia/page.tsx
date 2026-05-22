import type { Metadata } from "next"
import Image from "next/image"
import {
  BlogChromeBackLink,
  BlogChromeMeta,
  BlogChromeEnNotice,
  BlogChromeCTA,
} from "@/components/blog/blog-chrome"
import { BlogRelatedArticles } from "@/components/blog/blog-related"

export const metadata: Metadata = {
  title: "Discovery con IA: El Fin de los Workshops Interminables",
  description:
    "Cómo las herramientas inteligentes están reemplazando semanas de sesiones con stakeholders y comprimiendo el discovery de producto a días.",
  alternates: {
    canonical: "/blog/discovery-ia",
    languages: {
      es: "/blog/discovery-ia",
      en: "/en/blog/discovery-ia",
      "x-default": "/blog/discovery-ia",
    },
  },
  openGraph: {
    type: "article",
    url: "/blog/discovery-ia",
    publishedTime: "2026-04-20T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-ai.jpg", width: 1200, height: 630, alt: "Discovery con IA" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/blog-ai.jpg"] },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Discovery con IA: El Fin de los Workshops Interminables",
  description: "Cómo la IA reduce el discovery de producto de semanas a días.",
  image: ["https://medialab.design/images/blog-ai.jpg"],
  datePublished: "2026-04-20T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/discovery-ia" },
  inLanguage: "es",
  articleSection: "IA",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "Discovery con IA", item: "https://medialab.design/blog/discovery-ia" },
  ],
}

export default function BlogDiscoveryIAPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-ai.jpg" alt="Discovery con IA" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 w-fit" style={{ background: "#2AABB3" }}>
            IA en UX
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Discovery con IA: El Fin de los Workshops Interminables
          </h1>
          <BlogChromeMeta dateEs="Ene 2025" dateEn="Jan 2025" readMin={4} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
        <BlogChromeEnNotice />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          El discovery de producto con IA permite comprimir semanas de workshops y sesiones con stakeholders en días, sin perder rigor investigativo. Las herramientas inteligentes analizan patrones de mercado, generan hipótesis validables y aceleran la síntesis — liberando al equipo para enfocarse en lo que realmente importa: decisiones basadas en evidencia y contacto real con usuarios.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Por Qué el Discovery Tradicional Ya No Funciona?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El proceso clásico de product discovery involucra semanas de workshops, entrevistas a usuarios, análisis competitivo y sesiones de síntesis. Para una empresa mediana, esto puede sumar fácilmente 80–120 horas de trabajo antes de escribir una sola línea de código — y un costo que pocas startups pueden sostener.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Además, los workshops tienen un problema estructural: tienden a generar falso consenso. Los stakeholders más ruidosos dominan la conversación, los más introvertidos callan sus mejores ideas, y el resultado suele ser un promedio tibio de todas las opiniones, no la solución óptima.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cómo Está la IA Cambiando el Discovery de Producto?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Con herramientas como GPT-4, Claude y sistemas especializados de análisis de usuarios, es posible comprimir una semana de trabajo de discovery en horas. No porque la IA reemplace el pensamiento humano — sino porque elimina el trabajo repetitivo y acelera la síntesis.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En MediaLab, hemos desarrollado un framework de <strong className="font-semibold text-foreground">AI-Assisted Discovery</strong> que combina:
        </p>
        <ul className="list-disc pl-6 space-y-4 text-lg text-muted-foreground mb-8">
          <li>Análisis automático de reseñas de competidores (App Store, G2, Trustpilot) para extraer patrones de dolor</li>
          <li>Generación de personas de usuario basadas en datos demográficos y de comportamiento reales</li>
          <li>Síntesis de insights de entrevistas mediante transcripción + análisis semántico</li>
          <li>Generación de user stories y criterios de aceptación de forma semi-automática</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Qué No Puede Reemplazar la IA en el Discovery?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La IA es extraordinariamente buena para sintetizar información existente. Pero no puede generar insights que no están en los datos — y los insights más valiosos en producto suelen venir de observar directamente cómo las personas fallan en completar una tarea, no de leer lo que dicen que hacen.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La observación etnográfica, las entrevistas con empatía profunda, el análisis contextual — estos no desaparecen con la IA. Lo que cambia es cuánto tiempo dedicamos a organizar y sintetizar lo que ya sabemos vs. cuánto tiempo dedicamos a descubrir lo que aún no sabemos.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Es Posible Hacer Discovery en 48 Horas?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Con nuestro proceso actual, podemos entregar un brief de producto completo — incluyendo análisis de mercado, definición de usuario objetivo, propuesta de valor única y priorizacion de features — en 48 horas. Esto que antes tomaba 3–4 semanas.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El tiempo ahorrado no va a las ganancias — va a donde realmente importa: más interacciones con usuarios reales, más prototipos iterados, más decisiones basadas en evidencia.
        </p>
      </article>

      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Quieres hacer discovery en 48h?"
          headlineEn="Want to run discovery in 48h?"
          subEs="Nuestro proceso UXBox combina IA y metodología UX para darte claridad en tiempo récord."
          subEn="Our UXBox process combines AI and UX methodology to give you clarity in record time."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Aprende discovery con IA en nuestro curso"
          headlineEn="Learn AI discovery in our course"
          subEs="El módulo de AI-Assisted Discovery es parte de nuestro programa AI User Experience Architect."
          subEn="The AI-Assisted Discovery module is part of our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="discovery-ia" slugs={["mvp-escala", "trono-de-la-decision", "psicologia-adopcion"]} />
      </div>
    </main>
  )
}
