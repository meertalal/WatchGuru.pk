import { useMemo } from 'react'
import { OWN_BRAND } from '../data/products'
import { selectPremium } from '../lib/catalog'
import { useCatalog } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Hero } from '../components/home/Hero'
import { BrandStory } from '../components/home/BrandStory'
import { ServiceHighlights } from '../components/home/ServiceHighlights'
import { ProductRail } from '../components/home/ProductRail'
import { ShopByBrand } from '../components/home/ShopByBrand'
import { PromoBanner } from '../components/home/PromoBanner'
import { CollectionsShowcase } from '../components/home/CollectionsShowcase'
import { BenefitsGrid } from '../components/home/BenefitsGrid'
import { AdvanceExplainer } from '../components/home/AdvanceExplainer'
import { Testimonials } from '../components/home/Testimonials'
import { NewsletterBand } from '../components/home/NewsletterBand'
import { EditorialQuote } from '../components/home/EditorialQuote'

export function Home() {
  const { products } = useCatalog()

  useDocumentMeta({
    title: 'Buy 100% Original Luxury Watches Online in Pakistan',
    description:
      'WatchGuru.pk — Pakistan’s home for 100% original luxury watches. Authorised maisons, insured nationwide delivery, Cash on Delivery, 1-year machine warranty.',
  })

  const premium = useMemo(() => selectPremium(products, 12), [products])
  const fashion = useMemo(
    () => products.filter((p) => p.collections.includes('Fashion')),
    [products],
  )
  const executive = useMemo(
    () => products.filter((p) => p.collections.includes('Executive')),
    [products],
  )
  const ownBrand = useMemo(() => products.filter((p) => p.brand === OWN_BRAND), [products])

  return (
    <>
      <Hero />
      <BrandStory />
      <ServiceHighlights />

      <ProductRail
        eyebrow="The Icons"
        title="Premium Collection"
        description="Our most coveted references — hand-selected for finish, movement and rarity."
        products={premium}
        viewAllTo="/collections/all?sort=rating"
      />

      <ShopByBrand />

      <ProductRail
        eyebrow="The Fashion Edit"
        title="Fashion Collection"
        description="Statement pieces for the bold — jewellery-grade glamour from the world’s fashion ateliers."
        products={fashion}
        viewAllTo="/collections/fashion"
      />

      <PromoBanner />

      <ProductRail
        eyebrow="For the Connoisseur"
        title="Executive Watches"
        description="Specially imported for clients who demand the extraordinary — perpetuals, tourbillons and numbered editions."
        products={executive}
        viewAllTo="/collections/executive"
      />

      <ProductRail
        eyebrow="Est. 2026 · Geneva"
        title="Our Own Brand — WatchGuru Atelier"
        description="The WatchGuru Atelier — in-house movements, hand-finished cases and a five-year atelier warranty."
        products={ownBrand}
        viewAllTo="/collections/brand/watchguru-atelier"
        viewAllLabel="Discover the Atelier"
      />

      <CollectionsShowcase />
      <BenefitsGrid />
      <AdvanceExplainer />
      <Testimonials />
      <NewsletterBand />
      <EditorialQuote />
    </>
  )
}
