import { Hero } from '../components/home/Hero'
import { ServiceHighlights } from '../components/home/ServiceHighlights'
import { FeaturedWatches } from '../components/home/FeaturedWatches'
import { PromoBanner } from '../components/home/PromoBanner'
import { NewArrivals } from '../components/home/NewArrivals'
import { CollectionsShowcase } from '../components/home/CollectionsShowcase'
import { BrandStrip } from '../components/home/BrandStrip'
import { EditorialQuote } from '../components/home/EditorialQuote'

export function Home() {
  return (
    <>
      <Hero />
      <ServiceHighlights />
      <FeaturedWatches />
      <PromoBanner />
      <NewArrivals />
      <CollectionsShowcase />
      <BrandStrip />
      <EditorialQuote />
    </>
  )
}
