import type { Metadata } from "next"
import Image from "next/image"
import {
  BlogChromeBackLink,
  BlogChromeMeta,
  BlogChromeEnNotice,
  BlogChromeCTA,
} from "@/components/blog/blog-chrome"

export const metadata: Metadata = {
  title: "Diseñando para la Confianza: UX y Comportamiento Financiero",
  description:
    "Los principios de diseño UX que hacen que las personas se sientan seguras tomando decisiones financieras digitalmente. Estrategias para fintech y banca.",
  alternates: {
    canonical: "/blog/ux-fintech",
    languages: {
      es: "/blog/ux-fintech",
      en: "/en/blog/ux-fintech",
      "x-default": "/blog/ux-fintech",
    },
  },
  openGraph: {
    type: "article",
    url: "/blog/ux-fintech",
    publishedTime: "2026-03-15T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-fintech.jpg", width: 1200, height: 630, alt: "UX en Fintech" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/blog-fintech.jpg"] },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "UX en Fintech: Diseñar para la Confianza",
  description: "Estrategias UX para productos fintech que construyen confianza desde el primer contacto.",
  image: ["https://medialab.design/images/blog-fintech.jpg"],
  datePublished: "2026-03-15T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/ux-fintech" },
  inLanguage: "es",
  articleSection: "Fintech",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "UX en Fintech", item: "https://medialab.design/blog/ux-fintech" },
  ],
}

export default function BlogUXFintechPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-fintech.jpg" alt="UX en Fintech" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 w-fit" style={{ background: "#E8751A" }}>
            Diseño Conductual
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Diseñando para la Confianza: UX y Comportamiento Financiero
          </h1>
          <BlogChromeMeta dateEs="Ene 2025" dateEn="Jan 2025" readMin={6} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
        <BlogChromeEnNotice />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Los principios de diseño que hacen que las personas se sientan seguras tomando decisiones financieras digitalmente.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El Dinero y el Miedo: Una Relación Inevitable</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Las decisiones financieras activan el sistema límbico de manera mucho más intensa que otras decisiones digitales. Transferir dinero, invertir ahorros o solicitar un crédito son acciones cargadas de ansiedad — incluso para personas con altos niveles de educación financiera. El diseño fintech que ignora esta realidad psicológica está construido sobre arena.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Según un estudio de Nielsen Norman Group, los usuarios de aplicaciones financieras tienen 3 veces más probabilidades de abandonar una tarea a mitad de camino que los usuarios de apps de entretenimiento. La razón principal: la sensación de riesgo irreversible. A diferencia de elegir una película equivocada, una transferencia mal hecha no se puede deshacer fácilmente.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Los 5 Pilares del Diseño de Confianza Financiera</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">Después de diseñar docenas de productos fintech, hemos identificado cinco principios que construyen confianza genuina:</p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Transparencia Total, No Solo Legal</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Mostrar los costos y condiciones de forma clara no es solo una obligación legal — es una ventaja competitiva. Los usuarios que entienden exactamente qué van a pagar y por qué tienen tasas de conversión 40% más altas que aquellos expuestos a información ambigua o enterrada en letra pequeña.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. Confirmación y Reversibilidad Percibida</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Los pasos de confirmación no son fricción — son seguridad. Un botón de "Confirmar transferencia" con un resumen claro de lo que está a punto de pasar reduce el abandono en transacciones de alto valor. La percepción de reversibilidad (aunque no siempre sea técnicamente posible) también reduce la ansiedad de acción.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Señales Visuales de Seguridad</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Los locks, los certificados SSL visibles, los indicadores de encriptación — no son solo marketing. Son señales cognitivas que activan la confianza en el sistema límbico antes de que el usuario haya procesado conscientemente si el sistema es seguro o no.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Lenguaje Humano, No Financiero</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          "Débito en cuenta corriente" vs "Descuento de tu cuenta principal". El primer mensaje es financieramente correcto pero cognitivamente cargado. El segundo es más accesible y reduce la ansiedad asociada al término "débito". En fintech, el lenguaje es diseño.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. Progreso Visible en Operaciones Largas</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El mayor generador de ansiedad en una app financiera es la espera sin feedback. Una animación de "procesando..." que dura más de 3 segundos sin indicar progreso puede disparar comportamientos de cancelación incluso cuando la operación está funcionando perfectamente.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Caso Práctico: Rediseñando el Flujo de Primera Transferencia</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En un proyecto reciente con un cliente de pagos digitales, identificamos que el 45% del abandono ocurría en el paso de confirmación de la primera transferencia. El análisis reveló que los usuarios no entendían exactamente qué iba a pasar con su dinero ni cuándo llegaría.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La solución fue simple: agregamos un timeline visual que mostraba exactamente el recorrido del dinero (de dónde sale, cuándo se procesa, cuándo llega), personalizamos el mensaje con el nombre del destinatario, y añadimos un estado de "confirmado" visible por 10 segundos después de la operación. El abandono en ese paso cayó al 12%.
        </p>
      </article>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <BlogChromeCTA
          headlineEs="¿Estás construyendo un producto financiero?"
          headlineEn="Building a financial product?"
          subEs="Nuestro equipo tiene experiencia comprobada en UX para fintech. Conversemos."
          subEn="Our team has proven UX experience in fintech. Let's talk."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
      </div>
    </main>
  )
}
