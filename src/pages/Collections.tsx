import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BRANDS, COLLECTION_DEFS, OWN_BRAND } from '../data/collections'
import { selectPremium } from '../lib/catalog'
import { useCatalog } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CollectionSection } from '../components/collection/CollectionSection'
import { FeaturedCollectionCard } from '../components/collection/FeaturedCollectionCard'
import type { Product } from '../types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'

const COLLECTION_IMAGES: Record<string, string> = {
  all: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
  men: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
  women: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1000&q=80',
  executive: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
  original: 'https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=1000&q=80',
  fashion: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=1000&q=80',
  'watchguru-atelier': 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1000&q=80',
}

const hasTag = (tag: Product['collections'][number]) => (product: Product) =>
  product.collections.includes(tag)

/**
 * The Collections index: curated edits (premium, fashion, executive and our
 * own Atelier) above a grid of every browsable collection. All products come
 * from the live catalogue, so admin changes flow through automatically.
 */
export function Collections() {
  const { products } = useCatalog()

  useDocumentMeta({
    title: 'Watch Collections: Premium, Fashion & Executive',
    description:
      'Browse every WatchGuru.pk collection: premium pieces, the fashion edit, executive watches and our own WatchGuru Atelier.',
  })

  const premium = useMemo(() => selectPremium(products, 8), [products])
  const fashion = useMemo(() => products.filter(hasTag('Fashion')).slice(0, 8), [products])
  const executive = useMemo(() => products.filter(hasTag('Executive')).slice(0, 8), [products])
  const atelier = useMemo(
    () => products.filter((product) => product.brand === OWN_BRAND).slice(0, 8),
    [products],
  )

  const tiles = useMemo(() => {
    const defs = COLLECTION_DEFS.filter((def) => def.slug !== 'all').map((def) => {
      const matches = products.filter(def.match)
      return {
        to: `/collections/${def.slug}`,
        title: def.title,
        eyebrow: def.eyebrow,
        count: matches.length,
        image: COLLECTION_IMAGES[def.slug] ?? matches[0]?.images[0] ?? FALLBACK_IMAGE,
      }
    })

    const ownBrand = BRANDS.find((brand) => brand.own)
    if (ownBrand) {
      const matches = products.filter((product) => product.brand === ownBrand.name)
      defs.push({
        to: `/collections/brand/${ownBrand.slug}`,
        title: ownBrand.name,
        eyebrow: 'Our Own Brand',
        count: matches.length,
        image: COLLECTION_IMAGES[ownBrand.slug] ?? matches[0]?.images[0] ?? FALLBACK_IMAGE,
      })
    }

    return defs
  }, [products])

  return (
    <>
      <PageBanner
        eyebrow="The Boutique"
        title="Collections"
        description="Four curated edits and every maison we carry. Each piece is authenticated, prepared and insured before it reaches you."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]}
      />

      <CollectionSection
        id="premium"
        eyebrow="The finest pieces"
        title="Premium Collection"
        description="The most valuable references in the boutique: grand complications, high jewellery and our finest case and dial work."
        products={premium}
      />

      <CollectionSection
        id="fashion"
        eyebrow="The Fashion Edit"
        title="Fashion Collection"
        description="Statement dials and contemporary silhouettes from Parisian and Milanese ateliers."
        products={fashion}
        accent
      />

      <CollectionSection
        id="executive"
        eyebrow="The Executive Edit"
        title="Executive Watches"
        description="Formal, quietly confident pieces for the boardroom: perpetual calendars, slim dress watches and numbered editions."
        products={executive}
      />

      <CollectionSection
        id="atelier"
        eyebrow="Our Own Brand"
        title="WatchGuru Atelier"
        description="Assembled in Geneva, engraved by hand and covered by the same one-year machine warranty as every piece. Our own maison, made for this boutique."
        products={atelier}
        accent
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Shop by collection"
              title="Collections"
              description="Every edit in one place, from the dive watch you wear daily to the dress piece you keep for good."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {tiles.map((tile, index) => (
              <Reveal key={tile.to} delay={index * 60}>
                <FeaturedCollectionCard
                  to={tile.to}
                  title={tile.title}
                  eyebrow={tile.eyebrow}
                  count={tile.count}
                  image={tile.image}
                  eager={index < 3}
                />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex justify-center">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 border border-line px-8 py-3.5 font-akkurat text-[9.5px] font-medium tracking-[0.22em] text-ivory uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              Browse all watches
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
