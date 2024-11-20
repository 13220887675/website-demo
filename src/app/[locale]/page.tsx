import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { getAllProducts, getAllBlogPosts } from '@/lib/content'
import ProductHighlight from '@/components/ProductHighlight'
import BlogPreview from '@/components/BlogPreview'
import InquiryForm from '@/components/InquiryForm'
import FAQ from '@/components/FAQ'
import Link from 'next/link'

// 增加重验证时间到12小时，因为内容不经常更新
export const revalidate = 43200 // 12小时重新验证一次

interface Props {
  params: {
    locale: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  setRequestLocale(params.locale)
  const t = await getTranslations('Metadata')
  
  const alternateUrls = locales.reduce((acc, locale) => {
    acc[locale] = `/${locale}`
    return acc
  }, {} as Record<string, string>)

  return {
    title: t('defaultTitle'),
    description: t('description'),
    alternates: {
      canonical: `/${params.locale}`,
      languages: alternateUrls,
    },
    openGraph: {
      title: t('defaultTitle'),
      description: t('description'),
      type: 'website',
      locale: params.locale,
      alternateLocale: locales.filter(l => l !== params.locale),
    },
  }
}

// 预渲染所有语言版本
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('Home')
  const products = await getAllProducts(params.locale)
  const posts = await getAllBlogPosts(params.locale)

  // 只展示前3个产品和文章
  const featuredProducts = products.slice(0, 3)
  const recentPosts = posts.slice(0, 3)

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('subtitle')}</p>
          <button className="bg-white text-blue-600 px-6 py-2 hover:bg-blue-50 transition-colors">
            {t('cta')}
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('featuredProducts')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t('featuredProductsDescription')}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductHighlight key={product.id} product={product} locale={params.locale} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/${params.locale}/products`} className="text-blue-600 hover:text-blue-800">
              {t('featuredProductsViewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('latestBlog')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t('latestBlogDescription')}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogPreview key={post.slug} post={post} locale={params.locale} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/${params.locale}/blog`} className="text-blue-600 hover:text-blue-800">
              {t('latestBlogViewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('faq')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t('faqDescription')}</p>
          <FAQ />
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('contact')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t('contactDescription')}</p>
          <InquiryForm />
        </div>
      </section>
    </main>
  )
}
