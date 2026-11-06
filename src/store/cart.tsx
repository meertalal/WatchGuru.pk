import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { CartLine, Product } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCatalog } from './catalog'

export const CART_STORAGE_KEY = 'watchguru-pk:cart:v1'

export interface CartLineDetailed {
  product: Product
  quantity: number
  lineTotal: number
}

export interface CartContextValue {
  /** Raw persisted lines. */
  lines: CartLine[]
  /** Lines enriched with live catalogue data and computed totals. */
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
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { getById } = useCatalog()
  const [lines, setLines] = useLocalStorage<CartLine[]>(CART_STORAGE_KEY, [])

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === productId)
        if (existing) {
          return prev.map((l) =>
            l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l,
          )
        }
        return [...prev, { productId, quantity }]
      })
    },
    [setLines],
  )

  const removeItem = useCallback(
    (productId: string) => setLines((prev) => prev.filter((l) => l.productId !== productId)),
    [setLines],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setLines((prev) => prev.filter((l) => l.productId !== productId))
        return
      }
      setLines((prev) =>
        prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
      )
    },
    [setLines],
  )

  const clear = useCallback(() => setLines([]), [setLines])

  const items = useMemo<CartLineDetailed[]>(
    () =>
      lines.flatMap((line) => {
        const product = getById(line.productId)
        if (!product) return [] // stale line — product was removed from the catalogue
        return [{ product, quantity: line.quantity, lineTotal: product.price * line.quantity }]
      }),
    [lines, getById],
  )

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.lineTotal, 0), [items])

  const isInCart = useCallback(
    (productId: string) => lines.some((l) => l.productId === productId),
    [lines],
  )

  const value = useMemo<CartContextValue>(
    () => ({ lines, items, count, subtotal, addItem, removeItem, updateQuantity, clear, isInCart }),
    [lines, items, count, subtotal, addItem, removeItem, updateQuantity, clear, isInCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
