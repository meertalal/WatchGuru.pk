import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRICE_BOUNDS } from '../data/products'
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  type ShopFilters,
  type SortValue,
} from '../lib/shop'
import type { PriceBounds } from '../lib/catalog'

export type ArrayFilterKey = 'brand' | 'collection' | 'dial' | 'strap' | 'feature'

/**
 * Keeps every shop control in the URL, so filters, sorting and pagination are
 * shareable and survive the browser's back button.
 *
 * Price bounds default to the factory catalogue but accept the live bounds
 * from the catalog context so admin edits are reflected immediately.
 */
export function useShopFilters(bounds: PriceBounds = PRICE_BOUNDS) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<ShopFilters>(() => {
    const get = (key: string) => searchParams.get(key)
    const getAll = (key: string) => searchParams.getAll(key)
    const num = (key: string, fallback: number) => {
      const raw = get(key)
      if (raw === null || raw === '') return fallback
      const parsed = Number(raw)
      return Number.isFinite(parsed) ? parsed : fallback
    }

    const sortRaw = get('sort')
    const sort: SortValue = SORT_OPTIONS.some((o) => o.value === sortRaw)
      ? (sortRaw as SortValue)
      : 'featured'

    return {
      category: get('category'),
      brands: getAll('brand'),
      collections: getAll('collection'),
      dials: getAll('dial'),
      straps: getAll('strap'),
      features: getAll('feature'),
      min: num('min', bounds.min),
      max: num('max', bounds.max),
      tag: get('tag'),
      sort,
      page: Math.max(1, num('page', 1)),
    }
  }, [searchParams, bounds.min, bounds.max])

  const mutate = useCallback(
    (apply: (params: URLSearchParams) => void, resetPage = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          apply(next)
          if (resetPage) next.delete('page')
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const toggleArray = useCallback(
    (key: ArrayFilterKey, value: string) =>
      mutate((p) => {
        const current = p.getAll(key)
        p.delete(key)
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
        next.forEach((v) => p.append(key, v))
      }),
    [mutate],
  )

  const setSingle = useCallback(
    (key: string, value: string | null) =>
      mutate((p) => (value ? p.set(key, value) : p.delete(key))),
    [mutate],
  )

  const setPriceRange = useCallback(
    (min: number, max: number) =>
      mutate((p) => {
        if (min <= bounds.min) p.delete('min')
        else p.set('min', String(min))
        if (max >= bounds.max) p.delete('max')
        else p.set('max', String(max))
      }),
    [mutate, bounds.min, bounds.max],
  )

  const setSort = useCallback(
    (value: SortValue) => mutate((p) => (value === 'featured' ? p.delete('sort') : p.set('sort', value))),
    [mutate],
  )

  const setPage = useCallback(
    (page: number) => mutate((p) => (page <= 1 ? p.delete('page') : p.set('page', String(page))), false),
    [mutate],
  )

  const clearAll = useCallback(
    () => setSearchParams(new URLSearchParams(), { replace: false }),
    [setSearchParams],
  )

  return {
    filters,
    toggleArray,
    setSingle,
    setPriceRange,
    setSort,
    setPage,
    clearAll,
    defaults: { ...DEFAULT_FILTERS, min: bounds.min, max: bounds.max },
  }
}
