'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'

function BreadcrumbSkeleton() {
  return (
    <nav aria-label="Breadcrumb" className="py-2 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    </nav>
  )
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const t = useTranslations('Navigation')
  
  if (!pathname) {
    console.warn('No pathname available')
    return <BreadcrumbSkeleton />
  }

  // 移除语言前缀并分割路径
  const pathSegments = pathname
    .split('/')
    .filter(segment => segment && !['en', 'zh'].includes(segment))

  // 获取当前语言
  const locale = pathname.split('/')[1] || 'en'

  // 如果是首页，不显示面包屑
  if (pathname === `/${locale}` || pathSegments.length === 0) {
    return null
  }

  // 获取路径段的显示名称
  const getSegmentTitle = (segment: string) => {
    // 常见路径的直接映射
    const commonPaths: Record<string, string> = {
      'blog': 'blog',
      'products': 'products',
      'about': 'about',
      'contact': 'contact',
      'faq': 'faq'
    }

    if (commonPaths[segment]) {
      return t(commonPaths[segment])
    }

    // 对于其他路径，将 kebab-case 转换为可读格式
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <nav aria-label="breadcrumb" className="container mx-auto px-4 py-2">
      <div className="flex items-center space-x-2">
        <Link
          href={`/${locale}`}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">{t('home')}</span>
        </Link>

        {pathSegments.map((segment, index) => {
          const path = `/${locale}/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1
          const title = getSegmentTitle(segment)

          return (
            <span key={path} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {isLast ? (
                <span className="ml-2 text-gray-800" aria-current="page">
                  {title}
                </span>
              ) : (
                <Link
                  href={path}
                  className="ml-2 text-gray-600 hover:text-primary transition-colors"
                >
                  {title}
                </Link>
              )}
            </span>
          )
        })}
      </div>
    </nav>
  )
}
