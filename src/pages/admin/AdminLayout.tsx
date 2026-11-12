import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import {
  Boxes,
  ExternalLink,
  Layers,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  MessageSquare,
  Package,
  PlusCircle,
  ShieldCheck,
  Store,
  Tag,
  Users,
} from 'lucide-react'
import { classNames } from '../../lib/format'
import { useAuth, useOrders } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  badge?: 'pending-orders'
}

interface NavSection {
  label: string
  items: NavItem[]
}

/**
 * Every operational area is its own module with its own route. The sidebar
 * groups those modules but never merges their screens.
 */
const SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Fulfilment',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ListOrdered, badge: 'pending-orders' },
      { to: '/admin/orders/new', label: 'New order', icon: PlusCircle },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/admin/products', label: 'Products', icon: Package, end: true },
      { to: '/admin/collections', label: 'Collections', icon: Layers },
      { to: '/admin/stock', label: 'Stock', icon: Boxes },
    ],
  },
  {
    label: 'Merchandising',
    items: [
      { to: '/admin/discounts', label: 'Discounts', icon: Tag },
      { to: '/admin/customers', label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Support',
    items: [
      { to: '/admin/warranty', label: 'Warranty', icon: ShieldCheck },
      { to: '/admin/inbox', label: 'Inbox', icon: MessageSquare },
    ],
  },
]

export function AdminLayout() {
  const { account, logout } = useAuth()
  const { orders } = useOrders()
  const navigate = useNavigate()

  useDocumentMeta({
    title: 'Store Admin',
    description: 'Internal store administration panel.',
    noindex: true,
  })

  const pendingCount = orders.filter(
    (order) => order.status === 'processing' || order.status === 'confirmed',
  ).length

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    classNames(
      'flex items-center gap-3 border-l-2 px-4 py-2.5 font-akkurat text-[11px] font-medium tracking-[0.18em] uppercase transition-colors',
      isActive
        ? 'border-gold bg-charcoal text-ivory'
        : 'border-transparent text-ash hover:text-ivory',
    )

  return (
    <div className="flex min-h-svh flex-col bg-coal lg:flex-row">
      {/* Sidebar */}
      <aside className="shrink-0 bg-obsidian lg:w-64">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block">
          <div>
            <Link to="/admin" className="font-playfair text-xl tracking-[0.18em] text-ivory">
              WatchGuru<span className="text-gold">.pk</span>
            </Link>
            <p className="eyebrow mt-1 text-[9px] text-muted">Store Admin</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold lg:hidden"
          >
            Storefront
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <nav
          aria-label="Admin modules"
          className="flex gap-1 overflow-x-auto px-3 pb-2 lg:block lg:gap-0 lg:px-3 lg:pb-6"
        >
          {SECTIONS.map((section) => (
            <div key={section.label} className="contents lg:block lg:pb-3">
              <p className="hidden px-4 pb-1 pt-3 font-akkurat text-[8px] tracking-[0.22em] text-muted uppercase lg:block">
                {section.label}
              </p>
              {section.items.map(({ to, label, icon: Icon, end, badge }) => (
                <NavLink key={to} to={to} end={end} className={linkClass}>
                  <Icon className="size-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                  <span className="whitespace-nowrap">{label}</span>
                  {badge === 'pending-orders' && pendingCount > 0 && (
                    <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[9px] font-semibold text-obsidian">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="hidden p-4 lg:block">
          <Link
            to="/"
            className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold"
          >
            <Store className="size-4" aria-hidden="true" />
            View storefront
          </Link>
          <div className="bg-charcoal p-3">
            <p className="text-[11px] text-ash">Signed in as</p>
            <p className="mt-0.5 truncate text-[13px] font-normal text-ivory">
              {account?.firstName} {account?.lastName}
            </p>
            <p className="truncate text-[11px] text-muted">{account?.email}</p>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="mt-2 flex items-center gap-2 font-akkurat text-[9px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold"
            >
              <LogOut className="size-3.5" strokeWidth={1.4} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
