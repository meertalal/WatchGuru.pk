import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import type { PaymentMethod, ShippingDetails } from '../../types'
import { useCatalog, useOrders, useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatPrice, classNames } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { createAdminOrder } from '../../data/repositories/orderRepository'

const BLANK_SHIPPING: ShippingDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Pakistan',
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'cod', label: 'Cash on delivery' },
  { value: 'bank-transfer', label: 'Bank transfer' },
  { value: 'easypaisa', label: 'Easypaisa' },
  { value: 'jazzcash', label: 'JazzCash' },
]

/** Order entry module: the store team can record a phone or WhatsApp order. */
export function AdminOrderNew() {
  const { products } = useCatalog()
  const { refresh } = useOrders()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [shipping, setShipping] = useState<ShippingDetails>(BLANK_SHIPPING)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [status, setStatus] = useState<'processing' | 'confirmed'>('processing')
  const [couponCode, setCouponCode] = useState('')
  const [lines, setLines] = useState<{ productId: string; quantity: number }[]>([
    { productId: '', quantity: 1 },
  ])
  const [saving, setSaving] = useState(false)

  useDocumentMeta({
    title: 'Admin | New order',
    description: 'WatchGuru.pk order entry module for phone and WhatsApp orders.',
  })

  const available = useMemo(
    () => products.filter((product) => product.inStock && product.stock > 0),
    [products],
  )

  const preview = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = products.find((entry) => entry.id === line.productId)
        return product ? sum + product.price * Math.max(1, line.quantity) : sum
      }, 0),
    [lines, products],
  )

  const setField = (key: keyof ShippingDetails, value: string) => {
    setShipping((current) => ({ ...current, [key]: value }))
  }

  const submit = async () => {
    setSaving(true)
    try {
      const items = lines
        .filter((line) => line.productId !== '')
        .map((line) => ({ productId: line.productId, quantity: line.quantity }))

      const order = await createAdminOrder({
        shipping,
        items,
        couponCode: couponCode.trim() || undefined,
        paymentMethod,
        status,
      })

      await refresh()
      notify(`${order.orderNumber} created.`)
      navigate('/admin/orders')
    } catch (error) {
      notify(errorMessage(error, 'The order could not be created.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'mt-1 w-full border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-ivory outline-none placeholder:text-muted focus:border-gold'

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8">
      <header>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Orders
        </Link>
        <p className="mt-3 eyebrow text-gold">Fulfilment</p>
        <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">New order</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] font-light leading-relaxed text-ash">
          Enter a phone or WhatsApp order. Stock, coupons and totals follow exactly the same rules
          as the storefront checkout.
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="bg-charcoal p-5 lg:col-span-3" aria-labelledby="customer-heading">
          <h2 id="customer-heading" className="font-cormorant text-xl text-ivory">Customer & delivery</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow text-ash">First name</span>
              <input value={shipping.firstName} onChange={(e) => setField('firstName', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="eyebrow text-ash">Last name</span>
              <input value={shipping.lastName} onChange={(e) => setField('lastName', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="eyebrow text-ash">Email</span>
              <input type="email" value={shipping.email} onChange={(e) => setField('email', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="eyebrow text-ash">Phone</span>
              <input value={shipping.phone} onChange={(e) => setField('phone', e.target.value)} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow text-ash">Address</span>
              <input value={shipping.address} onChange={(e) => setField('address', e.target.value)} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow text-ash">Apartment, suite (optional)</span>
              <input value={shipping.apartment ?? ''} onChange={(e) => setField('apartment', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="eyebrow text-ash">City</span>
              <input value={shipping.city} onChange={(e) => setField('city', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="eyebrow text-ash">State / province</span>
              <input value={shipping.state} onChange={(e) => setField('state', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="eyebrow text-ash">Postal code</span>
              <input value={shipping.postalCode} onChange={(e) => setField('postalCode', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="eyebrow text-ash">Country</span>
              <input value={shipping.country} onChange={(e) => setField('country', e.target.value)} className={inputClass} />
            </label>
          </div>

          <h2 className="mt-6 font-cormorant text-xl text-ivory">Payment & status</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow text-ash">Payment method</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className={inputClass}
              >
                {PAYMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow text-ash">Initial status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'processing' | 'confirmed')}
                className={inputClass}
              >
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow text-ash">Coupon code (optional)</span>
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="bg-charcoal p-5 lg:col-span-2" aria-labelledby="items-heading">
          <div className="flex items-center justify-between">
            <h2 id="items-heading" className="font-cormorant text-xl text-ivory">Items</h2>
            <button
              type="button"
              onClick={() => setLines((current) => [...current, { productId: '', quantity: 1 }])}
              className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.16em] text-gold uppercase hover:opacity-75"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add line
            </button>
          </div>

          <ul className="mt-3 flex flex-col gap-3">
            {lines.map((line, index) => (
              <li key={index} className="border border-line/70 p-3">
                <label className="block">
                  <span className="eyebrow text-ash">Product</span>
                  <select
                    value={line.productId}
                    onChange={(event) =>
                      setLines((current) =>
                        current.map((entry, i) =>
                          i === index ? { ...entry, productId: event.target.value } : entry,
                        ),
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">Choose a watch…</option>
                    {available.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {product.stock} left
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-2 flex items-end gap-2">
                  <label className="block w-24">
                    <span className="eyebrow text-ash">Qty</span>
                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(event) =>
                        setLines((current) =>
                          current.map((entry, i) =>
                            i === index
                              ? { ...entry, quantity: Math.max(1, Number(event.target.value)) }
                              : entry,
                          ),
                        )
                      }
                      className={inputClass}
                    />
                  </label>
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setLines((current) => current.filter((_, i) => i !== index))}
                      aria-label={`Remove line ${index + 1}`}
                      className="mb-1 p-2 text-ash transition-colors hover:text-error"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
            <span className="eyebrow text-ash">Items subtotal</span>
            <span className="font-inter text-[14px] text-ivory">{formatPrice(preview)}</span>
          </div>
          <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
            Tax (8%), coupon discount and shipping are calculated by the API exactly as at checkout.
          </p>

          <button
            type="button"
            disabled={saving}
            onClick={() => void submit()}
            className={classNames(
              'mt-4 w-full bg-button px-4 py-3 font-akkurat text-[10px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:bg-gold-bright',
              saving && 'opacity-60',
            )}
          >
            {saving ? 'Creating order…' : 'Create order'}
          </button>
        </section>
      </div>
    </div>
  )
}
