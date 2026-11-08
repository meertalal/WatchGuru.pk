import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BRANDS } from '../../data/collections'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

/**
 * Shop by Brand — every maison we carry, presented as a restrained
 * monogram tile. Monograms keep the grid self-sufficient (no third-party
 * logos) while looking deliberate and boutique-grade.
 */
export function ShopByBrand() {
  return (
    <section className="bg-coal py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Authorised Partners"
          title="Shop by Brand"
          description="Seven maisons, one standard of authenticity. Explore the houses we carry."
        />

        <ul className="mt-11 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
          {BRANDS.map((brand, index) => (
            <li key={brand.slug}>
              <Reveal delay={index * 50} className="h-full">
                <Link
                  to={`/collections/brand/${brand.slug}`}
                  aria-label={`Shop ${brand.name}`}
                  className="group relative flex h-full min-h-[150px] flex-col items-center justify-center gap-3 bg-surface px-2 py-7 text-center transition-all duration-500 hover:bg-charcoal sm:min-h-[170px] sm:px-3 sm:py-8"
                >
                  <span
                    aria-hidden="true"
                    className="font-cormorant text-[2.6rem] leading-none text-gold/80 transition-colors duration-500 group-hover:text-gold"
                  >
                    {brand.name.charAt(0)}
                  </span>
                  <span className="max-w-full font-akkurat text-[8px] font-semibold leading-tight tracking-[0.14em] text-ivory uppercase sm:text-[8.5px] sm:tracking-[0.2em]">
                    {brand.name}
                  </span>
                  <span className="text-[8px] tracking-[0.16em] text-muted uppercase">
                    {brand.own ? 'Own Brand' : brand.country}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-5 bottom-0 h-px scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-9 text-center">
          <Link
            to="/collections/all"
            className="group inline-flex items-center gap-2.5 font-akkurat text-[9px] font-medium tracking-[0.26em] text-ivory uppercase transition-colors hover:text-gold"
          >
            View all watches
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
