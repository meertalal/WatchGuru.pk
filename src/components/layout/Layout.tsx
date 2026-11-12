import { Outlet } from 'react-router-dom'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useCatalog } from '../../store'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

/**
 * Storefront chrome. While the catalogue is loading (or unreachable) the
 * route outlet is replaced with a status panel so pages never render an
 * empty boutique.
 */
export function Layout() {
  const { loading, error, products, refresh } = useCatalog()

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-button focus:px-4 focus:py-2 focus:text-button-text"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        {loading && products.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading the boutique">
            <div className="flex flex-col items-center gap-4">
              <span className="flex size-14 animate-pulse items-center justify-center rounded-full border border-gold/50 font-playfair text-2xl text-gold">
                W
              </span>
              <span className="font-akkurat text-[10px] tracking-[0.3em] text-ash uppercase">
                Loading the boutique
              </span>
            </div>
          </div>
        ) : error && products.length === 0 ? (
          <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
            <AlertTriangle className="size-12 text-gold/70" strokeWidth={1.1} aria-hidden="true" />
            <h1 className="mt-5 font-cormorant text-2xl text-ivory">The boutique is unavailable</h1>
            <p className="mt-2 text-[12.5px] font-light leading-relaxed text-ash">{error}</p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-6 inline-flex items-center gap-2 border border-button bg-button px-5 py-3 font-akkurat text-[10px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:border-gold-bright hover:bg-gold-bright"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
