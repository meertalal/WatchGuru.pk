import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '../../types'
import { ProductGrid } from '../product/ProductGrid'
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
 * A curated product section. On desktop it presents a calm four-column
 * editorial grid; on mobile it becomes a balanced two-column grid so the
 * watch photography remains the focus.
 */
export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  viewAllTo,
  viewAllLabel = 'View all',
}: ProductRailProps) {
  if (products.length === 0) return null

  return (
    <section className="bg-obsidian py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow={eyebrow}
            title={title}
            description={description}
            className="max-w-2xl"
          />
          <Link
            to={viewAllTo}
            className="group inline-flex items-center gap-2.5 self-start font-akkurat text-[9px] font-medium tracking-[0.26em] text-ivory uppercase transition-colors hover:text-gold sm:self-auto"
          >
            {viewAllLabel}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductGrid products={products} className="mt-10 sm:mt-12" />
      </Container>
    </section>
  )
}

/** Shared eyebrow + link pattern for rails that need a custom action. */
export function RailAction({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 font-akkurat text-[9px] font-medium tracking-[0.26em] text-ivory uppercase transition-colors hover:text-gold"
    >
      {children}
      <ArrowRight className="size-3.5" />
    </Link>
  )
}
