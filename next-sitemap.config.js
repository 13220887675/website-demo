/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  generateRobotsTxt: false, // 因为我们使用了 app/robots.ts
  generateIndexSitemap: false,
  alternateRefs: [
    {
      href: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en`,
      hreflang: 'en',
    },
    {
      href: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/zh`,
      hreflang: 'zh',
    },
  ],
  // 配置需要排除的路径
  exclude: ['/404'],
}
