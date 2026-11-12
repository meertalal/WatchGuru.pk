import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Order, OrderStatus } from '../types'
import {
  orderRepository,
  type OrderRepository,
  type PlaceOrderInput,
} from '../data/repositories/orderRepository'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './auth'

const LAST_ORDER_STORAGE_KEY = 'watchguru-pk:last-order:v1'

export interface OrdersContextValue {
  /** The order most recently placed in this browser (drives the confirmation page). */
  lastOrder: Order | null
  /** Every order in the store (admin view). Empty for guests. */
  orders: Order[]
  loading: boolean
  placeOrder: (input: PlaceOrderInput) => Promise<Order>
  clearLastOrder: () => void
  /** Tracking lookup: order number and email must match. */
  trackOrder: (orderNumber: string, email: string) => Promise<Order>
  updateStatus: (orderNumber: string, status: OrderStatus, note?: string) => Promise<Order>
  refresh: () => Promise<void>
}

export const OrdersContext = createContext<OrdersContextValue | null>(null)

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within <OrdersProvider>')
  return ctx
}

export function OrdersProvider({
  children,
  repository = orderRepository,
}: {
  children: ReactNode
  repository?: OrderRepository
}) {
  const { isAdmin } = useAuth()
  const [lastOrder, setLastOrder] = useLocalStorage<Order | null>(LAST_ORDER_STORAGE_KEY, null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAdmin) {
      setOrders([])
      return
    }

    setLoading(true)
    try {
      setOrders(await repository.list())
    } finally {
      setLoading(false)
    }
  }, [repository, isAdmin])

  // Admin order data is only available with a bearer token, so load it when
  // the signed-in role changes (and clear it again on sign-out).
  useEffect(() => {
    let cancelled = false

    if (!isAdmin) {
      setOrders([])
      return
    }

    setLoading(true)
    repository
      .list()
      .then((list) => {
        if (!cancelled) setOrders(list)
      })
      .catch(() => {
        if (!cancelled) setOrders([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [repository, isAdmin])

  const placeOrder = useCallback(
    async (input: PlaceOrderInput): Promise<Order> => {
      const order = await repository.place(input)
      setLastOrder(order)
      return order
    },
    [repository, setLastOrder],
  )

  const clearLastOrder = useCallback(() => setLastOrder(null), [setLastOrder])

  const trackOrder = useCallback(
    (orderNumber: string, email: string) => repository.find(orderNumber, email),
    [repository],
  )

  const updateStatus = useCallback(
    async (orderNumber: string, status: OrderStatus, note?: string): Promise<Order> => {
      const updated = await repository.updateStatus(orderNumber, status, note)
      setOrders((current) =>
        current.map((order) => (order.orderNumber === updated.orderNumber ? updated : order)),
      )
      return updated
    },
    [repository],
  )

  const value = useMemo<OrdersContextValue>(
    () => ({
      lastOrder,
      orders,
      loading,
      placeOrder,
      clearLastOrder,
      trackOrder,
      updateStatus,
      refresh,
    }),
    [
      lastOrder,
      orders,
      loading,
      placeOrder,
      clearLastOrder,
      trackOrder,
      updateStatus,
      refresh,
    ],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}
