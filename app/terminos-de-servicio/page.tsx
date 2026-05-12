import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description:
    "Términos y condiciones de uso de los servicios de MediaLab Ingeniería.",
}

export default function TerminosDeServicio() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
          Términos de Servicio
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última actualización: mayo 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none flex flex-col gap-8">
          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              1. Aceptación de los términos
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Al acceder y utilizar el sitio web de MediaLab Ingeniería y sus servicios, aceptas
              estos términos de servicio en su totalidad. Si no estás de acuerdo con alguno de
              estos términos, te pedimos que no utilices nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              2. Descripción de los servicios
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MediaLab Ingeniería ofrece servicios de diseño UX/UI, desarrollo de software a medida,
              discovery de producto con IA (UXBox), consultoría de diseño conductual y SEO técnico.
              Los alcances específicos, entregables y plazos se definen en propuestas individuales
              acordadas con cada cliente.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              3. Uso de UXBox
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              UXBox es una herramienta de discovery de producto potenciada por IA. Los resultados
              generados son propuestas preliminares y no constituyen un compromiso contractual.
              La información que proporcionas a UXBox se usa exclusivamente para generar tu
              propuesta y no se comparte con terceros.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              4. Propiedad intelectual
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todo el contenido del sitio web, incluyendo textos, imágenes, diseños, logos y código,
              es propiedad de MediaLab Ingeniería o sus licenciantes. La propiedad intelectual de
              los proyectos desarrollados para clientes se transfiere según lo acordado en cada
              contrato individual.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              5. Confidencialidad
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nos comprometemos a mantener la confidencialidad de la información de tu proyecto.
              Ofrecemos acuerdos de confidencialidad (NDA) a solicitud del cliente antes de
              iniciar cualquier sesión de discovery o desarrollo.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              6. Limitación de responsabilidad
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MediaLab Ingeniería no será responsable por daños indirectos, incidentales o
              consecuentes que surjan del uso de nuestros servicios o sitio web. Nuestra
              responsabilidad total se limita al valor del contrato específico del servicio
              prestado.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              7. Contacto
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para consultas sobre estos términos de servicio, contáctanos en{" "}
              <Link href="/#contact" className="text-[var(--magenta)] hover:underline">
                medialabingenieria.com
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
