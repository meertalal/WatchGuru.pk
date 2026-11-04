import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { products } from '../../data/products'
import { buttonClass } from '../../lib/ui'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { ProductGrid } from '../product/ProductGrid'

const arrivals = [...products]
  .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
  .slice(0, 4)

export function NewArrivals() {
  return (
    <section className="border-y border-stone-200 bg-stone-100 py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Just arrived"
            title="New Arrivals"
            titleClassName="font-dmserif font-normal"
            description="Fresh from the workshops and the 2026 ateliers. New references are added every month — be the first to see them."
            align="left"
            action={
              <Link
                to="/shop?tag=new"
                className="hidden items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.2em] text-charcoal uppercase transition-colors hover:text-gold sm:inline-flex"
              >
                See all new
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Reveal>

        <Reveal className="mt-12 lg:mt-16">
          <ProductGrid products={arrivals} />
        </Reveal>

        <div className="mt-12 flex justify-center sm:hidden">
          <Link to="/shop?tag=new" className={buttonClass('outline', 'md')}>
            See all new arrivals
          </Link>
        </div>
      </Container>
    </section>
  )
}
