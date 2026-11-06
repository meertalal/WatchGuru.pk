import type { ReactNode } from 'react'
import { AuthProvider } from './auth'
import { CartProvider } from './cart'
import { CatalogProvider } from './catalog'
import { OrdersProvider } from './orders'
import { ToastProvider } from './toast'
import { WishlistProvider } from './wishlist'

/**
 * Provider composition (order matters):
 *   Toast   — notifications available everywhere
 *   Auth    — session resolution, independent of catalogue
 *   Catalog — live catalogue; Cart/Wishlist/Orders read from it
 *   Orders  — order placement & tracking on top of catalogue snapshots
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CatalogProvider>
          <WishlistProvider>
            <CartProvider>
              <OrdersProvider>{children}</OrdersProvider>
            </CartProvider>
          </WishlistProvider>
        </CatalogProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
