import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { useOrders, useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatDate, formatPriceExact, classNames } from '../../lib/format'
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
} from '../../lib/orders'
import type { OrderStatus } from '../../types'
import { OrderTimeline } from '../../components/order/OrderTimeline'
import { ProductImage } from '../../components/ui/ProductImage'

const TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  ...ORDER_STATUS_FLOW.map((status) => ({ label: ORDER_STATUS_LABEL[status], value: status })),
  { label: 'Cancelled', value: 'cancelled' },
]

const SELECTABLE_STATUSES: OrderStatus[] = [...ORDER_STATUS_FLOW, 'cancelled']

export function AdminOrders() {
  const { orders, updateStatus } = useOrders()
  const { notify } = useToast()
  const [tab, setTab] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useDocumentMeta({
    title: 'Admin — Orders',
    description: 'WatchGuru.pk order manager — confirm, ship and track every order.',
  })

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...orders]
      .filter((order) => (tab === 'all' ? true : order.status === tab))
      .filter(
        (order) =>
          !needle ||
          order.orderNumber.toLowerCase().includes(needle) ||
          order.email.toLowerCase().includes(needle) ||
          order.customerName.toLowerCase().includes(needle),
      )
      .sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt))
  }, [orders, tab, query])

  const counts = useMemo(() => {
    const map = new Map<OrderStatus | 'all', number>()
    map.set('all', orders.length)
    for (const order of orders) map.set(order.status, (map.get(order.status) ?? 0) + 1)
    return map
  }, [orders])

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header>
        <p className="eyebrow text-gold">Fulfilment</p>
        <h1 className="mt-1 text-2xl sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-ash">
          Confirm advances, advance statuses and keep customers in the loop. Every change is
          recorded in the order’s history.
        </p>
      </header>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by status">
          {TABS.map(({ label, value }) => {
            const active = tab === value
            const count = counts.get(value) ?? 0
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(value)}
                className={classNames(
                  'border px-3 py-1.5 font-montserrat text-[10px] font-medium tracking-[0.14em] uppercase transition-colors',
                  active
                    ? 'border-gold bg-charcoal text-ivory'
                    : 'border-line text-ash hover:border-gold hover:text-white',
                )}
              >
                {label} <span className="opacity-60">({count})</span>
              </button>
            )
          })}
        </div>
        <label className="flex items-center gap-2 border border-line bg-charcoal px-3 py-2.5 lg:w-72">
          <Search className="size-4 text-ash" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search number, name or email…"
            aria-label="Search orders"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ash"
          />
        </label>
      </div>

      {/* Orders list */}
      <ul className="mt-6 flex flex-col gap-4">
        {filtered.length === 0 && (
          <li className="border border-dashed border-line bg-charcoal/60 px-6 py-12 text-center text-sm text-ash">
            No orders match that filter.
          </li>
        )}

        {filtered.map((order) => {
          const isOpen = expanded === order.orderNumber
          return (
            <li key={order.orderNumber} className="border border-line bg-charcoal">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : order.orderNumber)}
                aria-expanded={isOpen}
                className="flex w-full flex-wrap items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-lift"
              >
                <div className="min-w-0">
                  <p className="font-inter font-medium text-white">{order.orderNumber}</p>
                  <p className="mt-0.5 text-[11px] text-ash">
                    {formatDate(order.placedAt)} · {order.customerName} ·{' '}
                    {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-white">{formatPriceExact(order.total)}</p>
                  <span
                    className="hidden rounded-full bg-coal px-3 py-1 text-[9px] font-semibold tracking-[0.18em] text-ash uppercase sm:inline-block"
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                  <ChevronDown
                    className={classNames('size-4 text-ash transition-transform', isOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-line px-5 py-5">
                  <div className="grid gap-6 lg:grid-cols-5">
                    {/* Items + address */}
                    <div className="lg:col-span-3">
                      <ul className="flex flex-col gap-3">
                        {order.lines.map((line) => (
                          <li key={`${line.productId}-${line.name}`} className="flex items-center gap-3">
                            <ProductImage
                              src={line.image}
                              alt={line.name}
                              label={line.brand}
                              className="size-14 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="eyebrow text-[9px] text-ash">{line.brand}</p>
                              <p className="truncate text-sm text-white">{line.name}</p>
                              <p className="text-[11px] text-ash">
                                Qty {line.quantity} · {formatPriceExact(line.price * line.quantity)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <address className="mt-4 border-t border-line pt-4 text-[12px] leading-relaxed text-ash not-italic">
                        <strong className="text-white">{order.shipping.firstName} {order.shipping.lastName}</strong>
                        <br />
                        {order.shipping.address}
                        {order.shipping.apartment ? `, ${order.shipping.apartment}` : ''}
                        <br />
                        {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode} ·{' '}
                        {order.shipping.country}
                        <br />
                        {order.shipping.phone} · {order.email}
                      </address>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label htmlFor={`status-${order.orderNumber}`} className="eyebrow text-ash">
                          Set status
                        </label>
                        <select
                          id={`status-${order.orderNumber}`}
                          value={order.status}
                          onChange={(e) => {
                            const next = e.target.value as OrderStatus
                            updateStatus(order.orderNumber, next)
                            notify(`${order.orderNumber} marked ${ORDER_STATUS_LABEL[next].toLowerCase()}.`)
                          }}
                          className="border border-line bg-charcoal px-3 py-2 text-[11px] text-white outline-none focus:border-gold"
                        >
                          {SELECTABLE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {ORDER_STATUS_LABEL[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="lg:col-span-2">
                      <OrderTimeline status={order.status} history={order.statusHistory} />
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
