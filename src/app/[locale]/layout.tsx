import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getMessages } from '@/lib/get-messages'
import { Suspense } from 'react'
import { headers } from 'next/headers'

import { locales } from '@/i18n/config'
import Navigation from '@/components/Navigation'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import '@/styles/globals.css'
import '@/styles/critical.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif',
  ],
})

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }]
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations('Layout')
  const headersList = headers()
  const host = headersList.get('host') || process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${t('siteName')}`,
      default: t('siteName'),
    },
    description: t('siteDescription'),
    alternates: {
      canonical: `${baseUrl}/${params.locale}`,
      languages: {
        'en': '/en',
        'zh': '/zh',
      },
    },
  }
}

type RootLayoutProps = {
  children: React.ReactNode
  params: { locale: (typeof locales)[number] }
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  setRequestLocale(locale);

  if (!locales.includes(locale)) notFound()

  let messages
  try {
    messages = await getMessages(locale)
  } catch (error) {
    console.error('Error loading messages:', error)
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <Suspense fallback={null}>
              <Breadcrumb />
            </Suspense>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
