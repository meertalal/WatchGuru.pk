import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Banknote,
  ListOrdered,
  Package,
  Receipt,
  Wallet,
} from 'lucide-react'
import { useCatalog, useOrders, useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatDate, formatPriceExact, classNames } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { ORDER_STATUS_LABEL, selectableStatuses } from '../../lib/orders'
import type { OrderStatus } from '../../types'

export function AdminOverview() {
  const { products } = useCatalog()
  const { orders, updateStatus } = useOrders()
  const { notify } = useToast()
  const [updating, setUpdating] = useState<string | null>(null)

  useDocumentMeta({
    title: 'Admin | Overview',
    description: 'WatchGuru.pk store admin. Orders, revenue and catalogue health at a glance.',
  })

  const changeStatus = async (orderNumber: string, next: OrderStatus) => {
    setUpdating(orderNumber)
    try {
      await updateStatus(orderNumber, next)
      notify(`${orderNumber} marked ${ORDER_STATUS_LABEL[next].toLowerCase()}.`)
    } catch (error) {
      notify(errorMessage(error, 'The order status could not be updated.'), 'error')
    } finally {
      setUpdating(null)
    }
  }

  const activeOrders = orders.filter((o) => o.status !== 'cancelled')
  const revenue = activeOrders.reduce((sum, o) => sum + o.total, 0)
  const pending = orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length
  const outForDelivery = orders.filter((o) => o.status === 'out-for-delivery').length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5)
  const soldOut = products.filter((p) => !p.inStock || p.stock === 0)
  const recentOrders = [...orders]
    .sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt))
    .slice(0, 5)

  const stats = [
    { label: 'Orders (all time)', value: String(orders.length), icon: ListOrdered },
    { label: 'Awaiting action', value: String(pending + outForDelivery), icon: Receipt, accent: pending + outForDelivery > 0 },
    { label: 'Revenue (excl. cancelled)', value: formatPriceExact(revenue), icon: Banknote },
    { label: 'Low stock / sold out', value: `${lowStock.length} / ${soldOut.length}`, icon: AlertTriangle, accent: lowStock.length + soldOut.length > 0 },
  ]

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Dashboard</p>
          <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Store overview</h1>
        </div>
        <Link
          to="/admin/products"
          className="border border-button bg-button px-5 py-3 font-akkurat text-[10px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:border-gold-bright hover:bg-gold-bright"
        >
          Manage products
        </Link>
      </header>

      {/* Stats */}
      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <li key={label} className="bg-charcoal p-4 sm:p-5">
            <Icon className={classNames('size-5', accent ? 'text-gold' : 'text-muted')} strokeWidth={1.4} aria-hidden="true" />
            <p className="mt-3 font-inter text-lg font-normal leading-tight text-ivory sm:text-xl">
              {value}
            </p>
            <p className="mt-1 font-akkurat text-[9px] leading-snug tracking-[0.16em] text-muted uppercase">
              {label}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        {/* Recent orders */}
        <section className="bg-charcoal xl:col-span-3" aria-labelledby="recent-orders">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 id="recent-orders" className="font-cormorant text-xl text-ivory">Recent orders</h2>
            <Link to="/admin/orders" className="text-[10px] font-medium tracking-[0.2em] text-gold uppercase hover:opacity-75">
              View all
            </Link>
          </div>
          <ul>
            {recentOrders.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ash">No orders yet.</li>
            )}
            {recentOrders.map((order) => (
              <li key={order.orderNumber} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-inter text-[13px] font-normal text-ivory">{order.orderNumber}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">
                    {formatDate(order.placedAt)}, {order.customerName}, {formatPriceExact(order.total)}
                  </p>
                </div>
                <label className="flex items-center gap-2">
                  <span className="sr-only">Update status for {order.orderNumber}</span>
                  <select
                    value={order.status}
                    disabled={updating === order.orderNumber}
                    onChange={(e) => {
                      void changeStatus(order.orderNumber, e.target.value as OrderStatus)
                    }}
                    className="border border-line bg-charcoal px-2 py-1.5 font-inter text-[11px] text-ivory outline-none focus:border-gold disabled:opacity-60"
                  >
                    {selectableStatuses(order.status).map((status) => (
                      <option key={status} value={status}>
                        {ORDER_STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Stock alerts */}
        <section className="bg-charcoal xl:col-span-2" aria-labelledby="stock-alerts">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 id="stock-alerts" className="font-cormorant text-xl text-ivory">Stock alerts</h2>
            <Wallet className="size-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
          </div>
          <ul>
            {lowStock.length === 0 && soldOut.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ash">
                Everything is comfortably stocked.
              </li>
            )}
            {[...soldOut.map((p) => ({ ...p, alert: 'Sold out' })), ...lowStock.map((p) => ({ ...p, alert: `${p.stock} left` }))]
              .slice(0, 6)
              .map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] text-ivory">{p.name}</p>
                    <p className="text-[10.5px] text-muted">{p.brand}</p>
                  </div>
                  <span
                    className={classNames(
                      'shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-[0.18em] uppercase',
                      p.alert === 'Sold out' ? 'border border-error/40 bg-error/10 text-error' : 'border border-gold/40 bg-gold/10 text-gold',
                    )}
                  >
                    {p.alert}
                  </span>
                </li>
              ))}
          </ul>
          <div className="px-5 py-4">
            <Link to="/admin/stock" className="flex items-center gap-2 font-akkurat text-[9px] font-medium tracking-[0.2em] text-ivory uppercase hover:text-gold">
              <Package className="size-4" strokeWidth={1.4} aria-hidden="true" />
              Restock in the stock module
            </Link>
          </div>
        </section>
      </div>

      <p className="mt-6 flex items-center gap-2 text-[11px] text-ash">
        <span className="inline-block size-2 rounded-full bg-gold" aria-hidden="true" />
        Live view. Every change here is saved to the store database (demo fulfilment; no courier is
        booked).
      </p>
    </div>
  )
}
