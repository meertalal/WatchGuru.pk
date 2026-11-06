import type { Product } from '../types'

/**
 * Pure catalogue queries — no React, no storage, no globals.
 * Everything operates on an explicit product list so the same logic works
 * against the seed, the live catalog context and tests.
 */

export interface PriceBounds {
  min: number
  max: number
}

export function priceBounds(source: Product[]): PriceBounds {
  if (source.length === 0) return { min: 0, max: 0 }
  let min = Number.POSITIVE_INFINITY
  let max = 0
  for (const product of source) {
    if (product.price < min) min = product.price
    if (product.price > max) max = product.price
  }
  return { min, max }
}

/** Highest-rated pieces — the "Premium Collection" edit. */
export function selectPremium(source: Product[], limit = 12): Product[] {
  return [...source]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit)
}

export function selectNewArrivals(source: Product[], limit = 12): Product[] {
  return [...source]
    .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
    .slice(0, limit)
}

/** Pieces currently discounted, ordered by depth of discount. */
export function selectSale(source: Product[], limit = 12): Product[] {
  return source
    .filter(isDiscounted)
    .sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0))
    .slice(0, limit)
}

export function isDiscounted(product: Product): boolean {
  return Boolean(product.compareAtPrice && product.compareAtPrice > product.price)
}

/** Whole-percent discount, or null when the product is full price. */
export function discountPercent(product: Product): number | null {
  if (!isDiscounted(product)) return null
  return Math.round((1 - product.price / (product.compareAtPrice as number)) * 100)
}

export function relatedProducts(
  source: Product[],
  product: Product,
  limit = 4,
): Product[] {
  return source
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      let score = 0
      if (candidate.brand === product.brand) score += 2
      score += candidate.collections.filter((c) => product.collections.includes(c)).length
      if (candidate.category === product.category) score += 1
      return { candidate, score }
    })
    .sort((a, b) => b.score - a.score || b.candidate.rating - a.candidate.rating)
    .slice(0, limit)
    .map((entry) => entry.candidate)
}

/**
 * Tokenised, case-insensitive search across the fields a shopper actually
 * remembers: name, brand, collection, movement, materials…
 */
export function searchCatalog(source: Product[], query: string): Product[] {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
  if (tokens.length === 0) return []

  return source.filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.slug,
      product.movement,
      product.caseMaterial,
      product.caseSize,
      product.dialColor,
      product.strapType,
      product.category,
      product.id,
      ...product.collections,
      ...product.features,
      ...product.specs.map((spec) => `${spec.label} ${spec.value}`),
      ...product.highlights,
    ]
      .join(' ')
      .toLowerCase()
    return tokens.every((token) => haystack.includes(token))
  })
}
