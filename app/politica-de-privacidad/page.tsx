import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de MediaLab Ingeniería. Conoce cómo recopilamos, usamos y protegemos tu información personal.",
}

export default function PoliticaDePrivacidad() {
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
          Política de Privacidad
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última actualización: mayo 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none flex flex-col gap-8">
          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              1. Información que recopilamos
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Recopilamos información que nos proporcionas directamente al usar nuestros servicios,
              como tu nombre, correo electrónico, empresa y descripción de proyecto cuando completas
              formularios de contacto o utilizas UXBox. También recopilamos datos de uso anónimos
              mediante herramientas de analítica para mejorar la experiencia del sitio.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              2. Uso de la información
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos tu información para: responder a tus consultas, generar propuestas
              de producto mediante UXBox, enviarte comunicaciones relevantes sobre nuestros servicios,
              y mejorar nuestro sitio web y servicios. Nunca vendemos ni compartimos tu información
              personal con terceros para fines de marketing.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              3. Protección de datos
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu
              información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              Esto incluye encriptación de datos en tránsito y en reposo.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              4. Cookies y tecnologías de seguimiento
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos cookies esenciales para el funcionamiento del sitio y cookies de analítica
              (Vercel Analytics) para entender cómo interactúas con nuestro contenido. Puedes
              configurar tu navegador para rechazar cookies, aunque esto podría afectar
              algunas funcionalidades del sitio.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              5. Tus derechos
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tienes derecho a acceder, rectificar, eliminar o limitar el uso de tus datos personales.
              Para ejercer estos derechos, contáctanos a través del formulario de contacto en nuestro
              sitio web o escríbenos directamente por WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-foreground mb-3">
              6. Contacto
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través
              de nuestro sitio web en{" "}
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
