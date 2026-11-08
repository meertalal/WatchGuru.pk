import { useMemo } from 'react'
import { BRANDS } from '../data/collections'
import { useCatalog } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { AboutHero } from '../components/about/AboutHero'
import { AboutIntroduction } from '../components/about/AboutIntroduction'
import { AboutExpertise, type ExpertiseMetric } from '../components/about/AboutExpertise'
import { AboutStatistics, type AboutStat } from '../components/about/AboutStatistics'
import { AboutCTA } from '../components/about/AboutCTA'
import { Container } from '../components/ui/Container'

export function About() {
  const { products } = useCatalog()

  useDocumentMeta({
    title: 'About Us | The WatchGuru Story',
    description:
      'Pakistan’s home for 100% original luxury watches. Hand-picked boutique, authorised maisons, in-house verification and concierge service.',
  })

  const metrics = useMemo<ExpertiseMetric[]>(() => {
    const total = products.length
    const automatic = products.filter((product) =>
      product.movement.toLowerCase().includes('automatic'),
    ).length
    const sapphire = products.filter((product) => product.features.includes('Sapphire Crystal')).length
    const inStock = products.filter((product) => product.inStock).length

    const percentage = (count: number) => (total === 0 ? 0 : Math.round((count / total) * 100))

    return [
      {
        label: 'Watch Craftsmanship',
        value: percentage(automatic),
        note: `${automatic} of ${total} pieces driven by high-precision mechanical and automatic calibres.`,
      },
      {
        label: 'Premium Quality',
        value: percentage(sapphire),
        note: `${sapphire} of ${total} references crafted with double-domed scratch-resistant sapphire crystal.`,
      },
      {
        label: 'Ready to Dispatch',
        value: percentage(inStock),
        note: `${inStock} of ${total} references currently in stock at the boutique.`,
      },
    ]
  }, [products])

  const stats = useMemo<AboutStat[]>(() => {
    const maisons = BRANDS.filter((brand) => !brand.own).length

    return [
      { value: `${products.length}+`, label: 'Original Luxury Watches' },
      { value: String(maisons), label: 'Authorised Partner Maisons' },
      { value: '100%', label: 'Verified & Certified Authentic' },
      { value: '1 Year', label: 'Comprehensive Machine Warranty' },
    ]
  }, [products])

  return (
    <>
      <AboutHero
        title="About Us"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
      />

      <AboutIntroduction
        heading="A boutique built on a single principle."
        copy="WatchGuru.pk was founded by collectors who were tired of two things: paying grey-market prices for uncertain pieces, and never knowing where a watch truly came from. So we built the boutique we always wanted. Every watch is sourced through authorised channels, verified in-house, and backed in writing."
        secondaryCopy="We carry six partner maisons and our own in-house label, WatchGuru Atelier, assembled in Geneva and engraved by hand. We visit the ateliers, we wear the watches, and we only sell references we would pass to our own families."
      />

      <section className="bg-coal py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <AboutExpertise
              copy="A boutique is only as good as what it can prove. These figures describe the catalogue as it stands today. Measured, not marketed."
              metrics={metrics}
            />
            <AboutStatistics
              stats={stats}
              caption="Live figures from the current WatchGuru.pk catalogue."
            />
          </div>
        </Container>
      </section>

      <AboutCTA
        heading="Find the watch you will keep for a lifetime."
        copy="Browse the boutique, or speak with our concierge for a personal recommendation."
        actionLabel="Explore the collection"
        actionTo="/collections/all"
      />
    </>
  )
}
