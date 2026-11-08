import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import { productRepository, type ProductRepository } from '../data/repositories/productRepository'
import { priceBounds, searchCatalog, type PriceBounds } from '../lib/catalog'
import { slugify } from '../lib/format'

/**
 * Live catalogue: the single source of truth for products on screen.
 *
 * Wraps the ProductRepository implementation (default: localStorage seeded
 * from the factory catalogue). Admins mutate the catalogue through this
 * context; storefront pages read from it, so edits are visible everywhere
 * instantly.
 */
export interface CatalogContextValue {
  products: Product[]
  bounds: PriceBounds
  getById: (id: string) => Product | undefined
  getBySlug: (slug: string) => Product | undefined
  search: (query: string) => Product[]
  /** Insert or update a product. Returns the stored entity. */
  saveProduct: (product: Product) => Product
  removeProduct: (id: string) => void
  /** Restore the factory catalogue (admin escape hatch). */
  resetCatalogue: () => void
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
  const [products, setProducts] = useState<Product[]>(() => repository.list())

  const refresh = useCallback(() => setProducts(repository.list()), [repository])

  const bounds = useMemo(() => priceBounds(products), [products])

  const getById = useCallback((id: string) => products.find((p) => p.id === id || p.slug === id), [products])
  const getBySlug = useCallback((slug: string) => products.find((p) => p.slug === slug), [products])
  const search = useCallback((query: string) => searchCatalog(products, query), [products])

  const saveProduct = useCallback(
    (product: Product): Product => {
      const saved = repository.save(product)
      refresh()
      return saved
    },
    [repository, refresh],
  )

  const removeProduct = useCallback(
    (id: string) => {
      repository.remove(id)
      refresh()
    },
    [repository, refresh],
  )

  const resetCatalogue = useCallback(() => {
    repository.resetToSeed()
    refresh()
  }, [repository, refresh])

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
      getById,
      getBySlug,
      search,
      saveProduct,
      removeProduct,
      resetCatalogue,
      suggestSlug,
    }),
    [
      products,
      bounds,
      getById,
      getBySlug,
      search,
      saveProduct,
      removeProduct,
      resetCatalogue,
      suggestSlug,
    ],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
