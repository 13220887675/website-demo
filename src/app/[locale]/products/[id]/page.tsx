import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProduct, getAllProducts } from '@/lib/content'
import { getServerTranslator } from '@/i18n/server'
import { locales } from '@/i18n/config'
import InquiryForm from '@/components/InquiryForm'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'

const defaultProductImage = '/images/defaults/default-product.jpg'

interface Props {
  params: {
    id: string
    locale: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslator(params.locale as any)
  const product = await getProduct(params.locale, params.id)
  
  if (!product) {
    return {
      title: t('Products.productNotFound'),
    }
  }

  const alternateUrls = locales.reduce((acc, locale) => {
    acc[locale] = `/${locale}/products/${params.id}`
    return acc
  }, {} as Record<string, string>)

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/${params.locale}/products/${params.id}`,
      languages: alternateUrls,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      locale: params.locale,
      alternateLocale: locales.filter(l => l !== params.locale),
      images: [
        {
          url: product.image ? product.image : defaultProductImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  }
}

// Generate all possible product pages for each locale
export async function generateStaticParams() {
  // Get all product IDs
  const products = await getAllProducts('en') // Use 'en' as reference to get all product IDs
  const productIds = products.map(product => product.id)

  // Generate combinations of locales and product IDs
  const params = []
  for (const locale of locales) {
    for (const id of productIds) {
      params.push({ locale, id })
    }
  }

  return params
}

export default async function ProductPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('Products')
  const product = await getProduct(params.locale, params.id)

  if (!product) {
    notFound()
  }

  // 添加结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || defaultProductImage,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative h-[400px] overflow-hidden">
              <Image
                src={product.image ? product.image : defaultProductImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {product.description}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('features')}</h2>
              <ul className="list-disc list-inside mb-8 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">{t('specifications')}</h2>
              <ul className="list-disc list-inside space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-4">{t('inquiryTitle')}</h2>
            <InquiryForm product={product} />
          </div>
        </div>
      </main>
    </>
  )
}
