import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { formatPrice } from '../lib/format'
import { computeTotals } from '../lib/cart'
import { useCart } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { ProductImage } from '../components/ui/ProductImage'
import { EmptyState } from '../components/ui/EmptyState'

export function Cart() {
  const { items, count, updateQuantity, removeItem, clear } = useCart()
  const navigate = useNavigate()

  useDocumentMeta({
    title: 'Shopping Cart',
    description: 'Review the pieces in your WatchGuru.pk cart — free insured delivery nationwide, COD available.',
  })

  const totals = computeTotals(items.map((i) => ({ price: i.product.price, quantity: i.quantity })))

  return (
    <>
      <PageBanner
        eyebrow={count > 0 ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : undefined}
        title="Shopping Cart"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]}
      />

      <Container className="py-12 lg:py-16">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="size-12" strokeWidth={1.1} />}
            title="Your cart is empty"
            description="Every great collection starts with a single piece. Explore the boutique to begin."
            action={
              <Link to="/collections/all">
                <Button size="lg">Browse the boutique</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
            {/* Lines */}
            <div>
              <div className="hidden border-b border-line pb-3 font-montserrat text-[10px] tracking-[0.2em] text-ash uppercase sm:grid sm:grid-cols-[1fr_120px_140px_100px]">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <ul className="divide-y divide-line">
                {items.map(({ product, quantity, lineTotal }) => (
                  <li
                    key={product.id}
                    className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-[1fr_120px_140px_100px] sm:items-center"
                  >
                    <div className="flex gap-4">
                      <Link to={`/products/${product.slug}`} className="shrink-0">
                        <ProductImage
                          src={product.images[0]}
                          alt={product.name}
                          label={product.brand}
                          className="size-24 sm:size-20"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <p className="eyebrow text-ash">{product.brand}</p>
                        <Link
                          to={`/products/${product.slug}`}
                          className="text-base leading-snug transition-colors hover:text-gold"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs text-ash">
                          {product.caseMaterial} · {product.dialColor} dial
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="mt-2 flex items-center gap-1.5 font-montserrat text-[10px] tracking-[0.16em] text-ash uppercase transition-colors hover:text-white sm:hidden"
                        >
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-ash sm:text-center">
                      <span className="sm:hidden text-ash">Price: </span>
                      {formatPrice(product.price)}
                    </div>

                    <div className="sm:flex sm:justify-center">
                      <QuantityStepper
                        value={quantity}
                        min={1}
                        max={product.stock}
                        onChange={(next) => updateQuantity(product.id, next)}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:block sm:text-right">
                      <span className="font-inter font-medium text-base text-white">
                        {formatPrice(lineTotal)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="hidden text-ash transition-colors hover:text-white sm:inline-flex"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/collections/all"
                  className="flex items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.18em] text-white uppercase transition-colors hover:text-gold"
                >
                  <ArrowRight className="size-4 rotate-180" />
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="font-montserrat text-[11px] tracking-[0.16em] text-ash uppercase transition-colors hover:text-white"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-line bg-charcoal p-6">
                <h2 className="text-xl">Order Summary</h2>

                <dl className="mt-6 flex flex-col gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-ash">Subtotal</dt>
                    <dd className="text-white">{formatPrice(totals.subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ash">Shipping</dt>
                    <dd className="text-gold">Free</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-4">
                    <dt className="eyebrow text-white">Total</dt>
                    <dd className="font-inter font-medium text-2xl text-white">{formatPrice(totals.total)}</dd>
                  </div>
                </dl>

                <p className="mt-3 text-[11px] text-ash">
                  Taxes and any coupon are applied at checkout.
                </p>

                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to checkout
                  <ArrowRight className="size-4" />
                </Button>

                <div className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-[11px] text-ash">
                  <Truck className="size-4 text-gold" strokeWidth={1.6} />
                  Complimentary insured shipping on every order
                </div>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </>
  )
}
