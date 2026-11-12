import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Tag, Trash2, X } from 'lucide-react'
import type { AdminCoupon, CouponInput } from '../../types'
import { useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { classNames, formatPriceExact } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { adminCouponRepository } from '../../data/repositories/adminCouponRepository'

const BLANK: CouponInput = {
  code: '',
  type: 'percent',
  value: 10,
  label: '',
  active: true,
}

const toInput = (coupon: AdminCoupon): CouponInput => ({
  code: coupon.code,
  type: coupon.type,
  value: coupon.value,
  label: coupon.label,
  active: coupon.active,
})

/** Discounts module: coupon codes, separate from the catalogue and orders. */
export function AdminDiscounts() {
  const { notify } = useToast()
  const [coupons, setCoupons] = useState<AdminCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [editor, setEditor] = useState<{ open: boolean; coupon: AdminCoupon | null }>({
    open: false,
    coupon: null,
  })
  const [form, setForm] = useState<CouponInput>(BLANK)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState<number | null>(null)

  useDocumentMeta({
    title: 'Admin | Discounts',
    description: 'WatchGuru.pk discounts module: create and manage coupon codes.',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCoupons(await adminCouponRepository.list())
    } catch (error) {
      notify(errorMessage(error, 'The coupons could not be loaded.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void load()
  }, [load])

  const openEditor = (coupon: AdminCoupon | null) => {
    setForm(coupon ? toInput(coupon) : BLANK)
    setEditor({ open: true, coupon })
  }

  const save = async () => {
    setSaving(true)
    try {
      const saved = editor.coupon
        ? await adminCouponRepository.update(editor.coupon.id, form)
        : await adminCouponRepository.create(form)
      setCoupons((current) => {
        const index = current.findIndex((coupon) => coupon.id === saved.id)
        if (index < 0) return [...current, saved]
        const next = [...current]
        next[index] = saved
        return next
      })
      notify(`${saved.code} saved.`)
      setEditor({ open: false, coupon: null })
    } catch (error) {
      notify(errorMessage(error, 'The coupon could not be saved.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (coupon: AdminCoupon) => {
    setBusy(coupon.id)
    try {
      const updated = await adminCouponRepository.update(coupon.id, {
        ...toInput(coupon),
        active: !coupon.active,
      })
      setCoupons((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      notify(`${updated.code} ${updated.active ? 'enabled' : 'disabled'}.`, 'info')
    } catch (error) {
      notify(errorMessage(error, 'The coupon could not be updated.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (coupon: AdminCoupon) => {
    if (!window.confirm(`Delete coupon “${coupon.code}”? This cannot be undone.`)) return
    setBusy(coupon.id)
    try {
      await adminCouponRepository.remove(coupon.id)
      setCoupons((current) => current.filter((entry) => entry.id !== coupon.id))
      notify(`${coupon.code} deleted.`, 'info')
    } catch (error) {
      notify(errorMessage(error, 'The coupon could not be deleted.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Merchandising</p>
          <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Discounts</h1>
          <p className="mt-1 text-[12.5px] font-light text-ash">
            Coupon codes are checked by the checkout and order entry modules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openEditor(null)}
          className="flex items-center gap-2 bg-button px-4 py-3 font-akkurat text-[9px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:bg-gold-bright"
        >
          <Plus className="size-4" aria-hidden="true" />
          New coupon
        </button>
      </header>

      <div className="mt-6 overflow-x-auto bg-charcoal">
        <table className="w-full min-w-[720px] text-left text-[12.5px]">
          <thead>
            <tr className="font-akkurat text-[8.5px] tracking-[0.2em] text-muted uppercase">
              <th scope="col" className="px-4 py-3">Code</th>
              <th scope="col" className="px-4 py-3">Discount</th>
              <th scope="col" className="px-4 py-3">Label</th>
              <th scope="col" className="px-4 py-3 text-center">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 font-inter text-ivory">
                    <Tag className="size-3.5 text-gold" strokeWidth={1.5} aria-hidden="true" />
                    {coupon.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-ash">
                  {coupon.type === 'percent' ? `${coupon.value}% off` : `${formatPriceExact(coupon.value)} off`}
                </td>
                <td className="px-4 py-3 text-ash">{coupon.label || '—'}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    disabled={busy === coupon.id}
                    onClick={() => void toggleActive(coupon)}
                    aria-pressed={coupon.active}
                    className={classNames(
                      'rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:opacity-50',
                      coupon.active
                        ? 'border-gold/40 bg-gold/10 text-gold hover:border-error/40 hover:bg-error/10 hover:text-error'
                        : 'border-line text-muted hover:border-gold/40 hover:text-gold',
                    )}
                  >
                    {coupon.active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEditor(coupon)}
                      aria-label={`Edit ${coupon.code}`}
                      className="p-2 text-muted transition-colors hover:text-gold"
                    >
                      <Pencil className="size-4" strokeWidth={1.4} />
                    </button>
                    <button
                      type="button"
                      disabled={busy === coupon.id}
                      onClick={() => void remove(coupon)}
                      aria-label={`Delete ${coupon.code}`}
                      className="p-2 text-ash transition-colors hover:text-error disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ash">
                  {loading ? 'Loading coupons…' : 'No coupon codes yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editor.open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close coupon editor"
            onClick={() => setEditor({ open: false, coupon: null })}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editor.coupon ? `Edit ${editor.coupon.code}` : 'New coupon'}
            className="relative w-full max-w-md bg-obsidian p-6 shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-gold">{editor.coupon ? 'Editing' : 'New coupon'}</p>
                <h2 className="mt-1 font-cormorant text-xl text-ivory">
                  {editor.coupon ? editor.coupon.code : 'Discount code'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditor({ open: false, coupon: null })}
                aria-label="Close"
                className="text-muted hover:text-gold"
              >
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </header>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="eyebrow text-ash">Code</span>
                <input
                  value={form.code}
                  onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
                  placeholder="WELCOME10"
                  className="mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none placeholder:text-muted focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="eyebrow text-ash">Type</span>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value as CouponInput['type'] })
                  }
                  className="mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none focus:border-gold"
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </label>
              <label className="block">
                <span className="eyebrow text-ash">
                  {form.type === 'percent' ? 'Percent off' : 'Amount off (PKR)'}
                </span>
                <input
                  type="number"
                  min={1}
                  value={form.value}
                  onChange={(event) => setForm({ ...form, value: Number(event.target.value) })}
                  className="mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none focus:border-gold"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="eyebrow text-ash">Label (optional)</span>
                <input
                  value={form.label}
                  onChange={(event) => setForm({ ...form, label: event.target.value })}
                  placeholder="Welcome offer"
                  className="mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none placeholder:text-muted focus:border-gold"
                />
              </label>
              <label className="flex items-center gap-3 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm({ ...form, active: event.target.checked })}
                  className="size-4 accent-gold"
                />
                <span className="text-[12.5px] text-ivory">Active at checkout</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditor({ open: false, coupon: null })}
                className="border border-line px-4 py-2.5 text-[10px] font-medium tracking-[0.18em] text-ash uppercase hover:text-ivory"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="bg-button px-4 py-2.5 text-[10px] font-medium tracking-[0.18em] text-button-text uppercase hover:bg-gold-bright disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
