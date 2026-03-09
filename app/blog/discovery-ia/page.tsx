import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Discovery con IA: El Fin de los Workshops Interminables | MediaLab",
  description: "Cómo las herramientas inteligentes están reemplazando semanas de sesiones con stakeholders.",
}

export default function BlogDiscoveryIAPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-ai.jpg" alt="Discovery con IA" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 w-fit" style={{ background: "#2AABB3" }}>
            IA en UX
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Discovery con IA: El Fin de los Workshops Interminables
          </h1>
          <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
            <span className="flex items-center gap-1"><Calendar size={13} /> Ene 2025</span>
            <span className="flex items-center gap-1"><Clock size={13} /> 4 min de lectura</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link href="/#blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Volver al blog
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Cómo las herramientas inteligentes están reemplazando semanas de sesiones con stakeholders — y por qué eso es bueno para todos.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El Problema con el Discovery Tradicional</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El proceso clásico de product discovery involucra semanas de workshops, entrevistas a usuarios, análisis competitivo y sesiones de síntesis. Para una empresa mediana, esto puede sumar fácilmente 80–120 horas de trabajo antes de escribir una sola línea de código — y un costo que pocas startups pueden sostener.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Además, los workshops tienen un problema estructural: tienden a generar falso consenso. Los stakeholders más ruidosos dominan la conversación, los más introvertidos callan sus mejores ideas, y el resultado suele ser un promedio tibio de todas las opiniones, no la solución óptima.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Cómo la IA Está Cambiando el Juego</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Con herramientas como GPT-4, Claude y sistemas especializados de análisis de usuarios, es posible comprimir una semana de trabajo de discovery en horas. No porque la IA reemplace el pensamiento humano — sino porque elimina el trabajo repetitivo y acelera la síntesis.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          En MediaLab, hemos desarrollado un framework de <strong className="font-semibold text-foreground">AI-Assisted Discovery</strong> que combina:
        </p>
        <ul className="list-disc pl-6 space-y-4 text-lg text-muted-foreground mb-8">
          <li>Análisis automático de reseñas de competidores (App Store, G2, Trustpilot) para extraer patrones de dolor</li>
          <li>Generación de personas de usuario basadas en datos demográficos y de comportamiento reales</li>
          <li>Síntesis de insights de entrevistas mediante transcripción + análisis semántico</li>
          <li>Generación de user stories y criterios de aceptación de forma semi-automática</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Lo que la IA No Puede Reemplazar</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La IA es extraordinariamente buena para sintetizar información existente. Pero no puede generar insights que no están en los datos — y los insights más valiosos en producto suelen venir de observar directamente cómo las personas fallan en completar una tarea, no de leer lo que dicen que hacen.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          La observación etnográfica, las entrevistas con empatía profunda, el análisis contextual — estos no desaparecen con la IA. Lo que cambia es cuánto tiempo dedicamos a organizar y sintetizar lo que ya sabemos vs. cuánto tiempo dedicamos a descubrir lo que aún no sabemos.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">El Resultado: Discovery en 48 Horas</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Con nuestro proceso actual, podemos entregar un brief de producto completo — incluyendo análisis de mercado, definición de usuario objetivo, propuesta de valor única y priorizacion de features — en 48 horas. Esto que antes tomaba 3–4 semanas.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          El tiempo ahorrado no va a las ganancias — va a donde realmente importa: más interacciones con usuarios reales, más prototipos iterados, más decisiones basadas en evidencia.
        </p>
      </article>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-border p-8 flex flex-col md:flex-row items-center gap-6 bg-card">
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl text-foreground mb-2">¿Quieres hacer discovery en 48h?</h3>
            <p className="text-sm text-muted-foreground">Nuestro proceso UXBox combina IA y metodología UX para darte claridad en tiempo récord.</p>
          </div>
          <Link href="/#uxbox" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "linear-gradient(90deg, #E8751A, #c65a10)" }}>
            Comenzar Discovery →
          </Link>
        </div>
      </div>
    </main>
  )
}
