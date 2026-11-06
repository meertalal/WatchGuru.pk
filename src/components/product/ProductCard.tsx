import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import type { Product } from '../../types'
import { classNames, formatPrice } from '../../lib/format'
import { discountPercent } from '../../lib/catalog'
import { useCart, useToast, useWishlist } from '../../store'
import { ProductImage } from '../ui/ProductImage'
import { Rating } from '../ui/Rating'

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
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          <ProductImage
            src={product.images[0]}
            alt={`${product.brand} ${product.name}`}
            label={product.brand}
            eager={eager}
            className="aspect-[4/5] w-full"
            imgClassName="group-hover:scale-[1.04] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </Link>

        {discounted && (
          <span className="pointer-events-none absolute left-3 top-3 bg-gold-bright px-2.5 py-1 font-montserrat text-[9px] font-semibold tracking-[0.2em] text-obsidian uppercase">
            Sale{discountPercent(product) ? ` −${discountPercent(product)}%` : ''}
          </span>
        )}
        {product.badge === 'new' && !discounted && (
          <span className="pointer-events-none absolute left-3 top-3 border border-line bg-obsidian/85 px-2.5 py-1 font-montserrat text-[9px] font-semibold tracking-[0.2em] text-ivory uppercase backdrop-blur">
            New in
          </span>
        )}

        <div className="pointer-events-none absolute top-0 right-0 flex items-start justify-end p-3">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wished}
            className={classNames(
              'pointer-events-auto flex size-9 items-center justify-center rounded-full bg-charcoal/90 text-white shadow-sm backdrop-blur transition-all duration-300 hover:bg-charcoal',
              wished && 'text-gold',
            )}
          >
            <Heart className={classNames('size-4', wished && 'fill-gold')} strokeWidth={1.6} />
          </button>
        </div>

        {/* Always visible — touch devices have no hover state */}
        <div className="absolute inset-x-3 bottom-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-black/95 py-3 font-montserrat text-[10px] font-medium tracking-[0.2em] text-ivory uppercase backdrop-blur transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingBag className="size-3.5" />
            {product.inStock ? 'Add to cart' : 'Sold out'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 pt-4 text-center">
        <p className="eyebrow text-ash">{product.brand}</p>
        <h3 className="font-playfair font-normal text-lg leading-snug">
          <Link
            to={`/products/${product.slug}`}
            className="transition-colors duration-300 hover:text-gold"
          >
            {product.name}
          </Link>
        </h3>
        <div className="flex justify-center">
          <Rating value={product.rating} />
        </div>
        <div className="mt-1 flex items-baseline justify-center gap-3">
          <span className="font-inter font-medium text-lg text-white">{formatPrice(product.price)}</span>
          {discounted && (
            <span className="text-xs text-ash line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
