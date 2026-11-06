import { Link } from 'react-router-dom'
import { ArrowRight, Award } from 'lucide-react'
import { buttonClass } from '../../lib/ui'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

const PROMO_IMAGE =
  '/watches/meridian-heritage-classic-38.svg'

export function PromoBanner() {
  return (
    <section className="bg-coal py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="grid overflow-hidden lg:grid-cols-2">
            <div className="relative min-h-[320px]">
              <img
                src={PROMO_IMAGE}
                alt="Meridian Heritage Classic 38 — original artwork"
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-5 bg-charcoal px-8 py-14 sm:px-14 sm:py-20">
              <span className="flex items-center gap-2 font-montserrat text-[10px] font-medium tracking-[0.22em] text-gold uppercase">
                <Award className="size-4" strokeWidth={1.6} />
                The Heritage Collection
              </span>
              <h2 className="font-lora font-normal text-3xl leading-tight text-ivory sm:text-4xl lg:text-[2.6rem]">
                Heirlooms, in the making.
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-ash">
                Hand-finished movements, sapphire crystal and case backs engraved by our
                in-house atelier. Designed to be passed down, not replaced.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <Link to="/collections/all?collection=Heritage" className={buttonClass('gold', 'md')}>
                  Explore Heritage
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/about"
                  className={buttonClass('ghost', 'md', 'text-ash hover:text-gold')}
                >
                  Our craftsmanship
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
