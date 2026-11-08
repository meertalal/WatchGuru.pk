/**
 * Single source of truth for site navigation: header, mobile menu and
 * footer all derive from these groups, so links never drift apart.
 */

export interface NavLink {
  label: string
  to: string
}

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'All Watches', to: '/collections/all' },
  { label: 'Men', to: '/collections/men' },
  { label: 'Women', to: '/collections/women' },
  { label: 'Executive', to: '/collections/executive' },
  { label: 'Originals', to: '/collections/original' },
]

export const COLLECTION_LINKS: NavLink[] = [
  { label: 'Collections', to: '/collections' },
  { label: 'All Watches', to: '/collections/all' },
  { label: 'Men’s Watches', to: '/collections/men' },
  { label: 'Women’s Watches', to: '/collections/women' },
  { label: 'Executive Edit', to: '/collections/executive' },
  { label: 'Original Watches', to: '/collections/original' },
  { label: 'Fashion Collection', to: '/collections/fashion' },
]

export const SUPPORT_LINKS: NavLink[] = [
  { label: 'Track Your Order', to: '/track-order' },
  { label: 'Shipping Policy', to: '/policies/shipping-policy' },
  { label: 'Refund & Exchange', to: '/policies/refund-policy' },
  { label: 'Warranty & Verification', to: '/policies/warranty' },
  { label: 'Terms of Service', to: '/policies/terms-of-service' },
  { label: 'Contact Us', to: '/contact' },
]

export const COMPANY_LINKS: NavLink[] = [
  { label: 'About Us', to: '/about' },
  { label: 'Track Your Order', to: '/track-order' },
  { label: 'Contact Us', to: '/contact' },
]
