import { BadgeCheck, Star } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const TESTIMONIALS = [
  {
    quote:
      'I was nervous about a six-figure order online. WatchGuru called me within minutes, verified the advance, and the Sovereign arrived sealed with all its papers. Flawless service.',
    name: 'Ahmed Raza',
    location: 'Karachi',
    product: 'Beaumont Sovereign Moonphase',
  },
  {
    quote:
      'The WG-01 Atelier is genuinely on par with European pieces twice the price. The engraved case back alone makes it feel like mine.',
    name: 'Danish Mahmood',
    location: 'Lahore',
    product: 'WatchGuru Atelier WG-01 Heritage Auto',
  },
  {
    quote:
      'Cash on Delivery made it possible — I saw the watch, checked the clasp, inspected the dial, and only then paid. That is how trust is built.',
    name: 'Zainab Khan',
    location: 'Islamabad',
    product: 'Aurelian Celestia Diamond 32',
  },
  {
    quote:
      'Delivery to Peshawar took four days, fully insured, and the verification card let me confirm the serial online. Outstanding attention to detail.',
    name: 'Hassan Sheikh',
    location: 'Peshawar',
    product: 'Nordvik Fjord Diver 42',
  },
]

const INITIALS = (name: string) =>
  name.split(' ').map((part) => part.charAt(0)).slice(0, 2).join('').toUpperCase()

export function Testimonials() {
  return (
    <section className="border-b border-line bg-obsidian py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Words from Our Collectors"
          title="Trusted, sealed, delivered"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, index) => (
            <li key={t.name}>
              <Reveal delay={index * 80} className="h-full">
                <figure className="flex h-full flex-col gap-5 border border-line bg-charcoal p-6">
                  <div className="flex items-center gap-1 text-gold" aria-label="Five star review">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-4 fill-gold" strokeWidth={0} aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-[13px] leading-relaxed text-ash">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-4">
                    <span
                      aria-hidden="true"
                      className="flex size-11 items-center justify-center rounded-full bg-charcoal font-montserrat text-[11px] font-semibold tracking-widest text-gold"
                    >
                      {INITIALS(t.name)}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-white">{t.name}</span>
                      <span className="block text-[10px] tracking-wide text-ash">
                        {t.location} · <span className="text-gold">{t.product}</span>
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-[9px] font-medium tracking-[0.18em] text-gold uppercase">
                        <BadgeCheck className="size-3" aria-hidden="true" />
                        Verified purchase
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
