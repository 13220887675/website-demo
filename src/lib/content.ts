import fs from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { BlogPost } from '@/types/blog'
import { Product } from '@/types/product'

const contentDirectory = path.join(process.cwd(), 'src', 'content')

// 确保目录存在
function ensureDirectoryExists(directory: string) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true })
  }
}

// 缓存内容
let productsCache: Record<string, Product[]> = {}
let blogPostsCache: Record<string, BlogPost[]> = {}

export async function getProduct(locale: string, id: string): Promise<Product | null> {
  try {
    // 先从缓存中查找
    const products = productsCache[locale]
    if (products) {
      const product = products.find(p => p.id === id)
      if (product) return product
    }

    const filePath = path.join(contentDirectory, locale, 'products', `${id}.json`)
    ensureDirectoryExists(path.dirname(filePath))
    const content = await fs.readFile(filePath, 'utf8')
    return {
      id,
      ...JSON.parse(content)
    }
  } catch (error) {
    console.error(`Error loading product ${id} in ${locale}:`, error)
    return null
  }
}

export async function getBlogPost(locale: string, slug: string): Promise<BlogPost | null> {
  try {
    // 先从缓存中查找
    const posts = blogPostsCache[locale]
    if (posts) {
      const post = posts.find(p => p.slug === slug)
      if (post) return post
    }

    const filePath = path.join(contentDirectory, locale, 'blog', `${slug}.json`)
    ensureDirectoryExists(path.dirname(filePath))
    const content = await fs.readFile(filePath, 'utf8')
    return {
      slug,
      ...JSON.parse(content)
    }
  } catch (error) {
    console.error(`Error loading blog post ${slug} in ${locale}:`, error)
    return null
  }
}

export async function getAllProducts(locale: string): Promise<Product[]> {
  try {
    // 检查缓存
    if (productsCache[locale]) {
      return productsCache[locale]
    }

    const productsDirectory = path.join(contentDirectory, locale, 'products')
    ensureDirectoryExists(productsDirectory)
    
    const files = await fs.readdir(productsDirectory)
    const products = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const id = path.basename(file, '.json')
          const content = await fs.readFile(path.join(productsDirectory, file), 'utf8')
          return {
            id,
            ...JSON.parse(content)
          }
        })
    )

    // 更新缓存
    productsCache[locale] = products
    return products
  } catch (error) {
    console.error(`Error loading products in ${locale}:`, error)
    return []
  }
}

export async function getAllBlogPosts(locale: string): Promise<BlogPost[]> {
  try {
    // 检查缓存
    if (blogPostsCache[locale]) {
      return blogPostsCache[locale]
    }

    const blogDirectory = path.join(contentDirectory, locale, 'blog')
    ensureDirectoryExists(blogDirectory)
    
    const files = await fs.readdir(blogDirectory)
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const slug = path.basename(file, '.json')
          const content = await fs.readFile(path.join(blogDirectory, file), 'utf8')
          return {
            slug,
            ...JSON.parse(content)
          }
        })
    )

    // 更新缓存
    blogPostsCache[locale] = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return blogPostsCache[locale]
  } catch (error) {
    console.error(`Error loading blog posts in ${locale}:`, error)
    return []
  }
}

// 清除缓存的函数（在开发环境中使用）
export function clearCache() {
  productsCache = {}
  blogPostsCache = {}
}
