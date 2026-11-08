import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import { classNames } from '../../lib/format'
import { PRIMARY_NAV, SUPPORT_LINKS } from '../../lib/navigation'
import { BRANDS } from '../../data/collections'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const linkClass = (active: boolean) =>
    classNames(
      'group flex items-center justify-between py-3.5 font-playfair text-[13px] font-normal tracking-[0.14em] uppercase transition-colors',
      active ? 'text-gold' : 'text-ivory/85 hover:text-gold',
    )

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
          'absolute inset-0 bg-ink/80 backdrop-blur-[2px] transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={classNames(
          'absolute inset-y-0 left-0 flex w-full max-w-[340px] flex-col bg-obsidian transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            to="/"
            onClick={onClose}
            className="font-playfair text-[1.35rem] leading-none tracking-[0.24em] text-ivory"
          >
            WatchGuru<span className="text-gold">.pk</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center text-ash transition-colors hover:text-gold"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Primary collections */}
          <p className="eyebrow mt-8 mb-2 flex items-center gap-3 text-gold">
            <span className="gold-rule" aria-hidden="true" />
            Collections
          </p>
          <nav aria-label="Collections" className="flex flex-col">
            {PRIMARY_NAV.filter((l) => l.to !== '/').map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={linkClass(isActive(link.to))}
              >
                {link.label}
                <ChevronRight
                  className="size-3.5 text-line transition-colors group-hover:text-gold"
                  strokeWidth={1.5}
                />
              </Link>
            ))}
            <Link
              to="/collections/fashion"
              onClick={onClose}
              aria-current={isActive('/collections/fashion') ? 'page' : undefined}
              className={linkClass(isActive('/collections/fashion'))}
            >
              Fashion Collection
              <ChevronRight
                className="size-3.5 text-line transition-colors group-hover:text-gold"
                strokeWidth={1.5}
              />
            </Link>
          </nav>

          {/* Brands */}
          <p className="eyebrow mt-8 mb-3 flex items-center gap-3 text-gold">
            <span className="gold-rule" aria-hidden="true" />
            Brands
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {BRANDS.map((brand) => (
              <li key={brand.slug}>
                <Link
                  to={`/collections/brand/${brand.slug}`}
                  onClick={onClose}
                  className="text-[11px] font-light tracking-wide text-ash transition-colors hover:text-gold"
                >
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Support */}
          <p className="eyebrow mt-8 mb-2 flex items-center gap-3 text-gold">
            <span className="gold-rule" aria-hidden="true" />
            Customer Care
          </p>
          <ul className="flex flex-col">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="block py-3 text-[12px] font-light tracking-wide text-ash transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/about"
                onClick={onClose}
                className="block py-3 text-[12px] font-light tracking-wide text-ash transition-colors hover:text-gold"
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
