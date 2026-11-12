import type { Order, OrderStatus, PaymentMethod, ShippingDetails } from '../../types'
import { request } from '../../lib/api'

/** The payload the API accepts when a guest places an order. */
export interface PlaceOrderInput {
  shipping: ShippingDetails
  items: { productId: string; quantity: number }[]
  couponCode?: string
  paymentMethod: PaymentMethod
}

/**
 * Order persistence, behind an interface (DIP).
 *
 * Placement and tracking are public; listing and status changes require the
 * admin bearer token, which the API client attaches automatically.
 */
export interface OrderRepository {
  list(): Promise<Order[]>
  /** Order lookup for the tracking page — order number + email must match. */
  find(orderNumber: string, email: string): Promise<Order>
  place(input: PlaceOrderInput): Promise<Order>
  updateStatus(orderNumber: string, status: OrderStatus, note?: string): Promise<Order>
}

export class ApiOrderRepository implements OrderRepository {
  list(): Promise<Order[]> {
    return request<Order[]>('/admin/orders', { auth: true })
  }

  find(orderNumber: string, email: string): Promise<Order> {
    const query = new URLSearchParams({ orderNumber, email })
    return request<Order>(`/orders/track?${query.toString()}`)
  }

  place(input: PlaceOrderInput): Promise<Order> {
    return request<Order>('/orders', { method: 'POST', body: input })
  }

  updateStatus(orderNumber: string, status: OrderStatus, note?: string): Promise<Order> {
    return request<Order>(`/admin/orders/${encodeURIComponent(orderNumber)}/status`, {
      method: 'PATCH',
      body: { status, note },
      auth: true,
    })
  }
}

export const orderRepository = new ApiOrderRepository()

/**
 * Manual order entry for the store team. The API applies the same stock, coupon
 * and total rules as guest checkout.
 */
export function createAdminOrder(
  input: PlaceOrderInput & { status?: OrderStatus },
): Promise<Order> {
  return request<Order>('/admin/orders', { method: 'POST', body: input, auth: true })
}
