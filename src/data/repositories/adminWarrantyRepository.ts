import type { AdminWarrantySerial } from '../../types'
import { request } from '../../lib/api'

/** Warranty module persistence. */
export interface WarrantyAdminRepository {
  list(): Promise<AdminWarrantySerial[]>
  create(input: { serial: string; productId?: string }): Promise<AdminWarrantySerial>
  remove(id: number): Promise<void>
}

export class ApiWarrantyAdminRepository implements WarrantyAdminRepository {
  list(): Promise<AdminWarrantySerial[]> {
    return request<AdminWarrantySerial[]>('/admin/warranty', { auth: true })
  }

  create(input: { serial: string; productId?: string }): Promise<AdminWarrantySerial> {
    return request<AdminWarrantySerial>('/admin/warranty', {
      method: 'POST',
      body: input,
      auth: true,
    })
  }

  async remove(id: number): Promise<void> {
    await request<{ deleted: boolean }>(`/admin/warranty/${id}`, {
      method: 'DELETE',
      auth: true,
    })
  }
}

export const warrantyAdminRepository = new ApiWarrantyAdminRepository()
