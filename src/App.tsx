import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { RequireAdmin } from './components/admin/RequireAdmin'
import { AdminLayout } from './pages/admin/AdminLayout'
import { useCatalog } from './store'

/* Storefront pages — code-split per route for fast first paint. */
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const Collection = lazy(() => import('./pages/Collection').then((m) => ({ default: m.Collection })))
const Collections = lazy(() =>
  import('./pages/Collections').then((m) => ({ default: m.Collections })),
)
const ProductDetails = lazy(() =>
  import('./pages/ProductDetails').then((m) => ({ default: m.ProductDetails })),
)
const Search = lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })))
const Cart = lazy(() => import('./pages/Cart').then((m) => ({ default: m.Cart })))
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })))
const OrderConfirmation = lazy(() =>
  import('./pages/OrderConfirmation').then((m) => ({ default: m.OrderConfirmation })),
)
const TrackOrder = lazy(() => import('./pages/TrackOrder').then((m) => ({ default: m.TrackOrder })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const AdminLogin = lazy(() =>
  import('./pages/AdminLogin').then((m) => ({ default: m.AdminLogin })),
)
const RefundPolicy = lazy(() =>
  import('./pages/policies/RefundPolicy').then((m) => ({ default: m.RefundPolicy })),
)
const ShippingPolicy = lazy(() =>
  import('./pages/policies/ShippingPolicy').then((m) => ({ default: m.ShippingPolicy })),
)
const TermsOfService = lazy(() =>
  import('./pages/policies/TermsOfService').then((m) => ({ default: m.TermsOfService })),
)
const Warranty = lazy(() =>
  import('./pages/policies/Warranty').then((m) => ({ default: m.Warranty })),
)
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))
const Forbidden = lazy(() => import('./pages/Forbidden').then((m) => ({ default: m.Forbidden })))
import { ServerError } from './pages/ServerError'
const Unauthorized = lazy(() =>
  import('./pages/Unauthorized').then((m) => ({ default: m.Unauthorized })),
)
const ServiceUnavailable = lazy(() =>
  import('./pages/ServiceUnavailable').then((m) => ({ default: m.ServiceUnavailable })),
)
const Maintenance = lazy(() =>
  import('./pages/Maintenance').then((m) => ({ default: m.Maintenance })),
)
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { OfflineBanner } from './components/ui/OfflineBanner'
const AdminOverview = lazy(() =>
  import('./pages/admin/AdminOverview').then((m) => ({ default: m.AdminOverview })),
)
const AdminOrders = lazy(() =>
  import('./pages/admin/AdminOrders').then((m) => ({ default: m.AdminOrders })),
)
const AdminProducts = lazy(() =>
  import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })),
)

/** Legacy /product/:id links → canonical slug route. */
function ProductRedirect() {
  const { id = '' } = useParams()
  const { products } = useCatalog()
  const match = products.find((p) => p.id === id || p.slug === id)
  return <Navigate to={match ? `/products/${match.slug}` : '/collections/all'} replace />
}

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <span className="flex size-14 animate-pulse items-center justify-center rounded-full border border-gold/50 font-playfair text-2xl text-gold">
          W
        </span>
        <span className="font-akkurat text-[10px] tracking-[0.3em] text-ash uppercase">
          WatchGuru.pk
        </span>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <OfflineBanner />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Storefront */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="collections" element={<Collections />} />
            <Route path="collections/brand/:brandSlug" element={<Collection />} />
            <Route path="collections/:slug" element={<Collection />} />
            <Route path="shop" element={<Navigate to="/collections/all" replace />} />
            <Route path="product/:id" element={<ProductRedirect />} />
            <Route path="products/:slug" element={<ProductDetails />} />

            <Route path="search" element={<Search />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="track-order" element={<TrackOrder />} />

            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            <Route path="policies/refund-policy" element={<RefundPolicy />} />
            <Route path="policies/shipping-policy" element={<ShippingPolicy />} />
            <Route path="policies/terms-of-service" element={<TermsOfService />} />
            <Route path="policies/warranty" element={<Warranty />} />

            {/* Error and maintenance routes */}
            <Route path="401" element={<Unauthorized />} />
            <Route path="403" element={<Forbidden />} />
            <Route path="500" element={<ServerError />} />
            <Route path="503" element={<ServiceUnavailable />} />
            <Route path="maintenance" element={<Maintenance />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Staff-only sign in — customer accounts are not offered */}
          <Route path="admin/login" element={<AdminLogin />} />

          {/* Store admin — separate chrome, guarded */}
          <Route
            path="admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
