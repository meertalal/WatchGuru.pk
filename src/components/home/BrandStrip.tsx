import { Link } from 'react-router-dom'
import { BRANDS } from '../../data/products'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export function BrandStrip() {
  return (
    <section className="border-y border-stone-200 py-14">
      <Container>
        <Reveal>
          <p className="eyebrow mb-10 text-center text-stone-400">
            Six independent maisons, one boutique
          </p>
        </Reveal>
        <Reveal>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {BRANDS.map((brand) => (
              <li key={brand.name} className="text-center">
                <Link
                  to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="group inline-flex flex-col items-center gap-2"
                >
                  <span className="font-montserrat font-medium text-xl tracking-[0.14em] text-charcoal transition-colors duration-300 group-hover:text-gold">
                    {brand.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] tracking-[0.14em] text-stone-400 uppercase">
                    {brand.country}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
