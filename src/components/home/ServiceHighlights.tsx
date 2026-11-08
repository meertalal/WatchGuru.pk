import { Link } from 'react-router-dom'
import { BadgeCheck, Headset, ShieldCheck, Truck } from 'lucide-react'
import { Container } from '../ui/Container'

const SERVICES = [
  {
    icon: Truck,
    title: 'Free insured delivery',
    text: 'Nationwide, 2 to 5 days',
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
    text: 'WhatsApp, 9am to 9pm PKT',
    to: '/contact',
  },
]

export function ServiceHighlights() {
  return (
    <section aria-label="Our promises" className="bg-obsidian">
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, text, to }) => (
            <li key={title}>
              <Link
                to={to}
                className="group flex h-full items-center gap-4 px-3 py-6 transition-colors hover:bg-charcoal sm:px-6 sm:py-7 lg:px-7"
              >
                <Icon
                  className="size-5 shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5"
                  strokeWidth={1.3}
                />
                <span>
                  <span className="block font-akkurat text-[9px] font-medium tracking-[0.18em] text-ivory uppercase">
                    {title}
                  </span>
                  <span className="mt-1 block text-[10.5px] font-light tracking-wide text-muted">
                    {text}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
