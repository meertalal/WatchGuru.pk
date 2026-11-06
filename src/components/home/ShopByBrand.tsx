import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BRANDS } from '../../data/collections'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

/**
 * Shop by Brand — every maison we carry, with a monogram tile.
 * Monograms keep the grid self-sufficient (no third-party logos) while
 * looking deliberate and boutique-grade.
 */
export function ShopByBrand() {
  return (
    <section className="border-y border-line bg-obsidian py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Authorised Partners"
          title="Shop by Brand"
          description="Seven maisons, one standard of authenticity — explore the houses we carry."
        />

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-7">
          {BRANDS.map((brand, index) => (
            <li key={brand.slug}>
              <Reveal delay={index * 60} className="h-full">
                <Link
                  to={`/collections/brand/${brand.slug}`}
                  aria-label={`Shop ${brand.name}`}
                  className="group flex h-full flex-col items-center justify-center gap-3 border border-line bg-charcoal px-3 py-8 text-center transition-all duration-300 hover:border-gold hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.45)]"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-16 items-center justify-center rounded-full border border-gold/60 font-playfair text-2xl text-gold transition-colors duration-300 group-hover:bg-charcoal group-hover:text-gold"
                  >
                    {brand.name.charAt(0)}
                  </span>
                  <span className="font-montserrat text-[10px] font-semibold tracking-[0.18em] text-white uppercase">
                    {brand.name}
                  </span>
                  <span className="text-[9px] tracking-[0.14em] text-ash uppercase">
                    {brand.own ? 'Own Brand' : brand.country}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.2em] text-white uppercase transition-colors hover:text-gold"
          >
            View all watches
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
