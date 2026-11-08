import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '../../types'
import { formatPrice } from '../../lib/format'
import { isDiscounted } from '../../lib/catalog'
import { useCart } from '../../store'
import { ProductImage } from '../ui/ProductImage'

interface CollectionProductCardProps {
  product: Product
  eager?: boolean
}

/**
 * The curated-collection card: large artwork, centred name and both prices,
 * with a Buy Now action that adds the piece and moves straight to checkout.
 */
export function CollectionProductCard({ product, eager = false }: CollectionProductCardProps) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const discounted = isDiscounted(product)

  const handleBuyNow = () => {
    addItem(product.id, 1)
    navigate('/checkout')
  }

  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/products/${product.slug}`}
        aria-label={`View ${product.brand} ${product.name}`}
        className="relative block overflow-hidden bg-charcoal"
      >
        <ProductImage
          src={product.images[0]}
          alt={`${product.brand} ${product.name}`}
          label={product.brand}
          eager={eager}
          className="aspect-[4/5] w-full"
          imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        {discounted && (
          <span className="absolute top-3 left-3 bg-gold px-2.5 py-1 font-akkurat text-[8px] font-semibold tracking-[0.22em] text-obsidian uppercase">
            Sale
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col items-center pt-5 text-center">
        <p className="font-akkurat text-[8.5px] font-medium tracking-[0.26em] text-gold uppercase">
          {product.brand}
        </p>
        <h3 className="mt-2 font-cormorant text-[1.4rem] leading-[1.15] text-ivory">
          <Link
            to={`/products/${product.slug}`}
            className="transition-colors duration-300 hover:text-gold"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          {discounted && product.compareAtPrice && (
            <span className="font-inter text-[11.5px] text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="font-inter text-[13.5px] font-normal tracking-wide text-ivory">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="mt-5 w-full border border-line py-3 font-akkurat text-[9px] font-semibold tracking-[0.22em] text-ivory uppercase transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-obsidian disabled:cursor-not-allowed disabled:opacity-50"
        >
          {product.inStock ? 'Buy Now' : 'Sold Out'}
        </button>
      </div>
    </article>
  )
}
