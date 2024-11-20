import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'

interface Props {
  product: Product
  locale: string
}

const translations = {
  en: {
    learnMore: 'Learn More',
  },
  zh: {
    learnMore: '了解更多',
  },
}

export default function ProductHighlight({ product, locale }: Props) {
  const t = translations[locale as keyof typeof translations]
  const imageUrl = product.image || '/images/defaults/default-product.jpg'

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
        <Link
          href={`/${locale}/products/${product.id}`}
          className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <span>{t.learnMore}</span>
          <span className="sr-only"> - {product.name}</span>
        </Link>
      </div>
    </div>
  )
}
