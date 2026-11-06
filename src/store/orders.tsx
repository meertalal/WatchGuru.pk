import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Order, OrderStatus } from '../types'
import { orderRepository, type OrderRepository } from '../data/repositories/orderRepository'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LAST_ORDER_STORAGE_KEY = 'watchguru-pk:last-order:v1'

export interface OrdersContextValue {
  /** The order most recently placed in this browser (drives the confirmation page). */
  lastOrder: Order | null
  /** Every order currently in the store (admin view). */
  orders: Order[]
  placeOrder: (order: Order) => void
  clearLastOrder: () => void
  /** Tracking lookup — order number and email must match. */
  trackOrder: (orderNumber: string, email: string) => Order | null
  listForEmail: (email: string) => Order[]
  updateStatus: (orderNumber: string, status: OrderStatus, note?: string) => Order | null
  refresh: () => void
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
  const [lastOrder, setLastOrder] = useLocalStorage<Order | null>(LAST_ORDER_STORAGE_KEY, null)
  const [orders, setOrders] = useState<Order[]>(() => repository.list())

  const refresh = useCallback(() => setOrders(repository.list()), [repository])

  const placeOrder = useCallback(
    (order: Order) => {
      repository.place(order)
      setLastOrder(order)
      refresh()
    },
    [repository, setLastOrder, refresh],
  )

  const clearLastOrder = useCallback(() => setLastOrder(null), [setLastOrder])

  const trackOrder = useCallback(
    (orderNumber: string, email: string) => repository.find(orderNumber, email),
    [repository],
  )

  const listForEmail = useCallback(
    (email: string) => repository.listForEmail(email),
    [repository],
  )

  const updateStatus = useCallback(
    (orderNumber: string, status: OrderStatus, note?: string) => {
      const updated = repository.updateStatus(orderNumber, status, note)
      refresh()
      return updated
    },
    [repository, refresh],
  )

  const value = useMemo<OrdersContextValue>(
    () => ({
      lastOrder,
      orders,
      placeOrder,
      clearLastOrder,
      trackOrder,
      listForEmail,
      updateStatus,
      refresh,
    }),
    [
      lastOrder,
      orders,
      placeOrder,
      clearLastOrder,
      trackOrder,
      listForEmail,
      updateStatus,
      refresh,
    ],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}
