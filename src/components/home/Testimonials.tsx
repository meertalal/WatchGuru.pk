import { BadgeCheck, FileCheck2, ShieldCheck, Truck } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const PROMISES = [
  {
    icon: BadgeCheck,
    title: 'Authorised sourcing',
    copy: 'Every watch is sourced through authorised partner maisons. No grey-market stock.',
  },
  {
    icon: FileCheck2,
    title: 'Papers and seals intact',
    copy: 'Warranty cards, manuals and serial-linked papers are delivered with each piece.',
  },
  {
    icon: ShieldCheck,
    title: 'One-year machine warranty',
    copy: 'Movement and manufacturing faults are covered for twelve months from delivery.',
  },
  {
    icon: Truck,
    title: 'Insured nationwide delivery',
    copy: 'Fully insured shipping with a signature on arrival, 2 to 5 business days after dispatch.',
  },
]

export function Testimonials() {
  return (
    <section className="bg-coal py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="What Comes With Every Piece"
          title="Sold with proof, not promises"
        />
        <ul className="mt-11 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
          {PROMISES.map((promise, index) => {
            const Icon = promise.icon
            return (
              <li key={promise.title} className="pt-6">
                <Reveal delay={index * 70} className="h-full">
                  <div className="flex h-full flex-col">
                    <span className="flex size-9 items-center justify-center bg-surface text-gold">
                      <Icon className="size-4" strokeWidth={1.3} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-cormorant text-[1.25rem] font-light leading-[1.5] text-ivory">
                      {promise.title}
                    </h3>
                    <p className="mt-2 text-[12px] font-light leading-[1.75] text-ash">
                      {promise.copy}
                    </p>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
