import { USD_TO_PKR } from '../data/products'

const FIXED_USD50_PKR = Math.round(50 * USD_TO_PKR)

/** Standard insured delivery is complimentary. */
export const SHIPPING_COST = 0

export const TAX_RATE = 0.08

export interface Coupon {
  code: string
  type: 'percent' | 'fixed'
  value: number
  label: string
}

export const COUPONS: Record<string, Coupon> = {
  WATCHGURU10: { code: 'WATCHGURU10', type: 'percent', value: 10, label: '10% off your order' },
  WELCOME50: { code: 'WELCOME50', type: 'fixed', value: FIXED_USD50_PKR, label: 'PKR 13,826 off your order' },
  NOUVEAU: { code: 'NOUVEAU', type: 'percent', value: 15, label: '15% off — new client offer' },
}

export function findCoupon(code: string): Coupon | null {
  return COUPONS[code.trim().toUpperCase()] ?? null
}

export interface PricedLine {
  price: number
  quantity: number
}

export interface Totals {
  subtotal: number
  shippingCost: number
  discount: number
  tax: number
  total: number
}

export function computeTotals(
  lines: PricedLine[],
  options: { coupon?: Coupon | null } = {},
): Totals {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const shippingCost = SHIPPING_COST

  let discount = 0
  if (options.coupon) {
    discount =
      options.coupon.type === 'percent'
        ? (subtotal * options.coupon.value) / 100
        : Math.min(options.coupon.value, subtotal)
  }

  const taxable = Math.max(0, subtotal - discount)
  const tax = Math.round(taxable * TAX_RATE * 100) / 100
  const total = Math.max(0, taxable + shippingCost + tax)

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost,
    discount: Math.round(discount * 100) / 100,
    tax,
    total: Math.round(total * 100) / 100,
  }
}

export const DEMO_COUPONS = Object.values(COUPONS)

export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5)
  const random = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `WG-${stamp}${random}`
}

/** Timestamp helper kept out of components so render stays pure. */
export function nowIso(): string {
  return new Date().toISOString()
}
