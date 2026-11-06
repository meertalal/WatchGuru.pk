import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, RotateCcw, ShieldCheck, Wallet } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const BENEFITS = [
  {
    icon: Wallet,
    title: 'Cash on Delivery',
    text: 'Pay when your watch arrives. A Rs. 1,000 advance confirms serious orders only — adjusted against your balance.',
    to: '/policies/shipping-policy',
    cta: 'How COD works',
  },
  {
    icon: RotateCcw,
    title: 'Easy Return & Exchange',
    text: 'Received a fault or simply changed your mind? Seven days to return or exchange — hassle-free, insured both ways.',
    to: '/policies/refund-policy',
    cta: 'Read the policy',
  },
  {
    icon: ShieldCheck,
    title: '1-Year Machine Warranty',
    text: 'Every movement we sell is covered against manufacturing defects for a full year — serviced by our own watchmakers.',
    to: '/policies/warranty',
    cta: 'Warranty details',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Assurance',
    text: 'Each piece passes a 40-point inspection — timing, water resistance, clasp fit, finishing — before it reaches your wrist.',
    to: '/policies/warranty',
    cta: 'Our verification',
  },
]

/** The four promises that make ordering from us risk-free. */
export function BenefitsGrid() {
  return (
    <section className="border-t border-line bg-charcoal py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="The WatchGuru Assurance"
          title="Buy with total confidence"
        />
        <ul className="mt-12 grid gap-px border border-line bg-charcoal sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <li key={benefit.title} className="bg-charcoal">
              <Reveal delay={index * 90} className="h-full">
                <div className="flex h-full flex-col gap-4 p-6 sm:p-7">
                  <span className="flex size-12 items-center justify-center border border-gold/50 text-gold">
                    <benefit.icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-cormorant font-medium text-xl leading-snug">{benefit.title}</h3>
                  <p className="text-[13px] leading-relaxed text-ash">{benefit.text}</p>
                  <Link
                    to={benefit.to}
                    className="mt-auto inline-flex items-center gap-2 pt-2 font-montserrat text-[10px] font-medium tracking-[0.2em] text-white uppercase transition-colors hover:text-gold"
                  >
                    {benefit.cta}
                    <ArrowRight className="size-3.5" />
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
