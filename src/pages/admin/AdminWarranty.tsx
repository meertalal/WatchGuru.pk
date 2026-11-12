import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Plus, Search, ShieldCheck, Trash2, X } from 'lucide-react'
import type { AdminWarrantySerial } from '../../types'
import { useCatalog, useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { classNames, formatDate } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { warrantyAdminRepository } from '../../data/repositories/adminWarrantyRepository'

/** Warranty module: serial registration, verification status and removal. */
export function AdminWarranty() {
  const { products } = useCatalog()
  const { notify } = useToast()
  const [serials, setSerials] = useState<AdminWarrantySerial[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [serial, setSerial] = useState('')
  const [productId, setProductId] = useState('')
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState<number | null>(null)

  useDocumentMeta({
    title: 'Admin | Warranty',
    description: 'WatchGuru.pk warranty module: register and verify serial numbers.',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setSerials(await warrantyAdminRepository.list())
    } catch (error) {
      notify(errorMessage(error, 'Warranty serials could not be loaded.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void load()
  }, [load])

  const productNames = useMemo(() => {
    const map = new Map<string, string>()
    for (const product of products) map.set(product.id, product.name)
    return map
  }, [products])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return serials
    return serials.filter(
      (entry) =>
        entry.serial.toLowerCase().includes(needle) ||
        (entry.productId ?? '').toLowerCase().includes(needle) ||
        (productNames.get(entry.productId ?? '') ?? '').toLowerCase().includes(needle),
    )
  }, [serials, query, productNames])

  const create = async () => {
    setSaving(true)
    try {
      const created = await warrantyAdminRepository.create({
        serial,
        productId: productId || undefined,
      })
      setSerials((current) => [created, ...current])
      setSerial('')
      setProductId('')
      notify(`${created.serial} registered.`)
    } catch (error) {
      notify(errorMessage(error, 'The serial could not be registered.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (entry: AdminWarrantySerial) => {
    if (!window.confirm(`Delete warranty serial “${entry.serial}”?`)) return
    setBusy(entry.id)
    try {
      await warrantyAdminRepository.remove(entry.id)
      setSerials((current) => current.filter((item) => item.id !== entry.id))
      notify(`${entry.serial} deleted.`, 'info')
    } catch (error) {
      notify(errorMessage(error, 'The serial could not be deleted.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header>
        <p className="eyebrow text-gold">Support</p>
        <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Warranty</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] font-light leading-relaxed text-ash">
          Register the serials that ship with each watch. Customers verify them on the warranty
          page; every check is timestamped here.
        </p>
      </header>

      <section className="mt-6 bg-charcoal p-4" aria-label="Register a warranty serial">
        <h2 className="flex items-center gap-2 eyebrow text-ash">
          <ShieldCheck className="size-4" strokeWidth={1.4} aria-hidden="true" />
          Register a serial
        </h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="eyebrow text-ash">Serial number</span>
            <input
              value={serial}
              onChange={(event) => setSerial(event.target.value.toUpperCase())}
              placeholder="WG-2026-0001"
              className="mt-1 w-full border border-line bg-obsidian px-3 py-2.5 text-[12.5px] text-ivory outline-none placeholder:text-muted focus:border-gold"
            />
          </label>
          <label className="block flex-1">
            <span className="eyebrow text-ash">Product (optional)</span>
            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              className="mt-1 w-full border border-line bg-obsidian px-3 py-2.5 text-[12.5px] text-ivory outline-none focus:border-gold"
            >
              <option value="">Not linked</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={saving || serial.trim() === ''}
            onClick={() => void create()}
            className="flex items-center justify-center gap-2 bg-button px-4 py-2.5 font-akkurat text-[9px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:bg-gold-bright disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" />
            {saving ? 'Saving…' : 'Register'}
          </button>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex flex-1 items-center gap-2 border border-line bg-charcoal px-3 py-2.5 sm:max-w-md">
          <Search className="size-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search serial or product…"
            aria-label="Search warranty serials"
            className="w-full bg-transparent font-inter text-[12.5px] font-light text-ivory outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted hover:text-gold">
              <X className="size-4" strokeWidth={1.4} />
            </button>
          )}
        </label>
        <p className="text-[11px] text-ash">
          {serials.length} registered · {serials.filter((entry) => entry.verified).length} verified
        </p>
      </div>

      <div className="mt-4 overflow-x-auto bg-charcoal">
        <table className="w-full min-w-[720px] text-left text-[12.5px]">
          <thead>
            <tr className="font-akkurat text-[8.5px] tracking-[0.2em] text-muted uppercase">
              <th scope="col" className="px-4 py-3">Serial</th>
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">Registered</th>
              <th scope="col" className="px-4 py-3 text-center">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-3 font-inter text-ivory">{entry.serial}</td>
                <td className="px-4 py-3 text-ash">
                  {entry.productId ? (productNames.get(entry.productId) ?? entry.productId) : '—'}
                </td>
                <td className="px-4 py-3 text-ash">{formatDate(entry.createdAt)}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={classNames(
                      'rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase',
                      entry.verified
                        ? 'border border-gold/40 bg-gold/10 text-gold'
                        : 'border border-line text-muted',
                    )}
                  >
                    {entry.verified ? 'Verified' : 'Unused'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {entry.verified && entry.verifiedAt && (
                      <span className="hidden items-center gap-1 text-[10px] text-muted sm:inline-flex">
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        {formatDate(entry.verifiedAt)}
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={busy === entry.id}
                      onClick={() => void remove(entry)}
                      aria-label={`Delete ${entry.serial}`}
                      className="p-2 text-ash transition-colors hover:text-error disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ash">
                  {loading ? 'Loading serials…' : query ? `Nothing matches “${query}”.` : 'No serials registered yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
