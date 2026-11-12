import type { Product } from '../../types'
import { serializeJsonLd } from '../../lib/jsonLd'

/**
 * Schema.org Product/Offer JSON-LD for a product page. Only facts already in
 * the catalogue are emitted — no reviews, ratings or stock claims are invented.
 */
export function ProductJsonLd({ product }: { product: Product }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://warchgurupk.vercel.app'
  const url = `${origin}/products/${product.slug}`

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    sku: product.id.toUpperCase(),
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.collections[0],
    image: product.images.map((image) =>
      image.startsWith('http') ? image : `${origin}${image.startsWith('/') ? '' : '/'}${image}`,
    ),
    itemCondition: 'https://schema.org/NewCondition',
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PKR',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'WatchGuru.pk' },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
