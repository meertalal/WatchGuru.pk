import { useCallback, useEffect, useMemo, useState } from 'react'
import { Mail, Search, Users, X } from 'lucide-react'
import type { Customer } from '../../types'
import { useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatDate, formatPriceExact } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { customerRepository } from '../../data/repositories/adminCustomerRepository'

/**
 * Customers module. The storefront is guest-only, so this is a read-only
 * aggregation of guest orders grouped by email — no duplicate customer table.
 */
export function AdminCustomers() {
  const { notify } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useDocumentMeta({
    title: 'Admin | Customers',
    description: 'WatchGuru.pk customers module: guest order history grouped by email.',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCustomers(await customerRepository.list())
    } catch (error) {
      notify(errorMessage(error, 'The customer list could not be loaded.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return customers
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(needle) ||
        customer.email.toLowerCase().includes(needle) ||
        customer.phone.toLowerCase().includes(needle) ||
        customer.city.toLowerCase().includes(needle),
    )
  }, [customers, query])

  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header>
        <p className="eyebrow text-gold">Relationships</p>
        <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Customers</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] font-light leading-relaxed text-ash">
          Guests are grouped by email from their orders. Editing an order updates this list.
        </p>
      </header>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <li className="bg-charcoal p-4 sm:p-5">
          <Users className="size-5 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <p className="mt-3 font-inter text-lg text-ivory sm:text-xl">{customers.length}</p>
          <p className="mt-1 font-akkurat text-[9px] tracking-[0.16em] text-muted uppercase">Customers</p>
        </li>
        <li className="bg-charcoal p-4 sm:p-5">
          <Mail className="size-5 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <p className="mt-3 font-inter text-lg text-ivory sm:text-xl">
            {customers.reduce((sum, customer) => sum + customer.ordersCount, 0)}
          </p>
          <p className="mt-1 font-akkurat text-[9px] tracking-[0.16em] text-muted uppercase">Orders</p>
        </li>
        <li className="col-span-2 bg-charcoal p-4 sm:col-span-1 sm:p-5">
          <p className="font-inter text-lg text-ivory sm:text-xl">{formatPriceExact(totalSpent)}</p>
          <p className="mt-1 font-akkurat text-[9px] tracking-[0.16em] text-muted uppercase">Lifetime value</p>
        </li>
      </ul>

      <label className="mt-6 flex items-center gap-2 border border-line bg-charcoal px-3 py-2.5 sm:max-w-md">
        <Search className="size-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, phone or city…"
          aria-label="Search customers"
          className="w-full bg-transparent font-inter text-[12.5px] font-light text-ivory outline-none placeholder:text-muted"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted hover:text-gold">
            <X className="size-4" strokeWidth={1.4} />
          </button>
        )}
      </label>

      <div className="mt-4 overflow-x-auto bg-charcoal">
        <table className="w-full min-w-[820px] text-left text-[12.5px]">
          <thead>
            <tr className="font-akkurat text-[8.5px] tracking-[0.2em] text-muted uppercase">
              <th scope="col" className="px-4 py-3">Customer</th>
              <th scope="col" className="px-4 py-3">Phone</th>
              <th scope="col" className="px-4 py-3">City</th>
              <th scope="col" className="px-4 py-3 text-center">Orders</th>
              <th scope="col" className="px-4 py-3 text-right">Spent</th>
              <th scope="col" className="px-4 py-3">Last order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.email}>
                <td className="px-4 py-3">
                  <p className="text-[13px] text-ivory">{customer.name}</p>
                  <p className="text-[10.5px] text-muted">{customer.email}</p>
                </td>
                <td className="px-4 py-3 text-ash">{customer.phone || '—'}</td>
                <td className="px-4 py-3 text-ash">{customer.city || '—'}</td>
                <td className="px-4 py-3 text-center font-inter tabular-nums text-ivory">
                  {customer.ordersCount}
                </td>
                <td className="px-4 py-3 text-right text-ivory">
                  {formatPriceExact(customer.totalSpent)}
                </td>
                <td className="px-4 py-3">
                  <p className="text-ash">{formatDate(customer.lastOrderAt)}</p>
                  <p className="text-[10px] text-muted">{customer.orderNumbers.join(', ')}</p>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ash">
                  {loading ? 'Loading customers…' : query ? `Nothing matches “${query}”.` : 'No orders yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
