import type { Metadata } from 'next'
import { Lato, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'MediaLab Ingeniería — Agencia de UX, IA y Diseño Conductual',
  description:
    'MediaLab Ingeniería es una agencia de diseño UX, inteligencia artificial y diseño conductual que ayuda a empresas a crear productos digitales de alto impacto mediante diseño centrado en el humano y tecnología inteligente.',
  generator: 'v0.app',
  keywords: ['diseño UX', 'diseño de productos con IA', 'diseño conductual', 'productos digitales', 'UXBox', 'product discovery'],
  openGraph: {
    title: 'MediaLab Ingeniería — Agencia de UX, IA y Diseño Conductual',
    description:
      'MediaLab Ingeniería es una agencia de diseño UX, inteligencia artificial y diseño conductual que ayuda a empresas a crear productos digitales de alto impacto mediante diseño centrado en el humano y tecnología inteligente.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MediaLab Ingeniería',
              description:
                'Agencia de diseño UX, IA y diseño conductual especializada en crear productos digitales de alto impacto.',
              url: 'https://medialabingenieria.com',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={`${lato.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
