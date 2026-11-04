import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react'
import { products } from '../../data/products'
import { formatPrice } from '../../lib/format'
import { useCart, useToast, useWishlist } from '../../store/contexts'
import { ProductImage } from '../ui/ProductImage'
import { Button } from '../ui/Button'

export function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { ids, remove } = useWishlist()
  const { addItem } = useCart()
  const { notify } = useToast()

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-[90] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close wishlist"
        onClick={onClose}
        className={`absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-[-30px_0_60px_-30px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <Heart className="size-4 text-gold" />
            <h2 className="text-xl">Wishlist</h2>
            <span className="text-xs text-stone-400">({items.length})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="text-stone-500 transition-colors hover:text-charcoal"
          >
            <X className="size-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <Heart className="size-10 text-stone-300" strokeWidth={1.2} />
            <p className="text-lg">Your wishlist is empty</p>
            <p className="text-sm text-stone-500">
              Save the pieces you love and find them here later.
            </p>
            <Link to="/shop" onClick={onClose} className="mt-2">
              <Button variant="outline" size="sm">
                Browse watches
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-stone-200 overflow-y-auto px-6">
              {items.map((product) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link to={`/product/${product.id}`} onClick={onClose} className="shrink-0">
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      label={product.brand}
                      className="size-24"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <p className="eyebrow text-stone-400">{product.brand}</p>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="text-base transition-colors hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-1 font-inter font-medium text-sm text-charcoal">
                      {formatPrice(product.price)}
                    </span>
                    <div className="mt-auto flex items-center gap-4 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          addItem(product.id, 1)
                          remove(product.id)
                          notify(`${product.name} moved to your cart`)
                        }}
                        className="flex items-center gap-1.5 font-montserrat text-[10px] font-medium tracking-[0.18em] text-charcoal uppercase transition-colors hover:text-gold"
                      >
                        <ShoppingBag className="size-3.5" /> Add to cart
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="flex items-center gap-1.5 font-montserrat text-[10px] font-medium tracking-[0.18em] text-stone-400 uppercase transition-colors hover:text-charcoal"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-stone-200 px-6 py-5">
              <Link to="/shop" onClick={onClose} className="block">
                <Button variant="primary" className="w-full">
                  Continue shopping
                </Button>
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
