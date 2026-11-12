import type { OrderStatus, PaymentMethod } from '../types'

/**
 * Order fulfilment vocabulary, shared by the tracking page and the admin
 * order manager so statuses never drift apart. The transition map mirrors
 * the rules enforced by the API.
 */

export const ORDER_STATUS_FLOW: readonly OrderStatus[] = [
  'processing',
  'confirmed',
  'shipped',
  'out-for-delivery',
  'delivered',
] as const

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  processing: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['out-for-delivery', 'cancelled'],
  'out-for-delivery': ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

/** The current status plus every status the API will accept next. */
export function selectableStatuses(status: OrderStatus): OrderStatus[] {
  return [status, ...ORDER_STATUS_TRANSITIONS[status]]
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  processing: 'Processing',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_DESCRIPTION: Record<OrderStatus, string> = {
  processing: 'We have received your order and are preparing it.',
  confirmed: 'Your advance is verified. Your watch is being packaged.',
  shipped: 'Your parcel is with our insured courier partner.',
  'out-for-delivery': 'Your courier is on the way to your address.',
  delivered: 'Delivered and signed for. Welcome to the club.',
  cancelled: 'This order was cancelled.',
}

/** Index into the happy-path flow; -1 for cancelled. */
export function statusStepIndex(status: OrderStatus): number {
  return ORDER_STATUS_FLOW.indexOf(status)
}

export function isCancelled(status: OrderStatus): boolean {
  return status === 'cancelled'
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  'bank-transfer': 'Bank Transfer',
  easypaisa: 'Easypaisa',
  jazzcash: 'JazzCash',
}

export const COD_ADVANCE_PKR = 1000
