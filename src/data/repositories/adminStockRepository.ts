import type { StockAdjustment, StockMovement, StockOverview } from '../../types'
import { request } from '../../lib/api'

/** Inventory module persistence. */
export interface StockRepository {
  overview(productId?: string): Promise<StockOverview>
  movements(productId?: string): Promise<StockMovement[]>
  adjust(input: StockAdjustment): Promise<StockMovement>
}

export class ApiStockRepository implements StockRepository {
  overview(productId?: string): Promise<StockOverview> {
    const query = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request<StockOverview>(`/admin/stock${query}`, { auth: true })
  }

  movements(productId?: string): Promise<StockMovement[]> {
    const query = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request<StockMovement[]>(`/admin/stock/movements${query}`, { auth: true })
  }

  adjust(input: StockAdjustment): Promise<StockMovement> {
    return request<StockMovement>('/admin/stock/adjust', {
      method: 'POST',
      body: input,
      auth: true,
    })
  }
}

export const stockRepository = new ApiStockRepository()
