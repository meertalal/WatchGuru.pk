import type { Product } from '../../types'
import { request } from '../../lib/api'

/**
 * Catalogue persistence, behind an interface (DIP).
 *
 * The storefront now reads from the WatchGuru.pk API. Components depend on
 * this interface through the catalog context, never on fetch directly.
 */
export interface ProductRepository {
  list(): Promise<Product[]>
  create(product: Product): Promise<Product>
  update(id: string, product: Product): Promise<Product>
  remove(id: string): Promise<void>
  /** Restore the seeded catalogue; returns the restored list. */
  reset(): Promise<Product[]>
}

export class ApiProductRepository implements ProductRepository {
  list(): Promise<Product[]> {
    return request<Product[]>('/products')
  }

  create(product: Product): Promise<Product> {
    return request<Product>('/admin/products', { method: 'POST', body: product, auth: true })
  }

  update(id: string, product: Product): Promise<Product> {
    return request<Product>(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: product,
      auth: true,
    })
  }

  async remove(id: string): Promise<void> {
    await request<{ deleted: boolean }>(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      auth: true,
    })
  }

  reset(): Promise<Product[]> {
    return request<Product[]>('/admin/catalogue/reset', { method: 'POST', auth: true })
  }
}

/** Shared singleton used by the app. */
export const productRepository = new ApiProductRepository()
