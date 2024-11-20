import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import { formatDate } from '@/utils/date'
import { useTranslations } from 'next-intl'

interface Props {
  post: BlogPost
  locale: string
}

export default function BlogPreview({ post, locale }: Props) {
  const t = useTranslations('Blog')
  const imageUrl = post.image || '/images/defaults/default-blog.jpg'

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform hover:scale-[1.02]">
      <Link href={`/${locale}/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {formatDate(post.date, locale)}
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              {t('readMore')}
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
