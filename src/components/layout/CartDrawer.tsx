import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react'
import { SHIPPING_COST } from '../../lib/cart'
import { formatPrice } from '../../lib/format'
import { useCart } from '../../store'
import { ProductImage } from '../ui/ProductImage'
import { QuantityStepper } from '../ui/QuantityStepper'
import { Button } from '../ui/Button'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, count, subtotal, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

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

  const goTo = (to: string) => () => {
    onClose()
    navigate(to)
  }

  return (
    <div
      className={`fixed inset-0 z-[90] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className={`absolute inset-0 bg-ink/80 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-obsidian shadow-[-40px_0_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-3">
            <ShoppingBag className="size-4 text-gold" strokeWidth={1.4} />
            <h2 className="font-cormorant text-2xl text-ivory">Your Cart</h2>
            <span className="font-inter text-[11px] text-muted">({count})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex size-8 items-center justify-center text-ash transition-colors hover:text-gold"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="size-10 text-gold/60" strokeWidth={1} />
            <p className="font-cormorant text-2xl text-ivory">Your cart is empty</p>
            <p className="text-[13px] font-light leading-relaxed text-ash">
              Explore the boutique and find the piece that keeps your time.
            </p>
            <Link to="/collections/all" onClick={onClose} className="mt-2">
              <Button variant="outline" size="sm">
                Browse watches
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link
                    to={`/products/${product.slug}`}
                    onClick={onClose}
                    className="shrink-0"
                    aria-label={`View ${product.name}`}
                  >
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      label={product.brand}
                      className="size-24"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <p className="eyebrow text-gold">{product.brand}</p>
                    <Link
                      to={`/products/${product.slug}`}
                      onClick={onClose}
                      className="mt-1 font-cormorant text-lg leading-snug text-ivory transition-colors hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <QuantityStepper
                        value={quantity}
                        onChange={(next) => updateQuantity(product.id, next)}
                        min={1}
                        max={Math.max(1, product.stock)}
                        size="sm"
                        label="Quantity"
                      />
                      <div className="text-right">
                        <p className="font-inter text-[13px] font-normal text-ivory">
                          {formatPrice(lineTotal)}
                        </p>
                        {product.stock <= 5 && (
                          <p className="mt-0.5 font-akkurat text-[8px] tracking-[0.18em] text-gold uppercase">
                            Only {product.stock} left
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="mt-2.5 flex w-fit items-center gap-1.5 font-akkurat text-[9px] font-medium tracking-[0.2em] text-muted uppercase transition-colors hover:text-gold"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.4} /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] tracking-wide text-ash">Subtotal</span>
                <span className="font-inter text-xl font-normal text-ivory">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[10.5px] text-muted">
                {SHIPPING_COST === 0
                  ? 'Free insured delivery nationwide, duties included'
                  : 'Shipping calculated at checkout'}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[10.5px] tracking-wide text-muted">
                <ShieldCheck className="size-3.5 text-gold" strokeWidth={1.4} />
                Cash on Delivery available, 1-year machine warranty
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button size="lg" className="w-full" onClick={goTo('/checkout')}>
                  Proceed to checkout
                </Button>
                <button
                  type="button"
                  onClick={goTo('/cart')}
                  className="w-full py-3 font-akkurat text-[9px] font-medium tracking-[0.24em] text-ash uppercase transition-colors hover:text-gold"
                >
                  View full cart
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
