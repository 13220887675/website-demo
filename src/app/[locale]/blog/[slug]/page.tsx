import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'
import { getBlogPost, getAllBlogPosts } from '@/lib/content'
import { getServerTranslator } from '@/i18n/server'
import { locales } from '@/i18n/config'

interface Props {
  params: {
    slug: string
    locale: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslator(params.locale as any)
  const post = await getBlogPost(params.locale, params.slug)
  
  if (!post) {
    return {
      title: t('Blog.postNotFound'),
    }
  }

  // 生成所有语言的替代链接
  const alternateUrls = locales.reduce((acc, locale) => {
    acc[locale] = `/${locale}/blog/${params.slug}`
    return acc
  }, {} as Record<string, string>)

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${params.locale}/blog/${params.slug}`,
      languages: alternateUrls,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      locale: params.locale,
      alternateLocale: locales.filter(l => l !== params.locale),
      images: [
        {
          url: post.image || '/images/defaults/default-blog.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

// Generate all possible blog post pages for each locale
export async function generateStaticParams() {
  // Get all blog post slugs
  const posts = await getAllBlogPosts('en') // Use 'en' as reference to get all slugs
  const slugs = posts.map(post => post.slug)

  // Generate combinations of locales and slugs
  const params = []
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }

  return params
}

export default async function BlogPostPage({ params }: Props) {
  const { t } = await getServerTranslator(params.locale as any)
  const post = await getBlogPost(params.locale, params.slug)
  const dateLocale = params.locale === 'zh' ? zhCN : enUS

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen py-16">
      <article className="container mx-auto px-4 max-w-4xl">
        {post.image && (
          <div className="relative h-[400px] overflow-hidden mb-8">
            <Image
              src={post.image || '/images/defaults/default-blog.jpg'}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-4">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'PPP', { locale: dateLocale })}
            </time>
            <span>•</span>
            <span>{post.author}</span>
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          {post.content}
        </div>

        <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </main>
  )
}
