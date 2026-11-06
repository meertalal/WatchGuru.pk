import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { MessageCircle, PackageSearch, SearchX, ShieldCheck, Truck } from 'lucide-react'
import { PAYMENT_METHOD_LABEL } from '../lib/orders'
import { formatPriceExact, formatDate } from '../lib/format'
import { useOrders, useAuth } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Order } from '../types'
import { Container } from '../components/ui/Container'
import { PageBanner } from '../components/layout/PageBanner'
import { OrderTimeline } from '../components/order/OrderTimeline'
import { ProductImage } from '../components/ui/ProductImage'

const DEMO_ORDERS = [
  { number: 'WG-DEMO2041', note: 'Delivered · COD' },
  { number: 'WG-DEMO2098', note: 'Shipped · Easypaisa' },
]
const DEMO_EMAIL = 'demo@watchguru.pk'

export function TrackOrder() {
  const { trackOrder, listForEmail } = useOrders()
  const { account } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [orderNumber, setOrderNumber] = useState(searchParams.get('number') ?? '')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [result, setResult] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)

  useDocumentMeta({
    title: 'Track Your Order',
    description:
      'Track your WatchGuru.pk order in real time — enter your order number and email to see live fulfilment status.',
  })

  // Deep link support: /track-order?number=…&email=… auto-runs the lookup.
  useEffect(() => {
    const number = searchParams.get('number')
    const address = searchParams.get('email')
    if (number && address) {
      setOrderNumber(number)
      setEmail(address)
      setResult(trackOrder(number, address))
      setSearched(true)
    }
    // Only on mount / param change — trackOrder is stable enough for this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const normalisedNumber = orderNumber.trim().toUpperCase()
    const normalisedEmail = email.trim().toLowerCase()
    setSearchParams({ number: normalisedNumber, email: normalisedEmail }, { replace: true })
    setResult(trackOrder(normalisedNumber, normalisedEmail))
    setSearched(true)
  }

  const myOrders = account ? listForEmail(account.email).slice(0, 3) : []

  return (
    <>
      <PageBanner
        eyebrow="Customer Care"
        title="Track Your Order"
        description="Enter your order number and the email used at checkout to see live fulfilment status — from confirmation to your doorstep."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Track Order' }]}
      />

      <Container className="py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Lookup form + help */}
          <div className="flex flex-col gap-8 lg:col-span-4">
            <form onSubmit={onSubmit} className="border border-line bg-charcoal p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <PackageSearch className="size-5 text-gold" strokeWidth={1.6} aria-hidden="true" />
                <h2 className="text-xl">Find your order</h2>
              </div>

              <label htmlFor="order-number" className="eyebrow mt-6 block text-ash">
                Order number
              </label>
              <input
                id="order-number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. WG-DEMO2041"
                autoComplete="off"
                className="mt-2 w-full border border-line bg-charcoal px-4 py-3 font-lato text-sm tracking-wider uppercase outline-none transition-colors placeholder:normal-case placeholder:text-ash focus:border-gold"
                required
              />

              <label htmlFor="order-email" className="eyebrow mt-5 block text-ash">
                Email address
              </label>
              <input
                id="order-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full border border-line bg-charcoal px-4 py-3 font-lato text-sm outline-none transition-colors placeholder:text-ash focus:border-gold"
                required
              />

              <button
                type="submit"
                className="mt-6 w-full border py-4 font-montserrat text-[11px] font-medium tracking-[0.22em] uppercase transition-colors bg-gold-bright text-obsidian border-gold-bright hover:bg-gold hover:border-gold"
              >
                Track my order
              </button>

              {myOrders.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="eyebrow text-ash">Signed in — recent orders</p>
                  <ul className="mt-2 flex flex-col">
                    {myOrders.map((order) => (
                      <li key={order.orderNumber}>
                        <button
                          type="button"
                          onClick={() => {
                            setOrderNumber(order.orderNumber)
                            setEmail(order.email)
                            setSearchParams(
                              { number: order.orderNumber, email: order.email },
                              { replace: true },
                            )
                          }}
                          className="flex w-full items-center justify-between py-2 text-left text-sm text-white transition-colors hover:text-gold"
                        >
                          <span>{order.orderNumber}</span>
                          <span className="text-[10px] tracking-[0.18em] text-ash uppercase">
                            {order.status.replace(/-/g, ' ')}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

            {/* Help panel */}
            <aside className="border border-line bg-coal p-6">
              <h2 className="flex items-center gap-2 text-sm font-medium tracking-[0.14em] text-white uppercase">
                <ShieldCheck className="size-4 text-gold" aria-hidden="true" />
                Need help?
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-[13px] leading-relaxed text-ash">
                <li className="flex items-start gap-2">
                  <Truck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  Insured delivery nationwide, 2–5 business days after dispatch.
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <a href="https://wa.me/923222242389" target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-white hover:underline">
                    WhatsApp +92 322 2242389
                  </a>{' '}
                  with your order number for instant support.
                </li>
              </ul>
              <div className="mt-5 border-t border-line pt-5">
                <p className="font-montserrat text-[10px] font-medium tracking-[0.2em] text-ash uppercase">
                  Try a demo order
                </p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {DEMO_ORDERS.map((demo) => (
                    <li key={demo.number}>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderNumber(demo.number)
                          setEmail(DEMO_EMAIL)
                          setSearchParams(
                            { number: demo.number, email: DEMO_EMAIL },
                            { replace: true },
                          )
                        }}
                        className="text-left text-[12px] text-white underline-offset-2 transition-colors hover:text-gold hover:underline"
                      >
                        {demo.number} <span className="text-ash">— {demo.note}</span>
                      </button>
                    </li>
                  ))}
                  <li className="text-[11px] text-ash">with {DEMO_EMAIL}</li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Result */}
          <div className="lg:col-span-8" aria-live="polite">
            {!searched ? (
              <div className="flex h-full flex-col items-center justify-center border border-dashed border-line bg-charcoal/50 px-6 py-20 text-center">
                <PackageSearch className="size-12 text-ash" strokeWidth={1.1} aria-hidden="true" />
                <p className="mt-4 text-lg">Your tracking details will appear here</p>
                <p className="mt-1 max-w-sm text-sm text-ash">
                  Enter the order number from your confirmation message — for example in the form
                  <span className="text-white"> WG-DEMO2041</span>.
                </p>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-6">
                {/* Order summary card */}
                <div className="border border-line bg-charcoal p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-ash">Order</p>
                      <p className="mt-1 font-inter font-medium text-2xl text-white">
                        {result.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-ash">
                        Placed {formatDate(result.placedAt)} ·{' '}
                        {PAYMENT_METHOD_LABEL[result.paymentMethod]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="eyebrow text-ash">Total</p>
                      <p className="mt-1 font-inter font-medium text-2xl text-white">
                        {formatPriceExact(result.total)}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 divide-y divide-line border-t border-line">
                    {result.lines.map((line) => (
                      <li key={`${line.productId}-${line.name}`} className="flex items-center gap-4 py-3">
                        <Link to={`/products/${line.slug}`} className="shrink-0">
                          <ProductImage
                            src={line.image}
                            alt={line.name}
                            label={line.brand}
                            className="size-14"
                          />
                        </Link>
                        <div className="min-w-0">
                          <p className="eyebrow text-ash">{line.brand}</p>
                          <Link
                            to={`/products/${line.slug}`}
                            className="block truncate text-sm text-white transition-colors hover:text-gold"
                          >
                            {line.name}
                          </Link>
                          <p className="text-[11px] text-ash">Qty {line.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <address className="mt-2 border-t border-line pt-4 text-[12px] leading-relaxed text-ash not-italic">
                    Delivering to {result.shipping.firstName} {result.shipping.lastName} ·{' '}
                    {result.shipping.address}
                    {result.shipping.apartment ? `, ${result.shipping.apartment}` : ''},{' '}
                    {result.shipping.city}, {result.shipping.state} {result.shipping.postalCode}
                  </address>
                </div>

                {/* Timeline */}
                <div className="border border-line bg-charcoal p-6">
                  <h2 className="text-base font-medium text-white">Fulfilment status</h2>
                  <div className="mt-5">
                    <OrderTimeline status={result.status} history={result.statusHistory} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center border border-line bg-charcoal px-6 py-20 text-center">
                <SearchX className="size-12 text-ash" strokeWidth={1.1} aria-hidden="true" />
                <p className="mt-4 text-lg">No order matches those details</p>
                <p className="mt-1 max-w-sm text-sm text-ash">
                  Double-check the order number and the email used at checkout. If the problem
                  persists, message us on WhatsApp with your confirmation message.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
