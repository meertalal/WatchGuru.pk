import { Link } from 'react-router-dom'
import { ArrowRight, Award } from 'lucide-react'
import { buttonClass } from '../../lib/ui'
import { Reveal } from '../ui/Reveal'

const PROMO_IMAGE =
  'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85'

export function PromoBanner() {
  return (
    <section className="bg-coal">
      <Reveal>
        <div className="mx-auto grid w-full max-w-[1600px] overflow-hidden lg:grid-cols-2">
          <div className="relative min-h-[340px] overflow-hidden sm:min-h-[440px] lg:min-h-[560px]">
            <img
              src={PROMO_IMAGE}
              alt="Close-up of a finely finished watch movement"
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-obsidian/25 to-transparent" />
          </div>

          <div className="flex flex-col justify-center px-5 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            <span className="flex items-center gap-3 font-akkurat text-[9px] font-medium tracking-[0.26em] text-gold uppercase">
              <Award className="size-4" strokeWidth={1.4} />
              The Heritage Collection
            </span>
            <h2 className="mt-5 max-w-md font-cormorant text-[2.4rem] font-normal leading-[1.06] text-ivory sm:text-[3rem] lg:text-[3.4rem]">
              Heirlooms, in the making.
            </h2>
            <p className="mt-6 max-w-md text-[13.5px] font-light leading-[1.9] text-ash">
              Hand-finished movements, sapphire crystal and case backs engraved by our
              in-house atelier. Designed to be passed down, not replaced.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/collections/all?collection=Heritage"
                className={buttonClass('primary', 'md', 'group')}
              >
                Explore Heritage
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className={buttonClass('ghost', 'md', 'px-2 text-ash hover:text-gold')}
              >
                Our craftsmanship
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
