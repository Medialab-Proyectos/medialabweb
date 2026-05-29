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
  title: "El Trono de la Decisión: IA, Autonomía Humana y el Futuro del Diseño Ético",
  description:
    "En la era de los agentes de IA, el mayor riesgo no es la privacidad — es la infantilización del usuario. Descubre el Agentic Experience Design (AXD).",
  alternates: {
    canonical: "/blog/trono-de-la-decision",
    languages: {
      es: "/blog/trono-de-la-decision",
      en: "/en/blog/trono-de-la-decision",
      "x-default": "/blog/trono-de-la-decision",
    },
  },
  openGraph: {
    title: "El Trono de la Decisión",
    description: "La ética del diseño en la era de la IA.",
    type: "article",
    url: "/blog/trono-de-la-decision",
    publishedTime: "2026-05-08T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-zero-ui-decision.png", width: 1200, height: 630, alt: "El Trono de la Decisión" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Trono de la Decisión",
    description: "IA, autonomía y diseño ético.",
    images: ["/images/blog-zero-ui-decision.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "El Trono de la Decisión: IA, Autonomía Humana y Diseño Ético",
  description:
    "En la era de los agentes de IA, el mayor riesgo no es la privacidad — es la infantilización del usuario.",
  image: ["https://medialab.design/images/blog-zero-ui-decision.png"],
  datePublished: "2026-05-08T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/trono-de-la-decision" },
  inLanguage: "es",
  articleSection: "IA y Ética",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "El Trono de la Decisión", item: "https://medialab.design/blog/trono-de-la-decision" },
  ],
}

export default function BlogTronoDecisionPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-zero-ui-decision.png" alt="IA, autonomía humana y diseño ético" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "var(--magenta, #E8751A)" }}>
              IA y Ética
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            El Trono de la Decisión: IA, Autonomía Humana y el Futuro del Diseño Ético
          </h1>
          <BlogChromeMeta dateEs="Mayo 2026" dateEn="May 2026" readMin={9} />
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
          Estamos en el epicentro de la era del <strong className="font-semibold text-foreground">Agentic Experience Design (AXD)</strong> — un paradigma donde
          la IA deja de ser reactiva para convertirse en un agente proactivo que actúa en nombre del usuario.
          La mayor preocupación ética no es la privacidad: es la <em className="italic text-foreground">integridad de la voluntad humana</em>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Qué Es la Infantilización del Usuario y Por Qué Es un Riesgo?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Si la tecnología comienza a decidirlo todo por nosotros — desde qué noticias consumir hasta cómo gestionar nuestras finanzas — corremos el riesgo de perder nuestra <strong className="font-semibold text-foreground">agencia</strong>: esa capacidad única de los seres humanos para actuar con intención y propósito.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El AXD promete una experiencia sin fricciones, un mundo donde las tareas comunes son reemplazadas por interacciones fluidas con los datos. Pero esta comodidad tiene un precio oculto si no se diseña con una conciencia ética rigurosa.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--orange, #E8751A)" }}>
          &ldquo;Un sistema bien diseñado no decide por ti. Te ayuda a decidir mejor.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cuál Es el Dilema Ético del UX con IA?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Existe una verdad incómoda: muchos de los productos digitales más exitosos han alcanzado su estatus precisamente porque han logrado <strong className="font-semibold text-foreground">erosionar la autonomía del usuario</strong>. Durante años, el diseño persuasivo fue celebrado: menos fricción, decisiones más rápidas, tasas de conversión más altas.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Sin embargo, este enfoque esconde una tensión profunda: cuando un sistema decide &ldquo;demasiado bien&rdquo;, el ser humano deja de decidir. El CXD surge como un acto de rebelión ética frente a esta tendencia.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cómo Aplicar el Estoicismo al Diseño Digital?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El estoicismo nos enseña una lección fundamental para la era digital: debemos distinguir claramente entre lo que está bajo nuestro control y lo que no. En el diseño de productos, esto se traduce en un imperativo técnico:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Crear sistemas que fortalezcan el control interno del usuario</strong> en lugar de generar dependencia debilitante</li>
          <li><strong className="font-semibold text-foreground">Rechazar los dark patterns</strong> — esos trucos de diseño desde suscripciones imposibles de cancelar hasta notificaciones que disparan impulsos adictivos</li>
          <li><strong className="font-semibold text-foreground">Mejorar la capacidad de decisión del ser humano</strong>, no anularla</li>
          <li>Preguntarse: <em className="italic">&ldquo;¿Qué tipo de relación de control estamos construyendo entre el humano y la máquina?&rdquo;</em></li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cómo Diseñar IA que Sea Guardiana y No Dictadora?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En el marco del diseño consciente, la IA deja de ser un motor de engagement para convertirse en un <strong className="font-semibold text-foreground">mediador ético</strong> entre la intención y la acción. Una IA ética:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>Detecta señales de fatiga o saturación emocional</li>
          <li>Ajusta el ritmo y tono de la interfaz según la claridad mental del usuario</li>
          <li>Ofrece opciones reales, no la ilusión de opciones</li>
          <li>Sugiere pausas antes de decisiones impulsivas</li>
        </ul>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cómo Pasar de la Persuasión a la Conciencia en el Diseño?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El futuro del diseño digital no está en quién logra más clics, sino en quién construye sistemas que fortalezcan la agencia humana. En un mundo donde la IA puede simularnos, el verdadero diferencial será quién entienda mejor al ser humano que la tecnología está afectando.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu IA fortalece o debilita a tus usuarios?"
          headlineEn="Is your AI empowering or weakening your users?"
          subEs="Te ayudamos a diseñar sistemas de IA éticos que generen confianza y lealtad genuina."
          subEn="We help you design ethical AI systems that build genuine trust and loyalty."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Formamos arquitectos de experiencias con IA"
          headlineEn="We train AI experience architects"
          subEs="Ética, diseño conductual e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Ethics, behavioral design, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="trono-de-la-decision" slugs={["influencia-sin-erosion", "discovery-ia", "arquitectura-percepcion"]} />
      </div>
    </main>
  )
}
