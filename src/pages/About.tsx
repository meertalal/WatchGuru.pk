import { Link } from 'react-router-dom'
import { Award, Compass, Gem, Hammer, Leaf, ShieldCheck } from 'lucide-react'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80'
const CRAFT_IMAGE =
  'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=1200&q=80'

const CRAFT = [
  {
    icon: Hammer,
    title: 'Hand-finished',
    copy: 'Every case is polished and brushed by hand, then assembled by a single watchmaker.',
  },
  {
    icon: Gem,
    title: 'Finest materials',
    copy: 'Sapphire crystal, 316L steel, 18k gold and full-grain leather — nothing less will do.',
  },
  {
    icon: Compass,
    title: 'Swiss-inspired movements',
    copy: 'Precision calibres regulated in five positions and tested over fourteen days.',
  },
  {
    icon: ShieldCheck,
    title: 'Made to last',
    copy: 'Serviced, guaranteed and supported for a lifetime — that is the WatchGuru.pk promise.',
  },
]

const VALUES = [
  { icon: Award, title: 'Provenance', copy: 'Every piece is authenticated and documented before it reaches you.' },
  { icon: Leaf, title: 'Responsibility', copy: 'Responsibly sourced materials and plastic-free packaging.' },
  { icon: ShieldCheck, title: 'Confidence', copy: 'A five-year international warranty on every watch we sell.' },
]

const STATS = [
  { value: '1898', label: 'Maison established' },
  { value: '06', label: 'Independent brands' },
  { value: '40k+', label: 'Watches delivered' },
  { value: '98%', label: 'Client satisfaction' },
]

export function About() {
  return (
    <>
      <PageBanner
        eyebrow="Our Story"
        title="Craftsmanship, kept alive."
        description="WatchGuru.pk began as a single vitrine of hand-picked watches. More than a century later, we remain a small, independent boutique guided by one idea: a fine watch is made to be kept."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      {/* Story */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="relative">
                <img
                  src={STORY_IMAGE}
                  alt="A fine watch on a workbench"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute -right-4 -bottom-4 hidden border border-gold bg-ivory px-6 py-4 text-center sm:block">
                  <p className="font-playfair font-normal text-3xl text-charcoal">125</p>
                  <p className="font-montserrat text-[10px] tracking-[0.18em] text-stone-500 uppercase">
                    Years of service
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <p className="eyebrow text-gold">Since 1898</p>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
                A boutique built on a single principle.
              </h2>
              <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-stone-600">
                <p>
                  Our founder, Ellinor Vance, believed that a watch should be chosen the way one
                  chooses a companion — slowly, deliberately, and with an eye to the decades ahead.
                  That philosophy still guides everything we do.
                </p>
                <p>
                  We work directly with six independent maisons, each with its own atelier and its own
                  obsession. We visit them, we wear their watches, and we only carry the references we
                  would happily pass to our own families.
                </p>
                <p>
                  Nothing is mass-produced here. Every watch is inspected, regulated and prepared by
                  hand before it is wrapped and sent on its way.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/shop">
                  <Button variant="outline">Explore the collection</Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Craft pillars */}
      <section className="border-y border-stone-200 bg-stone-100 py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The craft"
              title="Why a WatchGuru.pk is different"
              description="Four commitments we make on every single watch that leaves the boutique."
            />
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {CRAFT.map((item, index) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={index * 80}>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full border border-stone-300 bg-white text-gold">
                      <Icon className="size-6" strokeWidth={1.4} />
                    </span>
                    <h3 className="text-lg">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-500">{item.copy}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Craft image + copy */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="order-2 lg:order-1">
              <p className="eyebrow text-gold">Assembled by hand</p>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
                The last two per cent is the part you feel.
              </h2>
              <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-stone-600">
                <p>
                  A dial may take a year to perfect and a bracelet three months to finish — and yet
                  the difference between a good watch and a great one comes down to the final hours
                  of assembly and regulation.
                </p>
                <p>
                  Our watchmakers spend that time willingly. They adjust, re-adjust, and only sign
                  off when the watch keeps time well within the standards of chronometric precision.
                  Then, and only then, is it ready for you.
                </p>
              </div>
              <ul className="mt-8 flex flex-col gap-3">
                {['Five-position regulation', 'Fourteen-day timing test', 'Signed by the watchmaker'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-charcoal">
                      <span className="h-px w-6 bg-gold" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>

            <Reveal delay={120} className="order-1 lg:order-2">
              <img
                src={CRAFT_IMAGE}
                alt="Detail of a stainless steel watch bracelet"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-16">
        <Container>
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="font-playfair font-normal text-4xl text-ivory sm:text-5xl">{stat.value}</dt>
                <dd className="mt-2 font-montserrat text-[10px] tracking-[0.2em] text-stone-400 uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="What we stand for" title="Our values" />
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {VALUES.map((value, index) => {
              const Icon = value.icon
              return (
                <Reveal key={value.title} delay={index * 90}>
                  <div className="flex flex-col items-center gap-4 border border-stone-200 bg-white p-8 text-center">
                    <Icon className="size-7 text-gold" strokeWidth={1.4} />
                    <h3 className="text-xl">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-500">{value.copy}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 bg-stone-100 py-16 sm:py-20">
        <Container>
          <Reveal className="flex flex-col items-center text-center">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Find the watch you will keep for a lifetime.
            </h2>
            <p className="mt-4 max-w-lg text-sm text-stone-500">
              Browse the boutique, or speak with our concierge for a personal recommendation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/shop">
                <Button size="lg">Shop the collection</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Contact the concierge
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
