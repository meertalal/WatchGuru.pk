import { Link } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import { COD_ADVANCE_PKR } from '../../lib/orders'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

const POINTS = [
  'We take a Rs. 1,000 advance only to confirm your order is genuine. Nothing more, nothing hidden.',
  'Every unconfirmed order costs us packaging, insurance, transport and labour; the advance filters out non-serious bookings.',
  'The moment your watch is in your hands, the Rs. 1,000 is adjusted against your bill. You never pay a rupee extra.',
  'Your parcel is insured end-to-end and handed to you only after full payment on delivery.',
]

/**
 * Honest explainer for the Cash-on-Delivery confirmation advance,
 * why it exists and exactly how it is adjusted.
 */
export function AdvanceExplainer() {
  return (
    <section className="bg-obsidian py-16 text-ivory sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="gold-rule" aria-hidden="true" />
              Fair &amp; Transparent
            </p>
            <h2 className="mt-5 font-cormorant text-[2.3rem] font-normal leading-[1.06] text-ivory sm:text-[2.9rem]">
              Why we take
              <br />
              <span className="italic text-gold">
                Rs. {COD_ADVANCE_PKR.toLocaleString('en-PK')}
              </span>{' '}
              in advance?
            </h2>
            <p className="mt-6 max-w-md text-[13.5px] font-light leading-[1.9] text-ash">
              We love Cash on Delivery. It lets you inspect your watch before a single
              rupee moves. The small advance simply makes sure both sides mean business.
            </p>
            <Link
              to="/policies/shipping-policy"
              className="group mt-8 inline-flex items-center gap-2.5 font-akkurat text-[9px] font-medium tracking-[0.24em] text-gold uppercase transition-opacity hover:opacity-75"
            >
              Read the full shipping policy
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <ul className="flex flex-col lg:col-span-7">
            {POINTS.map((point, index) => (
              <Reveal key={point} delay={index * 70}>
                <li className="flex items-start gap-4 py-5">
                  <span className="flex size-7 shrink-0 items-center justify-center border border-gold/40 font-cormorant text-sm text-gold">
                    {index + 1}
                  </span>
                  <span className="text-[12.5px] font-light leading-[1.85] text-ash">{point}</span>
                </li>
              </Reveal>
            ))}
            <li className="flex items-start gap-3 px-1 pt-5 text-[10.5px] font-light leading-relaxed text-muted">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Advances are refunded within 5 to 7 working days if your order is cancelled before
              dispatch, or if we fail to deliver within the promised window.
            </li>
          </ul>
        </div>
      </Container>
    </section>
  )
}
