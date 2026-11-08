/**
 * Schema.org Organization structured data for WatchGuru.pk.
 */
export function OrganizationJsonLd() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.watchguru.pk'

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WatchGuru.pk',
    legalName: 'WatchGuru Pakistan',
    url: origin,
    logo: `${origin}/favicon.svg`,
    description:
      "Pakistan's premier boutique for 100% original luxury watches, authorized partner maisons, and insured nationwide delivery.",
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-300-1234567',
        contactType: 'customer support',
        areaServed: 'PK',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    sameAs: [
      'https://www.instagram.com/watchguru.pk',
      'https://www.facebook.com/watchguru.pk',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
