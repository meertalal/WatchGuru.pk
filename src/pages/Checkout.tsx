import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ShieldCheck,
  ShoppingBag,
  Tag,
} from 'lucide-react'
import { formatPrice } from '../lib/format'
import {
  DEMO_COUPONS,
  computeTotals,
  findCoupon,
  generateOrderNumber,
  nowIso,
  type Coupon,
} from '../lib/cart'
import { COUNTRIES, checkoutSchema, type CheckoutValues } from '../lib/validation'
import { useCart, useOrder, useToast } from '../store/contexts'
import type { Order, ShippingDetails } from '../types'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ProductImage } from '../components/ui/ProductImage'
import { SelectField, TextField } from '../components/ui/FormControls'

export function Checkout() {
  const navigate = useNavigate()
  const { items, clear } = useCart()
  const { placeOrder } = useOrder()
  const { notify } = useToast()

  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState('')
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
              <Link to="/shop">
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
    notify(`Coupon ${found.code} applied — ${found.label}`, 'success')
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
    }

    setRedirecting(true)
    placeOrder(order)
    clear()
    notify('Order placed — this is a simulated checkout.')
    navigate('/order-confirmation')
  }

  return (
    <>
      <PageBanner
        eyebrow="Demo checkout"
        title="Checkout"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <Container className="py-12 lg:py-16">
        <div className="mb-8 flex items-start gap-3 border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-charcoal">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>
            This is a demonstration checkout. Your details are used to create a demo order, and no watch is shipped.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
            <div className="flex flex-col gap-10">
              {/* Contact */}
              <section>
                <h2 className="mb-5 text-xl">Contact details</h2>
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
                    label="Phone"
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
                <h2 className="mb-5 text-xl">Shipping address</h2>
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

            </div>

            {/* Order summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-stone-200 bg-white p-6">
                <h2 className="text-xl">Order summary</h2>

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
                        <span className="text-sm text-charcoal">{product.name}</span>
                        <span className="text-xs text-stone-400">
                          {product.brand} · Qty {quantity}
                        </span>
                      </div>
                      <span className="font-inter font-medium text-sm text-charcoal">
                        {formatPrice(lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Coupon */}
                <div className="mt-6 border-t border-stone-200 pt-5">
                  <label
                    htmlFor="coupon"
                    className="mb-2 flex items-center gap-1.5 font-montserrat text-[10px] font-medium tracking-[0.18em] text-stone-500 uppercase"
                  >
                    <Tag className="size-3.5" /> Coupon code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter code"
                      className="w-full border border-stone-300 bg-white px-3 py-2.5 font-lato text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-charcoal"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="mt-1.5 text-xs text-red-500">{couponError}</p>}
                  {coupon && (
                    <p className="mt-2 text-xs text-gold">
                      {coupon.code} applied — {coupon.label}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-stone-400">
                    Demo codes:{' '}
                    {DEMO_COUPONS.map((c) => c.code).join(' · ')}
                  </p>
                </div>

                {/* Totals */}
                <dl className="mt-5 flex flex-col gap-3 border-t border-stone-200 pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-stone-500">Subtotal</dt>
                    <dd className="text-charcoal">{formatPrice(totals.subtotal)}</dd>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <dt className="text-stone-500">Discount</dt>
                      <dd className="text-gold">−{formatPrice(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <dt className="text-stone-500">Shipping</dt>
                    <dd className="text-charcoal">
                      {totals.shippingCost === 0 ? 'Free' : formatPrice(totals.shippingCost)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-stone-500">Estimated tax</dt>
                    <dd className="text-charcoal">{formatPrice(totals.tax)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-stone-200 pt-4">
                    <dt className="eyebrow text-charcoal">Total</dt>
                    <dd className="font-inter font-medium text-2xl text-charcoal">{formatPrice(totals.total)}</dd>
                  </div>
                </dl>

                <Button
                  type="submit"
                  size="lg"
                  variant="gold"
                  disabled={isSubmitting}
                  className="mt-6 w-full"
                >
                  {isSubmitting ? 'Placing order…' : `Place demo order · ${formatPrice(totals.total)}`}
                </Button>

                <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                  <ShieldCheck className="size-3.5 text-gold" />
                  Demo order · no payment is collected
                </p>
              </div>
            </aside>
          </div>
        </form>
      </Container>
    </>
  )
}
