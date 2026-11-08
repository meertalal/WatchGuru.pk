import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Heart, Menu, Search, ShoppingBag } from 'lucide-react'
import { classNames, pluralize } from '../../lib/format'
import { PRIMARY_NAV } from '../../lib/navigation'
import { BRANDS } from '../../data/collections'
import { useCart, useWishlist } from '../../store'
import { Container } from '../ui/Container'
import { WishlistDrawer } from './WishlistDrawer'
import { CartDrawer } from './CartDrawer'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()

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
    'relative flex size-9 items-center justify-center text-ivory transition-colors duration-300 hover:text-gold'

  const badge =
    'absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[8px] font-semibold text-obsidian'

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const navLink = (active: boolean) =>
    classNames(
      'relative py-4 font-playfair text-[12px] font-normal tracking-[0.16em] uppercase transition-colors duration-300',
      active ? 'text-gold' : 'text-ivory/80 hover:text-ivory',
    )

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-[70] backdrop-blur-md transition-colors duration-300',
          scrolled ? 'bg-obsidian/95' : 'bg-obsidian/85',
        )}
      >
        <Container>
          {/* Desktop top bar — utility actions around the centred wordmark */}
          <div className="hidden h-[74px] grid-cols-3 items-center lg:grid">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => navigate('/search')}
                aria-label="Search watches"
                className={iconButton}
              >
                <Search className="size-[18px]" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex justify-center">
              <Link
                to="/"
                aria-label="WatchGuru.pk home"
                className="group text-center"
              >
                <span className="font-playfair text-[1.65rem] leading-none tracking-[0.28em] text-ivory transition-colors group-hover:text-gold">
                  WatchGuru<span className="text-gold">.pk</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                aria-label={`Wishlist, ${wishlistCount} ${pluralize(wishlistCount, 'item')}`}
                className={iconButton}
              >
                <Heart className="size-[18px]" strokeWidth={1.5} />
                {wishlistCount > 0 && <span className={badge}>{wishlistCount}</span>}
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Cart, ${cartCount} ${pluralize(cartCount, 'item')}`}
                aria-haspopup="dialog"
                className={iconButton}
              >
                <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
                {cartCount > 0 && <span className={badge}>{cartCount}</span>}
              </button>
            </div>
          </div>

          {/* Desktop navigation row */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center justify-center gap-9">
              {PRIMARY_NAV.map((item) => {
                const active = isActive(item.to)
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={navLink(active)}
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
                    navLink(pathname.startsWith('/collections/brand')),
                    'flex items-center gap-1.5',
                  )}
                >
                  Brands
                  <ChevronDown
                    className={classNames(
                      'size-3 transition-transform duration-300',
                      brandsOpen && 'rotate-180',
                    )}
                    strokeWidth={1.6}
                  />
                </button>

                {brandsOpen && (
                  <div className="absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-2">
                    <div className="bg-charcoal p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
                      <div className="grid grid-cols-2">
                        {BRANDS.map((brand) => (
                          <Link
                            key={brand.slug}
                            to={`/collections/brand/${brand.slug}`}
                            className="group flex flex-col gap-1 px-4 py-4 transition-colors hover:bg-lift"
                          >
                            <span className="flex items-center gap-2 font-akkurat text-[10px] font-semibold tracking-[0.2em] text-ivory uppercase transition-colors group-hover:text-gold">
                              {brand.name}
                              {brand.own && (
                                <span className="border border-gold/40 px-1.5 py-0.5 text-[7px] tracking-[0.2em] text-gold">
                                  Own Brand
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] font-light tracking-wide text-muted">
                              {brand.country}, {brand.tagline}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        to="/collections/all"
                        className="mt-2 flex items-center justify-center px-4 py-3 font-akkurat text-[9px] font-medium tracking-[0.26em] text-gold uppercase transition-colors hover:bg-lift"
                      >
                        View all watches
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>

          {/* Mobile bar */}
          <div className="grid h-[64px] grid-cols-[1fr_auto_1fr] items-center lg:hidden">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className={iconButton}
              >
                <Menu className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <Link to="/" aria-label="WatchGuru.pk home" className="justify-self-center text-center">
              <span className="block font-playfair text-[1.3rem] leading-none tracking-[0.18em] text-ivory sm:text-[1.4rem]">
                WatchGuru<span className="text-gold">.pk</span>
              </span>
            </Link>

            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => navigate('/search')}
                aria-label="Search watches"
                className={iconButton}
              >
                <Search className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Cart, ${cartCount} ${pluralize(cartCount, 'item')}`}
                aria-haspopup="dialog"
                className={iconButton}
              >
                <ShoppingBag className="size-5" strokeWidth={1.5} />
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
