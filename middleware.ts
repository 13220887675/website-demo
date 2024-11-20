import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales } from './src/i18n/config'

// Create the internal middleware
const internal = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
})

export default async function middleware(request: NextRequest) {
  const response = await internal(request)

  // 如果没有响应，返回原始响应
  if (!response) {
    return response
  }

  // 获取当前路径
  const pathname = request.nextUrl.pathname
  console.log('Middleware pathname:', pathname)

  // 克隆响应并添加自定义头
  const headers = new Headers(response.headers)
  headers.set('x-pathname', pathname)

  return NextResponse.json(
    { body: response.body },
    {
      headers,
      status: response.status,
      statusText: response.statusText
    }
  )
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|en)/:path*']
}
