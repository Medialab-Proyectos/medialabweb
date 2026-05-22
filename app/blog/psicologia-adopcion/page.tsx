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
  title: "La Psicología Oculta Detrás de la Adopción de Productos Digitales",
  description:
    "Por qué algunos productos se convierten en hábito y otros son abandonados — lo que la ciencia del comportamiento nos dice sobre la diferencia.",
  alternates: {
    canonical: "/blog/psicologia-adopcion",
    languages: {
      es: "/blog/psicologia-adopcion",
      en: "/en/blog/psicologia-adopcion",
      "x-default": "/blog/psicologia-adopcion",
    },
  },
  openGraph: {
    type: "article",
    url: "/blog/psicologia-adopcion",
    publishedTime: "2026-04-15T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-behavioral.jpg", width: 1200, height: 630, alt: "Psicología de la adopción digital" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/blog-behavioral.jpg"] },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "La Psicología Oculta Detrás de la Adopción de Productos Digitales",
  description: "Cómo aplicar psicología del consumidor para acelerar la adopción de productos B2B y B2C.",
  image: ["https://medialab.design/images/blog-behavioral.jpg"],
  datePublished: "2026-04-15T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/psicologia-adopcion" },
  inLanguage: "es",
  articleSection: "UX",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "Psicología de la Adopción", item: "https://medialab.design/blog/psicologia-adopcion" },
  ],
}

export default function BlogPsicologiaAdopcionPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-behavioral.jpg" alt="Psicología de adopción digital" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 w-fit" style={{ background: "#E8751A" }}>
            Estrategia UX
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            La Psicología Oculta Detrás de la Adopción de Productos Digitales
          </h1>
          <BlogChromeMeta dateEs="Feb 2025" dateEn="Feb 2025" readMin={5} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
        <BlogChromeEnNotice />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Por qué algunos productos se convierten en hábito y otros son abandonados — lo que la ciencia del comportamiento nos dice sobre la diferencia.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El Modelo del Gancho: Cómo se Forman los Hábitos Digitales</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Nir Eyal, en su libro <em className="italic text-foreground">Hooked</em>, describe un ciclo de cuatro fases que los productos más exitosos usan para crear hábitos: disparador, acción, recompensa variable e inversión. Si tu producto no activa al menos alguna de estas etapas, la probabilidad de abandono se dispara después de los primeros tres días de uso.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El <strong className="font-semibold text-foreground">disparador</strong> puede ser externo (una notificación push, un email) o interno (el aburrimiento, la ansiedad, la soledad). Los productos que logran conectarse a disparadores internos — como Instagram conectado al aburrimiento o WhatsApp conectado a la necesidad de pertenencia — son los que generan comportamientos casi automáticos en sus usuarios.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Por Qué el 95% de las Apps Fracasan en la Primera Semana</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Según datos de Adjust y AppsFlyer, entre el 65% y el 80% de los usuarios de apps las abandonan después del primer día. Para el día 30, más del 95% han desaparecido. Este no es un problema de marketing — es un problema de diseño de experiencia.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La mayoría de los equipos de producto diseñan para la <em className="italic text-foreground">primera visita</em>, no para la <em className="italic text-foreground">décima</em>. El onboarding se optimiza, los primeros pantallazos son pulidos, pero nadie ha pensado en por qué alguien volvería mañana. La psicología nos dice que los humanos somos criaturas del contexto: necesitamos anchors cognitivos — razones para volver — y momentos de inversión que hagan que dejar el producto sea costoso.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cuáles Son las 3 Variables que Predicen la Retención?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Después de analizar docenas de productos digitales, hemos identificado tres variables que correlacionan fuertemente con la retención a 30 días:
        </p>
        <ol className="list-decimal pl-6 space-y-4 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Tiempo hasta el primer valor (Time to Value):</strong> ¿Cuánto tarda el usuario en experimentar el beneficio core? Si supera los 3 minutos, la retención cae dramáticamente.</li>
          <li><strong className="font-semibold text-foreground">Recompensas variables:</strong> La imprevisibilidad de las recompensas activa el sistema dopaminérgico. TikTok, Tinder y las redes sociales explotan este principio magistralmente.</li>
          <li><strong className="font-semibold text-foreground">Costo de cambio percibido:</strong> ¿Cuánto perdería el usuario si deja el producto? Calendarios llenos, playlists curadas, historiales de compra — toda esta inversión crea fricción psicológica al salir.</li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cómo Diseñar para la Habituación y No Solo para la Conversión?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El error más común en product design es optimizar métricas de conversión (sign-ups, downloads, purchases) sin pensar en habituación. Un producto puede tener tasas de conversión extraordinarias y aun así fracasar si el comportamiento no se repite.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En MediaLab, cuando hacemos discovery con un cliente nuevo, siempre preguntamos: <em className="italic text-foreground overflow-wrap-normal bg-secondary/30 px-2 py-0.5 rounded">"¿Por qué alguien usaría tu producto mañana, sin que tú se lo pidas?"</em> Si no hay una respuesta clara, el diseño de habituación se convierte en la prioridad absoluta antes de cualquier pixel o línea de código.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Por Qué el Diseño Conductual Es una Ventaja Competitiva?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La adopción no es accidental — es diseñada. Los productos que lideran sus categorías no lo hacen solo por ser los más funcionales, sino por ser los más inteligentes en cómo entienden y aprovechan la psicología humana. Esto no es manipulación — es empatía aplicada al diseño de sistemas.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Si tu producto está luchando con retención, el problema rara vez está en las funcionalidades. Está en cómo conectas emocionalmente con el usuario, en qué disparadores activas, y en cuánta inversión logras que hagan en el sistema. Esas son preguntas de diseño conductual, y son las que determinan si tu producto se convierte en hábito o en otra app olvidada.
        </p>
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu producto tiene problemas de retención?"
          headlineEn="Is your product struggling with retention?"
          subEs="Conversemos. Hacemos un diagnóstico de comportamiento de usuarios en 48 horas."
          subEn="Let's talk. We deliver a user behavior diagnostic in 48 hours."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Aprende psicología del consumidor aplicada a UX"
          headlineEn="Learn consumer psychology applied to UX"
          subEs="Nuestro curso AI User Experience Architect incluye diseño conductual y psicología de la adopción."
          subEn="Our AI User Experience Architect course includes behavioral design and adoption psychology."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="psicologia-adopcion" slugs={["adn-del-significado", "arquitectura-percepcion", "influencia-sin-erosion"]} />
      </div>
    </main>
  )
}
