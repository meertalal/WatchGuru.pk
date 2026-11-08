import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from 'lucide-react'
import { buttonClass } from '../../lib/ui'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

const PROMISES = [
  { icon: BadgeCheck, text: '100% original watches with papers, seals and stamps intact' },
  { icon: Truck, text: 'Fully insured delivery nationwide, signature on arrival' },
  { icon: ShieldCheck, text: 'One-year machine warranty on every piece we sell' },
]

/**
 * The brand introduction — who WatchGuru.pk is, and the promise that
 * separates us from grey-market sellers.
 */
export function BrandStory() {
  return (
    <section className="bg-coal py-16 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:order-2 lg:col-span-6">
            <figure className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 hidden size-full border border-gold/25 lg:block"
              />
              <img
                src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85"
                alt="Luxury wristwatch photographed on a dark background"
                loading="lazy"
                className="relative aspect-[4/5] w-full bg-surface object-cover"
              />
              <figcaption className="absolute bottom-5 left-5 max-w-[250px] bg-obsidian/90 p-5 backdrop-blur">
                <p className="font-cormorant text-xl leading-snug text-ivory">The WatchGuru Promise</p>
                <p className="mt-1.5 text-[10px] font-light leading-relaxed tracking-wide text-ash">
                  Verified originals, insured delivery, 1-year machine warranty
                </p>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="lg:order-1 lg:col-span-6" delay={120}>
            <div>
              <p className="eyebrow flex items-center gap-3 text-gold">
                <span className="gold-rule" aria-hidden="true" />
                Welcome to WatchGuru.pk
              </p>
              <h2 className="mt-5 font-cormorant text-[2.4rem] font-normal leading-[1.08] text-ivory sm:text-[3rem] lg:text-[3.4rem]">
                Pakistan’s home of
                <br />
                <span className="italic text-gold">original luxury watches.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[13.5px] font-light leading-[1.9] text-ash sm:text-sm">
                WatchGuru.pk was built for people who refuse to compromise on time. Every
                watch in our boutique is sourced through authorised channels, verified by our
                in-house horologists and dispatched with its papers, seals and warranty card
                intact, so you can buy with complete confidence, whether it is your first
                automatic or your fiftieth grand complication.
              </p>
              <p className="mt-4 max-w-lg text-[13.5px] font-light leading-[1.9] text-ash sm:text-sm">
                Luxury is not only the statement. It is the craftsmanship we put into every
                piece. Try it once, and you will never look at time the same way again.
              </p>

              <ul className="mt-8">
                {PROMISES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3.5 py-3.5 text-[12.5px] font-light text-ash">
                    <Icon className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.4} />
                    {text}
                  </li>
                ))}
              </ul>

              <Link
                to="/collections/all"
                className={buttonClass('primary', 'lg', 'group mt-9')}
              >
                Shop Now
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
