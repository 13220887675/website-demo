'use client'

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface Props {
  locale: string
}

export default function LanguageSwitcher({ locale }: Props) {
  const t = useTranslations('LanguageSwitcher')
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return (
    <div className="relative inline-block text-left">
      <label htmlFor="language-select" className="sr-only">
        {t('selectLanguage')}
      </label>
      <select
        id="language-select"
        name="language"
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        aria-label={t('selectLanguage')}
      >
        <option value="en" lang="en">English</option>
        <option value="zh" lang="zh">中文</option>
      </select>
    </div>
  )
}
