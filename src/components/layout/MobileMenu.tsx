import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { classNames } from '../../lib/format'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
]

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

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
          'absolute inset-0 bg-charcoal/40 transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={classNames(
          'absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-ivory transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <span className="font-playfair font-normal text-2xl tracking-[0.18em]">WatchGuru.pk</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-stone-500 transition-colors hover:text-charcoal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <nav className="flex flex-col">
            {LINKS.map((link) => {
              const active = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={classNames(
                    'border-b border-stone-200 py-4 font-montserrat text-lg tracking-[0.18em] uppercase transition-colors',
                    active ? 'text-gold' : 'text-charcoal hover:text-gold',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
