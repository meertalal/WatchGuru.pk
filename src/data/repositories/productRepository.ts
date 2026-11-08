import { products as seedCatalogue } from '../products'
import type { Product } from '../../types'
import {
  defaultStorage,
  readJson,
  storageKeys,
  writeJson,
  type StorageLike,
} from '../../lib/storage'

/**
 * Catalogue persistence, behind an interface (DIP).
 *
 * Components and contexts depend on `ProductRepository`, never on
 * localStorage directly — so the storefront can be wired to a real API
 * later by swapping the implementation, with zero component changes.
 */
export interface ProductRepository {
  list(): Product[]
  getById(id: string): Product | undefined
  getBySlug(slug: string): Product | undefined
  /** Insert or replace; returns the stored product (with id). */
  save(product: Product): Product
  remove(id: string): void
  /** Restore the factory catalogue; returns the restored list. */
  resetToSeed(): Product[]
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export class LocalStorageProductRepository implements ProductRepository {
  private readonly storage: StorageLike | null
  private readonly seed: Product[]

  constructor(storage: StorageLike | null = defaultStorage(), seed: Product[] = seedCatalogue) {
    this.storage = storage
    this.seed = seed
  }

  list(): Product[] {
    const stored = readJson<Product[] | null>(this.storage, storageKeys.catalog, null)
    if (stored === null) {
      // First run — seed the store so subsequent resets are explicit.
      writeJson(this.storage, storageKeys.catalog, this.seed)
      return clone(this.seed)
    }
    if (!Array.isArray(stored)) return clone(this.seed)

    // Seamlessly upgrade any stored products that had older SVG single image
    const upgraded = stored.map((item) => {
      const match = this.seed.find((s) => s.id === item.id)
      if (
        match &&
        (item.images.some((img) => img.endsWith('.svg')) ||
          item.images.length === 1 ||
          !item.variants ||
          item.variants.length === 0)
      ) {
        return {
          ...item,
          images: match.images,
          variants: match.variants,
        }
      }
      return item
    })
    return upgraded
  }

  getById(id: string): Product | undefined {
    return this.list().find((p) => p.id === id || p.slug === id)
  }

  getBySlug(slug: string): Product | undefined {
    return this.list().find((p) => p.slug === slug)
  }

  save(product: Product): Product {
    const list = this.list()
    const index = list.findIndex((p) => p.id === product.id)
    const normalised: Product = {
      ...product,
      slug: product.slug.trim(),
      name: product.name.trim(),
      brand: product.brand.trim(),
      price: Math.max(0, Math.round(product.price)),
      compareAtPrice:
        product.compareAtPrice && product.compareAtPrice > 0
          ? Math.round(product.compareAtPrice)
          : undefined,
      stock: Math.max(0, Math.floor(product.stock)),
      inStock: product.inStock && product.stock > 0,
    }
    if (index >= 0) list[index] = normalised
    else list.push(normalised)
    writeJson(this.storage, storageKeys.catalog, list)
    return clone(normalised)
  }

  remove(id: string): void {
    const list = this.list().filter((p) => p.id !== id)
    writeJson(this.storage, storageKeys.catalog, list)
  }

  resetToSeed(): Product[] {
    writeJson(this.storage, storageKeys.catalog, this.seed)
    return clone(this.seed)
  }
}

/** Shared singleton used by the app. */
export const productRepository = new LocalStorageProductRepository()
