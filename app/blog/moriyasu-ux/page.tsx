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
  title: { absolute: "Moriyasu UX: Cómo Diseñar Interfaces para Usuarios Bajo Presión | MediaLab" },
  description:
    "En momentos de tensión, una buena interfaz no explica más: reduce ambigüedad, muestra lo urgente y guía la siguiente acción segura. Qué enseña una pizarra de fútbol sobre UX y diseño conductual.",
  alternates: {
    canonical: "/blog/moriyasu-ux",
    languages: { es: "/blog/moriyasu-ux", "x-default": "/blog/moriyasu-ux" },
  },
  openGraph: {
    title: "Moriyasu UX: Diseñar Interfaces para Cuando el Usuario No Puede Pensar con Calma",
    description:
      "Un patrón práctico para diseñar señales visibles, mínimas y accionables para usuarios bajo tensión, con poca capacidad de procesamiento y necesidad de actuar rápido.",
    type: "article",
    url: "/blog/moriyasu-ux",
    publishedTime: "2026-07-03T08:00:00-05:00",
    modifiedTime: "2026-07-03T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-moriyasu-ux.png", width: 1200, height: 630, alt: "Moriyasu UX — diseñar bajo presión" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moriyasu UX: Diseñar Interfaces para Usuarios Bajo Presión",
    description: "En tensión, la interfaz no debe explicar más: debe reducir ambigüedad y guiar la siguiente acción.",
    images: ["/images/blog-moriyasu-ux.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Moriyasu UX: Diseñar Interfaces para Cuando el Usuario No Puede Pensar con Calma",
  description:
    "Un patrón práctico de diseño para momentos de presión: señales visibles, mínimas y accionables para usuarios bajo tensión. Inspirado en la pizarra del entrenador Hajime Moriyasu.",
  image: ["https://medialab.design/images/blog-moriyasu-ux.png"],
  datePublished: "2026-07-03T08:00:00-05:00",
  dateModified: "2026-07-03T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/blog/moriyasu-ux" },
  inLanguage: "es",
  articleSection: "UX y Comportamiento Humano",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/blog" },
    { "@type": "ListItem", position: 3, name: "Moriyasu UX", item: "https://medialab.design/blog/moriyasu-ux" },
  ],
}

export default function BlogMoriyasuUXPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-moriyasu-ux.png" alt="Moriyasu UX: diseñar interfaces para usuarios bajo presión" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#8b5cf6" }}>
              UX y Comportamiento Humano
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Moriyasu UX: diseñar interfaces para cuando el usuario no puede pensar con calma
          </h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-white/80">
            Lo que una pizarra en un partido de fútbol nos enseña sobre UX, diseño comportamental y toma de decisiones bajo tensión.
          </p>
          <BlogChromeMeta dateEs="Julio 2026" dateEn="July 2026" readMin={11} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          En UX solemos hablar de claridad, consistencia, accesibilidad y reducción de fricción. Son principios necesarios. Pero hay una pregunta que muchas veces queda fuera de la conversación: <strong className="font-semibold text-foreground">¿qué pasa cuando el usuario no está tranquilo?</strong> Cuando tiene miedo, está cansado, tiene poco tiempo, se equivocó o necesita decidir rápido.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La mayoría de interfaces se diseñan como si el usuario estuviera sentado, con buena conexión, leyendo todo con atención. Pero la vida real no funciona así: las personas usan productos digitales mientras conducen, cuidan a alguien, hacen un pago urgente o suben un documento antes de que venza un plazo. Ahí aparece una idea interesante: el llamado <strong className="font-semibold text-foreground">método Moriyasu</strong>. No nació en una escuela de diseño ni en Silicon Valley. Viene del fútbol. Y precisamente por eso resulta tan útil.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">¿Qué es el método Moriyasu?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El "método Moriyasu" se popularizó a partir de una práctica del entrenador japonés Hajime Moriyasu: usar una <strong className="font-semibold text-foreground">pizarra analógica con números grandes</strong> para comunicar información crítica a sus jugadores en momentos de alta presión. No es una doctrina formal de UX ni de teoría deportiva; es una etiqueta para describir una práctica concreta: comunicar desde la banda, mediante señales visuales simples, información relevante como el tiempo restante o instrucciones abreviadas.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La explicación fue sencilla: varios jugadores no podían ver bien el reloj del estadio ni escuchar al banquillo. Entonces el cuerpo técnico convirtió una variable crítica —el tiempo— en una señal visual grande, directa y compartida. Eso es <strong className="font-semibold text-foreground">diseño</strong>: no gráfico, no decorativo, sino como <em className="italic text-foreground">mediación entre información, contexto y acción</em>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">La gran lección para UX</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La lección principal no es "usa números grandes". Es esta:
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#8b5cf6" }}>
          &ldquo;Cuando una persona está bajo tensión, la interfaz debe mostrar lo mínimo necesario para tomar la siguiente decisión correcta.&rdquo;
        </blockquote>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En contextos de presión, más información no significa más claridad: muchas veces significa más carga cognitiva. Un usuario bajo tensión no analiza como uno calmado. <strong className="font-semibold text-foreground">Escanea, reconoce patrones, busca señales.</strong> Quiere saber qué pasa y qué debe hacer ahora. Por eso una interfaz diseñada para tensión no puede comportarse como un dashboard lleno de opciones: debe comportarse como una <strong className="font-semibold text-foreground">señal crítica</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El problema de muchas interfaces actuales</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Muchas experiencias fallan porque están diseñadas para <strong className="font-semibold text-foreground">organizar funciones, no para orientar decisiones</strong>. Un usuario varado en carretera, con poca batería y preocupado, abre su app y ve: Historial, Mantenimiento, Talleres, Seguros, Perfil, Documentos, Solicitudes, Repuestos, Cotizaciones, Notificaciones. Desde arquitectura de información parece completo. Desde experiencia humana es un desastre. <strong className="font-semibold text-foreground">El usuario no necesita navegar. Necesita resolver.</strong>
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La pregunta no debería ser "¿dónde ponemos cada función?", sino: <em className="italic text-foreground">¿qué necesita entender esta persona en los próximos 10 segundos para sentirse segura y actuar bien?</em> Esa es la diferencia entre diseñar una interfaz y diseñar una experiencia comportamental.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Moriyasu UX: una propuesta conceptual</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Podemos llamar <strong className="font-semibold text-foreground">Moriyasu UX</strong> a un enfoque de diseño para momentos de presión: <em className="italic text-foreground">diseñar señales visibles, mínimas y accionables para usuarios que están bajo tensión, con poca capacidad de procesamiento y necesidad de actuar rápido</em>. Su objetivo no es explicar más. Es <strong className="font-semibold text-foreground">reducir ambigüedad</strong>. No busca mostrar todo: busca mostrar lo que cambia la decisión inmediata.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Por qué importa desde la psicología cognitiva</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Cuando una persona está bajo presión, su capacidad mental se reduce. La <strong className="font-semibold text-foreground">memoria de trabajo tiene límites</strong> y, bajo estrés, se deterioran la flexibilidad cognitiva, el control ejecutivo y la evaluación de alternativas con calma. En un partido abierto, un jugador atiende balón, rivales, espacios, cansancio, instrucciones y presión del resultado. Pedirle además calcular el tiempo restante añade carga innecesaria. La pizarra <strong className="font-semibold text-foreground">externaliza esa información</strong> para que no compita con otras demandas mentales.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Lo mismo pasa en productos digitales. Cuando alguien intenta subir un documento antes de una fecha límite o resolver un pago rechazado, no deberíamos obligarlo a leer textos largos, interpretar diez estados o comparar varias opciones. <strong className="font-semibold text-foreground">La interfaz debe ayudarle a pensar menos, no más.</strong>
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Diseñar para tensión no es manipular</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Diseñar para momentos de tensión no significa crear urgencia falsa ni usar miedo. Eso sería manipulación. El enfoque correcto es distinto: <strong className="font-semibold text-foreground">si la tensión ya existe, el diseño debe hacerla comprensible y manejable.</strong>
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Mala práctica:</strong> "¡Última oportunidad! Si no haces esto ya, perderás todo." (explota la ansiedad)</li>
          <li><strong className="font-semibold text-foreground">Buena práctica:</strong> "Tu solicitud vence hoy a las 5:00 p. m. Puedes enviarla ahora o guardar el avance y completarla después." (organiza la decisión)</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El diseño conductual ético no busca controlar al usuario. Busca <strong className="font-semibold text-foreground">mejorar las condiciones en las que decide</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Más allá de Nielsen</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Las heurísticas de Nielsen siguen siendo fundamentales: visibilidad del estado del sistema, reconocer antes que recordar, prevención de errores, minimalismo. El aporte del caso Moriyasu es <strong className="font-semibold text-foreground">llevar esos principios a un escenario extremo</strong>: ruido, presión, fatiga, poco tiempo, baja atención y alto costo del error. Moriyasu no reemplaza a Nielsen; <em className="italic text-foreground">operacionaliza</em> varias heurísticas donde la claridad debe ser mucho más severa.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Nielsen dice que el estado del sistema debe ser visible. Moriyasu UX pregunta: <strong className="font-semibold text-foreground">¿visible para quién, en qué estado emocional, con cuánto tiempo y bajo qué presión?</strong>
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Los 5 principios de Moriyasu UX</h2>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">1. Una sola señal dominante.</strong> La interfaz debe elegir cuál es la variable que ordena la acción (tiempo, riesgo, estado, siguiente paso…). Si todo grita, nada guía.</li>
          <li><strong className="font-semibold text-foreground">2. La información debe convertirse en acción.</strong> No basta con "Documento pendiente": mejor "Falta 1 documento para enviar tu solicitud: recibo de servicios" + CTA "Subir recibo". Señal y acción acopladas.</li>
          <li><strong className="font-semibold text-foreground">3. Menos opciones en el momento crítico.</strong> Una pantalla crítica: una acción principal, una alternativa secundaria y una salida segura. No más.</li>
          <li><strong className="font-semibold text-foreground">4. El usuario no debe recordar lo que el sistema puede mostrar.</strong> No "completa los documentos requeridos", sino "te faltan 2 documentos: recibo de servicios y certificado de matrícula".</li>
          <li><strong className="font-semibold text-foreground">5. La señal debe ser compartida y consistente.</strong> Los sistemas de diseño deberían definir una <em className="italic">gramática de estados críticos</em> (pendiente, en revisión, urgente, aprobado, rechazado, vencido, recuperable, irreversible). La consistencia no es estética: es velocidad cognitiva.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Ejemplo aplicado: app de asistencia vehicular</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El usuario está en carretera y su vehículo se detiene. Un diseño tradicional lo recibe con "¿Qué deseas hacer?" y siete opciones. Está bien para navegación normal, pero no para una emergencia. Con enfoque Moriyasu UX, la app <strong className="font-semibold text-foreground">ordena la realidad</strong>: primero seguridad ("¿Estás en un lugar seguro?"), luego ubicación ("Compartir ubicación y pedir ayuda"), luego diagnóstico y seguimiento.
        </p>

        <figure className="my-10">
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-2xl border border-border">
            <Image src="/images/blog-moriyasu-ejemplo.png" alt="Ejemplo Moriyasu UX: interfaz que ordena la decisión bajo presión" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground text-center">
            La interfaz cambia la <strong className="font-semibold text-foreground">señal dominante</strong> según el momento: primero seguridad, luego ubicación, luego espera y seguimiento.
          </figcaption>
        </figure>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Tras pedir ayuda, la variable crítica cambia: ya no es la seguridad, es la <strong className="font-semibold text-foreground">espera</strong>. "Asistencia solicitada · Tiempo estimado: 18 min · Tu ubicación ya fue compartida", con el CTA "Ver estado de la asistencia". Eso es Moriyasu UX: la interfaz cambia la señal dominante según el momento de tensión.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Ejemplo aplicado: formularios complejos</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Un usuario rural, con baja alfabetización digital, debe subir documentos antes de una fecha límite. En vez de "adjunta los documentos requeridos para continuar", la señal dominante es <strong className="font-semibold text-foreground">"te falta 1 documento: recibo de servicios públicos"</strong> + CTA "Subir recibo", con ayuda contextual ("si no lo tienes ahora, puedes guardar tu avance") y salida segura ("Guardar y continuar luego"). El usuario no tiene que interpretar todo el proceso: entiende qué falta y qué puede hacer.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Cómo evaluar una interfaz bajo tensión</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Una prueba de usabilidad clásica pregunta si el usuario completó la tarea. Una prueba <strong className="font-semibold text-foreground">Moriyasu</strong> agrega preguntas más duras:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>¿El usuario entendió qué era urgente?</li>
          <li>¿Identificó la siguiente acción sin leer toda la pantalla?</li>
          <li>¿La interfaz redujo la ansiedad o la aumentó?</li>
          <li>¿La señal crítica era visible a distancia, en movimiento o con distracciones?</li>
          <li>¿Dependía de su memoria o de información visible?</li>
          <li>¿Qué error podría cometer bajo presión, y cómo se recupera?</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Diseñar para tensión exige probar en condiciones menos ideales: no basta con validar la pantalla en Figma, hay que preguntarse cómo se comporta cuando el usuario está cansado, apurado o preocupado.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Cinco preguntas antes de diseñar una pantalla crítica</h2>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">¿Cuál es la tensión real del usuario?</strong> No la tarea: la tensión (miedo, urgencia, presión económica, cansancio, incertidumbre).</li>
          <li><strong className="font-semibold text-foreground">¿Cuál es la variable crítica?</strong> El dato que cambia la decisión inmediata (tiempo, documento faltante, riesgo, ubicación, monto, consecuencia).</li>
          <li><strong className="font-semibold text-foreground">¿Qué información sobra ahora?</strong> En tensión, ocultar lo secundario puede ser una forma de ayudar.</li>
          <li><strong className="font-semibold text-foreground">¿Cuál es la acción segura por defecto?</strong> El camino menos riesgoso, no necesariamente el más rentable para el negocio.</li>
          <li><strong className="font-semibold text-foreground">¿Cómo se recupera el usuario si se equivoca?</strong> Bajo presión los errores aumentan: hacen falta salidas claras y recuperación simple.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El valor para las empresas</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Este enfoque impacta métricas: <strong className="font-semibold text-foreground">menor abandono en flujos críticos, menos errores de carga, menos llamadas a soporte, mejor conversión y mayor confianza</strong>. Pero el valor más importante es otro: el usuario siente que el producto lo entiende justo cuando más lo necesita. Y la confianza es una de las métricas más importantes de cualquier experiencia digital.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Conclusión: cuando el usuario no necesita una interfaz completa</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El método Moriyasu no necesita convertirse en una moda para ser útil. Su valor es recordarnos algo esencial: una buena experiencia no se mide solo cuando el usuario está tranquilo, sino <strong className="font-semibold text-foreground">cuando está bajo presión</strong>. En esos momentos el diseño debe ser menos decorativo y más conductual. Menos explicación, más señal. Menos opciones compitiendo, más claridad sobre la siguiente acción.
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#8b5cf6" }}>
          &ldquo;En momentos de tensión, una buena interfaz no explica más: reduce ambigüedad, muestra lo urgente y guía la siguiente acción segura.&rdquo;
        </blockquote>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Porque en los momentos críticos, el usuario no necesita una interfaz completa. Necesita una interfaz que <strong className="font-semibold text-foreground">le ayude a decidir</strong>.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu producto acompaña al usuario cuando está bajo presión?"
          headlineEn="Does your product support users when they're under pressure?"
          subEs="Diseñamos flujos críticos que reducen ambigüedad y guían la siguiente acción — con investigación real, no suposiciones."
          subEn="We design critical flows that reduce ambiguity and guide the next action — with real research, not assumptions."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #8b5cf6, #6d28d9)"
        />
        <BlogChromeCTA
          headlineEs="Formamos arquitectos de experiencias con IA"
          headlineEn="We train AI experience architects"
          subEs="Diseño conductual, psicología cognitiva e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Behavioral design, cognitive psychology, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="moriyasu-ux" slugs={["el-gol-en-pausa", "arquitectura-percepcion", "trono-de-la-decision"]} />
      </div>
    </main>
  )
}
