import { Link } from 'react-router-dom'
import { CheckCircle2, PackageCheck, Printer, Truck } from 'lucide-react'
import { formatDate, formatPriceExact } from '../lib/format'
import { PAYMENT_METHOD_LABEL } from '../lib/orders'
import { useOrders } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ProductImage } from '../components/ui/ProductImage'
import { OrderTimeline } from '../components/order/OrderTimeline'

export function OrderConfirmation() {
  const { lastOrder } = useOrders()

  useDocumentMeta({
    title: 'Order Confirmed',
    description: 'Your WatchGuru.pk order has been received and is being prepared.',
  })

  if (!lastOrder) {
    return (
      <Container className="py-24">
        <EmptyState
          title="No recent order to show"
          description="Once you complete checkout, your confirmation will appear here."
          action={
            <Link to="/collections/all">
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
          <p className="eyebrow mt-6 text-gold">Order received</p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
            Thank you, {shipping.firstName}.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ash">
            Your order is with our team and will be confirmed shortly on{' '}
            <span className="text-white">{shipping.phone}</span> or by email at{' '}
            <span className="text-white">{lastOrder.email}</span>. Delivery is fully insured,
            and payment is collected as per your chosen method — nothing more.
          </p>
        </div>

        {/* Order meta */}
        <div className="mt-10 grid gap-px overflow-hidden border border-line bg-charcoal sm:grid-cols-3">
          {[
            { label: 'Order number', value: lastOrder.orderNumber },
            { label: 'Date placed', value: formatDate(lastOrder.placedAt) },
            { label: 'Payment', value: PAYMENT_METHOD_LABEL[lastOrder.paymentMethod] },
          ].map((meta) => (
            <div key={meta.label} className="bg-charcoal px-5 py-4 text-center">
              <p className="font-montserrat text-[10px] tracking-[0.18em] text-ash uppercase">
                {meta.label}
              </p>
              <p className="mt-1.5 font-inter font-medium text-sm text-white break-all">
                {meta.value}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <section className="mt-8 border border-line bg-charcoal p-6" aria-label="Order progress">
          <h2 className="text-base font-medium text-white">Order progress</h2>
          <div className="mt-5">
            <OrderTimeline status={lastOrder.status} history={lastOrder.statusHistory} />
          </div>
        </section>

        {/* Items */}
        <section className="mt-6 border border-line bg-charcoal p-6">
          <h2 className="flex items-center gap-2 text-lg">
            <PackageCheck className="size-5 text-gold" strokeWidth={1.6} />
            Items in this order
          </h2>
          <ul className="mt-5 divide-y divide-line">
            {lastOrder.lines.map((line) => (
              <li key={`${line.productId}-${line.name}`} className="flex items-center gap-4 py-4">
                <Link to={`/products/${line.slug}`} className="shrink-0">
                  <ProductImage
                    src={line.image}
                    alt={line.name}
                    label={line.brand}
                    className="size-16"
                  />
                </Link>
                <div className="flex-1">
                  <p className="eyebrow text-ash">{line.brand}</p>
                  <Link
                    to={`/products/${line.slug}`}
                    className="text-sm text-white transition-colors hover:text-gold"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-ash">Qty {line.quantity}</p>
                </div>
                <span className="font-inter font-medium text-sm text-white">
                  {formatPriceExact(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 flex flex-col gap-3 border-t border-line pt-5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ash">Subtotal</dt>
              <dd className="text-white">{formatPriceExact(lastOrder.subtotal)}</dd>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex items-center justify-between">
                <dt className="text-ash">
                  Discount {lastOrder.couponCode && `(${lastOrder.couponCode})`}
                </dt>
                <dd className="text-gold">−{formatPriceExact(lastOrder.discount)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-ash">Shipping</dt>
              <dd className="text-white">
                {lastOrder.shippingCost === 0 ? 'Free · insured' : formatPriceExact(lastOrder.shippingCost)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ash">Tax</dt>
              <dd className="text-white">{formatPriceExact(lastOrder.tax)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <dt className="eyebrow text-white">Order total</dt>
              <dd className="font-inter font-medium text-2xl text-white">
                {formatPriceExact(lastOrder.total)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Shipping */}
        <section className="mt-6 grid gap-px overflow-hidden border border-line bg-charcoal sm:grid-cols-2">
          <div className="bg-charcoal p-6">
            <h3 className="flex items-center gap-2 text-sm font-medium tracking-[0.14em] text-white uppercase">
              <Truck className="size-4 text-gold" aria-hidden="true" /> Shipping to
            </h3>
            <address className="mt-3 text-sm leading-relaxed text-ash not-italic">
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
          <div className="bg-charcoal p-6">
            <h3 className="text-sm font-medium tracking-[0.14em] text-white uppercase">
              What happens next
            </h3>
            <ol className="mt-3 flex flex-col gap-2 text-sm text-ash">
              <li>1. We call or message to confirm your order and advance.</li>
              <li>2. Your watch is authenticated, prepared and sealed by hand.</li>
              <li>3. Insured delivery in 2–5 business days, signature included.</li>
            </ol>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/track-order?number=${encodeURIComponent(lastOrder.orderNumber)}&email=${encodeURIComponent(lastOrder.email)}`}
          >
            <Button size="lg">Track this order</Button>
          </Link>
          <Link to="/collections/all">
            <Button variant="outline" size="lg">Continue shopping</Button>
          </Link>
          <Button variant="ghost" size="lg" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden="true" />
            Print receipt
          </Button>
        </div>
      </div>
    </Container>
  )
}
