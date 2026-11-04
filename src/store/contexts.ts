import { createContext, useContext } from 'react'
import type { CartLine, Order, Product } from '../types'

/* ------------------------------------------------------------------ */
/*  Storage keys                                                       */
/* ------------------------------------------------------------------ */

export const STORAGE_KEYS = {
  cart: 'watchguru-pk:cart:v1',
  wishlist: 'watchguru-pk:wishlist:v1',
  order: 'watchguru-pk:last-order:v1',
} as const

/* ------------------------------------------------------------------ */
/*  Cart                                                               */
/* ------------------------------------------------------------------ */

export interface CartLineDetailed {
  product: Product
  quantity: number
  lineTotal: number
}

export interface CartContextValue {
  /** Raw persisted lines. */
  lines: CartLine[]
  /** Lines enriched with product data and computed totals. */
  items: CartLineDetailed[]
  /** Total number of units in the cart. */
  count: number
  subtotal: number
  addItem: (productId: string, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  isInCart: (productId: string) => boolean
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <AppProviders>')
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Wishlist                                                           */
/* ------------------------------------------------------------------ */

export interface WishlistContextValue {
  ids: string[]
  count: number
  toggle: (productId: string) => void
  remove: (productId: string) => void
  has: (productId: string) => boolean
  clear: () => void
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within <AppProviders>')
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

export interface OrderContextValue {
  lastOrder: Order | null
  placeOrder: (order: Order) => void
  clearLastOrder: () => void
}

export const OrderContext = createContext<OrderContextValue | null>(null)

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within <AppProviders>')
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Toasts (demo feedback)                                             */
/* ------------------------------------------------------------------ */

export type ToastVariant = 'success' | 'info' | 'error'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

export interface ToastContextValue {
  toasts: Toast[]
  notify: (message: string, variant?: ToastVariant) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <AppProviders>')
  return ctx
}
