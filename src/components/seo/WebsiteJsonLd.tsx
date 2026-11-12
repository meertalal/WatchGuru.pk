import { serializeJsonLd } from '../../lib/jsonLd'

/**
 * Schema.org WebSite structured data with SearchAction for site search indexing.
 */
export function WebsiteJsonLd() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://watchgurupk.vercel.app'

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WatchGuru.pk',
    url: origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
