import { Link } from 'react-router-dom'
import { CheckCircle2, PackageCheck, Printer, Truck } from 'lucide-react'
import { formatDate, formatPriceExact } from '../lib/format'
import { useOrder } from '../store/contexts'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ProductImage } from '../components/ui/ProductImage'

export function OrderConfirmation() {
  const { lastOrder } = useOrder()

  if (!lastOrder) {
    return (
      <Container className="py-24">
        <EmptyState
          title="No recent order to show"
          description="Once you complete a demo checkout, your confirmation will appear here."
          action={
            <Link to="/shop">
              <Button size="lg">Browse the boutique</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  const { shipping } = lastOrder

  return (
    <Container className="py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold">
            <CheckCircle2 className="size-9" strokeWidth={1.4} />
          </span>
          <p className="eyebrow mt-6 text-gold">Order confirmed</p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
            Thank you, {shipping.firstName}.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-500">
            Your order has been placed. A confirmation would normally be sent to{' '}
            <span className="text-charcoal">{lastOrder.email}</span>. This is a demonstration
            storefront, so no email will actually be sent and no payment has been taken.
          </p>
        </div>

        {/* Order meta */}
        <div className="mt-10 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
          {[
            { label: 'Order number', value: lastOrder.orderNumber },
            { label: 'Date placed', value: formatDate(lastOrder.placedAt) },
          ].map((meta) => (
            <div key={meta.label} className="bg-white px-5 py-4 text-center">
              <p className="font-montserrat text-[10px] tracking-[0.18em] text-stone-400 uppercase">{meta.label}</p>
              <p className="mt-1.5 font-inter font-medium text-lg text-charcoal">{meta.value}</p>
            </div>
          ))}
        </div>

        {/* Items */}
        <section className="mt-10 border border-stone-200 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg">
            <PackageCheck className="size-5 text-gold" strokeWidth={1.6} />
            Items in this order
          </h2>
          <ul className="mt-5 divide-y divide-stone-100">
            {lastOrder.lines.map((line) => (
              <li key={line.productId} className="flex items-center gap-4 py-4">
                <Link to={`/product/${line.productId}`} className="shrink-0">
                  <ProductImage
                    src={line.image}
                    alt={line.name}
                    label={line.brand}
                    className="size-16"
                  />
                </Link>
                <div className="flex-1">
                  <p className="eyebrow text-stone-400">{line.brand}</p>
                  <Link
                    to={`/product/${line.productId}`}
                    className="text-sm text-charcoal transition-colors hover:text-gold"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-stone-400">Qty {line.quantity}</p>
                </div>
                <span className="font-inter font-medium text-sm text-charcoal">
                  {formatPriceExact(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 flex flex-col gap-3 border-t border-stone-200 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">Subtotal</dt>
              <dd className="text-charcoal">{formatPriceExact(lastOrder.subtotal)}</dd>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex items-center justify-between">
                <dt className="text-stone-500">
                  Discount {lastOrder.couponCode && `(${lastOrder.couponCode})`}
                </dt>
                <dd className="text-gold">−{formatPriceExact(lastOrder.discount)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">Shipping</dt>
              <dd className="text-charcoal">
                {lastOrder.shippingCost === 0 ? 'Free' : formatPriceExact(lastOrder.shippingCost)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">Tax</dt>
              <dd className="text-charcoal">{formatPriceExact(lastOrder.tax)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-stone-200 pt-4">
              <dt className="eyebrow text-charcoal">Total paid</dt>
              <dd className="font-inter font-medium text-2xl text-charcoal">
                {formatPriceExact(lastOrder.total)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Shipping */}
        <section className="mt-6 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
          <div className="bg-white p-6">
            <h3 className="flex items-center gap-2 text-sm font-medium tracking-[0.14em] text-charcoal uppercase">
              <Truck className="size-4 text-gold" /> Shipping to
            </h3>
            <address className="mt-3 text-sm leading-relaxed text-stone-500 not-italic">
              {shipping.firstName} {shipping.lastName}
              <br />
              {shipping.address}
              {shipping.apartment && (
                <>
                  <br />
                  {shipping.apartment}
                </>
              )}
              <br />
              {shipping.city}, {shipping.state} {shipping.postalCode}
              <br />
              {shipping.country}
            </address>
          </div>
          <div className="bg-white p-6">
            <h3 className="text-sm font-medium tracking-[0.14em] text-charcoal uppercase">
              What happens next
            </h3>
            <ol className="mt-3 flex flex-col gap-2 text-sm text-stone-500">
              <li>1. Your order would be authenticated and prepared by hand.</li>
              <li>2. A tracking link would be emailed on dispatch.</li>
              <li>3. Delivery within 3–6 business days, fully insured.</li>
            </ol>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/shop">
            <Button size="lg">Continue shopping</Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print receipt
          </Button>
        </div>
      </div>
    </Container>
  )
}
