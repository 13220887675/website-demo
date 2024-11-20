export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)
  
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
