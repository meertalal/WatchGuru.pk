import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from 'lucide-react'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

const PROMISES = [
  { icon: BadgeCheck, text: '100% original watches — papers, seals and stamps intact' },
  { icon: Truck, text: 'Fully insured delivery nationwide, signature on arrival' },
  { icon: ShieldCheck, text: 'One-year machine warranty on every piece we sell' },
]

/**
 * The brand introduction — who WatchGuru.pk is, and the promise that
 * separates us from grey-market sellers.
 */
export function BrandStory() {
  return (
    <section className="border-b border-line bg-charcoal py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div>
              <p className="eyebrow text-gold">Welcome to WatchGuru.pk</p>
              <h2 className="mt-4 font-playfair font-normal text-4xl leading-[1.1] sm:text-5xl">
                Pakistan’s home of<br />
                <span className="italic text-gold">original luxury watches.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ash">
                WatchGuru.pk was built for people who refuse to compromise on time. Every
                watch in our boutique is sourced through authorised channels, verified by our
                in-house horologists and dispatched with its papers, seals and warranty card
                intact — so you can buy with complete confidence, whether it is your first
                automatic or your fiftieth grand complication.
              </p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ash">
                Luxury is not only the statement — it is the craftsmanship we put into every
                piece. Try it once, and you will never look at time the same way again.
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {PROMISES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-ash">
                    <Icon className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.8} />
                    {text}
                  </li>
                ))}
              </ul>

              <Link
                to="/collections/all"
                className="group mt-10 inline-flex items-center gap-3 border px-8 py-4 font-montserrat text-[11px] font-medium tracking-[0.22em] text-obsidian uppercase transition-colors duration-300 bg-gold-bright text-obsidian border-gold-bright hover:bg-gold hover:border-gold"
              >
                Shop Now
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <figure className="relative">
              <img
                src="/watches/watchguru-atelier-wg01-heritage-auto.svg"
                alt="WatchGuru Atelier WG-01 Heritage Auto — original artwork"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="absolute bottom-5 left-5 max-w-[240px] bg-obsidian/95 p-4 backdrop-blur">
                <p className="font-playfair text-lg leading-snug">The WatchGuru Promise</p>
                <p className="mt-1 text-[11px] leading-snug text-ash">
                  Verified originals · insured delivery · 1-year machine warranty
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
