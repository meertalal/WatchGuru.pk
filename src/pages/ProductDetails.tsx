import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Copy,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import { BRANDS } from '../data/collections'
import { discountPercent, relatedProducts } from '../lib/catalog'
import { materialsAndCare } from '../lib/product'
import { classNames, formatPrice, formatPriceExact } from '../lib/format'
import { useCart, useCatalog, useToast, useWishlist } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductJsonLd } from '../components/seo/ProductJsonLd'
import { WatchVariantSelector } from '../components/product/WatchVariantSelector'
import { ProductGrid } from '../components/product/ProductGrid'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'

const TABS = ['Details', 'Specifications', 'Materials & Care', 'Shipping & Warranty'] as const
type Tab = (typeof TABS)[number]

export function ProductDetails() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { products, getBySlug } = useCatalog()
  const product = getBySlug(slug)

  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { notify } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<Tab>('Details')
  const [variantId, setVariantId] = useState<string>('')

  useDocumentMeta({
    title: product ? `${product.brand} ${product.name} | Buy Online` : 'Watch Not Found',
    description:
      product?.description.slice(0, 155) ??
      'Discover the piece. 100% original, insured delivery nationwide.',
    image: product?.images[0],
    type: 'product',
  })

  if (!product) {
    return (
      <Container className="py-24">
        <EmptyState
          title="We couldn’t find that watch"
          description="It may have sold out or the link may be incorrect."
          action={
            <Link to="/collections/all">
              <Button>Back to the boutique</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  const wished = has(product.id)
  const activeVariant =
    product.variants?.find((variant) => variant.id === variantId) ?? product.variants?.[0]
  const related = relatedProducts(products, product, 3)
  const discount = discountPercent(product)
  const discounted = discount !== null
  const brandSlug = BRANDS.find((b) => b.name === product.brand)?.slug
  const careSections = materialsAndCare(product)

  const handleAdd = () => {
    addItem(product.id, quantity)
    const variantSuffix = activeVariant ? ` (${activeVariant.name})` : ''
    notify(`${quantity} × ${product.brand} ${product.name}${variantSuffix} added to your cart`)
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

  const copySku = async () => {
    try {
      await navigator.clipboard.writeText(product.id.toUpperCase())
      notify('SKU copied to clipboard', 'info')
    } catch {
      notify('Couldn’t copy. SKU shown above', 'error')
    }
  }

  return (
    <>
      <ProductJsonLd product={product} />
      <PageBanner
        title={product.name}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Collections', to: '/collections/all' },
          {
            label: product.brand,
            to: brandSlug ? `/collections/brand/${brandSlug}` : '/collections/all',
          },
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
              activeImage={activeVariant?.image}
            />
          </div>

          <div>
            <div>
              <p className="eyebrow text-gold">{product.brand}</p>
              <h1 className="mt-3 font-cormorant text-[2.4rem] leading-[1.05] text-ivory sm:text-[3rem]">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={copySku}
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-gold"
                aria-label="Copy SKU"
              >
                SKU: {product.id.toUpperCase()}
                <Copy className="size-3" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              {product.inStock ? (
                <span className="flex items-center gap-1.5 font-akkurat text-[8.5px] tracking-[0.18em] text-gold uppercase">
                  <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
                  In stock: {product.stock} {product.stock === 1 ? 'piece' : 'pieces'} left
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-akkurat text-[8.5px] tracking-[0.18em] text-error uppercase">
                  <span className="size-1.5 rounded-full bg-error" aria-hidden="true" />
                  Out of stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <span className="font-inter text-[1.7rem] font-normal tracking-wide text-ivory">
                {formatPrice(activeVariant?.price ?? product.price)}
              </span>
              {discounted && product.compareAtPrice && (
                <span className="text-[13px] text-muted line-through">
                  {formatPriceExact(product.compareAtPrice)}
                </span>
              )}
              {discounted && (
                <span className="border border-gold/40 px-2.5 py-1 font-akkurat text-[8px] font-semibold tracking-[0.22em] text-gold uppercase">
                  Save {discount}%
                </span>
              )}
            </div>
            <p className="mt-2 text-[10.5px] tracking-wide text-muted">
              Includes duties, free insured delivery nationwide and COD available
            </p>

            <p className="mt-7 text-[13.5px] font-light leading-[1.9] text-ash">{product.description}</p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-[12.5px] font-light text-ash">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.6} aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>

            {/* Quantity + actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-line bg-charcoal">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex size-12 items-center justify-center text-ash transition-colors hover:bg-lift hover:text-gold disabled:opacity-40"
                >
                  <Minus className="size-4" strokeWidth={1.4} />
                </button>
                <span className="w-10 text-center font-inter text-[13px] tabular-nums text-ivory">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || !product.inStock}
                  aria-label="Increase quantity"
                  className="flex size-12 items-center justify-center text-ash transition-colors hover:bg-lift hover:text-gold disabled:opacity-40"
                >
                  <Plus className="size-4" strokeWidth={1.4} />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="order-first w-full sm:order-none sm:min-w-[200px] sm:flex-1"
              >
                <ShoppingBag className="size-4" aria-hidden="true" />
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
                    : 'border-line text-ash hover:border-gold hover:text-gold',
                )}
              >
                <Heart className={classNames('size-5', wished && 'fill-gold')} strokeWidth={1.4} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="mt-3 w-full border border-gold py-4 font-akkurat text-[11px] font-medium tracking-[0.2em] uppercase text-gold transition-colors hover:bg-gold hover:text-obsidian disabled:opacity-50"
            >
              Buy it now
            </button>

            {/* Assurances */}
            <ul className="mt-8 grid gap-3 py-6 sm:grid-cols-3">
              {[
                { icon: Truck, text: 'Free insured delivery, 2 to 5 days' },
                { icon: ShieldCheck, text: '1-year machine warranty' },
                { icon: RotateCcw, text: '7-day return & exchange' },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2 text-[10.5px] font-light tracking-wide text-ash"
                >
                  <Icon className="size-4 shrink-0 text-gold" strokeWidth={1.4} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>

            <a
              href="#product-details"
              className="mt-3 flex w-full items-center justify-center border border-line py-3.5 font-akkurat text-[10px] font-medium tracking-[0.2em] text-ivory uppercase transition-colors hover:border-gold hover:text-gold"
            >
              View full details
            </a>

            {/* Tabs */}
            <div id="product-details" className="mt-8 scroll-mt-28">
              <div
                role="tablist"
                aria-label="Product information"
                className="no-scrollbar flex gap-6 overflow-x-auto"
              >
                {TABS.map((item) => (
                  <button
                    key={item}
                    role="tab"
                    aria-selected={tab === item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={classNames(
                      '-mb-px border-b pb-3 font-akkurat text-[9px] font-medium tracking-[0.18em] whitespace-nowrap uppercase transition-colors',
                      tab === item
                        ? 'border-gold text-gold'
                        : 'border-transparent text-ash hover:text-ivory',
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="pt-6 text-[13px] font-light leading-[1.85] text-ash">
                {tab === 'Details' && (
                  <div className="flex flex-col gap-5">
                    <p>{product.description}</p>
                    <ul className="flex flex-wrap gap-2">
                      {product.features.map((feature) => (
                        <li
                          key={feature}
                          className="bg-charcoal px-3 py-1.5 text-[10.5px] tracking-wide text-ash"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === 'Specifications' && (
                  <dl>
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="grid grid-cols-[110px_1fr] gap-4 py-3">
                        <dt className="font-akkurat text-[8.5px] tracking-[0.18em] text-muted uppercase">
                          {spec.label}
                        </dt>
                        <dd className="text-ivory">{spec.value}</dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[110px_1fr] gap-4 py-3">
                      <dt className="font-akkurat text-[8.5px] tracking-[0.18em] text-muted uppercase">
                        Reference
                      </dt>
                      <dd className="text-ivory">{product.id.toUpperCase()}</dd>
                    </div>
                  </dl>
                )}

                {tab === 'Materials & Care' && (
                  <div className="flex flex-col gap-5">
                    {careSections.map((section) => (
                      <div key={section.title}>
                        <h3 className="font-akkurat text-[9px] font-medium tracking-[0.18em] text-ivory uppercase">
                          {section.title}
                        </h3>
                        <p className="mt-1.5">{section.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'Shipping & Warranty' && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h3 className="font-akkurat text-[9px] font-medium tracking-[0.18em] text-ivory uppercase">
                        Shipping
                      </h3>
                      <p className="mt-1.5">
                        Dispatched within 24 to 48 hours in tamper-evident, double-boxed packaging,
                        fully insured, signature required on delivery. Free nationwide, 2 to 5
                        business days. Cash on Delivery available with a Rs. 1,000 advance,
                        adjusted against your bill.
                      </p>
                      <Link
                        to="/policies/shipping-policy"
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.16em] text-gold uppercase hover:opacity-75"
                      >
                        Read the shipping policy
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-akkurat text-[9px] font-medium tracking-[0.18em] text-ivory uppercase">
                        1-Year Machine Warranty
                      </h3>
                      <p className="mt-1.5">
                        Movement, dial, case, crown and gaskets are covered against manufacturing
                        defects for twelve months from delivery. Straps, batteries and wear are
                        excluded. Claims are serviced by our own watchmakers, insured both ways.
                      </p>
                      <Link
                        to="/policies/warranty"
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.16em] text-gold uppercase hover:opacity-75"
                      >
                        Warranty &amp; verification
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-akkurat text-[9px] font-medium tracking-[0.18em] text-ivory uppercase">
                        Returns
                      </h3>
                      <p className="mt-1.5">
                        Seven calendar days to return or exchange, unworn with seals intact.
                        WhatsApp us with your order number and photos; approval within one
                        business day.
                      </p>
                      <Link
                        to="/policies/refund-policy"
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.16em] text-gold uppercase hover:opacity-75"
                      >
                        Read the refund policy
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                    <p className="flex items-center gap-2 text-[11px] tracking-wide text-ash">
                      <Sparkles className="size-3.5 text-gold" aria-hidden="true" />
                      Every WatchGuru watch ships with papers, stamps and warranty card.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {product.variants && product.variants.length > 0 && activeVariant && (
          <div className="mt-14 lg:mt-16">
            <WatchVariantSelector
              variants={product.variants}
              value={activeVariant.id}
              onChange={setVariantId}
            />
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 pt-16 lg:mt-28">
            <SectionHeading
              eyebrow="You may also like"
              title="Related pieces"
              align="left"
              action={
                <Link
                  to="/collections/all"
                  className="hidden items-center gap-2 font-akkurat text-[9px] font-medium tracking-[0.24em] text-ivory uppercase transition-colors hover:text-gold sm:inline-flex"
                >
                  Browse all
                  <ArrowRight className="size-4" aria-hidden="true" />
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
