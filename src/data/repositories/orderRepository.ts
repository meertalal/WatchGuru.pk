import type { Order, OrderStatus, OrderStatusEntry } from '../../types'
import {
  defaultStorage,
  readJson,
  storageKeys,
  writeJson,
  type StorageLike,
} from '../../lib/storage'

/**
 * Order persistence, behind an interface (DIP). Orders placed through
 * checkout are appended to local storage and read back by the tracking
 * page and admin order manager.
 */
export interface OrderRepository {
  list(): Order[]
  listForEmail(email: string): Order[]
  /** Order lookup for the tracking page — order number + email must match. */
  find(orderNumber: string, email: string): Order | null
  place(order: Order): void
  updateStatus(orderNumber: string, status: OrderStatus, note?: string): Order | null
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export class LocalStorageOrderRepository implements OrderRepository {
  private readonly storage: StorageLike | null

  constructor(storage: StorageLike | null = defaultStorage()) {
    this.storage = storage
  }

  list(): Order[] {
    const stored = readJson<Order[] | null>(this.storage, storageKeys.orders, null)
    return Array.isArray(stored) ? stored : []
  }

  listForEmail(email: string): Order[] {
    const normalised = email.trim().toLowerCase()
    return this.list()
      .filter((order) => order.email.toLowerCase() === normalised)
      .sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt))
  }

  find(orderNumber: string, email: string): Order | null {
    const number = orderNumber.trim().toUpperCase()
    const address = email.trim().toLowerCase()
    return (
      this.list().find(
        (order) =>
          order.orderNumber.toUpperCase() === number &&
          order.email.toLowerCase() === address,
      ) ?? null
    )
  }

  place(order: Order): void {
    const list = this.list()
    list.push(order)
    writeJson(this.storage, storageKeys.orders, list)
  }

  updateStatus(orderNumber: string, status: OrderStatus, note?: string): Order | null {
    const number = orderNumber.trim().toUpperCase()
    const list = this.list()
    const index = list.findIndex((order) => order.orderNumber.toUpperCase() === number)
    if (index < 0) return null
    const order = list[index]
    const entry: OrderStatusEntry = { status, at: new Date().toISOString(), ...(note ? { note } : {}) }
    const updated: Order = {
      ...order,
      status,
      statusHistory: [...order.statusHistory, entry],
    }
    list[index] = updated
    writeJson(this.storage, storageKeys.orders, list)
    return clone(updated)
  }
}

export const orderRepository = new LocalStorageOrderRepository()
