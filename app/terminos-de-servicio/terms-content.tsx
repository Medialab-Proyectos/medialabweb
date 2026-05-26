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

export function TermsContent() {
  const { t, localized } = useLanguage()

  const sections = [
    {
      title: t("1. Aceptación de los términos", "1. Acceptance of terms"),
      body: t(
        "Al acceder y utilizar el sitio web de MediaLab Ingeniería y sus servicios, aceptas estos términos de servicio en su totalidad. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices nuestros servicios.",
        "By accessing and using MediaLab Ingeniería's website and services, you accept these terms of service in full. If you disagree with any of these terms, please do not use our services."
      ),
    },
    {
      title: t("2. Descripción de los servicios", "2. Description of services"),
      body: t(
        "MediaLab Ingeniería ofrece servicios de diseño UX/UI, desarrollo de software a medida, discovery de producto con IA (UXBox), consultoría de diseño conductual y SEO técnico. Los alcances específicos, entregables y plazos se definen en propuestas individuales acordadas con cada cliente.",
        "MediaLab Ingeniería offers UX/UI design, custom software development, AI product discovery (UXBox), behavioral design consulting, and technical SEO services. Specific scopes, deliverables, and timelines are defined in individual proposals agreed with each client."
      ),
    },
    {
      title: t("3. Uso de UXBox", "3. Use of UXBox"),
      body: t(
        "UXBox es una herramienta de discovery de producto potenciada por IA. Los resultados generados son propuestas preliminares y no constituyen un compromiso contractual. La información que proporcionas a UXBox se usa exclusivamente para generar tu propuesta y no se comparte con terceros.",
        "UXBox is an AI-powered product discovery tool. Generated results are preliminary proposals and do not constitute a contractual commitment. The information you provide to UXBox is used exclusively to generate your proposal and is not shared with third parties."
      ),
    },
    {
      title: t("4. Propiedad intelectual", "4. Intellectual property"),
      body: t(
        "Todo el contenido del sitio web, incluyendo textos, imágenes, diseños, logos y código, es propiedad de MediaLab Ingeniería o sus licenciantes. La propiedad intelectual de los proyectos desarrollados para clientes se transfiere según lo acordado en cada contrato individual.",
        "All website content, including text, images, designs, logos, and code, is the property of MediaLab Ingeniería or its licensors. Intellectual property of projects developed for clients is transferred as agreed in each individual contract."
      ),
    },
    {
      title: t("5. Confidencialidad", "5. Confidentiality"),
      body: t(
        "Nos comprometemos a mantener la confidencialidad de la información de tu proyecto. Ofrecemos acuerdos de confidencialidad (NDA) a solicitud del cliente antes de iniciar cualquier sesión de discovery o desarrollo.",
        "We commit to maintaining the confidentiality of your project information. We offer non-disclosure agreements (NDAs) upon client request before starting any discovery or development session."
      ),
    },
    {
      title: t("6. Limitación de responsabilidad", "6. Limitation of liability"),
      body: t(
        "MediaLab Ingeniería no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso de nuestros servicios o sitio web. Nuestra responsabilidad total se limita al valor del contrato específico del servicio prestado.",
        "MediaLab Ingeniería shall not be liable for indirect, incidental, or consequential damages arising from the use of our services or website. Our total liability is limited to the value of the specific contract for the service provided."
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

          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-2">
            {t("Términos y Condiciones", "Terms & Conditions")}
          </h1>
          <p className="text-base text-muted-foreground mb-2">
            {t("de Servicio", "of Service")}
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            {t("Última actualización: mayo 2026", "Last updated: May 2026")}
          </p>

          <div className="flex flex-col gap-3">
            {sections.map((s) => (
              <Accordion key={s.title} title={s.title}>
                <p>{s.body}</p>
              </Accordion>
            ))}

            <Accordion title={t("7. Contacto", "7. Contact")}>
              <p>
                {t(
                  "Para consultas sobre estos términos de servicio, contáctanos en ",
                  "For inquiries about these terms of service, contact us at "
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
