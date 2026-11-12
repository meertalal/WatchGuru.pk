import { serializeJsonLd } from '../../lib/jsonLd'

interface BreadcrumbItem {
  label: string
  to?: string
}

/**
 * Schema.org BreadcrumbList structured data for rich breadcrumbs in search results.
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://warchgurupk.vercel.app'

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.to ? (item.to.startsWith('http') ? item.to : `${origin}${item.to}`) : undefined,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
