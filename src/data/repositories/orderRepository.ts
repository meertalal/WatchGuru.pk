import { products as seedCatalogue } from '../products'
import type { Order, OrderStatus, OrderStatusEntry } from '../../types'
import {
  defaultStorage,
  readJson,
  storageKeys,
  writeJson,
  type StorageLike,
} from '../../lib/storage'

/**
 * Order persistence, behind an interface (DIP).
 *
 * The store demo ships two seeded sample orders (flagged with
 * orderNumber `WG-DEMO…`) so the tracking page and admin order manager
 * have something to show on first run. New orders placed through
 * checkout are appended to the same store.
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

const demoLine = (productId: string, quantity: number) => {
  const seed = seedCatalogue.find((p) => p.id === productId)
  if (!seed) throw new Error(`Demo seed product missing: ${productId}`)
  return {
    productId: seed.id,
    slug: seed.slug,
    name: seed.name,
    brand: seed.brand,
    price: seed.price,
    quantity,
    image: seed.images[0],
  }
}

const hoursAgo = (hours: number): string => new Date(Date.now() - hours * 3_600_000).toISOString()

const DEMO_CUSTOMER = {
  firstName: 'Demo',
  lastName: 'Customer',
  email: 'demo@watchguru.pk',
  phone: '+923221234567',
} as const

const demoShipping = (city: string, state: string, postalCode: string) => ({
  ...DEMO_CUSTOMER,
  address: 'House 12, Street 4, Phase 6, DHA',
  city,
  state,
  postalCode,
  country: 'Pakistan',
})

function buildDemoOrders(): Order[] {
  const deliveredHistory: OrderStatusEntry[] = [
    { status: 'processing', at: hoursAgo(96) },
    { status: 'confirmed', at: hoursAgo(90), note: 'Advance verified via call' },
    { status: 'shipped', at: hoursAgo(72), note: 'Insured handover — leopards courier' },
    { status: 'out-for-delivery', at: hoursAgo(30) },
    { status: 'delivered', at: hoursAgo(26) },
  ]
  const shippedHistory: OrderStatusEntry[] = [
    { status: 'processing', at: hoursAgo(30) },
    { status: 'confirmed', at: hoursAgo(26), note: 'Advance verified via WhatsApp' },
    { status: 'shipped', at: hoursAgo(8), note: 'Insured handover' },
  ]

  const orderALines = [demoLine('wg-001', 1)]
  const orderASubtotal = orderALines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  const orderBLines = [demoLine('tc-003', 1), demoLine('wg-003', 1)]
  const orderBSubtotal = orderBLines.reduce((sum, l) => sum + l.price * l.quantity, 0)

  return [
    {
      orderNumber: 'WG-DEMO2041',
      placedAt: hoursAgo(96),
      email: DEMO_CUSTOMER.email,
      customerName: `${DEMO_CUSTOMER.firstName} ${DEMO_CUSTOMER.lastName}`,
      shipping: demoShipping('Karachi', 'Sindh', '75500'),
      lines: orderALines,
      subtotal: orderASubtotal,
      shippingCost: 0,
      discount: 0,
      tax: Math.round(orderASubtotal * 0.08 * 100) / 100,
      total: Math.round(orderASubtotal * 1.08 * 100) / 100,
      paymentMethod: 'cod',
      status: 'delivered',
      statusHistory: deliveredHistory,
    },
    {
      orderNumber: 'WG-DEMO2098',
      placedAt: hoursAgo(30),
      email: DEMO_CUSTOMER.email,
      customerName: `${DEMO_CUSTOMER.firstName} ${DEMO_CUSTOMER.lastName}`,
      shipping: demoShipping('Lahore', 'Punjab', '54660'),
      lines: orderBLines,
      subtotal: orderBSubtotal,
      shippingCost: 0,
      discount: 0,
      tax: Math.round(orderBSubtotal * 0.08 * 100) / 100,
      total: Math.round(orderBSubtotal * 1.08 * 100) / 100,
      paymentMethod: 'easypaisa',
      status: 'shipped',
      statusHistory: shippedHistory,
    },
  ]
}

export class LocalStorageOrderRepository implements OrderRepository {
  private readonly storage: StorageLike | null

  constructor(storage: StorageLike | null = defaultStorage()) {
    this.storage = storage
  }

  list(): Order[] {
    const stored = readJson<Order[] | null>(this.storage, storageKeys.orders, null)
    if (stored === null) {
      const seeded = buildDemoOrders()
      writeJson(this.storage, storageKeys.orders, seeded)
      return clone(seeded)
    }
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
