import type { Coupon } from '../../lib/cart'
import { request } from '../../lib/api'

/**
 * Coupon validation lives on the server so the discount the customer sees is
 * the discount the API will actually apply at checkout.
 */
export function lookupCoupon(code: string): Promise<Coupon> {
  return request<Coupon>(`/coupons/${encodeURIComponent(code.trim())}`)
}
