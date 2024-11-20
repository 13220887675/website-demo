import { createTranslator } from 'next-intl'
import { getMessages } from './messages'
import { Locale } from './config'

export async function getClientTranslator(locale: Locale) {
  const messages = await getMessages(locale)
  return {
    t: createTranslator({ locale, messages }),
    messages,
  }
}
