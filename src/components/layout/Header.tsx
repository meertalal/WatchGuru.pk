import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { classNames, pluralize } from '../../lib/format'
import { PRIMARY_NAV } from '../../lib/navigation'
import { BRANDS } from '../../data/collections'
import { useAuth, useCart, useWishlist } from '../../store'
import { Container } from '../ui/Container'
import { WishlistDrawer } from './WishlistDrawer'
import { CartDrawer } from './CartDrawer'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { account } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 12,
  )
  const brandsRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawers and dropdowns on navigation — adjust state during render.
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setMobileOpen(false)
    setCartOpen(false)
    setWishlistOpen(false)
    setBrandsOpen(false)
  }

  useEffect(() => {
    if (!brandsOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setBrandsOpen(false)
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!brandsRef.current?.contains(event.target as Node)) setBrandsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [brandsOpen])

  const iconButton =
    'relative flex size-10 items-center justify-center text-white transition-colors duration-300 hover:text-gold'

  const badge =
    'absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-white'

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-[70] bg-obsidian/95 backdrop-blur transition-shadow duration-300',
          scrolled ? 'border-b border-line shadow-[0_10px_30px_-24px_rgba(0,0,0,0.6)]' : 'border-b border-transparent',
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
                aria-label="WatchGuru.pk — home"
                className="font-playfair font-normal text-xl tracking-[0.22em] text-white transition-colors hover:text-gold sm:text-2xl lg:text-[1.7rem]"
              >
                WatchGuru<span className="text-gold">.pk</span>
              </Link>
            </div>

            {/* Center: desktop navigation */}
            <nav aria-label="Primary" className="hidden xl:block">
              <ul className="flex items-center gap-7">
                {PRIMARY_NAV.map((item) => {
                  const active = isActive(item.to)
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        className={classNames(
                          'border-b-2 pb-1.5 font-montserrat text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300',
                          active
                            ? 'border-gold text-gold'
                            : 'border-transparent text-white hover:text-gold',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}

                {/* Brands dropdown */}
                <li
                  ref={brandsRef}
                  className="relative"
                  onMouseEnter={() => setBrandsOpen(true)}
                  onMouseLeave={() => setBrandsOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={brandsOpen}
                    aria-haspopup="true"
                    onClick={() => setBrandsOpen((v) => !v)}
                    className={classNames(
                      'flex items-center gap-1.5 border-b-2 pb-1.5 font-montserrat text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300',
                      pathname.startsWith('/collections/brand')
                        ? 'border-gold text-gold'
                        : 'border-transparent text-white hover:text-gold',
                    )}
                  >
                    Brands
                    <ChevronDown
                      className={classNames('size-3.5 transition-transform duration-300', brandsOpen && 'rotate-180')}
                    />
                  </button>

                  {brandsOpen && (
                    <div className="absolute left-1/2 top-full w-[540px] -translate-x-1/2 pt-4">
                      <div className="grid grid-cols-2 gap-1 border border-line bg-obsidian p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
                        {BRANDS.map((brand) => (
                          <Link
                            key={brand.slug}
                            to={`/collections/brand/${brand.slug}`}
                            className="group flex flex-col gap-0.5 rounded-sm px-4 py-3 transition-colors hover:bg-lift"
                          >
                            <span className="font-montserrat text-[11px] font-semibold tracking-[0.14em] text-white uppercase transition-colors group-hover:text-gold">
                              {brand.name}
                              {brand.own && (
                                <span className="ml-2 rounded-sm bg-gold/15 px-1.5 py-0.5 text-[8px] tracking-[0.18em] text-gold">
                                  Own Brand
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] tracking-wide text-ash">
                              {brand.country} · {brand.tagline}
                            </span>
                          </Link>
                        ))}
                        <Link
                          to="/collections/all"
                          className="col-span-2 mt-1 border-t border-line px-4 pt-3 text-center font-montserrat text-[10px] font-medium tracking-[0.22em] text-gold uppercase transition-opacity hover:opacity-70"
                        >
                          View all watches →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => navigate('/search')}
                aria-label="Search watches"
                className={iconButton}
              >
                <Search className="size-5" />
              </button>

              <button
                type="button"
                onClick={() => navigate(account ? '/account' : '/account/login')}
                aria-label={account ? 'Your account' : 'Sign in'}
                className={iconButton}
              >
                <User className="size-5" />
              </button>

              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                aria-label={`Wishlist, ${wishlistCount} ${pluralize(wishlistCount, 'item')}`}
                className={classNames(iconButton, 'hidden sm:flex')}
              >
                <Heart className="size-5" />
                {wishlistCount > 0 && <span className={badge}>{wishlistCount}</span>}
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Cart, ${cartCount} ${pluralize(cartCount, 'item')}`}
                aria-haspopup="dialog"
                className={iconButton}
              >
                <ShoppingBag className="size-5" />
                {cartCount > 0 && <span className={badge}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
