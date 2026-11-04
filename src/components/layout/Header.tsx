import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, ShoppingBag } from 'lucide-react'
import { classNames, pluralize } from '../../lib/format'
import { useCart, useWishlist } from '../../store/contexts'
import { Container } from '../ui/Container'
import { WishlistDrawer } from './WishlistDrawer'
import { MobileMenu } from './MobileMenu'

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
]

export function Header() {
  const { pathname } = useLocation()
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 12)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const iconButton =
    'relative flex size-10 items-center justify-center text-charcoal transition-colors duration-300 hover:text-gold'

  const badge =
    'absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-white'

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-[70] bg-ivory/95 backdrop-blur transition-shadow duration-300',
          scrolled ? 'border-b border-stone-200 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.6)]' : 'border-b border-transparent',
        )}
      >
        <Container>
          <div className="flex h-[68px] items-center justify-between gap-4 lg:h-20">
            {/* Left: mobile trigger + logo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className={classNames(iconButton, 'lg:hidden')}
              >
                <Menu className="size-5" />
              </button>

              <Link
                to="/"
                className="font-playfair font-normal text-xl tracking-[0.22em] text-charcoal transition-colors hover:text-gold sm:text-2xl lg:text-[1.7rem]"
              >
                WatchGuru.pk
              </Link>
            </div>

            {/* Center: desktop navigation */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {NAV.map((item) => {
                  const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        className={classNames(
                          'border-b-2 pb-1.5 font-montserrat text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300',
                          active
                            ? 'border-gold text-gold'
                            : 'border-transparent text-charcoal hover:text-gold',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                aria-label={`Wishlist, ${wishlistCount} ${pluralize(wishlistCount, 'item')}`}
                className={classNames(iconButton, 'hidden sm:flex')}
              >
                <Heart className="size-5" />
                {wishlistCount > 0 && <span className={badge}>{wishlistCount}</span>}
              </button>

              <Link
                to="/cart"
                aria-label={`Cart, ${cartCount} ${pluralize(cartCount, 'item')}`}
                className={iconButton}
              >
                <ShoppingBag className="size-5" />
                {cartCount > 0 && <span className={badge}>{cartCount}</span>}
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  )
}
