import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "La Arquitectura de la Percepción: Por Qué Tus Usuarios No Navegan Flujos, Sino Estados Emocionales | MediaLab",
  description: "Los usuarios no abandonan productos por falta de lógica sino por fricciones emocionales invisibles. Descubre el Diseño de Experiencia Consciente (CXD) de MediaLab.",
  openGraph: {
    title: "La Arquitectura de la Percepción — MediaLab Ingeniería",
    description: "Los usuarios transitan estados emocionales, no flujos lógicos. Aprende a diseñar desde la percepción consciente.",
    images: ["/images/blog-zero-ui-percepcion.png"],
  },
}

export default function BlogArquitecturaPercepcionPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop" alt="Equipo de diseño UX analizando estados emocionales del usuario" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#E8751A" }}>
              Diseño UX
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            La Arquitectura de la Percepción: Por Qué Tus Usuarios No Navegan Flujos, Sino Estados Emocionales
          </h1>
          <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
            <span className="flex items-center gap-1"><Calendar size={13} /> Mayo 2026</span>
            <span className="flex items-center gap-1"><Clock size={13} /> 8 min de lectura</span>
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
          Hay productos digitales que son perfectos… al menos en el papel. Sus flujos son claros, sus interfaces impecables.
          Y aun así, algo falla. Es una <em className="italic text-foreground">fricción invisible</em>. Cuando esto ocurre, el problema no está en el código ni en la estética — es un fallo en la arquitectura de la percepción.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El Malentendido Central del UX Moderno</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Durante décadas, la industria del diseño digital se ha cimentado sobre una ecuación errónea: <strong className="font-semibold text-foreground">Clic + Pantalla + Acción = Experiencia</strong>. Esta visión atómica ignora una verdad fundamental: una interacción es solo un evento aislado, mientras que la experiencia es un <em className="italic text-foreground">estado de conciencia sostenido</em>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El error más costoso de la tecnología contemporánea ha sido diseñar para un usuario ideal — una abstracción racional que opera en un vacío — en lugar del usuario real, cuya navegación está condicionada por su entorno, sus emociones y sus capacidades cognitivas momentáneas.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--magenta)" }}>
          &ldquo;Las personas no navegan a través de flujos lógicos; navegan a través de estados emocionales. El usuario no habita botones ni wireframes; habita sensaciones de claridad, duda, control, ansiedad o seguridad.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Los 4 Estados Críticos de la Percepción</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El Diseño de Experiencia Consciente (CXD) establece que para que un diseño sea verdaderamente consciente, debe responder con precisión a cuatro estados críticos:
        </p>
        <ol className="list-decimal pl-6 space-y-4 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Estado de Orientación:</strong> El usuario necesita sentir: &ldquo;Sé exactamente dónde estoy y entiendo qué sucederá a continuación.&rdquo; Se logra con indicadores de progreso contextuales y microcopy que elimine cualquier ambigüedad.</li>
          <li><strong className="font-semibold text-foreground">Gestión de la Carga Cognitiva:</strong> El usuario percibe: &ldquo;La información me abruma y me impide decidir.&rdquo; La solución es el revelado progresivo — fragmentar procesos complejos en micro-etapas.</li>
          <li><strong className="font-semibold text-foreground">Control del Tiempo Subjetivo:</strong> &ldquo;Esta espera parece interminable.&rdquo; La implementación de Skeleton Screens mantiene al usuario enfocado en el progreso, no en la espera.</li>
          <li><strong className="font-semibold text-foreground">Seguridad y Confianza:</strong> &ldquo;Confío plenamente en que el sistema no cometerá errores con mi información.&rdquo; Requiere transparencia total, especialmente en sistemas impulsados por IA.</li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Cuando la Lógica Produce Experiencias Incorrectas</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Un caso paradigmático: McDonald&apos;s implementó un sistema de pedidos por voz con IA para sus drive-thru. El sistema, diseñado para optimizar la eficiencia, fracasó estrepitosamente al no considerar el contexto real: ruido ambiental, acentos regionales, voces superpuestas. Los pedidos absurdos se volvieron virales.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Técnicamente, el código procesaba datos siguiendo su lógica interna, pero <strong className="font-semibold text-foreground">fenomenológicamente el sistema era ciego</strong> a la confusión del cliente. Un enfoque de diseño consciente habría detectado la degradación en la calidad de la respuesta para ceder el control a un humano antes de que el error escalara.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">De la Fenomenología al Diseño UX Práctico</h2>
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

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Conclusión: Diseñar para la Conciencia, No para el Clic</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La pregunta fundamental del CXD no es <em className="italic">&ldquo;¿qué debe hacer el usuario?&rdquo;</em>, sino <em className="italic text-foreground">&ldquo;¿desde qué estado mental está intentando hacerlo?&rdquo;</em>. Cuando diseñamos desde la percepción consciente, no solo creamos productos más usables — creamos experiencias que respetan la humanidad de quien las usa.
        </p>
        <p className="text-sm text-muted-foreground/60 mt-8 italic">
          — Por MediaLab Ingeniería.
        </p>
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-border p-8 flex flex-col md:flex-row items-center gap-6 bg-card">
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl text-foreground mb-2">¿Quieres diseñar desde la percepción consciente?</h3>
            <p className="text-sm text-muted-foreground">Descubre cómo aplicamos el CXD en productos B2B y B2C reales. Agenda una llamada gratuita.</p>
          </div>
          <Link href="/#contact"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
            Agendar llamada →
          </Link>
        </div>
      </div>
    </main>
  )
}
