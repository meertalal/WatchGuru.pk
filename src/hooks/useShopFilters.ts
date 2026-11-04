import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRICE_BOUNDS } from '../data/products'
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  type ShopFilters,
  type SortValue,
} from '../lib/shop'

export type ArrayFilterKey = 'brand' | 'collection' | 'dial' | 'strap' | 'feature'

/**
 * Keeps every shop control in the URL, so filters, sorting and pagination are
 * shareable and survive the browser's back button.
 */
export function useShopFilters() {
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
      min: num('min', PRICE_BOUNDS.min),
      max: num('max', PRICE_BOUNDS.max),
      tag: get('tag'),
      sort,
      page: Math.max(1, num('page', 1)),
    }
  }, [searchParams])

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
        if (min <= PRICE_BOUNDS.min) p.delete('min')
        else p.set('min', String(min))
        if (max >= PRICE_BOUNDS.max) p.delete('max')
        else p.set('max', String(max))
      }),
    [mutate],
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
    defaults: DEFAULT_FILTERS,
  }
}
