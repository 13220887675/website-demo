import { notFound } from 'next/navigation'

export async function getMessages(locale: string) {
  try {
    const messages = (await import(`../messages/${locale}.json`)).default
    return messages
  } catch (error) {
    notFound()
  }
}
