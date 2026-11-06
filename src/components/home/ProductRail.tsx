import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Product } from '../../types'
import { ProductCard } from '../product/ProductCard'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

interface ProductRailProps {
  eyebrow: string
  title: string
  description?: string
  products: Product[]
  /** Where “View all” points. */
  viewAllTo: string
  viewAllLabel?: string
}

/**
 * Horizontal product carousel used across the homepage — native scroll
 * with snap points, arrow buttons on desktop, edge-bleed on mobile.
 */
export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  viewAllTo,
  viewAllLabel = 'View all',
}: ProductRailProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (delta: number) => {
    trackRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  const arrowButton =
    'hidden size-11 items-center justify-center border border-line text-white transition-colors hover:border-gold hover:bg-charcoal hover:text-ivory sm:flex'

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow={eyebrow}
            title={title}
            description={description}
            className="max-w-xl"
          />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => scrollBy(-640)} aria-label="Scroll back" className={arrowButton}>
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" onClick={() => scrollBy(640)} aria-label="Scroll forward" className={arrowButton}>
              <ArrowRight className="size-4" />
            </button>
            <Link
              to={viewAllTo}
              className="ml-2 hidden items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.2em] whitespace-nowrap text-white uppercase transition-colors hover:text-gold sm:inline-flex"
            >
              {viewAllLabel}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>

      {/* Track — bleeds to the viewport edge on small screens */}
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label={`${title} carousel`}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-10"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[240px] shrink-0 snap-start sm:w-[260px] lg:w-[280px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
        {/* End spacer lets the last card clear the edge padding */}
        <div aria-hidden="true" className="w-1 shrink-0" />
      </div>

      <Container>
        <Link
          to={viewAllTo}
          className="mt-6 inline-flex items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.2em] text-white uppercase transition-colors hover:text-gold sm:hidden"
        >
          {viewAllLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Container>
    </section>
  )
}

/** Shared eyebrow + link pattern for rails that need a custom action. */
export function RailAction({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.2em] text-white uppercase transition-colors hover:text-gold"
    >
      {children}
      <ArrowRight className="size-4" />
    </Link>
  )
}
