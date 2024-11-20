import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getAllProducts } from '@/lib/content'
import { locales } from '@/i18n/config'

const defaultProductImage = '/images/defaults/default-product.jpg'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations('Products')
  
  const alternateUrls = locales.reduce((acc, locale) => {
    acc[locale] = `/${locale}/products`
    return acc
  }, {} as Record<string, string>)

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    alternates: {
      canonical: `/${params.locale}/products`,
      languages: alternateUrls,
    },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'website',
      locale: params.locale,
      alternateLocale: locales.filter(l => l !== params.locale),
    },
  }
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' },
  ]
}

interface Props {
  params: {
    locale: string
  }
}

export default async function ProductsPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('Products')
  const products = await getAllProducts(params.locale)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{t('pageTitle')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/${params.locale}/products/${product.id}`}
            className="group bg-white dark:bg-gray-800 p-6 rounded shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-64 mb-4 overflow-hidden">
              <Image
                src={product.image || defaultProductImage}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
              />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {product.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
