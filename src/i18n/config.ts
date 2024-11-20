export const locales = ['en', 'zh'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export function getLocaleFromPathname(pathname: string): Locale {
  const locale = pathname.split('/')[1] as Locale
  return locales.includes(locale) ? locale : defaultLocale
}

export function removeLocaleFromPathname(pathname: string): string {
  const parts = pathname.split('/')
  if (locales.includes(parts[1] as Locale)) {
    parts.splice(1, 1)
  }
  return parts.join('/')
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPathname(pathname)
  return `/${locale}${cleanPath}`
}
