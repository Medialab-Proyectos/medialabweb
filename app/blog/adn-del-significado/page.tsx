import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios",
  description:
    "La motivación inicia la acción, pero el significado sostiene el hábito. Descubre cómo el diseño con propósito crea productos digitales que los usuarios aman.",
  alternates: { canonical: "/blog/adn-del-significado" },
  openGraph: {
    title: "El ADN del Significado — MediaLab Ingeniería",
    description:
      "La motivación inicia la acción, pero el significado sostiene el hábito. Diseño noético para productos que trascienden.",
    type: "article",
    url: "/blog/adn-del-significado",
    publishedTime: "2026-05-05T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-zero-ui-significado.png", width: 1200, height: 630, alt: "El ADN del Significado" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "El ADN del Significado",
    description: "Diseño noético: 4 patrones para productos que retienen por propósito.",
    images: ["/images/blog-zero-ui-significado.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios",
  description:
    "La motivación inicia la acción, pero el significado sostiene el hábito. 4 patrones de diseño noético para productos que trascienden.",
  image: ["https://medialab.design/images/blog-zero-ui-significado.png"],
  datePublished: "2026-05-05T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/adn-del-significado" },
  inLanguage: "es",
  articleSection: "Producto",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "El ADN del Significado", item: "https://medialab.design/blog/adn-del-significado" },
  ],
}

export default function BlogAdnSignificadoPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" alt="Equipo colaborando en el propósito y significado de un producto digital" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#2AABB3" }}>
              Producto
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios
          </h1>
          <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
            <span className="flex items-center gap-1"><Calendar size={13} /> Mayo 2026</span>
            <span className="flex items-center gap-1"><Clock size={13} /> 7 min de lectura</span>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link href="/#blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Volver al blog
        </Link>
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          ¿Por qué ciertos productos digitales se convierten en parte de la identidad del usuario mientras que otros,
          técnicamente superiores, caen en el olvido? La respuesta no está en las funcionalidades — está en el <em className="italic text-foreground">significado</em>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">La Noética: La Ciencia del Significado en el Diseño</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La noética es la rama de la filosofía que estudia el pensamiento y el conocimiento intuitivo que trasciende los sentidos tradicionales.
          Aplicada al diseño de experiencia, nos revela algo profundo: <strong className="font-semibold text-foreground">las personas no regresan a productos que solo ejecutan tareas; regresan a aquellos que refuerzan quiénes son o quiénes quieren ser</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Considere Nike Run Club. Los usuarios no vuelven por los botones o la interfaz — vuelven porque la plataforma refuerza su identidad de atleta.
          Duolingo no retiene usuarios por sus rayas de actividad, sino porque el usuario se ve a sí mismo como &ldquo;alguien que está aprendiendo un idioma&rdquo;.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan)" }}>
          &ldquo;El diseño consciente no se pregunta: '¿Qué puede hacer el usuario aquí?'. Pregunta: '¿Qué versión de sí mismo está construyendo el usuario al hacerlo?'&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">4 Patrones de Diseño Noético</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Para que el propósito sea operativo en tu producto B2B o B2C, debe traducirse en patrones claros:
        </p>
        <ol className="list-decimal pl-6 space-y-5 text-lg text-muted-foreground mb-8">
          <li>
            <strong className="font-semibold text-foreground">Identidad Activa — El fin del usuario genérico.</strong> El sistema debe actuar como un espejo que refuerce la autoimagen del usuario. En lugar de etiquetas impersonales, emplea roles como &ldquo;Mentor&rdquo;, &ldquo;Constructor&rdquo; o &ldquo;Líder&rdquo;. Al posicionar al sujeto en un estado activo, la identidad sostiene el uso incluso cuando la motivación flaquea.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Progreso con Sentido — Más allá de los números fríos.</strong> Un sistema consciente no dice &ldquo;has completado 10 lecciones&rdquo;, sino: &ldquo;Estás construyendo la base de tu conocimiento en X&rdquo;. El progreso debe vincularse a objetivos personales e hitos narrativos.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Narrativa Coherente — El producto como relato.</strong> El diseño noético crea continuidad temporal: inicio, desarrollo y cierre claros en cada flujo. El sistema posee &ldquo;memoria&rdquo; para recordar hitos pasados y contextualizar el futuro.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Propósito Explícito — La justificación del &ldquo;para qué&rdquo;.</strong> Justificar las recomendaciones basándose en los valores del usuario reduce la fricción interna. Conectar tareas pequeñas con objetivos mayores.
          </li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Motivación vs. Significado: La Diferencia Crítica</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          <strong className="font-semibold text-foreground">La motivación inicia la acción, pero el significado sostiene el hábito.</strong> Sin la capa noética, el riesgo es generar engagement efímero sin lealtad real. Es la diferencia entre una red social que devora el tiempo mediante refuerzos variables y una plataforma que facilita el crecimiento intelectual.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Hoy, la IA permite que el sentido sea dinámico: traduce métricas frías en impacto personal y adapta la narrativa según el momento vital del usuario. Pero si la IA no comprende el propósito profundo del usuario, solo optimizará su comportamiento superficial, no su experiencia vital.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Conclusión: Diseñar Identidad, Propósito y Narrativa</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La noética explica por qué algunos productos permanecen y otros mueren. El significado sostiene lo que la motivación no puede. Tu producto debe diseñar identidad, propósito y narrativa — y la IA permite personalizar el sentido, no solo la acción.
        </p>
        <p className="text-sm text-muted-foreground/60 mt-8 italic">
          — Por MediaLab Ingeniería.
        </p>
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-border p-8 flex flex-col md:flex-row items-center gap-6 bg-card">
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl text-foreground mb-2">¿Tu producto genera significado o solo engagement?</h3>
            <p className="text-sm text-muted-foreground">Descubre cómo implementar diseño noético en tu producto B2B o B2C. Hablemos.</p>
          </div>
          <Link href="/#contact"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(90deg, #2AABB3, #1d8a91)" }}>
            Agendar llamada →
          </Link>
        </div>
      </div>
    </main>
  )
}
