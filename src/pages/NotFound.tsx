import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Home, ShoppingBag } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export function NotFound() {
  useDocumentMeta({
    title: '404 Timepiece Not Found',
    description: 'The page you were looking for has moved or does not exist.',
    noindex: true,
  })

  return (
    <Container className="flex min-h-[72svh] flex-col items-center justify-center py-20 text-center sm:py-28">
      {/* Horological 404 visual */}
      <div className="relative mb-6 flex size-32 items-center justify-center rounded-full border border-gold/30 bg-coal/70 sm:size-40">
        <div className="absolute inset-2 animate-[spin_60s_linear_infinite] rounded-full border border-dashed border-gold/20" />
        <Compass className="size-16 text-gold/80 sm:size-20" strokeWidth={1.2} aria-hidden="true" />
        <span className="absolute -bottom-2 rounded-full border border-gold/40 bg-obsidian px-3 py-0.5 font-akkurat text-[9px] font-semibold tracking-[0.24em] text-gold uppercase">
          404 Error
        </span>
      </div>

      <p className="eyebrow text-gold">Lost in Chronology</p>
      <h1 className="display mt-3 text-[2.8rem] text-ivory sm:text-[3.8rem]">
        This page keeps its own time.
      </h1>
      <p className="mt-4 max-w-lg text-[13.5px] font-light leading-relaxed text-ash">
        The reference you requested does not exist, was moved, or has ticked away into history.
        Allow us to guide you back to the WatchGuru boutique.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/">
          <Button size="lg" className="inline-flex items-center gap-2">
            <Home className="size-4" aria-hidden="true" />
            Back to Home
          </Button>
        </Link>
        <Link to="/collections/all">
          <Button size="lg" variant="outline" className="inline-flex items-center gap-2">
            <ShoppingBag className="size-4" aria-hidden="true" />
            Continue Shopping
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </Container>
  )
}
