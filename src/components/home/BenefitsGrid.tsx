import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, RotateCcw, ShieldCheck, Wallet } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const BENEFITS = [
  {
    icon: Wallet,
    title: 'Cash on Delivery',
    text: 'Pay when your watch arrives. A Rs. 1,000 advance confirms serious orders only and is adjusted against your balance.',
    to: '/policies/shipping-policy',
    cta: 'How COD works',
  },
  {
    icon: RotateCcw,
    title: 'Easy Return & Exchange',
    text: 'Received a fault or simply changed your mind? Seven days to return or exchange, hassle-free and insured both ways.',
    to: '/policies/refund-policy',
    cta: 'Read the policy',
  },
  {
    icon: ShieldCheck,
    title: '1-Year Machine Warranty',
    text: 'Every movement we sell is covered against manufacturing defects for a full year, serviced by our own watchmakers.',
    to: '/policies/warranty',
    cta: 'Warranty details',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Assurance',
    text: 'Each piece passes a 40-point inspection for timing, water resistance, clasp fit and finishing before it reaches your wrist.',
    to: '/policies/warranty',
    cta: 'Our verification',
  },
]

/** The four promises that make ordering from us risk-free. */
export function BenefitsGrid() {
  return (
    <section className="bg-coal py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="The WatchGuru Assurance"
          title="Buy with total confidence"
        />
        <ul className="mt-11 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
          {BENEFITS.map((benefit, index) => (
            <li key={benefit.title} className="pt-6">
              <Reveal delay={index * 80} className="h-full">
                <div className="flex h-full flex-col">
                  <benefit.icon className="size-5 text-gold" strokeWidth={1.3} />
                  <h3 className="mt-5 font-cormorant text-[1.45rem] leading-snug text-ivory">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-[12.5px] font-light leading-[1.8] text-ash">
                    {benefit.text}
                  </p>
                  <Link
                    to={benefit.to}
                    className="group mt-auto inline-flex items-center gap-2 pt-5 font-akkurat text-[8.5px] font-medium tracking-[0.24em] text-ivory uppercase transition-colors hover:text-gold"
                  >
                    {benefit.cta}
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
