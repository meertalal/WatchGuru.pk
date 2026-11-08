import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import type { Product } from '../../types'
import { classNames, formatPrice } from '../../lib/format'
import { discountPercent } from '../../lib/catalog'
import { useCart, useToast, useWishlist } from '../../store'
import { ProductImage } from '../ui/ProductImage'

interface ProductCardProps {
  product: Product
  className?: string
  eager?: boolean
}

export function ProductCard({ product, className, eager = false }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { notify } = useToast()

  const wished = has(product.id)
  const discounted = product.compareAtPrice && product.compareAtPrice > product.price

  const handleAdd = () => {
    addItem(product.id, 1)
    notify(`${product.brand} ${product.name} added to your cart`)
  }

  const handleWishlist = () => {
    toggle(product.id)
    notify(
      wished
        ? `${product.name} removed from wishlist`
        : `${product.name} saved to your wishlist`,
      wished ? 'info' : 'success',
    )
  }

  return (
    <article className={classNames('group relative flex flex-col', className)}>
      <div className="relative overflow-hidden bg-charcoal">
        <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          <ProductImage
            src={product.images[0]}
            alt={`${product.brand} ${product.name}`}
            label={product.brand}
            eager={eager}
            className="aspect-[4/5] w-full"
            imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {discounted && (
          <span className="pointer-events-none absolute left-3 top-3 bg-gold px-2.5 py-1 font-akkurat text-[8px] font-semibold tracking-[0.22em] text-obsidian uppercase">
            Sale{discountPercent(product) ? ` −${discountPercent(product)}%` : ''}
          </span>
        )}
        {product.badge === 'new' && !discounted && (
          <span className="pointer-events-none absolute left-3 top-3 bg-obsidian/80 px-2.5 py-1 font-akkurat text-[8px] font-semibold tracking-[0.22em] text-ivory uppercase backdrop-blur">
            New in
          </span>
        )}

        <div className="pointer-events-none absolute top-0 right-0 p-3">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wished}
            className={classNames(
              'pointer-events-auto flex size-8 items-center justify-center bg-obsidian/70 text-ivory backdrop-blur transition-colors duration-300 hover:text-gold',
              wished && 'text-gold',
            )}
          >
            <Heart className={classNames('size-3.5', wished && 'fill-gold')} strokeWidth={1.4} />
          </button>
        </div>

        {/* Always visible on touch; revealed on hover on desktop */}
        <div className="absolute inset-x-3 bottom-3 translate-y-0 opacity-100 transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex w-full items-center justify-center gap-2 bg-button py-3 font-akkurat text-[9px] font-semibold tracking-[0.22em] text-button-text uppercase transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingBag className="size-3.5" strokeWidth={1.6} />
            {product.inStock ? 'Add to cart' : 'Sold out'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="font-akkurat text-[8.5px] font-medium tracking-[0.26em] text-gold uppercase">
          {product.brand}
        </p>
        <h3 className="mt-1.5 font-cormorant text-[1.4rem] leading-[1.15] text-ivory">
          <Link
            to={`/products/${product.slug}`}
            className="transition-colors duration-300 hover:text-gold"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-inter text-[13px] font-normal tracking-wide text-ivory">
            {formatPrice(product.price)}
          </span>
          {discounted && (
            <span className="font-inter text-[11px] text-muted line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
