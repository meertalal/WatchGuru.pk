import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import { getProductById, getRelatedProducts } from '../data/products'
import { classNames, formatPrice } from '../lib/format'
import { useCart, useToast, useWishlist } from '../store/contexts'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Rating } from '../components/ui/Rating'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductGrid } from '../components/product/ProductGrid'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'

const TABS = ['Details', 'Specifications', 'Shipping & Returns'] as const
type Tab = (typeof TABS)[number]

export function ProductDetails() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)

  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { notify } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<Tab>('Details')

  if (!product) {
    return (
      <Container className="py-24">
        <EmptyState
          title="We couldn’t find that watch"
          description="It may have sold out or the link may be incorrect."
          action={
            <Link to="/shop">
              <Button>Back to the boutique</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  const wished = has(product.id)
  const related = getRelatedProducts(product, 3)
  const discounted = product.compareAtPrice && product.compareAtPrice > product.price

  const handleAdd = () => {
    addItem(product.id, quantity)
    notify(
      `${quantity} × ${product.brand} ${product.name} added to your cart`,
    )
  }

  const handleBuyNow = () => {
    addItem(product.id, quantity)
    navigate('/checkout')
  }

  const handleWishlist = () => {
    toggle(product.id)
    notify(
      wished ? `${product.name} removed from wishlist` : `${product.name} saved to your wishlist`,
      wished ? 'info' : 'success',
    )
  }

  return (
    <>
      <PageBanner
        title={product.name}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: product.brand, to: `/shop?brand=${encodeURIComponent(product.brand)}` },
          { label: product.name },
        ]}
      />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              images={product.images}
              alt={`${product.brand} ${product.name}`}
              label={product.brand}
            />
          </div>

          <div>
            <div>
              <p className="eyebrow text-gold">{product.brand}</p>
              <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-500">
                {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-inter font-medium text-3xl text-charcoal">{formatPrice(product.price)}</span>
              {discounted && (
                <span className="text-base text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] tracking-wide text-stone-400">
              Includes duties and insured worldwide delivery
            </p>

            <p className="mt-7 text-sm leading-relaxed text-stone-600">{product.description}</p>

            <ul className="mt-6 flex flex-col gap-2">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-sm text-stone-600">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={2} />
                  {highlight}
                </li>
              ))}
            </ul>

            {/* Quantity + actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-stone-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex size-12 items-center justify-center text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="flex size-12 items-center justify-center text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="flex-1 min-w-[200px]"
              >
                <ShoppingBag className="size-4" />
                Add to cart
              </Button>

              <button
                type="button"
                onClick={handleWishlist}
                aria-pressed={wished}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                className={classNames(
                  'flex size-12 items-center justify-center border transition-colors',
                  wished
                    ? 'border-gold text-gold'
                    : 'border-stone-300 text-stone-500 hover:border-charcoal hover:text-charcoal',
                )}
              >
                <Heart className={classNames('size-5', wished && 'fill-gold')} strokeWidth={1.6} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="mt-3 w-full border border-charcoal py-4 font-montserrat text-[11px] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-charcoal hover:text-ivory disabled:opacity-50"
            >
              Buy it now
            </button>

            {/* Assurances */}
            <ul className="mt-8 grid gap-3 border-y border-stone-200 py-6 sm:grid-cols-3">
              {[
                { icon: Truck, text: 'Free insured shipping' },
                { icon: ShieldCheck, text: '5-year warranty' },
                { icon: RotateCcw, text: '30-day returns' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-[11px] tracking-wide text-stone-500">
                  <Icon className="size-4 text-gold" strokeWidth={1.6} />
                  {text}
                </li>
              ))}
            </ul>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-6 overflow-x-auto border-b border-stone-200 no-scrollbar">
                {TABS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={classNames(
                      '-mb-px border-b-2 pb-3 font-montserrat text-[11px] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors',
                      tab === item
                        ? 'border-gold text-charcoal'
                        : 'border-transparent text-stone-400 hover:text-charcoal',
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="pt-6 text-sm leading-relaxed text-stone-600">
                {tab === 'Details' && (
                  <div className="flex flex-col gap-5">
                    <p>{product.description}</p>
                    <ul className="flex flex-wrap gap-2">
                      {product.features.map((feature) => (
                        <li
                          key={feature}
                          className="border border-stone-200 bg-white px-3 py-1.5 text-[11px] tracking-wide text-stone-600"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === 'Specifications' && (
                  <dl className="divide-y divide-stone-200 border-y border-stone-200">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="grid grid-cols-[96px_1fr] gap-4 py-3">
                        <dt className="text-[11px] tracking-[0.14em] text-stone-400 uppercase">
                          {spec.label}
                        </dt>
                        <dd className="text-charcoal">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {tab === 'Shipping & Returns' && (
                  <div className="flex flex-col gap-4">
                    <p>
                      Each WatchGuru.pk is dispatched within two business days in fully insured,
                      signature-required packaging. Delivery is complimentary worldwide and typically
                      arrives in 3–6 business days.
                    </p>
                    <p>
                      Returns are accepted within 30 days of delivery, provided the watch is unworn
                      with all seals and paperwork intact. Every piece includes a five-year
                      international warranty.
                    </p>
                    <p className="flex items-center gap-2 text-[11px] tracking-wide text-stone-400">
                      <Sparkles className="size-3.5 text-gold" />
                      Demo storefront — shipping and returns are illustrative only.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-stone-200 pt-16 lg:mt-28">
            <SectionHeading
              eyebrow="You may also like"
              title="Related pieces"
              align="left"
              action={
                <Link
                  to="/shop"
                  className="hidden items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.2em] uppercase transition-colors hover:text-gold sm:inline-flex"
                >
                  Browse all
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
            <div className="mt-10">
              <ProductGrid products={related} columns={3} />
            </div>
          </section>
        )}
      </Container>
    </>
  )
}
