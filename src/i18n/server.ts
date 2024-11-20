import { createTranslator } from 'next-intl'
import { getMessages } from './messages'
import { Locale } from './config'
import { setRequestLocale } from 'next-intl/server'

export async function getServerTranslator(locale: Locale) {
  setRequestLocale(locale)
  const messages = await getMessages(locale)
  return {
    t: createTranslator({ locale, messages }),
    messages,
  }
}
