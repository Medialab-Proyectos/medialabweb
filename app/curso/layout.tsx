import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Metodología IA — Aprende a construir con criterio',
  description:
    'Curso premium de MediaLab: aprende a construir productos impulsados por IA sin perder tu criterio humano. Para diseñadores, UX/UI, developers y startups. Metodología 90-10.',
  keywords: [
    'curso IA para diseñadores', 'metodología IA MediaLab', 'UX con inteligencia artificial',
    'diseño con IA', 'IA para UX/UI', 'curso premium IA', 'pensamiento estratégico IA',
    'IA y diseño humano', 'frameworks IA', 'producto digital con IA',
  ],
  openGraph: {
    title: 'Metodología IA — La IA genera opciones. Tú aprenderás a darles sentido.',
    description:
      'Curso premium de MediaLab para diseñadores, UX/UI, developers y startups que quieren dominar la IA sin perder el criterio humano.',
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metodología IA — MediaLab',
    description: 'Aprende a construir productos con IA sin perder tu criterio humano.',
  },
}

export default function CursoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
