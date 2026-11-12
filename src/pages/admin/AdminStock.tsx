import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, Search, X } from 'lucide-react'
import type { Product, StockOverview } from '../../types'
import { useCatalog, useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { classNames, formatDate, formatPriceExact } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { stockRepository } from '../../data/repositories/adminStockRepository'
import { ProductImage } from '../../components/ui/ProductImage'

type View = 'all' | 'low' | 'out'

const TYPE_LABEL = { in: 'Stock in', out: 'Stock out', correction: 'Correction' } as const

/**
 * Inventory module. Separate from the catalogue: stock levels and every
 * movement are managed here, while product content stays in the catalogue.
 */
export function AdminStock() {
  const { products, refresh } = useCatalog()
  const { notify } = useToast()
  const [overview, setOverview] = useState<StockOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('all')
  const [adjusting, setAdjusting] = useState<Product | null>(null)
  const [type, setType] = useState<'in' | 'out' | 'correction'>('in')
  const [quantity, setQuantity] = useState('1')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  useDocumentMeta({
    title: 'Admin | Stock',
    description: 'WatchGuru.pk inventory module: stock levels, adjustments and movement history.',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setOverview(await stockRepository.overview())
    } catch (error) {
      notify(errorMessage(error, 'The stock ledger could not be loaded.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void load()
  }, [load])

  const threshold = overview?.summary.threshold ?? 5

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return products
      .filter((product) => {
        if (view === 'out' && product.stock !== 0) return false
        if (view === 'low' && !(product.stock > 0 && product.stock < threshold)) return false
        if (!needle) return true
        return (
          product.name.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle) ||
          product.slug.toLowerCase().includes(needle)
        )
      })
      .sort((a, b) => a.stock - b.stock)
  }, [products, query, view, threshold])

  const openAdjust = (product: Product, next: 'in' | 'out' | 'correction' = 'in') => {
    setAdjusting(product)
    setType(next)
    setQuantity(next === 'correction' ? String(product.stock) : '1')
    setReason('')
  }

  const submitAdjust = async () => {
    if (!adjusting) return
    setSaving(true)
    try {
      const movement = await stockRepository.adjust({
        productId: adjusting.id,
        type,
        quantity: Number(quantity),
        reason: reason.trim() || undefined,
      })
      notify(
        `${adjusting.name}: ${movement.quantity > 0 ? '+' : ''}${movement.quantity} → ${movement.balanceAfter} in stock.`,
      )
      setAdjusting(null)
      await Promise.all([refresh(), load()])
    } catch (error) {
      notify(errorMessage(error, 'The stock adjustment could not be saved.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const stats = [
    { label: 'Units on hand', value: String(overview?.summary.units ?? 0), icon: Boxes },
    {
      label: 'Retail value',
      value: formatPriceExact(overview?.summary.retailValue ?? 0),
      icon: ArrowUpFromLine,
    },
    { label: `Low stock (< ${threshold})`, value: String(overview?.summary.lowStock ?? 0), icon: AlertTriangle },
    { label: 'Sold out', value: String(overview?.summary.soldOut ?? 0), icon: ArrowDownToLine },
  ]

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header>
        <p className="eyebrow text-gold">Inventory</p>
        <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Stock</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] font-light leading-relaxed text-ash">
          Stock lives in its own module. Every adjustment below is written to the movement ledger,
          so each balance can be explained.
        </p>
      </header>

      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <li key={label} className="bg-charcoal p-4 sm:p-5">
            <Icon className="size-5 text-muted" strokeWidth={1.4} aria-hidden="true" />
            <p className="mt-3 font-inter text-lg leading-tight text-ivory sm:text-xl">{value}</p>
            <p className="mt-1 font-akkurat text-[9px] leading-snug tracking-[0.16em] text-muted uppercase">
              {label}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 border border-line bg-charcoal px-3 py-2.5">
          <Search className="size-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product, brand or slug…"
            aria-label="Search stock"
            className="w-full bg-transparent font-inter text-[12.5px] font-light text-ivory outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted hover:text-gold">
              <X className="size-4" strokeWidth={1.4} />
            </button>
          )}
        </label>
        <div className="flex gap-1.5" role="tablist" aria-label="Filter stock">
          {(['all', 'low', 'out'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={view === value}
              onClick={() => setView(value)}
              className={classNames(
                'border px-3 py-2 font-akkurat text-[10px] font-medium tracking-[0.14em] uppercase transition-colors',
                view === value
                  ? 'border-gold/70 bg-charcoal text-ivory'
                  : 'border-line text-ash hover:border-gold/50 hover:text-ivory',
              )}
            >
              {value === 'all' ? 'All' : value === 'low' ? 'Low' : 'Sold out'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto bg-charcoal">
        <table className="w-full min-w-[780px] text-left text-[12.5px]">
          <thead>
            <tr className="font-akkurat text-[8.5px] tracking-[0.2em] text-muted uppercase">
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">Brand</th>
              <th scope="col" className="px-4 py-3 text-center">On hand</th>
              <th scope="col" className="px-4 py-3 text-center">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Stock value</th>
              <th scope="col" className="px-4 py-3 text-right">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage src={product.images[0]} alt={product.name} label={product.brand} className="size-11 shrink-0" />
                    <div className="min-w-0 max-w-[240px]">
                      <p className="truncate font-cormorant text-base text-ivory">{product.name}</p>
                      <p className="truncate text-[9.5px] text-muted">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ash">{product.brand}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={classNames(
                      'font-inter tabular-nums',
                      product.stock === 0 ? 'text-error' : product.stock < threshold ? 'text-gold' : 'text-ivory',
                    )}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={classNames(
                      'rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase',
                      product.stock === 0
                        ? 'border border-error/40 bg-error/10 text-error'
                        : product.stock < threshold
                          ? 'border border-gold/40 bg-gold/10 text-gold'
                          : 'border border-line text-ash',
                    )}
                  >
                    {product.stock === 0 ? 'Sold out' : product.stock < threshold ? 'Low' : 'In stock'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-ash">
                  {formatPriceExact(product.price * product.stock)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openAdjust(product, 'in')}
                      className="border border-line px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-ash uppercase transition-colors hover:border-gold hover:text-gold"
                    >
                      In
                    </button>
                    <button
                      type="button"
                      onClick={() => openAdjust(product, 'out')}
                      className="border border-line px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-ash uppercase transition-colors hover:border-gold hover:text-gold"
                    >
                      Out
                    </button>
                    <button
                      type="button"
                      onClick={() => openAdjust(product, 'correction')}
                      className="border border-line px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-ash uppercase transition-colors hover:border-gold hover:text-gold"
                    >
                      Set
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ash">
                  {loading ? 'Loading stock…' : 'No products match this view.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-8" aria-labelledby="ledger-heading">
        <h2 id="ledger-heading" className="font-cormorant text-xl text-ivory">Movement ledger</h2>
        <p className="mt-1 text-[11.5px] text-ash">The most recent manual stock changes across the boutique.</p>
        <ul className="mt-3 divide-y divide-line/60 bg-charcoal">
          {(overview?.movements ?? []).slice(0, 20).map((movement) => (
            <li key={movement.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[12.5px] text-ivory">{movement.productName}</p>
                <p className="text-[10.5px] text-muted">
                  {formatDate(movement.createdAt)} · {movement.reason}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={classNames(
                    'text-[9px] font-semibold tracking-[0.16em] uppercase',
                    movement.quantity > 0 ? 'text-gold' : 'text-error',
                  )}
                >
                  {TYPE_LABEL[movement.type]}
                </span>
                <span className="font-inter text-[12px] tabular-nums text-ivory">
                  {movement.quantity > 0 ? '+' : ''}
                  {movement.quantity}
                </span>
                <span className="text-[10.5px] text-muted">→ {movement.balanceAfter}</span>
              </div>
            </li>
          ))}
          {(overview?.movements ?? []).length === 0 && (
            <li className="px-4 py-8 text-center text-[12px] text-ash">No stock movements yet.</li>
          )}
        </ul>
      </section>

      {adjusting && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close stock adjustment"
            onClick={() => setAdjusting(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Adjust stock for ${adjusting.name}`}
            className="relative w-full max-w-md bg-obsidian p-6 shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-gold">Stock adjustment</p>
                <h2 className="mt-1 font-cormorant text-xl text-ivory">{adjusting.name}</h2>
                <p className="mt-1 text-[11px] text-ash">
                  Currently {adjusting.stock} on hand · {adjusting.brand}
                </p>
              </div>
              <button type="button" onClick={() => setAdjusting(null)} aria-label="Close" className="text-muted hover:text-gold">
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </header>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="eyebrow text-ash">Movement type</span>
                <select
                  value={type}
                  onChange={(event) => {
                    const next = event.target.value as 'in' | 'out' | 'correction'
                    setType(next)
                    setQuantity(next === 'correction' ? String(adjusting.stock) : '1')
                  }}
                  className="mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none focus:border-gold"
                >
                  <option value="in">Stock in</option>
                  <option value="out">Stock out</option>
                  <option value="correction">Set exact level</option>
                </select>
              </label>

              <label className="block">
                <span className="eyebrow text-ash">
                  {type === 'correction' ? 'New stock level' : 'Quantity'}
                </span>
                <input
                  type="number"
                  min={type === 'correction' ? 0 : 1}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none focus:border-gold"
                />
              </label>

              <label className="block">
                <span className="eyebrow text-ash">Reason (optional)</span>
                <input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="New delivery, stocktake, damaged…"
                  className="mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none placeholder:text-muted focus:border-gold"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAdjusting(null)}
                className="border border-line px-4 py-2.5 text-[10px] font-medium tracking-[0.18em] text-ash uppercase hover:text-ivory"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void submitAdjust()}
                className="bg-button px-4 py-2.5 text-[10px] font-medium tracking-[0.18em] text-button-text uppercase hover:bg-gold-bright disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
