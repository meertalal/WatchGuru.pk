import { Link } from 'react-router-dom'
import { BadgeCheck, Headset, ShieldCheck, Truck } from 'lucide-react'
import { Container } from '../ui/Container'

const SERVICES = [
  {
    icon: Truck,
    title: 'Free insured delivery',
    text: 'Nationwide · 2–5 days',
    to: '/policies/shipping-policy',
  },
  {
    icon: ShieldCheck,
    title: '1-year machine warranty',
    text: 'In-house watchmakers',
    to: '/policies/warranty',
  },
  {
    icon: BadgeCheck,
    title: '100% original watches',
    text: 'Authorised sourcing',
    to: '/policies/warranty',
  },
  {
    icon: Headset,
    title: 'Concierge support',
    text: 'WhatsApp · 9am–9pm PKT',
    to: '/contact',
  },
]

export function ServiceHighlights() {
  return (
    <section aria-label="Our promises" className="border-b border-line bg-charcoal">
      <Container>
        <ul className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {SERVICES.map(({ icon: Icon, title, text, to }) => (
            <li key={title}>
              <Link
                to={to}
                className="flex items-center gap-4 px-1 py-7 transition-colors hover:bg-lift lg:px-8"
              >
                <Icon className="size-6 shrink-0 text-gold" strokeWidth={1.4} />
                <span>
                  <span className="block font-montserrat text-[12px] font-medium tracking-[0.06em] text-white">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-ash">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
