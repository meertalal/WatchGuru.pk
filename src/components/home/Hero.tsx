import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonClass } from '../../lib/ui'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1495856458515-0637185db551?auto=format&fit=crop&w=2000&q=80'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-charcoal">
      <img
        src={HERO_IMAGE}
        alt="A fine gold wristwatch resting on stone"
        className="absolute inset-0 -z-10 size-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

      <div className="mx-auto w-full max-w-[1280px] px-5 py-24 sm:px-8 lg:px-10">
        <div className="max-w-xl fade-up">
          <p className="eyebrow mb-5 text-gold">The 2026 Collection</p>
          <h1 className="font-playfair font-normal text-[2.75rem] leading-[1.05] text-ivory sm:text-6xl lg:text-[4.5rem]">
            Time, crafted to be kept.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-stone-300">
            A curated boutique of fine mechanical watches — Swiss-inspired movements,
            hand-finished cases and a five-year international warranty on every piece.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/shop" className={buttonClass('gold', 'lg')}>
              Shop the collection
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/shop?tag=new"
              className={buttonClass(
                'outline',
                'lg',
                'border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal',
              )}
            >
              New arrivals
            </Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-ivory/15 pt-7">
            {[
              { value: '06', label: 'Boutique maisons' },
              { value: '5 yr', label: 'Global warranty' },
              { value: '100%', label: 'Insured delivery' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-playfair font-normal text-3xl text-ivory">{stat.value}</dt>
                <dd className="mt-1 font-montserrat text-[10px] tracking-[0.18em] text-stone-400 uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
