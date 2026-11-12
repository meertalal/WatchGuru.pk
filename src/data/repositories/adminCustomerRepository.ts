import type { Customer } from '../../types'
import { request } from '../../lib/api'

/** Customers module persistence (read-only aggregation of orders). */
export interface CustomerRepository {
  list(): Promise<Customer[]>
}

export class ApiCustomerRepository implements CustomerRepository {
  list(): Promise<Customer[]> {
    return request<Customer[]>('/admin/customers', { auth: true })
  }
}

export const customerRepository = new ApiCustomerRepository()
