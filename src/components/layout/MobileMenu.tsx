import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import { classNames } from '../../lib/format'
import { PRIMARY_NAV, SUPPORT_LINKS } from '../../lib/navigation'
import { BRANDS } from '../../data/collections'
import { useAuth } from '../../store'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const { account } = useAuth()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <div
      className={classNames(
        'fixed inset-0 z-[95] lg:hidden',
        open ? '' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        className={classNames(
          'absolute inset-0 bg-black/40 transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={classNames(
          'absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-obsidian transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <span className="font-playfair font-normal text-2xl tracking-[0.18em]">
            WatchGuru<span className="text-gold">.pk</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-ash transition-colors hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Account shortcut */}
          <Link
            to={account ? '/account' : '/account/login'}
            onClick={onClose}
            className="flex items-center justify-between border border-line bg-charcoal px-4 py-3 text-sm text-white transition-colors hover:border-gold"
          >
            <span>{account ? `Signed in as ${account.firstName}` : 'Sign in / Create account'}</span>
            <ChevronRight className="size-4 text-ash" />
          </Link>

          {/* Primary collections */}
          <p className="eyebrow mt-6 mb-2 text-ash">Collections</p>
          <nav aria-label="Collections" className="flex flex-col">
            {PRIMARY_NAV.filter((l) => l.to !== '/').map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={classNames(
                  'border-b border-line py-3.5 font-montserrat text-sm tracking-[0.16em] uppercase transition-colors',
                  isActive(link.to) ? 'text-gold' : 'text-white hover:text-gold',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/collections/fashion"
              onClick={onClose}
              aria-current={isActive('/collections/fashion') ? 'page' : undefined}
              className={classNames(
                'border-b border-line py-3.5 font-montserrat text-sm tracking-[0.16em] uppercase transition-colors',
                isActive('/collections/fashion') ? 'text-gold' : 'text-white hover:text-gold',
              )}
            >
              Fashion Collection
            </Link>
          </nav>

          {/* Brands */}
          <p className="eyebrow mt-6 mb-2 text-ash">Brands</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {BRANDS.map((brand) => (
              <li key={brand.slug}>
                <Link
                  to={`/collections/brand/${brand.slug}`}
                  onClick={onClose}
                  className="py-1.5 text-sm text-ash transition-colors hover:text-gold"
                >
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Support */}
          <p className="eyebrow mt-6 mb-2 text-ash">Customer Care</p>
          <ul className="flex flex-col">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="block border-b border-line py-3 text-[13px] text-ash transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/about"
                onClick={onClose}
                className="block border-b border-line py-3 text-[13px] text-ash transition-colors hover:text-gold"
              >
                About WatchGuru.pk
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
