import type { Metadata } from "next"
import Image from "next/image"
import {
  BlogChromeBackLink,
  BlogChromeMeta,
  BlogChromeAuthorLine,
  BlogChromeCTA,
} from "@/components/blog/blog-chrome"
import { BlogRelatedArticles } from "@/components/blog/blog-related"

export const metadata: Metadata = {
  title: { absolute: "Ya No Aprendemos a Trabajar: Aprendemos a Dirigir Inteligencias | MediaLab" },
  description:
    "El fin del prompt engineering. Cómo una decisión en las universidades, una declaración de Anthropic y el movimiento Zero UI señalan el mismo futuro: dejar de ejecutar tareas para dirigir agentes de IA.",
  keywords: [
    "fin de los prompts",
    "prompt engineering",
    "agentes de IA",
    "loops de IA",
    "Zero UI",
    "futuro del trabajo",
    "orquestación de IA",
    "pensamiento sistémico",
    "Boris Cherny",
    "Anthropic",
  ],
  alternates: {
    canonical: "/blog/dirigir-inteligencias",
    languages: {
      es: "/blog/dirigir-inteligencias",
      en: "/en/blog/dirigir-inteligencias",
      "x-default": "/blog/dirigir-inteligencias",
    },
  },
  openGraph: {
    title: "Ya No Aprendemos a Trabajar. Aprendemos a Dirigir Inteligencias",
    description:
      "El fin de los prompts. La próxima ventaja competitiva no será preguntar mejor, sino construir sistemas que piensen, aprendan y actúen contigo.",
    type: "article",
    url: "/blog/dirigir-inteligencias",
    publishedTime: "2026-06-18T08:00:00-05:00",
    modifiedTime: "2026-06-18T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-dirigir-inteligencias-og-v2.png", width: 1200, height: 630, alt: "El fin de los prompts: dirigir inteligencias" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ya No Aprendemos a Trabajar. Aprendemos a Dirigir Inteligencias",
    description: "El fin de los prompts y el nacimiento de la orquestación de IA.",
    images: ["/images/blog-dirigir-inteligencias-og-v2.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Ya No Estamos Aprendiendo a Trabajar. Estamos Aprendiendo a Dirigir Inteligencias",
  alternativeHeadline: "El fin de los prompts: del ejecutar tareas al dirigir agentes de IA",
  description:
    "Cómo una decisión en las universidades, una declaración de Anthropic y el movimiento Zero UI señalan el mismo futuro: dejar de ejecutar trabajo intelectual para orquestar sistemas que lo hagan.",
  image: ["https://medialab.design/images/blog-dirigir-inteligencias-og-v2.png"],
  datePublished: "2026-06-18T08:00:00-05:00",
  dateModified: "2026-06-18T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/dirigir-inteligencias" },
  inLanguage: "es",
  articleSection: "IA y Futuro del Trabajo",
  keywords:
    "fin de los prompts, prompt engineering, agentes de IA, loops, Zero UI, futuro del trabajo, orquestación, pensamiento sistémico",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "Ya No Aprendemos a Trabajar, Aprendemos a Dirigir Inteligencias", item: "https://medialab.design/blog/dirigir-inteligencias" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Está muriendo el prompt engineering?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El prompt sigue siendo trabajo manual: tú instruyes, la IA responde y el proceso termina. Los sistemas que construyen Anthropic, OpenAI y otros laboratorios ya no funcionan así, sino con agentes y loops que reciben objetivos en lugar de instrucciones. La ejecución se está automatizando; lo que gana valor es el criterio, la dirección y la visión.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es un loop o un agente de IA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un loop es una inteligencia que sigue trabajando cuando tú dejas de hacerlo. No recibe instrucciones, recibe objetivos. En lugar de pedirle 'analiza este sitio web', le das una meta como 'ayúdame a aumentar el tráfico orgánico', y entonces investiga, analiza, compara, propone, corrige, reintenta, aprende y repite mientras tú haces otra cosa.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué tiene que ver Zero UI con los agentes de IA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las interfaces tradicionales —botones, menús, formularios— existen porque el sistema necesita instrucciones humanas constantes. Cuando los sistemas empiezan a entender objetivos en lugar de clics, la interfaz deja de ser el centro de la experiencia. Zero UI plantea que diseñar no es crear interfaces, sino diseñar estados de conciencia: menos fricción y más intención.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál será la habilidad más valiosa de la próxima década?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Probablemente no sea aprender a usar inteligencia artificial, sino aprender a dirigirla: diseñar sistemas capaces de pensar, aprender y actuar contigo, o incluso sin ti. El profesional más productivo del futuro no será quien haga más trabajo, sino quien construya mejores sistemas para que el trabajo ocurra.",
      },
    },
  ],
}

export default function BlogDirigirInteligenciasPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-dirigir-inteligencias-v2.png" alt="El fin de los prompts: aprender a dirigir inteligencias" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#2AABB3" }}>
              IA y Futuro del Trabajo
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Ya No Estamos Aprendiendo a Trabajar. Estamos Aprendiendo a Dirigir Inteligencias
          </h1>
          <BlogChromeMeta dateEs="Junio 2026" dateEn="June 2026" readMin={9} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Cómo una decisión en las universidades, una declaración de Anthropic y el movimiento{" "}
          <strong className="font-semibold text-foreground">Zero UI</strong> podrían estar señalando el mismo futuro.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Hace apenas dos años, Internet estaba obsesionado con una habilidad: <strong className="font-semibold text-foreground">aprender a escribir prompts</strong>. Miles de cursos prometían enseñarte a hablar con ChatGPT. Aparecieron especialistas, certificaciones y nuevos cargos laborales. Parecía lógico: si la inteligencia artificial iba a cambiar el mundo, la ventaja estaría en saber comunicarse con ella.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Decimos que la imprenta cambió el mundo. Pero la imprenta no cambió el mundo. Lo cambió la <em className="italic text-foreground">alfabetización</em>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Decimos que Internet cambió el mundo. Pero Internet no cambió el mundo. Lo cambió el <em className="italic text-foreground">acceso masivo a la información</em>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Con la inteligencia artificial está ocurriendo algo parecido. Creemos que el cambio es ChatGPT. No lo es. El cambio es que, por primera vez en la historia, podemos <strong className="font-semibold text-foreground">delegar trabajo intelectual</strong>. No tareas físicas. No cálculos. No almacenamiento. Trabajo intelectual.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El fin del paradigma del prompt</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Un prompt sigue siendo trabajo manual. Cada vez que escribes <em className="italic">«resume este documento», «analiza este reporte», «crea una estrategia de marketing» o «diseña una interfaz»</em>, sigues siendo operador. La IA responde, el proceso termina y vuelves a comenzar.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Pero los sistemas que están construyendo Anthropic, OpenAI y otros laboratorios ya no funcionan así. Ahora hablamos de <strong className="font-semibold text-foreground">agentes</strong>. Y después de los agentes, hablamos de <strong className="font-semibold text-foreground">loops</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Qué es realmente un loop?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La explicación técnica es aburrida. La explicación humana es más interesante.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#2AABB3" }}>
          &ldquo;Un loop es una inteligencia que sigue trabajando cuando tú dejas de hacerlo.&rdquo;
        </blockquote>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          No recibe instrucciones. Recibe objetivos. No le dices «analiza este sitio web». Le dices <em className="italic text-foreground">«ayúdame a aumentar el tráfico orgánico»</em>. Y entonces investiga, analiza, compara, propone, corrige, vuelve a intentar, aprende y repite. Mientras tú haces otra cosa.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El trabajo está cambiando: de ejecutarlo a orquestarlo</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Quizás la mejor manera de entenderlo sea pensar en cómo ha cambiado el rol de un director de cine. Un director no sostiene la cámara. No controla la iluminación. No edita cada escena. Coordina sistemas, especialistas, talento y decisiones.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El profesional del futuro podría parecerse mucho más a eso:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>Menos ejecución, <strong className="font-semibold text-foreground">más dirección</strong>.</li>
          <li>Menos producción, <strong className="font-semibold text-foreground">más orquestación</strong>.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Por qué Zero UI es mucho más importante de lo que parece</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Aquí aparece una idea que normalmente no entra en la conversación tecnológica. La mayoría de las interfaces fueron diseñadas para que los humanos operaran sistemas: botones, menús, formularios, paneles, configuraciones. Todo eso existe porque el sistema necesita instrucciones humanas constantes.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Pero ¿qué ocurre cuando los sistemas empiezan a entender <strong className="font-semibold text-foreground">objetivos</strong> en lugar de clics? Es aquí donde el concepto de <strong className="font-semibold text-foreground">Zero UI</strong> se vuelve relevante. No porque las interfaces desaparezcan, sino porque dejan de ser el centro de la experiencia.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#2AABB3" }}>
          &ldquo;Diseñar no es crear interfaces. Es diseñar estados de conciencia.&rdquo;
        </blockquote>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La atención humana se está convirtiendo en el recurso más escaso de la economía digital. Cada botón innecesario, cada pantalla redundante y cada configuración compleja es una forma de <strong className="font-semibold text-foreground">deuda cognitiva</strong>. El futuro no consiste en construir más interfaces. Consiste en construir menos fricción y más intención.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">La nueva habilidad que nadie está enseñando</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Las universidades siguen enseñando herramientas. Las empresas siguen contratando herramientas. Los cursos siguen vendiendo herramientas. Pero el mercado está empezando a valorar otra cosa: el <strong className="font-semibold text-foreground">pensamiento sistémico</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Porque cuando tienes diez agentes trabajando para ti, el problema deja de ser técnico y se vuelve estratégico. La pregunta ya no es <em className="italic">«¿cómo hago esto?»</em>. Ahora es <em className="italic text-foreground">«¿qué sistema debería existir para que esto ocurra automáticamente?»</em>.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Lo que Boris Cherny realmente está intentando decir</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Mucha gente interpreta sus declaraciones como «los programadores van a desaparecer». No creo que ese sea el mensaje. De hecho, el propio Cherny ha dicho que los ingenieros siguen siendo más importantes que nunca, aunque su trabajo está cambiando radicalmente.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El mensaje es otro: <strong className="font-semibold text-foreground">la ejecución se está automatizando. El criterio no. La dirección no. La visión no. La responsabilidad no.</strong>
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">La pregunta que definirá la próxima década</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Hace veinte años la ventaja era tener acceso a Internet. Hace diez años era aprender a programar. Hoy parece ser aprender a utilizar inteligencia artificial. Pero quizás esa tampoco sea la respuesta correcta.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Quizás la habilidad más valiosa de la próxima década sea <strong className="font-semibold text-foreground">diseñar sistemas capaces de pensar, aprender y actuar contigo</strong>. O incluso sin ti. Porque el profesional más productivo del futuro no será quien haga más trabajo. Será quien construya mejores sistemas para que el trabajo ocurra.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Y si las decisiones de las universidades, las declaraciones de Boris Cherny y movimientos como Zero UI están señalando la misma dirección, entonces el futuro no se trata de aprender a usar inteligencia artificial. Se trata de aprender a <strong className="font-semibold text-foreground">dirigirla</strong>.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Fuentes para profundizar</h2>
        <ul className="list-disc pl-6 space-y-2 text-base text-muted-foreground mb-8">
          <li>
            <a href="https://www.zeroui.me/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline decoration-[#2AABB3] underline-offset-4 hover:text-[#2AABB3] transition-colors">
              Zero UI Manifesto
            </a>{" "}
            — el manifiesto de diseño sin fricción de Christian Benavides.
          </li>
          <li>The Verge — entrevista a Boris Cherny (Anthropic) sobre el cambio del rol de los ingenieros.</li>
          <li>Business Insider — «Thousands of AI Agents Overnight»: la irrupción de los agentes autónomos.</li>
          <li>Comunidades de referencia: r/ClaudeAI, r/LocalLLaMA, r/singularity y r/ArtificialIntelligence.</li>
        </ul>

        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu equipo ejecuta tareas o dirige sistemas?"
          headlineEn="Does your team execute tasks or direct systems?"
          subEs="Te ayudamos a rediseñar tus productos y procesos para que la IA trabaje en loops, no en prompts."
          subEn="We help you redesign your products and processes so AI works in loops, not prompts."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogChromeCTA
          headlineEs="Formamos a quienes dirigen inteligencias"
          headlineEn="We train those who direct intelligences"
          subEs="Pensamiento sistémico, Zero UI e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Systems thinking, Zero UI, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogRelatedArticles currentSlug="dirigir-inteligencias" slugs={["trono-de-la-decision", "arquitectura-percepcion", "influencia-sin-erosion"]} />
      </div>
    </main>
  )
}
