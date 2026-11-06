import { Link } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import { COD_ADVANCE_PKR } from '../../lib/orders'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

const POINTS = [
  'We take a Rs. 1,000 advance only to confirm your order is genuine — nothing more, nothing hidden.',
  'Every unconfirmed order costs us packaging, insurance, transport and labour; the advance filters out non-serious bookings.',
  'The moment your watch is in your hands, the Rs. 1,000 is adjusted against your bill — you never pay a rupee extra.',
  'Your parcel is insured end-to-end and handed to you only after full payment on delivery.',
]

/**
 * Honest explainer for the Cash-on-Delivery confirmation advance —
 * why it exists and exactly how it is adjusted.
 */
export function AdvanceExplainer() {
  return (
    <section className="bg-charcoal py-16 text-ivory sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-gold">Fair & Transparent</p>
            <h2 className="mt-4 font-playfair font-normal text-3xl leading-[1.15] sm:text-4xl">
              Why we take<br />
              Rs. {COD_ADVANCE_PKR.toLocaleString('en-PK')} in advance?
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ash">
              We love Cash on Delivery — it lets you inspect your watch before a single
              rupee moves. The small advance simply makes sure both sides mean business.
            </p>
            <Link
              to="/policies/shipping-policy"
              className="mt-8 inline-flex items-center gap-2 font-montserrat text-[11px] font-medium tracking-[0.22em] text-gold uppercase transition-opacity hover:opacity-75"
            >
              Read the full shipping policy
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <ul className="flex flex-col gap-4 lg:col-span-7">
            {POINTS.map((point, index) => (
              <Reveal key={point} delay={index * 90}>
                <li className="flex items-start gap-4 border border-ivory/10 bg-obsidian/[0.04] p-5">
                  <span className="flex size-7 shrink-0 items-center justify-center border border-gold/50 font-playfair text-sm text-gold">
                    {index + 1}
                  </span>
                  <span className="text-[13px] leading-relaxed text-ash">{point}</span>
                </li>
              </Reveal>
            ))}
            <li className="flex items-start gap-3 px-1 text-[11px] leading-relaxed text-ash">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Advances are refunded within 5–7 working days if your order is cancelled before
              dispatch, or if we fail to deliver within the promised window.
            </li>
          </ul>
        </div>
      </Container>
    </section>
  )
}
