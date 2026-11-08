import { BRANDS, OWN_BRAND, type BrandInfo } from './products'
import type { Product } from '../types'

/**
 * The collection registry — one config entry per browsable collection, so a
 * new collection is data, not a new page (open/closed principle).
 *
 * Individual brand collections are generated on demand via `brandCollection`.
 */

export interface CollectionDef {
  /** URL segment under /collections. */
  slug: string
  title: string
  eyebrow: string
  description: string
  /** Which products belong to this collection. */
  match: (product: Product) => boolean
}

const hasTag = (tag: string) => (product: Product) =>
  product.collections.includes(tag as Product['collections'][number])

export const COLLECTION_DEFS: readonly CollectionDef[] = [
  {
    slug: 'all',
    title: 'All Watches',
    eyebrow: 'The Boutique',
    description:
      'Every watch in the WatchGuru.pk boutique, authenticated, serviced and prepared by hand before dispatch.',
    match: () => true,
  },
  {
    slug: 'men',
    title: 'Men’s Watches',
    eyebrow: 'Gentlemen',
    description:
      'Dress pieces, tool watches and grand complications, built for the boardroom, the runway and everywhere in between.',
    match: (product) => product.category === 'men',
  },
  {
    slug: 'women',
    title: 'Women’s Watches',
    eyebrow: 'Hers',
    description:
      'High jewellery and quiet dials, pieces designed to be kept, worn and passed on.',
    match: (product) => product.category === 'women',
  },
  {
    slug: 'executive',
    title: 'Executive Watches',
    eyebrow: 'The Executive Edit',
    description:
      'Specially imported for clients who want the extraordinary: perpetual calendars, tourbillons and numbered editions.',
    match: hasTag('Executive'),
  },
  {
    slug: 'original',
    title: 'Original Watches',
    eyebrow: '100% Authentic',
    description:
      'Only 100% original watches from our authorised partner maisons, each piece verified, warrantied and sealed.',
    match: (product) => product.brand !== OWN_BRAND,
  },
  {
    slug: 'fashion',
    title: 'Fashion Collection',
    eyebrow: 'The Fashion Edit',
    description:
      'Statement pieces from Parisian and Milanese ateliers, where design leads and horology follows.',
    match: hasTag('Fashion'),
  },
] as const

export function getCollectionBySlug(slug: string | undefined): CollectionDef | undefined {
  if (!slug) return undefined
  return COLLECTION_DEFS.find((def) => def.slug === slug)
}

export function brandCollection(brand: BrandInfo): CollectionDef {
  return {
    slug: `brand/${brand.slug}`,
    title: brand.name,
    eyebrow: brand.own ? 'Our Own Brand' : `The ${brand.name} Maison`,
    description: brand.blurb,
    match: (product) => product.brand === brand.name,
  }
}

export function getBrandCollection(slug: string | undefined): CollectionDef | undefined {
  if (!slug) return undefined
  const brand = BRANDS.find((entry) => entry.slug === slug)
  return brand ? brandCollection(brand) : undefined
}

export { BRANDS, OWN_BRAND }
