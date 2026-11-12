import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import { productRepository, type ProductRepository } from '../data/repositories/productRepository'
import { errorMessage } from '../lib/api'
import { priceBounds, searchCatalog, type PriceBounds } from '../lib/catalog'
import { slugify } from '../lib/format'

/**
 * Live catalogue: the single source of truth for products on screen.
 *
 * Loads the catalogue from the WatchGuru.pk API on mount. Admins mutate it
 * through this context; storefront pages read from it, so edits are visible
 * everywhere without a reload.
 */
export interface CatalogContextValue {
  products: Product[]
  bounds: PriceBounds
  loading: boolean
  error: string | null
  getById: (id: string) => Product | undefined
  getBySlug: (slug: string) => Product | undefined
  search: (query: string) => Product[]
  /** Insert (isNew) or update a product. Resolves with the stored entity. */
  saveProduct: (product: Product, isNew?: boolean) => Promise<Product>
  removeProduct: (id: string) => Promise<void>
  /** Restore the seeded catalogue (admin escape hatch). */
  resetCatalogue: () => Promise<void>
  /** Re-fetch the catalogue from the API. */
  refresh: () => Promise<void>
  /** Build a collision-free slug for a new product. */
  suggestSlug: (name: string) => string
}

export const CatalogContext = createContext<CatalogContextValue | null>(null)

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within <CatalogProvider>')
  return ctx
}

export function CatalogProvider({
  children,
  repository = productRepository,
}: {
  children: ReactNode
  repository?: ProductRepository
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await repository.list()
      setProducts(list)
      setError(null)
    } catch (err) {
      setError(errorMessage(err, 'The catalogue could not be loaded.'))
    } finally {
      setLoading(false)
    }
  }, [repository])

  useEffect(() => {
    let cancelled = false

    repository
      .list()
      .then((list) => {
        if (cancelled) return
        setProducts(list)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(errorMessage(err, 'The catalogue could not be loaded.'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [repository])

  const refresh = useCallback(async () => {
    await load()
  }, [load])

  const bounds = useMemo(() => priceBounds(products), [products])

  const getById = useCallback((id: string) => products.find((p) => p.id === id || p.slug === id), [products])
  const getBySlug = useCallback((slug: string) => products.find((p) => p.slug === slug), [products])
  const search = useCallback((query: string) => searchCatalog(products, query), [products])

  const saveProduct = useCallback(
    async (product: Product, isNew = false): Promise<Product> => {
      const saved = isNew
        ? await repository.create(product)
        : await repository.update(product.id, product)

      setProducts((current) => {
        const index = current.findIndex((p) => p.id === saved.id)
        if (index < 0) return [...current, saved]
        const next = [...current]
        next[index] = saved
        return next
      })

      return saved
    },
    [repository],
  )

  const removeProduct = useCallback(
    async (id: string) => {
      await repository.remove(id)
      setProducts((current) => current.filter((p) => p.id !== id))
    },
    [repository],
  )

  const resetCatalogue = useCallback(async () => {
    const list = await repository.reset()
    setProducts(list)
  }, [repository])

  const suggestSlug = useCallback(
    (name: string): string => {
      const base = slugify(name) || 'watch'
      const taken = new Set(products.map((p) => p.slug))
      if (!taken.has(base)) return base
      let counter = 2
      while (taken.has(`${base}-${counter}`)) counter += 1
      return `${base}-${counter}`
    },
    [products],
  )

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      bounds,
      loading,
      error,
      getById,
      getBySlug,
      search,
      saveProduct,
      removeProduct,
      resetCatalogue,
      refresh,
      suggestSlug,
    }),
    [
      products,
      bounds,
      loading,
      error,
      getById,
      getBySlug,
      search,
      saveProduct,
      removeProduct,
      resetCatalogue,
      refresh,
      suggestSlug,
    ],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
