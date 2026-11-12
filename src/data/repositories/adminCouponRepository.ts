import type { AdminCoupon, CouponInput } from '../../types'
import { request } from '../../lib/api'

/** Discounts module persistence. */
export interface AdminCouponRepository {
  list(): Promise<AdminCoupon[]>
  create(input: CouponInput): Promise<AdminCoupon>
  update(id: number, input: CouponInput): Promise<AdminCoupon>
  remove(id: number): Promise<void>
}

export class ApiAdminCouponRepository implements AdminCouponRepository {
  list(): Promise<AdminCoupon[]> {
    return request<AdminCoupon[]>('/admin/coupons', { auth: true })
  }

  create(input: CouponInput): Promise<AdminCoupon> {
    return request<AdminCoupon>('/admin/coupons', { method: 'POST', body: input, auth: true })
  }

  update(id: number, input: CouponInput): Promise<AdminCoupon> {
    return request<AdminCoupon>(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: input,
      auth: true,
    })
  }

  async remove(id: number): Promise<void> {
    await request<{ deleted: boolean }>(`/admin/coupons/${id}`, {
      method: 'DELETE',
      auth: true,
    })
  }
}

export const adminCouponRepository = new ApiAdminCouponRepository()
