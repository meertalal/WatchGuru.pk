import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AlertTriangle, Check, Info, X } from 'lucide-react'
import { getProductById } from '../data/products'
import type { CartLine, Order } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  CartContext,
  OrderContext,
  STORAGE_KEYS,
  ToastContext,
  WishlistContext,
  type CartContextValue,
  type CartLineDetailed,
  type OrderContextValue,
  type Toast,
  type ToastContextValue,
  type ToastVariant,
  type WishlistContextValue,
} from './contexts'

/* ------------------------------------------------------------------ */
/*  Cart provider                                                      */
/* ------------------------------------------------------------------ */

function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useLocalStorage<CartLine[]>(STORAGE_KEYS.cart, [])

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
        const product = getProductById(line.productId)
        if (!product) return []
        return [{ product, quantity: line.quantity, lineTotal: product.price * line.quantity }]
      }),
    [lines],
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

/* ------------------------------------------------------------------ */
/*  Wishlist provider                                                  */
/* ------------------------------------------------------------------ */

function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>(STORAGE_KEYS.wishlist, [])

  const toggle = useCallback(
    (productId: string) =>
      setIds((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev],
      ),
    [setIds],
  )

  const remove = useCallback(
    (productId: string) => setIds((prev) => prev.filter((id) => id !== productId)),
    [setIds],
  )

  const has = useCallback((productId: string) => ids.includes(productId), [ids])
  const clear = useCallback(() => setIds([]), [setIds])

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.length, toggle, remove, has, clear }),
    [ids, toggle, remove, has, clear],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  Order provider                                                     */
/* ------------------------------------------------------------------ */

function OrderProvider({ children }: { children: ReactNode }) {
  const [lastOrder, setLastOrder] = useLocalStorage<Order | null>(STORAGE_KEYS.order, null)

  const placeOrder = useCallback((order: Order) => setLastOrder(order), [setLastOrder])
  const clearLastOrder = useCallback(() => setLastOrder(null), [setLastOrder])

  const value = useMemo<OrderContextValue>(
    () => ({ lastOrder, placeOrder, clearLastOrder }),
    [lastOrder, placeOrder, clearLastOrder],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  Toast provider                                                     */
/* ------------------------------------------------------------------ */

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}`
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = makeId()
      setToasts((prev) => [...prev.slice(-2), { id, message, variant }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 3400),
      )
    },
    [dismiss],
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((timer) => clearTimeout(timer))
      map.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, notify, dismiss }),
    [toasts, notify, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

const TOAST_ICONS = {
  success: Check,
  info: Info,
  error: AlertTriangle,
} as const

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.variant]
        return (
          <div
            key={toast.id}
            className="fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-sm border border-stone-800 bg-charcoal/95 px-4 py-3 text-ivory shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Icon className="size-3.5" strokeWidth={2.4} />
            </span>
            <p className="flex-1 text-[13px] leading-snug font-light tracking-wide">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-stone-400 transition-colors hover:text-ivory"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Composition                                                        */
/* ------------------------------------------------------------------ */

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>{children}</OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  )
}
