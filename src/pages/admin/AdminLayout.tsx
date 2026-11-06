import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Package,
  Store,
} from 'lucide-react'
import { classNames } from '../../lib/format'
import { useAuth, useOrders } from '../../store'

const TABS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ListOrdered, end: false },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
]

/**
 * Store admin chrome — sidebar on desktop, scrollable tabs on mobile.
 * Completely separate from the storefront header/footer.
 */
export function AdminLayout() {
  const { account, logout } = useAuth()
  const { orders } = useOrders()
  const navigate = useNavigate()
  const pendingCount = orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    classNames(
      'flex items-center gap-3 border-l-2 px-4 py-3 font-montserrat text-[11px] font-medium tracking-[0.18em] uppercase transition-colors',
      isActive
        ? 'border-gold bg-charcoal text-white'
        : 'border-transparent text-ash hover:text-white',
    )

  return (
    <div className="flex min-h-svh flex-col bg-coal lg:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-line bg-obsidian lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block">
          <div>
            <Link to="/admin" className="font-playfair text-xl tracking-[0.18em] text-white">
              WatchGuru<span className="text-gold">.pk</span>
            </Link>
            <p className="eyebrow mt-1 text-[9px] text-ash">Store Admin</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold lg:hidden"
          >
            Storefront
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto px-3 pb-2 lg:flex-col lg:gap-0 lg:px-3 lg:pb-6">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
              {label}
              {label === 'Orders' && pendingCount > 0 && (
                <span className="ml-auto rounded-full bg-gold-bright px-2 py-0.5 text-[9px] font-semibold text-obsidian">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-line p-4 lg:block">
          <Link
            to="/"
            className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold"
          >
            <Store className="size-4" aria-hidden="true" />
            View storefront
          </Link>
          <div className="border border-line bg-charcoal p-3">
            <p className="text-[11px] text-ash">Signed in as</p>
            <p className="mt-0.5 truncate text-sm font-medium text-white">
              {account?.firstName} {account?.lastName}
            </p>
            <p className="truncate text-[11px] text-ash">{account?.email}</p>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="mt-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-white"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
