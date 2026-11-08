import type { ComponentType, SVGProps } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { WhatsAppIcon } from '../ui/SocialIcons'

type ContactIcon = ComponentType<SVGProps<SVGSVGElement>>

const WHATSAPP_HREF = `https://wa.me/923222242389?text=${encodeURIComponent(
  'Hello WatchGuru.pk, I would like some help with a watch.',
)}`

const MAP_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Phase 6, DHA, Karachi 75500, Pakistan',
)}`

interface ContactItem {
  icon: ContactIcon
  title: string
  lines: string[]
  href: string
  external?: boolean
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+92 322 2242389', 'Daily, 9am to 9pm PKT'],
    href: 'tel:+923222242389',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['concierge@watchguru.pk', 'Replies within one business day'],
    href: 'mailto:concierge@watchguru.pk',
  },
  {
    icon: WhatsAppIcon,
    title: 'WhatsApp',
    lines: ['+92 322 2242389', 'Chat with our concierge'],
    href: WHATSAPP_HREF,
    external: true,
  },
  {
    icon: MapPin,
    title: 'Boutique',
    lines: ['WatchGuru.pk Flagship', 'Phase 6, DHA, Karachi 75500'],
    href: MAP_HREF,
    external: true,
  },
]

/**
 * A two-column contact grid: phone, email, WhatsApp and the existing boutique
 * address, each with a centred icon and supporting detail.
 */
export function ContactInformation() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CONTACT_ITEMS.map(({ icon: Icon, title, lines, href, external }) => (
        <li key={title}>
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
            className="group flex h-full flex-col items-center border border-line bg-coal/50 px-4 py-6 text-center transition-colors duration-300 hover:border-gold/40 hover:bg-charcoal/60"
          >
            <span className="flex size-12 items-center justify-center rounded-full border border-gold/25 bg-obsidian text-gold transition-colors duration-300 group-hover:border-gold/60 group-hover:bg-gold/10">
              <Icon className="size-5" strokeWidth={1.4} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-akkurat text-[9px] font-medium tracking-[0.22em] text-ivory uppercase">
              {title}
            </h3>
            {lines.map((line, index) => (
              <span
                key={line}
                className={
                  index === 0
                    ? 'mt-2 text-[12.5px] font-light leading-relaxed text-ash'
                    : 'mt-1 text-[11px] font-light leading-relaxed text-muted'
                }
              >
                {line}
              </span>
            ))}
          </a>
        </li>
      ))}
    </ul>
  )
}
