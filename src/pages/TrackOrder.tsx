import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Loader2, MessageCircle, PackageSearch, SearchX, ShieldCheck, Truck } from 'lucide-react'
import { PAYMENT_METHOD_LABEL } from '../lib/orders'
import { errorMessage } from '../lib/api'
import { formatPriceExact, formatDate } from '../lib/format'
import { useOrders } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Order } from '../types'
import { Container } from '../components/ui/Container'
import { PageBanner } from '../components/layout/PageBanner'
import { OrderTimeline } from '../components/order/OrderTimeline'
import { ProductImage } from '../components/ui/ProductImage'

export function TrackOrder() {
  const { trackOrder } = useOrders()
  const [searchParams, setSearchParams] = useSearchParams()

  const [orderNumber, setOrderNumber] = useState(searchParams.get('number') ?? '')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [result, setResult] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: 'Track Your Order',
    description:
      'Track your WatchGuru.pk order in real time. Enter your order number and email to see live fulfilment status.',
    noindex: true,
  })

  const lookup = useCallback(
    async (number: string, address: string) => {
      setLoading(true)
      setError('')
      try {
        setResult(await trackOrder(number, address))
      } catch (err) {
        setResult(null)
        setError(errorMessage(err, 'We could not look up that order right now.'))
      } finally {
        setSearched(true)
        setLoading(false)
      }
    },
    [trackOrder],
  )

  // Deep link support: /track-order?number=…&email=… auto-runs the lookup.
  useEffect(() => {
    const number = searchParams.get('number')
    const address = searchParams.get('email')
    if (!number || !address) return
    setOrderNumber(number)
    setEmail(address)
    void lookup(number, address)
  }, [searchParams, lookup])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const normalisedNumber = orderNumber.trim().toUpperCase()
    const normalisedEmail = email.trim().toLowerCase()

    if (
      searchParams.get('number') === normalisedNumber &&
      searchParams.get('email') === normalisedEmail
    ) {
      void lookup(normalisedNumber, normalisedEmail)
      return
    }

    setSearchParams({ number: normalisedNumber, email: normalisedEmail }, { replace: true })
  }

  return (
    <>
      <PageBanner
        eyebrow="Customer Care"
        title="Track Your Order"
        description="Enter your order number and the email used at checkout to see live fulfilment status, from confirmation to your doorstep."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Track Order' }]}
      />

      <Container className="py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Lookup form + help */}
          <div className="flex flex-col gap-8 lg:col-span-4">
            <form onSubmit={onSubmit} className="bg-charcoal p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <PackageSearch className="size-5 text-gold" strokeWidth={1.3} aria-hidden="true" />
                <h2 className="font-cormorant text-2xl text-ivory">Find your order</h2>
              </div>

              <label htmlFor="order-number" className="eyebrow mt-6 block text-gold">
                Order number
              </label>
              <input
                id="order-number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. WG-2041"
                autoComplete="off"
                className="mt-2 w-full border border-line bg-obsidian px-4 py-3 font-inter text-[13px] tracking-wider text-ivory uppercase outline-none transition-colors placeholder:normal-case placeholder:text-muted focus:border-gold"
                required
              />

              <label htmlFor="order-email" className="eyebrow mt-5 block text-gold">
                Email address
              </label>
              <input
                id="order-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full border border-line bg-obsidian px-4 py-3 font-inter text-[13px] text-ivory outline-none transition-colors placeholder:text-muted focus:border-gold"
                required
              />

              <button
                type="submit"
                className="mt-6 w-full border border-button bg-button py-4 font-akkurat text-[9px] font-medium tracking-[0.24em] text-button-text uppercase transition-colors hover:border-gold-bright hover:bg-gold-bright"
              >
                Track my order
              </button>
            </form>

            {/* Help panel */}
            <aside className="bg-charcoal p-6">
              <h2 className="flex items-center gap-2 font-akkurat text-[9px] font-medium tracking-[0.2em] text-ivory uppercase">
                <ShieldCheck className="size-4 text-gold" strokeWidth={1.4} aria-hidden="true" />
                Need help?
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-[12px] font-light leading-relaxed text-ash">
                <li className="flex items-start gap-2">
                  <Truck className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.4} aria-hidden="true" />
                  Insured delivery nationwide, 2 to 5 business days after dispatch.
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.4} aria-hidden="true" />
                  <a href="https://wa.me/923222242389" target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-gold hover:underline">
                    WhatsApp +92 322 2242389
                  </a>{' '}
                  with your order number for instant support.
                </li>
              </ul>
            </aside>
          </div>

          {/* Result */}
          <div className="lg:col-span-8" aria-live="polite">
            {loading ? (
              <div className="flex h-full flex-col items-center justify-center bg-charcoal px-6 py-20 text-center">
                <Loader2 className="size-10 animate-spin text-gold/70" strokeWidth={1.2} aria-hidden="true" />
                <p className="mt-4 font-cormorant text-xl text-ivory">Looking up your order…</p>
                <p className="mt-1 max-w-sm text-[12.5px] font-light leading-relaxed text-ash">
                  This only takes a moment.
                </p>
              </div>
            ) : !searched ? (
              <div className="flex h-full flex-col items-center justify-center bg-coal/50 px-6 py-20 text-center">
                <PackageSearch className="size-12 text-gold/60" strokeWidth={1} aria-hidden="true" />
                <p className="mt-4 font-cormorant text-xl text-ivory">Your tracking details will appear here</p>
                <p className="mt-1 max-w-sm text-[12.5px] font-light leading-relaxed text-ash">
                  Enter the order number and email from your confirmation message to see where
                  your watch is.
                </p>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-6">
                {/* Order summary card */}
                <div className="bg-charcoal p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-gold">Order</p>
                      <p className="mt-1 font-inter text-2xl font-normal text-ivory">
                        {result.orderNumber}
                      </p>
                      <p className="mt-1 text-[10.5px] text-muted">
                        Placed {formatDate(result.placedAt)}, {' '}
                        {PAYMENT_METHOD_LABEL[result.paymentMethod]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="eyebrow text-gold">Total</p>
                      <p className="mt-1 font-inter text-2xl font-normal text-ivory">
                        {formatPriceExact(result.total)}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5">
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
                          <p className="eyebrow text-gold">{line.brand}</p>
                          <Link
                            to={`/products/${line.slug}`}
                            className="block truncate font-cormorant text-base text-ivory transition-colors hover:text-gold"
                          >
                            {line.name}
                          </Link>
                          <p className="text-[10.5px] text-muted">Qty {line.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <address className="mt-2 pt-4 text-[11.5px] font-light leading-relaxed text-ash not-italic">
                    Delivering to {result.shipping.firstName} {result.shipping.lastName}, {' '}
                    {result.shipping.address}
                    {result.shipping.apartment ? `, ${result.shipping.apartment}` : ''},{' '}
                    {result.shipping.city}, {result.shipping.state} {result.shipping.postalCode}
                  </address>
                </div>

                {/* Timeline */}
                <div className="bg-charcoal p-6">
                  <h2 className="font-akkurat text-[9px] font-medium tracking-[0.2em] text-ivory uppercase">
                    Fulfilment status
                  </h2>
                  <div className="mt-5">
                    <OrderTimeline status={result.status} history={result.statusHistory} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-charcoal px-6 py-20 text-center">
                <SearchX className="size-12 text-gold/60" strokeWidth={1} aria-hidden="true" />
                <p className="mt-4 font-cormorant text-xl text-ivory">No order matches those details</p>
                <p className="mt-1 max-w-sm text-[12.5px] font-light leading-relaxed text-ash">
                  {error ||
                    'Double-check the order number and the email used at checkout. If the problem persists, message us on WhatsApp with your confirmation message.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
