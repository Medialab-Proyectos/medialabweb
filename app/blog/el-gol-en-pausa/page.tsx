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
  title: { absolute: "El Gol en Pausa: el VAR y la Emoción del Hincha | MediaLab" },
  description:
    "Una solución puede ser técnicamente correcta y emocionalmente dañina. Cómo el VAR está cambiando la emoción, la atención y el comportamiento del hincha — y qué nos enseña sobre diseñar tecnología.",
  alternates: {
    canonical: "/blog/el-gol-en-pausa",
    languages: {
      es: "/blog/el-gol-en-pausa",
      "x-default": "/blog/el-gol-en-pausa",
    },
  },
  openGraph: {
    title: "El Gol en Pausa: Cómo el VAR Está Cambiando la Emoción del Hincha",
    description:
      "Cuando la tecnología se obsesiona con tener razón, puede olvidarse de cómo se siente usarla. El VAR como caso de estudio de experiencia humana.",
    type: "article",
    url: "/blog/el-gol-en-pausa",
    publishedTime: "2026-06-30T08:00:00-05:00",
    modifiedTime: "2026-06-30T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-gol-en-pausa.png", width: 1200, height: 630, alt: "El gol en pausa: el VAR y la emoción del hincha" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Gol en Pausa: el VAR y la Emoción del Hincha",
    description: "Una solución puede ser técnicamente correcta y emocionalmente dañina.",
    images: ["/images/blog-gol-en-pausa.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "El Gol en Pausa: Cómo el VAR Está Cambiando la Emoción, la Atención y el Comportamiento del Hincha",
  description:
    "Una solución puede ser técnicamente correcta y emocionalmente dañina. El VAR como metáfora del diseño tecnológico que se obsesiona con tener razón y olvida cómo se siente usarlo.",
  image: ["https://medialab.design/images/blog-gol-en-pausa.png"],
  datePublished: "2026-06-30T08:00:00-05:00",
  dateModified: "2026-06-30T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/el-gol-en-pausa" },
  inLanguage: "es",
  articleSection: "UX y Comportamiento Humano",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "El Gol en Pausa", item: "https://medialab.design/blog/el-gol-en-pausa" },
  ],
}

export default function BlogGolEnPausaPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-gol-en-pausa.png" alt="El gol en pausa: el VAR y la emoción del hincha" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "var(--cyan, #2AABB3)" }}>
              UX y Comportamiento Humano
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            El Gol en Pausa: Cómo el VAR Está Cambiando la Emoción, la Atención y el Comportamiento del Hincha
          </h1>
          <BlogChromeMeta dateEs="Junio 2026" dateEn="June 2026" readMin={12} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Antes, un gol era una reacción inmediata. La pelota entraba, el cuerpo saltaba, la garganta gritaba y la celebración aparecía antes que el pensamiento. Hoy, la pelota entra, pero el hincha mira al árbitro. En la pantalla aparece una frase que ya es parte del fútbol moderno: <strong className="font-semibold text-foreground">Revisión VAR</strong>. Y en ese instante, el gol deja de ser una emoción. Se convierte en una espera.

        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El caso no es Colombia. El caso somos todos.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El gol anulado a Colombia frente a Portugal por una posición adelantada mínima funciona como una escena perfecta para entender el problema: un país pasa de la euforia a la frustración por un detalle casi invisible. Pero este no es un artículo sobre un partido. Es un artículo sobre un <strong className="font-semibold text-foreground">nuevo comportamiento</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El VAR está enseñando al hincha a no celebrar de inmediato. Está cambiando una reacción natural por una reacción condicionada. Antes el cuerpo respondía al gol. Ahora el cuerpo espera autorización. Ese cambio parece pequeño, pero es enorme. Porque el fútbol no es solo un deporte de reglas: es un <em className="italic text-foreground">sistema emocional</em>. Y cuando se altera el momento más importante de ese sistema —el gol— se altera toda la experiencia.
        </p>

        <figure className="my-10">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image src="/images/blog-gol-en-pausa-colombia.jpg" alt="Gol anulado a Colombia frente a Portugal por posición adelantada mínima" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground text-center">
            El gol anulado a Colombia ante Portugal: de la euforia a la frustración por un detalle casi invisible.
          </figcaption>
        </figure>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Los datos muestran que no es una molestia aislada</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La crítica al VAR no se explica solo por hinchas frustrados después de una derrota. Una encuesta de la Football Supporters&rsquo; Association publicada en 2026 encontró que el <strong className="font-semibold text-foreground">91,7 % de los aficionados</strong> considera que el VAR ha eliminado la alegría espontánea de celebrar goles. Solo el <strong className="font-semibold text-foreground">3,3 %</strong> dijo que la experiencia en estadio es mejor con VAR. Además, el <strong className="font-semibold text-foreground">58 %</strong> quería mantener los anuncios de los árbitros en el estadio y el <strong className="font-semibold text-foreground">47,2 %</strong> apoyaba un sistema de retos limitado por partido.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          YouGov encontró en mayo de 2026 que el <strong className="font-semibold text-foreground">59 %</strong> de los fans de Premier League cree que el VAR funciona mal, frente a un <strong className="font-semibold text-foreground">26 %</strong> que cree que funciona bien. El <strong className="font-semibold text-foreground">72 %</strong> de los espectadores regulares siente que ha hecho los partidos menos disfrutables. Sin embargo, solo el <strong className="font-semibold text-foreground">18 %</strong> quiere eliminarlo del todo, mientras que el <strong className="font-semibold text-foreground">68 %</strong> prefiere mantenerlo, pero con cambios.
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;Los hinchas no están pidiendo volver al error; están pidiendo rediseñar la experiencia.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">La celebración ya no es libre</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El cambio más profundo no ocurre en la pantalla. Ocurre en el cuerpo del usuario. Antes, la secuencia emocional era simple: <strong className="font-semibold text-foreground">tensión → ataque → gol → grito → abrazo → memoria</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Ahora la secuencia se fragmentó: <strong className="font-semibold text-foreground">tensión → ataque → gol → duda → revisión → espera → ansiedad → decisión</strong>. El VAR introdujo una pausa justo en el punto más alto de la emoción. Y cuando una emoción se pausa, no vuelve igual. Incluso si el gol termina validado, la primera explosión ya se perdió: la celebración llega tarde, la energía colectiva se enfría, el abrazo ya no nace del instinto sino de una confirmación externa.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El fútbol se volvió más exacto, pero menos espontáneo</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El gran argumento a favor del VAR es la precisión, y es cierto: algunas investigaciones señalan que la precisión arbitral puede pasar de aproximadamente <strong className="font-semibold text-foreground">92,1 % a 98,3 %</strong> con su implementación. Pero en experiencia de usuario existe una verdad incómoda:
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;Una solución puede ser técnicamente correcta y emocionalmente dañina.&rdquo;
        </blockquote>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El sistema mejora una métrica —la exactitud arbitral— pero afecta otras igual de importantes: la espontaneidad, el ritmo, la confianza, la claridad, la celebración y la continuidad emocional. El fútbol vive una paradoja: puede ser más correcto y sentirse peor.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El problema no es la tecnología. Es el diseño de la interrupción.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La tecnología de línea de gol casi no genera rechazo porque responde rápido, es clara y no rompe el flujo emocional: la pelota entra o no entra. El VAR, en cambio, muchas veces se siente como una caja negra. El hincha no siempre sabe qué se revisa, cuánto falta, cuál es el criterio o por qué una imagen congelada cambia todo lo que acaba de sentir.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Ahí aparece el verdadero problema: <strong className="font-semibold text-foreground">la interrupción sin explicación se convierte en frustración</strong>. En UX, cuando un sistema detiene al usuario en el momento de mayor intención, debe ofrecer claridad inmediata. Si no lo hace, la espera se transforma en ansiedad. Y en el fútbol esa ansiedad se multiplica, porque no se está esperando cualquier cosa: se está esperando la validación de una emoción colectiva.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El VAR cambió el comportamiento del espectador</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Durante una revisión, el usuario ya no se queda solo mirando la televisión. Toma el celular, entra a redes, busca la repetición, mira comentarios, revisa memes, escribe al grupo de WhatsApp, lee a periodistas, busca culpables. La atención se fragmenta.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El VAR no solo pausa el juego: abre una conversación paralela. Mientras el árbitro revisa, las redes juzgan. La experiencia deja de ser lineal. Ya no vemos simplemente un partido: vivimos un ecosistema de tensión distribuida entre cancha, televisión, redes, chats, narradores y algoritmos.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">La tensión en redes confirma el impacto emocional</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Un estudio publicado en <em className="italic">PLOS ONE</em> analizó <strong className="font-semibold text-foreground">643.251 tuits</strong> de <strong className="font-semibold text-foreground">129 partidos</strong> de Premier League, incluyendo <strong className="font-semibold text-foreground">94 incidentes de VAR</strong>. Los tuits relacionados con VAR tenían una carga emocional más negativa que el resto, y ese impacto podía extenderse <em className="italic text-foreground">después</em> de la jugada.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El VAR no solo interrumpe un momento: puede contaminar emocionalmente el resto de la experiencia. El usuario no vuelve de inmediato al partido; se queda atrapado en la controversia, la sensación de injusticia o la duda sobre el sistema. Eso lo convierte en algo más que una herramienta arbitral: un detonador de conversación social, frustración y polarización.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">La duda se volvió parte del producto</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El fútbol siempre tuvo polémica. Pero antes la polémica venía <em className="italic">después</em> de la jugada. Ahora aparece <em className="italic text-foreground">dentro</em> de la jugada. El gol ya no termina cuando la pelota entra: termina cuando el sistema lo aprueba.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Eso transforma la psicología del hincha. Aprende que no debe confiar del todo en lo que vio, que su primera emoción puede ser invalidada, que celebrar demasiado pronto puede convertirse en vergüenza. Con el tiempo, se celebra menos fuerte, se espera más, se sospecha antes, se mira al árbitro antes que al compañero. El VAR instaló una nueva emoción en el fútbol: <strong className="font-semibold text-foreground">la celebración defensiva</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El hincha no espera una decisión. Espera justicia.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La espera del VAR no es neutra. Cuando una persona espera que cargue una app, se impacienta. Pero cuando espera que confirmen un gol de su país, la espera toca algo más profundo: identidad, pertenencia, memoria y justicia. Cuando una jugada se decide por milímetros invisibles, aparece una fractura entre dos tipos de justicia:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Justicia técnica:</strong> la línea dice que estaba adelantado.</li>
          <li><strong className="font-semibold text-foreground">Justicia percibida:</strong> esa diferencia no parecía una ventaja real.</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Ahí nace gran parte del rechazo. El usuario no siempre siente que la tecnología hizo justicia. A veces siente que la tecnología encontró una excusa.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El cuerpo del hincha también juega el partido</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La emoción deportiva no es una opinión: es una respuesta física. Un estudio publicado en <em className="italic">Scientific Reports</em> recopiló datos de smartwatches de <strong className="font-semibold text-foreground">229 aficionados</strong> durante unas <strong className="font-semibold text-foreground">12 semanas</strong>. El estrés fue aproximadamente <strong className="font-semibold text-foreground">41 % más alto</strong> el día del partido frente a días normales, y la frecuencia cardiaca promedio fue mayor en quienes estaban en el estadio.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Una revisión no interrumpe solo una transmisión: interrumpe una activación fisiológica. El cuerpo estaba listo para descargar emoción, pero el sistema le pide esperar. Es como frenar una ola justo antes de romper. Por eso la experiencia se siente tan antinatural: el gol está diseñado emocionalmente para ser inmediato, no para ser administrado.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Lo que este fenómeno enseña sobre comportamiento humano</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El usuario no evalúa una experiencia solo por el resultado final. Evalúa el <em className="italic text-foreground">camino emocional</em> que tuvo que recorrer para llegar a ese resultado. Por eso, una decisión correcta puede sentirse injusta si:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>llega tarde,</li>
          <li>no se entiende,</li>
          <li>interrumpe demasiado,</li>
          <li>contradice la percepción del usuario,</li>
          <li>no explica su criterio,</li>
          <li>castiga algo que parece insignificante,</li>
          <li>rompe un momento emocional de alto valor.</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El mismo principio aplica a una app financiera que bloquea una cuenta, una plataforma educativa que cancela un avance, una IA que rechaza una solicitud sin explicar o un sistema de salud que obliga a repetir un proceso. La lección es clara: <strong className="font-semibold text-foreground">la tecnología no solo debe resolver problemas; debe cuidar el estado emocional del usuario mientras los resuelve.</strong>
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;Cuando la tecnología se obsesiona con tener razón, puede olvidarse de cómo se siente usarla.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Lo que el fútbol debería aprender</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El futuro no debería ser un fútbol sin tecnología, sino un fútbol con mejor diseño de experiencia. Una tecnología bien aplicada debería cumplir cinco principios:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Intervenir menos:</strong> si el error no es claro, evidente y relevante, la experiencia debería continuar.</li>
          <li><strong className="font-semibold text-foreground">Explicar mejor:</strong> el hincha necesita saber qué se revisa, por qué y bajo qué criterio.</li>
          <li><strong className="font-semibold text-foreground">Respetar el tiempo emocional:</strong> la emoción tiene una ventana corta; si la revisión llega tarde, la experiencia ya se rompió.</li>
          <li><strong className="font-semibold text-foreground">Medir impacto emocional:</strong> no solo goles y posesión, también frustración, comprensión, confianza y pérdida de celebración.</li>
          <li><strong className="font-semibold text-foreground">Proteger el gol:</strong> es el pico emocional del producto fútbol; cualquier tecnología que lo intervenga debe hacerlo con máximo cuidado.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Conclusión: cuando celebrar necesita permiso</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El VAR muestra una de las tensiones más importantes de nuestra época: la que existe entre precisión tecnológica y experiencia humana. En el papel, la tecnología promete justicia; en la práctica, muchas veces introduce espera, sospecha y frustración. El gol, que antes era una explosión inmediata, ahora puede convertirse en una pregunta.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Y cuando el momento más emocionante del fútbol se transforma en una pausa administrativa, algo profundo se rompe: la confianza en la primera emoción, la sincronía colectiva, la libertad de celebrar. Tal vez el gran reto del fútbol moderno no sea hacer que la tecnología vea más, sino lograr que entienda mejor lo que no se puede medir fácilmente: el grito, el abrazo, la espera, la rabia, la ilusión y esa pequeña ventana donde un gol deja de ser una jugada y se convierte en memoria.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu tecnología cuida la emoción de quien la usa?"
          headlineEn="Does your technology care about how it feels to use it?"
          subEs="Diseñamos productos que resuelven sin romper el momento emocional del usuario — con investigación real, no suposiciones."
          subEn="We design products that solve without breaking the user's emotional moment — with real research, not assumptions."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogChromeCTA
          headlineEs="Formamos arquitectos de experiencias con IA"
          headlineEn="We train AI experience architects"
          subEs="Comportamiento humano, diseño conductual e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Human behavior, behavioral design, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogRelatedArticles currentSlug="el-gol-en-pausa" slugs={["trono-de-la-decision", "influencia-sin-erosion", "psicologia-adopcion"]} />
      </div>
    </main>
  )
}
