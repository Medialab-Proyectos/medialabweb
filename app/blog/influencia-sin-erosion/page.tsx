import type { Metadata } from "next"
import Image from "next/image"
import {
  BlogChromeBackLink,
  BlogChromeMeta,
  BlogChromeEnNotice,
  BlogChromeAuthorLine,
  BlogChromeCTA,
} from "@/components/blog/blog-chrome"
import { BlogRelatedArticles } from "@/components/blog/blog-related"

export const metadata: Metadata = {
  title: { absolute: "Influencia sin Erosión | MediaLab" },
  description:
    "El comportamiento sostenido no nace de la presión. Nace de una conciencia respetada. Descubre las 4 capas de la acción y el caso del botón de $300 millones.",
  alternates: {
    canonical: "/blog/influencia-sin-erosion",
    languages: {
      es: "/blog/influencia-sin-erosion",
      "x-default": "/blog/influencia-sin-erosion",
    },
  },
  openGraph: {
    title: "Influencia sin Erosión",
    description: "5 patrones para influir sin erosionar.",
    type: "article",
    url: "/blog/influencia-sin-erosion",
    publishedTime: "2026-05-10T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-zero-ui-influencia.png", width: 1200, height: 630, alt: "Influencia sin Erosión" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Influencia sin Erosión",
    description: "Diseño conductual sostenible sin manipular.",
    images: ["/images/blog-zero-ui-influencia.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Influencia sin Erosión: Diseño de Comportamiento Sostenible sin Manipular",
  description: "Las 4 capas de la acción y el caso del botón de $300 millones.",
  image: ["https://medialab.design/images/blog-zero-ui-influencia.png"],
  datePublished: "2026-05-10T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/influencia-sin-erosion" },
  inLanguage: "es",
  articleSection: "Diseño Conductual",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "Influencia sin Erosión", item: "https://medialab.design/blog/influencia-sin-erosion" },
  ],
}

export default function BlogInfluenciaSinErosionPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-influencia-sin-erosion.jpg" alt="Investigadora UX en sesión de usabilidad con usuario" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#2AABB3" }}>
              Diseño Conductual
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Influencia sin Erosión: Cómo Diseñar Comportamiento Sostenible sin Manipular al Usuario
          </h1>
          <BlogChromeMeta dateEs="Mayo 2026" dateEn="May 2026" readMin={10} />
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
          El diseño del comportamiento nació de una intención legítima: ayudar a las personas a realizar aquello que ya desean hacer, pero que no logran sostener. Los modelos pioneros resolvieron la <em className="italic text-foreground">activación</em>. Pero dejaron una pregunta vital: <strong className="font-semibold text-foreground">¿Qué ocurre después?</strong>
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cuál Es el Límite Invisible del Behavioral Design Clásico?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La mayoría de los patrones conductuales contemporáneos se enfocan obsesivamente en los disparadores, la gratificación inmediata y la eliminación total de la fricción. Son herramientas diseñadas para el asalto al corto plazo, pero fallan estrepitosamente cuando intentan construir bienestar, autonomía o confianza duradera.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El error de fondo: <strong className="font-semibold text-foreground">asumir que si optimizamos la acción externa, el resultado humano interno llegará por añadidura</strong>. El CXD invierte esta lógica: si diseñamos la conciencia desde la cual ocurre la acción, el comportamiento se regula de forma orgánica.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;En el diseño consciente, el comportamiento no se fuerza; el comportamiento emerge.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cuáles Son las 4 Capas de la Acción del Usuario?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En el ecosistema del diseño consciente, el comportamiento no es un evento aislado, sino el resultado de cuatro capas previas en perfecta armonía. Si una falla, el comportamiento se degrada sin importar cuán potente sea el disparador tecnológico:
        </p>
        <ol className="list-decimal pl-6 space-y-5 text-lg text-muted-foreground mb-8">
          <li>
            <strong className="font-semibold text-foreground">Estado Fenomenológico:</strong> ¿Cómo se <em className="italic">siente</em> usar el sistema en este instante? No una métrica de satisfacción, sino la cualidad de la experiencia subjetiva. ¿El sistema expande la presencia del usuario o la fragmenta?
          </li>
          <li>
            <strong className="font-semibold text-foreground">Sentido Noético:</strong> ¿Qué representa para mí esta acción? ¿Tiene un lugar con sentido en la narrativa de mi vida? Sin un norte noético, la interacción se convierte en consumo vacío de dopamina.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Autonomía Ética:</strong> ¿Cuánto control real tiene el individuo sobre lo que ocurre? Un sistema que respeta la autonomía no manipula la arquitectura de la decisión — la ilumina.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Contexto Adaptativo:</strong> La capacidad del sistema para responder al estado real del usuario: fatiga, duda o necesidad de claridad.
          </li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cuáles Son los 5 Patrones de Diseño Conductual Consciente?</h2>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--orange, #E8751A)" }}>1. Activación Contextual</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En lugar de empujar al usuario o notificar por reglas fijas, el diseño consciente activa la interfaz según su estado emocional y cognitivo. CTAs que aparecen solo ante señales de claridad. Recomendaciones que se retrasan ante saturación. Resultado: menos rechazo reactivo, acción más voluntaria.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--cyan, #2AABB3)" }}>2. Micro-compromiso Consciente</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El patrón clásico empuja agresivamente al siguiente nivel. El diseño consciente valida la intención a cada paso: opciones reales para pausar, recordatorios de que ciertos pasos no son obligatorios. Resultado: compromisos más duraderos, menos abandono por estrés.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--magenta, #E8751A)" }}>3. Refuerzo Interpretativo</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En lugar del vacío &ldquo;¡Lo lograste!&rdquo;, el refuerzo consciente explica el impacto real. El sistema muestra cómo esa acción reduce un problema específico o acerca al usuario a sus valores a largo plazo.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--orange, #E8751A)" }}>4. Fricción Consciente</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La fricción no siempre es el enemigo. Se elimina la fricción innecesaria pero se introduce <strong className="font-semibold text-foreground">fricción reflexiva</strong> donde importa: confirmaciones antes de acciones irreversibles, pausas antes de decisiones impulsivas.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--cyan, #2AABB3)" }}>5. Salida Digna</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El usuario debe poder salir del flujo sin sentir que ha fallado. &ldquo;Tu progreso queda guardado&rdquo; y &ldquo;está bien no continuar ahora&rdquo; construyen confianza inquebrantable, asegurando retorno basado en lealtad, no en culpa.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Qué Enseña el Caso del Botón de $300 Millones?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Un gran sitio de e-commerce cambió el botón &ldquo;Registrarse&rdquo; por &ldquo;Continuar&rdquo;, permitiendo el pago como invitado. Este pequeño ajuste en la autonomía del usuario <strong className="font-semibold text-foreground">aumentó las ventas en $300 millones de dólares anuales</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El CXD lleva esta idea más allá. Imagine un sistema que, ante una compra impulsiva tarde en la noche, introduce una pausa: &ldquo;¿Estás seguro? Has estado navegando mucho tiempo.&rdquo; Aunque parece ir contra el interés comercial, esta práctica construye lealtad profunda y aumenta el valor de vida del cliente a largo plazo.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cómo Pasar de Motor de Engagement a Cuidadora del Contexto?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El comportamiento sostenido no nace de la presión. Nace de una conciencia que se siente respetada. En esta nueva era, la IA deja de ser una herramienta para maximizar clics y se convierte en un mediador ético entre la intención y la acción del usuario.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Quieres influir sin erosionar a tus usuarios?"
          headlineEn="Want to influence without eroding your users?"
          subEs="Implementamos diseño conductual consciente en plataformas B2B y apps B2C. Hablemos de tu producto."
          subEn="We implement conscious behavioral design in B2B platforms and B2C apps. Let's talk about your product."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogChromeCTA
          headlineEs="Ve cómo aplicamos diseño conductual en producción"
          headlineEn="See how we apply behavioral design in production"
          subEs="Casos reales de productos digitales que mejoraron retención y conversión con nuestro enfoque."
          subEn="Real cases of digital products that improved retention and conversion with our approach."
          ctaEs="Ver portafolio"
          ctaEn="View portfolio"
          href="/portafolio"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogRelatedArticles currentSlug="influencia-sin-erosion" slugs={["trono-de-la-decision", "adn-del-significado", "arquitectura-percepcion"]} />
      </div>
    </main>
  )
}
