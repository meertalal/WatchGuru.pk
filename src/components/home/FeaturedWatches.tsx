import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { products } from '../../data/products'
import { buttonClass } from '../../lib/ui'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { ProductGrid } from '../product/ProductGrid'

const featured = [...products]
  .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
  .slice(0, 4)

export function FeaturedWatches() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Curated selection"
            title="The Signature Collection"
            titleClassName="font-playfair font-normal"
            description="The pieces our clients return to again and again — chosen for their movement, their finish and their quiet presence on the wrist."
            align="left"
            action={
              <Link
                to="/shop"
                className="hidden items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.2em] text-charcoal uppercase transition-colors hover:text-gold sm:inline-flex"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Reveal>

        <Reveal className="mt-12 lg:mt-16">
          <ProductGrid products={featured} />
        </Reveal>

        <div className="mt-12 flex justify-center sm:hidden">
          <Link to="/shop" className={buttonClass('outline', 'md')}>
            View all watches
          </Link>
        </div>
      </Container>
    </section>
  )
}
