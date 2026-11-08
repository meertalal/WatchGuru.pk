import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Banknote,
  Building2,
  Landmark,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Tag,
} from 'lucide-react'
import { formatPrice, classNames } from '../lib/format'
import {
  DEMO_COUPONS,
  computeTotals,
  findCoupon,
  nowIso,
  type Coupon,
} from '../lib/cart'
import { COD_ADVANCE_PKR, PAYMENT_METHOD_LABEL, generateOrderNumber } from '../lib/orders'
import { COUNTRIES, checkoutSchema, type CheckoutValues } from '../lib/validation'
import { useCart, useOrders, useToast } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Order, PaymentMethod, ShippingDetails } from '../types'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ProductImage } from '../components/ui/ProductImage'
import { SelectField, TextField } from '../components/ui/FormControls'

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  hint: string
  icon: typeof Banknote
}[] = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    hint: 'Pay when your watch arrives. A Rs. 1,000 advance confirms the order and is adjusted on delivery.',
    icon: Banknote,
  },
  {
    value: 'bank-transfer',
    label: 'Bank Transfer',
    hint: 'We share our account details on WhatsApp; your order dispatches once the advance reflects.',
    icon: Building2,
  },
  {
    value: 'easypaisa',
    label: 'Easypaisa',
    hint: 'Advance via Easypaisa to the number shared after checkout; instant confirmation.',
    icon: Smartphone,
  },
  {
    value: 'jazzcash',
    label: 'JazzCash',
    hint: 'Advance via JazzCash to the number shared after checkout; instant confirmation.',
    icon: Landmark,
  },
]

export function Checkout() {
  const navigate = useNavigate()
  const { items, clear } = useCart()
  const { placeOrder } = useOrders()
  const { notify } = useToast()

  useDocumentMeta({
    title: 'Secure Checkout',
    description:
      'Complete your WatchGuru.pk order with Cash on Delivery, bank transfer or mobile wallets. Insured nationwide delivery.',
    noindex: true,
  })

  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [redirecting, setRedirecting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
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
    },
  })

  const totals = computeTotals(
    items.map((i) => ({ price: i.product.price, quantity: i.quantity })),
    { coupon },
  )

  if (items.length === 0 && !redirecting) {
    return (
      <>
        <PageBanner
          title="Checkout"
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]}
        />
        <Container className="py-16">
          <EmptyState
            icon={<ShoppingBag className="size-12" strokeWidth={1.1} />}
            title="Nothing to check out yet"
            description="Add a watch to your cart and your checkout will appear here."
            action={
              <Link to="/collections/all">
                <Button size="lg">Browse the boutique</Button>
              </Link>
            }
          />
        </Container>
      </>
    )
  }

  const applyCoupon = () => {
    const found = findCoupon(couponInput)
    if (!found) {
      setCoupon(null)
      setCouponError('That code isn’t recognised. Try WATCHGURU10.')
      return
    }
    setCoupon(found)
    setCouponError('')
    notify(`Coupon ${found.code} applied: ${found.label}`, 'success')
  }

  const onSubmit = async (values: CheckoutValues) => {
    await new Promise((resolve) => setTimeout(resolve, 700))

    const shipping: ShippingDetails = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      apartment: values.apartment,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
    }

    const order: Order = {
      orderNumber: generateOrderNumber(),
      placedAt: nowIso(),
      email: values.email,
      customerName: `${values.firstName} ${values.lastName}`,
      shipping,
      lines: items.map(({ product, quantity }) => ({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity,
        image: product.images[0],
      })),
      subtotal: totals.subtotal,
      shippingCost: totals.shippingCost,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      couponCode: coupon?.code,
      paymentMethod,
      status: 'processing',
      statusHistory: [{ status: 'processing', at: nowIso() }],
    }

    setRedirecting(true)
    placeOrder(order)
    clear()
    notify('Order received. Our team will confirm within minutes.')
    navigate('/order-confirmation')
  }

  return (
    <>
      <PageBanner
        eyebrow="Guest checkout"
        title="Secure Checkout"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <Container className="py-12 lg:py-16">
        <div className="mb-8 flex items-start gap-3 bg-charcoal px-4 py-3 text-[12px] font-light leading-relaxed text-ash">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.4} aria-hidden="true" />
          <p>
            Every order is confirmed by phone or WhatsApp before dispatch, and your watch is
            insured until it is in your hands. No card data is ever collected on this site.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
            <div className="flex flex-col gap-10">
              {/* Contact */}
              <section>
                <div className="mb-5">
                  <h2 className="font-cormorant text-2xl text-ivory">Contact details</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="First name"
                    id="firstName"
                    autoComplete="given-name"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  <TextField
                    label="Last name"
                    id="lastName"
                    autoComplete="family-name"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                  <TextField
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    containerClassName="sm:col-span-2"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <TextField
                    label="Phone (WhatsApp preferred)"
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    containerClassName="sm:col-span-2"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>
              </section>

              {/* Shipping address */}
              <section>
                <h2 className="mb-5 font-cormorant text-2xl text-ivory">Shipping address</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Street address"
                    id="address"
                    autoComplete="address-line1"
                    containerClassName="sm:col-span-2"
                    error={errors.address?.message}
                    {...register('address')}
                  />
                  <TextField
                    label="Apartment, suite (optional)"
                    id="apartment"
                    autoComplete="address-line2"
                    containerClassName="sm:col-span-2"
                    {...register('apartment')}
                  />
                  <TextField
                    label="City"
                    id="city"
                    autoComplete="address-level2"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <TextField
                    label="State / region"
                    id="state"
                    autoComplete="address-level1"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                  <TextField
                    label="Postal code"
                    id="postalCode"
                    autoComplete="postal-code"
                    error={errors.postalCode?.message}
                    {...register('postalCode')}
                  />
                  <SelectField
                    label="Country"
                    id="country"
                    autoComplete="country-name"
                    error={errors.country?.message}
                    options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                    {...register('country')}
                  />
                </div>
              </section>

              {/* Payment method */}
              <fieldset>
                <legend className="mb-5 font-cormorant text-2xl text-ivory">Payment method</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PAYMENT_METHODS.map(({ value, label, hint, icon: Icon }) => {
                    const selected = paymentMethod === value
                    return (
                      <label
                        key={value}
                        className={classNames(
                          'flex cursor-pointer items-start gap-3 border p-4 transition-colors',
                          selected
                            ? 'border-gold/70 bg-charcoal'
                            : 'border-line bg-charcoal hover:border-gold/50',
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={value}
                          checked={selected}
                          onChange={() => setPaymentMethod(value)}
                          className="sr-only"
                        />
                        <Icon
                          className={classNames(
                            'mt-0.5 size-5 shrink-0',
                            selected ? 'text-gold' : 'text-ash',
                          )}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span>
                          <span className="block font-akkurat text-[9px] font-medium tracking-[0.16em] text-ivory uppercase">{label}</span>
                          <span className="mt-1.5 block text-[11px] font-light leading-relaxed text-ash">
                            {hint}
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>

                {paymentMethod === 'cod' && (
                  <p className="mt-4 border-l-2 border-gold bg-coal px-4 py-3 text-[11.5px] font-light leading-relaxed text-ash">
                    A Rs. {COD_ADVANCE_PKR.toLocaleString('en-PK')} advance confirms your order.
                    Our team calls or messages to verify, and the advance is adjusted against your
                    balance. You pay the remainder in cash, on delivery.
                  </p>
                )}
              </fieldset>
            </div>

            {/* Order summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-charcoal p-6">
                <h2 className="font-cormorant text-2xl text-ivory">Order summary</h2>

                <ul className="mt-5 flex flex-col gap-4">
                  {items.map(({ product, quantity, lineTotal }) => (
                    <li key={product.id} className="flex gap-3">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        label={product.brand}
                        className="size-16 shrink-0"
                      />
                      <div className="flex flex-1 flex-col">
                        <Link
                          to={`/products/${product.slug}`}
                          className="font-cormorant text-base leading-snug text-ivory transition-colors hover:text-gold"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[10.5px] text-muted">
                          {product.brand}, Qty {quantity}
                        </span>
                      </div>
                      <span className="font-inter text-[12px] font-normal text-ivory">
                        {formatPrice(lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Coupon */}
                <div className="mt-6 pt-5">
                  <label
                    htmlFor="coupon"
                    className="mb-2 flex items-center gap-1.5 font-akkurat text-[10px] font-medium tracking-[0.18em] text-ash uppercase"
                  >
                    <Tag className="size-3.5" /> Coupon code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter code"
                      className="w-full border border-line bg-charcoal px-3 py-2.5 font-inter text-[13px] font-light text-ivory outline-none transition-colors placeholder:text-muted focus:border-gold"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="mt-1.5 text-xs text-error">{couponError}</p>}
                  {coupon && (
                    <p className="mt-2 text-xs text-gold">
                      {coupon.code} applied: {coupon.label}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-ash">
                    Demo codes:{' '}
                    {DEMO_COUPONS.map((c) => c.code).join(', ')}
                  </p>
                </div>

                {/* Totals */}
                <dl className="mt-5 flex flex-col gap-3 pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-ash">Subtotal</dt>
                    <dd className="text-ivory">{formatPrice(totals.subtotal)}</dd>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <dt className="text-ash">Discount</dt>
                      <dd className="text-gold">−{formatPrice(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <dt className="text-ash">Shipping</dt>
                    <dd className="text-ivory">
                      {totals.shippingCost === 0 ? 'Free, insured' : formatPrice(totals.shippingCost)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ash">Estimated tax</dt>
                    <dd className="text-ivory">{formatPrice(totals.tax)}</dd>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex items-center justify-between text-[12px] text-ash">
                      <dt>Payable advance</dt>
                      <dd>Rs. {COD_ADVANCE_PKR.toLocaleString('en-PK')}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4">
                    <dt className="eyebrow text-ivory">Total</dt>
                    <dd className="font-inter text-2xl font-normal text-ivory">
                      {formatPrice(totals.total)}
                    </dd>
                  </div>
                </dl>

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  disabled={isSubmitting}
                  className="mt-6 w-full"
                >
                  {isSubmitting
                    ? 'Placing order…'
                    : `Place order, ${formatPrice(totals.total)}`}
                </Button>

                <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-ash">
                  <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
                  {PAYMENT_METHOD_LABEL[paymentMethod]}, no card data collected
                </p>
              </div>
            </aside>
          </div>
        </form>
      </Container>
    </>
  )
}
