import { BadgeCheck, Headphones, ShieldCheck, Truck } from 'lucide-react'
import { Container } from '../ui/Container'

const SERVICES = [
  { icon: Truck, title: 'Free insured shipping', text: 'On every order, worldwide' },
  { icon: ShieldCheck, title: '5-year warranty', text: 'International coverage' },
  { icon: BadgeCheck, title: 'Authenticity assured', text: 'Certified on every piece' },
  { icon: Headphones, title: 'Concierge support', text: 'Mon–Sat, 9am–6pm GMT' },
]

export function ServiceHighlights() {
  return (
    <section className="border-b border-stone-200 bg-white">
      <Container>
        <ul className="grid grid-cols-2 divide-stone-200 lg:grid-cols-4 lg:divide-x">
          {SERVICES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4 px-1 py-7 lg:px-8">
              <Icon className="size-6 shrink-0 text-gold" strokeWidth={1.4} />
              <div>
                <p className="font-montserrat text-[12px] font-medium tracking-[0.06em] text-charcoal">{title}</p>
                <p className="mt-0.5 text-[11px] text-stone-500">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
