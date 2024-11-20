import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { getAllBlogPosts } from '@/lib/content'
import { locales } from '@/i18n/config'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations('Blog')
  
  // 生成所有语言的替代链接
  const alternateUrls = locales.reduce((acc, locale) => {
    acc[locale] = `/${locale}/blog`
    return acc
  }, {} as Record<string, string>)

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    alternates: {
      canonical: `/${params.locale}/blog`,
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

export default async function BlogPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('Blog')
  const posts = await getAllBlogPosts(params.locale)
  const dateLocale = params.locale === 'zh' ? zhCN : enUS

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{t('pageTitle')}</h1>
      <div className="space-y-8">
        {posts.map(post => (
          <article 
            key={post.slug}
            className="bg-white dark:bg-gray-800 shadow-lg p-6 transition-transform duration-300 hover:scale-[1.02]"
          >
            <Link href={`/${params.locale}/blog/${post.slug}`} className="block group">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {post.title}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{format(new Date(post.date), 'PPP', { locale: dateLocale })}</span>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
              <div className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                {t('readMore')} →
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
