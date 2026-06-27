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
  title: { absolute: "La Arquitectura de la Percepción | MediaLab" },
  description:
    "Los usuarios no abandonan productos por falta de lógica sino por fricciones emocionales invisibles. Descubre el Diseño de Experiencia Consciente (CXD) de MediaLab.",
  alternates: {
    canonical: "/blog/arquitectura-percepcion",
    languages: {
      es: "/blog/arquitectura-percepcion",
      "x-default": "/blog/arquitectura-percepcion",
    },
  },
  openGraph: {
    title: "La Arquitectura de la Percepción",
    description:
      "Los usuarios transitan estados emocionales, no flujos lógicos. Aprende a diseñar desde la percepción consciente.",
    type: "article",
    url: "/blog/arquitectura-percepcion",
    publishedTime: "2026-05-01T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    tags: ["UX", "Diseño Consciente", "Percepción", "CXD"],
    images: [
      { url: "/images/blog-zero-ui-percepcion.png", width: 1200, height: 630, alt: "Arquitectura de la percepción" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Arquitectura de la Percepción",
    description: "4 estados críticos para diseñar experiencias conscientes.",
    images: ["/images/blog-zero-ui-percepcion.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "La Arquitectura de la Percepción: Por Qué Tus Usuarios No Navegan Flujos, Sino Estados Emocionales",
  description:
    "Los usuarios no abandonan productos por falta de lógica sino por fricciones emocionales invisibles. Descubre el Diseño de Experiencia Consciente (CXD).",
  image: ["https://medialab.design/images/blog-zero-ui-percepcion.png"],
  datePublished: "2026-05-01T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: {
    "@type": "Person",
    name: "Christian Benavides",
    url: "https://www.zeroui.me/",
  },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://medialab.design/blog/arquitectura-percepcion",
  },
  inLanguage: "es",
  keywords: "UX, percepción, CXD, diseño consciente, estados emocionales, Zero UI",
  articleSection: "Diseño UX",
  wordCount: 1800,
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Arquitectura de la Percepción",
      item: "https://medialab.design/blog/arquitectura-percepcion",
    },
  ],
}

export default function BlogArquitecturaPercepcionPage() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-arquitectura-percepcion.jpg" alt="Equipo de diseño UX analizando estados emocionales del usuario" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#E8751A" }}>
              Diseño UX
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            La Arquitectura de la Percepción: Por Qué Tus Usuarios No Navegan Flujos, Sino Estados Emocionales
          </h1>
          <BlogChromeMeta dateEs="Mayo 2026" dateEn="May 2026" readMin={8} />
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
          Hay productos digitales que son perfectos… al menos en el papel. Sus flujos son claros, sus interfaces impecables.
          Y aun así, algo falla. Es una <em className="italic text-foreground">fricción invisible</em>. Cuando esto ocurre, el problema no está en el código ni en la estética — es un fallo en la arquitectura de la percepción.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cuál Es el Malentendido Central del UX Moderno?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Durante décadas, la industria del diseño digital se ha cimentado sobre una ecuación errónea: <strong className="font-semibold text-foreground">Clic + Pantalla + Acción = Experiencia</strong>. Esta visión atómica ignora una verdad fundamental: una interacción es solo un evento aislado, mientras que la experiencia es un <em className="italic text-foreground">estado de conciencia sostenido</em>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El error más costoso de la tecnología contemporánea ha sido diseñar para un usuario ideal — una abstracción racional que opera en un vacío — en lugar del usuario real, cuya navegación está condicionada por su entorno, sus emociones y sus capacidades cognitivas momentáneas.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--magenta)" }}>
          &ldquo;Las personas no navegan a través de flujos lógicos; navegan a través de estados emocionales. El usuario no habita botones ni wireframes; habita sensaciones de claridad, duda, control, ansiedad o seguridad.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cuáles Son los 4 Estados Críticos de la Percepción?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El Diseño de Experiencia Consciente (CXD) establece que para que un diseño sea verdaderamente consciente, debe responder con precisión a cuatro estados críticos:
        </p>
        <ol className="list-decimal pl-6 space-y-4 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Estado de Orientación:</strong> El usuario necesita sentir: &ldquo;Sé exactamente dónde estoy y entiendo qué sucederá a continuación.&rdquo; Se logra con indicadores de progreso contextuales y microcopy que elimine cualquier ambigüedad.</li>
          <li><strong className="font-semibold text-foreground">Gestión de la Carga Cognitiva:</strong> El usuario percibe: &ldquo;La información me abruma y me impide decidir.&rdquo; La solución es el revelado progresivo — fragmentar procesos complejos en micro-etapas.</li>
          <li><strong className="font-semibold text-foreground">Control del Tiempo Subjetivo:</strong> &ldquo;Esta espera parece interminable.&rdquo; La implementación de Skeleton Screens mantiene al usuario enfocado en el progreso, no en la espera.</li>
          <li><strong className="font-semibold text-foreground">Seguridad y Confianza:</strong> &ldquo;Confío plenamente en que el sistema no cometerá errores con mi información.&rdquo; Requiere transparencia total, especialmente en sistemas impulsados por IA.</li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Por Qué la Lógica Produce Experiencias Incorrectas?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Un caso paradigmático: McDonald&apos;s implementó un sistema de pedidos por voz con IA para sus drive-thru. El sistema, diseñado para optimizar la eficiencia, fracasó estrepitosamente al no considerar el contexto real: ruido ambiental, acentos regionales, voces superpuestas. Los pedidos absurdos se volvieron virales.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Técnicamente, el código procesaba datos siguiendo su lógica interna, pero <strong className="font-semibold text-foreground">fenomenológicamente el sistema era ciego</strong> a la confusión del cliente. Un enfoque de diseño consciente habría detectado la degradación en la calidad de la respuesta para ceder el control a un humano antes de que el error escalara.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Cómo Aplicar la Fenomenología al Diseño UX Práctico?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La fenomenología nos ofrece patrones de UX accionables para cualquier producto B2B o B2C:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Mapeo de estados emocionales</strong> en cada touchpoint del journey del usuario</li>
          <li><strong className="font-semibold text-foreground">Diseño adaptativo al contexto</strong> — no solo responsivo en tamaño, sino en estado mental</li>
          <li><strong className="font-semibold text-foreground">Reducción de carga cognitiva progresiva</strong> basada en señales de fatiga del usuario</li>
          <li><strong className="font-semibold text-foreground">Transparencia radical</strong> en sistemas de IA para generar confianza genuina</li>
        </ul>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Por Qué Diseñar para la Conciencia y No para el Clic?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La pregunta fundamental del CXD no es <em className="italic">&ldquo;¿qué debe hacer el usuario?&rdquo;</em>, sino <em className="italic text-foreground">&ldquo;¿desde qué estado mental está intentando hacerlo?&rdquo;</em>. Cuando diseñamos desde la percepción consciente, no solo creamos productos más usables — creamos experiencias que respetan la humanidad de quien las usa.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Quieres diseñar desde la percepción consciente?"
          headlineEn="Want to design from conscious perception?"
          subEs="Descubre cómo aplicamos el CXD en productos B2B y B2C reales. Agenda una llamada gratuita."
          subEn="Discover how we apply CXD in real B2B and B2C products. Book a free call."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Aprende a diseñar experiencias con IA"
          headlineEn="Learn to design experiences with AI"
          subEs="Nuestro curso AI User Experience Architect te enseña a aplicar psicología del consumidor e IA en productos reales."
          subEn="Our AI User Experience Architect course teaches you to apply consumer psychology and AI to real products."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="arquitectura-percepcion" slugs={["adn-del-significado", "psicologia-adopcion", "influencia-sin-erosion"]} />
      </div>
    </main>
  )
}
