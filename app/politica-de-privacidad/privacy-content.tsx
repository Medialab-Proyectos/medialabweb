"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border/40 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-display font-semibold text-base text-foreground">{title}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1">
          <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
        </div>
      )}
    </div>
  )
}

export function PrivacyContent() {
  const { t, localized } = useLanguage()

  const sections = [
    {
      title: t("1. Información que recopilamos", "1. Information we collect"),
      body: t(
        "Recopilamos información que nos proporcionas directamente al usar nuestros servicios, como tu nombre, correo electrónico, empresa y descripción de proyecto cuando completas formularios de contacto o utilizas UXBox. También recopilamos datos de uso anónimos mediante herramientas de analítica para mejorar la experiencia del sitio.",
        "We collect information you provide directly when using our services, such as your name, email, company, and project description when you complete contact forms or use UXBox. We also collect anonymous usage data through analytics tools to improve the site experience."
      ),
    },
    {
      title: t("2. Uso de la información", "2. Use of information"),
      body: t(
        "Utilizamos tu información para: responder a tus consultas, generar propuestas de producto mediante UXBox, enviarte comunicaciones relevantes sobre nuestros servicios, y mejorar nuestro sitio web y servicios. Nunca vendemos ni compartimos tu información personal con terceros para fines de marketing.",
        "We use your information to: respond to your inquiries, generate product proposals via UXBox, send you relevant communications about our services, and improve our website and services. We never sell or share your personal information with third parties for marketing purposes."
      ),
    },
    {
      title: t("3. Protección de datos", "3. Data protection"),
      body: t(
        "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye encriptación de datos en tránsito y en reposo.",
        "We implement technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit and at rest."
      ),
    },
    {
      title: t("4. Cookies y tecnologías de seguimiento", "4. Cookies and tracking technologies"),
      body: t(
        "Utilizamos cookies esenciales para el funcionamiento del sitio y cookies de analítica (Vercel Analytics) para entender cómo interactúas con nuestro contenido. Puedes configurar tu navegador para rechazar cookies, aunque esto podría afectar algunas funcionalidades del sitio.",
        "We use essential cookies for site functionality and analytics cookies (Vercel Analytics) to understand how you interact with our content. You can configure your browser to reject cookies, though this may affect some site features."
      ),
    },
    {
      title: t("5. Tus derechos", "5. Your rights"),
      body: t(
        "Tienes derecho a acceder, rectificar, eliminar o limitar el uso de tus datos personales. Para ejercer estos derechos, contáctanos a través del formulario de contacto en nuestro sitio web o escríbenos directamente por WhatsApp.",
        "You have the right to access, correct, delete, or restrict the use of your personal data. To exercise these rights, contact us through the contact form on our website or message us directly on WhatsApp."
      ),
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 py-24" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
          <Link
            href={localized("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            {t("Volver al inicio", "Back to home")}
          </Link>

          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t("Política de Privacidad", "Privacy Policy")}
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            {t("Última actualización: mayo 2026", "Last updated: May 2026")}
          </p>

          <div className="flex flex-col gap-3">
            {sections.map((s) => (
              <Accordion key={s.title} title={s.title}>
                <p>{s.body}</p>
              </Accordion>
            ))}

            <Accordion title={t("6. Contacto", "6. Contact")}>
              <p>
                {t(
                  "Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de nuestro sitio web en ",
                  "If you have questions about this privacy policy, you can contact us through our website at "
                )}
                <Link href={localized("/") + "#contact"} className="text-[var(--magenta)] hover:underline">
                  medialabingenieria.com
                </Link>.
              </p>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
