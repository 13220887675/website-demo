"use client"

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

// 动态导入非关键组件
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), {
  loading: () => <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />,
  ssr: false
})

const ThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), {
  loading: () => <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />,
  ssr: false
})

// 导航链接配置
const navLinks = [
  { href: '/', label: 'home' },
  { href: '/products', label: 'products' },
  { href: '/blog', label: 'blog' },
  { href: '/#faq', label: 'faq' }
] as const

export default function Navigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const getLocalizedHref = (href: string) => {
    return href === '/' ? `/${locale}` : `/${locale}${href}`
  }

  const t = useTranslations('Navigation')

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={getLocalizedHref('/')} className="text-xl font-bold text-primary dark:text-primary-light">
            {t('logo')}
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={getLocalizedHref(href)}
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {t(label)}
              </Link>
            ))}
          </div>

          {/* 功能按钮区 */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Suspense fallback={<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />}>
                <ThemeSwitcher />
              </Suspense>
            </div>
            <div className="hidden md:block">
              <Suspense fallback={<div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />}>
                <LanguageSwitcher locale={locale} />
              </Suspense>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={toggleDrawer}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-menu"
              aria-label={t('toggleMenu')}
            >
              <span className="sr-only">{isDrawerOpen ? t('closeMenu') : t('openMenu')}</span>
              {isDrawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端抽屉菜单 */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 遮罩层按钮 */}
          <button 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsDrawerOpen(false)}
            aria-label={t('closeMenu')}
          />
          <div 
            id="mobile-menu"
            className="fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t('mobileMenu')}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={t('closeMenu')}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="mt-12">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={getLocalizedHref(href)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {t(label)}
                </Link>
              ))}
              <div className="px-4 py-2">
                <Suspense fallback={<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />}>
                  <ThemeSwitcher />
                </Suspense>
              </div>
              <div className="px-4 py-2">
                <Suspense fallback={<div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />}>
                  <LanguageSwitcher locale={locale} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
