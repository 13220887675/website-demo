import { Locale } from './config'

const messages: Record<Locale, any> = {
  en: () => import('../messages/en.json').then((module) => module.default),
  zh: () => import('../messages/zh.json').then((module) => module.default),
}

export async function getMessages(locale: Locale) {
  try {
    return await messages[locale]()
  } catch (error) {
    console.error(`Error loading messages for ${locale}:`, error)
    return {}
  }
}
