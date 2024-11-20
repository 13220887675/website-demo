/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  // 图片优化配置
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600, // 增加到1小时
  },

  // 优化构建输出
  compress: true,
  poweredByHeader: false,
  
  // 静态页面优化
  generateBuildId: async () => {
    // 使用时间戳作为构建ID，方便版本控制
    return `build-${Date.now()}`
  },
}

// 应用next-intl配置
module.exports = withNextIntl({
  // Base path for the application
  basePath: '',
  
  // 配置next-intl
  ...nextConfig
});
