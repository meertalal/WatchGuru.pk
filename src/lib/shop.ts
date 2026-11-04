import { PRICE_BOUNDS } from '../data/products'
import type { Product } from '../types'

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export const PAGE_SIZE = 9

export interface ShopFilters {
  category: string | null
  brands: string[]
  collections: string[]
  dials: string[]
  straps: string[]
  features: string[]
  min: number
  max: number
  tag: string | null
  sort: SortValue
  page: number
}

export const DEFAULT_FILTERS: ShopFilters = {
  category: null,
  brands: [],
  collections: [],
  dials: [],
  straps: [],
  features: [],
  min: PRICE_BOUNDS.min,
  max: PRICE_BOUNDS.max,
  tag: null,
  sort: 'featured',
  page: 1,
}

export function filterProducts(source: Product[], filters: ShopFilters): Product[] {
  return source.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.brands.length && !filters.brands.includes(product.brand)) return false
    if (
      filters.collections.length &&
      !product.collections.some((c) => filters.collections.includes(c))
    )
      return false
    if (filters.dials.length && !filters.dials.includes(product.dialColor)) return false
    if (filters.straps.length && !filters.straps.includes(product.strapType)) return false
    if (filters.features.length && !product.features.some((f) => filters.features.includes(f)))
      return false
    if (product.price < filters.min || product.price > filters.max) return false

    if (filters.tag === 'new' && product.badge !== 'new') return false
    if (
      filters.tag === 'sale' &&
      !(product.badge === 'sale' || (product.compareAtPrice && product.compareAtPrice > product.price))
    )
      return false

    return true
  })
}

export function sortProducts(source: Product[], sort: SortValue): Product[] {
  const list = [...source]
  switch (sort) {
    case 'newest':
      return list.sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'featured':
    default:
      return list.sort(
        (a, b) =>
          Number(Boolean(b.badge)) - Number(Boolean(a.badge)) ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount,
      )
  }
}

export function countActiveFilters(filters: ShopFilters): number {
  return (
    filters.brands.length +
    filters.collections.length +
    filters.dials.length +
    filters.straps.length +
    filters.features.length +
    (filters.category ? 1 : 0) +
    (filters.tag ? 1 : 0) +
    (filters.min !== DEFAULT_FILTERS.min || filters.max !== DEFAULT_FILTERS.max ? 1 : 0)
  )
}
