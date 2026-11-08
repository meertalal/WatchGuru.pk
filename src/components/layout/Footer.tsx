import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { COLLECTION_LINKS, SUPPORT_LINKS } from '../../lib/navigation'
import { Container } from '../ui/Container'
import { NewsletterForm } from '../newsletter/NewsletterForm'
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from '../ui/SocialIcons'
import { FooterSkyline } from './FooterSkyline'

const CURRENT_YEAR = new Date().getFullYear()

const IMPORTANT_LINKS = [{ label: 'Home', to: '/' }, ...COLLECTION_LINKS]

const INFORMATION_LINKS = [{ label: 'About Us', to: '/about' }, ...SUPPORT_LINKS]

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    text: 'WatchGuru.pk Flagship, Phase 6, DHA, Karachi 75500',
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      'Phase 6, DHA, Karachi 75500, Pakistan',
    )}`,
    external: true,
  },
  {
    icon: Phone,
    text: '+92 322 2242389',
    href: 'tel:+923222242389',
  },
  {
    icon: Mail,
    text: 'concierge@watchguru.pk',
    href: 'mailto:concierge@watchguru.pk',
  },
  {
    icon: Clock,
    text: 'Daily, 9am to 9pm PKT',
  },
]

const SOCIAL = [
  { label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/watchguru.pk' },
  { label: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com/watchguru.pk' },
  { label: 'X', icon: XIcon, href: 'https://x.com/watchgurupk' },
  { label: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/@watchgurupk' },
  { label: 'WhatsApp', icon: WhatsAppIcon, href: 'https://wa.me/923222242389' },
]

const PAYMENT_METHODS = ['Cash on Delivery', 'Bank Transfer', 'Easypaisa', 'JazzCash']

const linkClass =
  'text-[12.5px] font-light text-ash transition-colors duration-300 hover:text-gold'

/**
 * Site footer — a curved, watchmakers' skyline over four columns: newsletter,
 * important links, information and contact details, followed by social links,
 * copyright and the payment methods already supported by the store.
 */
export function Footer() {
  return (
    <footer className="relative mt-auto bg-coal text-ash">
      <FooterSkyline />

      <Container>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 pt-10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1fr_1fr] lg:gap-x-12 lg:pt-12 lg:pb-20">
          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="font-playfair text-[1.7rem] font-normal tracking-[0.2em] text-ivory transition-colors hover:text-gold sm:text-[2rem] sm:tracking-[0.24em]"
            >
              WatchGuru<span className="text-gold">.pk</span>
            </Link>
            <p className="mt-4 max-w-sm text-[12.5px] font-light leading-[1.9] text-ash">
              Pakistan’s home for 100% original luxury watches, sourced from authorised maisons,
              verified in-house, and delivered to your door with a one-year machine warranty.
            </p>

            <div className="mt-8 max-w-md">
              <h3 className="font-playfair text-[1.35rem] font-normal tracking-[0.06em] text-ivory">
                The Dispatch
              </h3>
              <p className="mt-2 text-[12.5px] font-light leading-[1.9] text-ash">
                New arrivals, private events and atelier stories. A short letter, once a month.
              </p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
              <p className="mt-3 text-[10px] font-light text-muted">
                No spam, ever. Unsubscribe any time.
              </p>
            </div>
          </div>

          {/* Important links */}
          <div>
            <h3 className="eyebrow text-ivory">Important Links</h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {IMPORTANT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="eyebrow text-ivory">Information</h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {INFORMATION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="eyebrow text-ivory">Contact</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {CONTACT_DETAILS.map(({ icon: Icon, text, href, external }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-gold"
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                      className="text-[12.5px] font-light leading-[1.7] text-ash transition-colors duration-300 hover:text-gold"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-[12.5px] font-light leading-[1.7] text-ash">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-line">
          <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-muted">Follow the maison</p>
              <ul className="flex flex-wrap items-center gap-3">
                {SOCIAL.map(({ label, icon: Icon, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`WatchGuru.pk on ${label}`}
                      className="flex size-9 items-center justify-center rounded-full border border-line text-ash transition-colors duration-300 hover:border-gold/50 hover:text-gold"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <p className="eyebrow text-muted">We accept</p>
              <ul className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <li
                    key={method}
                    className="border border-line px-2.5 py-1 font-akkurat text-[8px] font-medium tracking-[0.16em] text-ash uppercase"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-line/70 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
              <p className="font-akkurat text-[9px] tracking-[0.22em] text-ivory uppercase">
                WatchGuru<span className="text-gold">.pk</span> Boutique
              </p>
              <p className="text-[10px] tracking-wide text-muted">
                © {CURRENT_YEAR} WatchGuru.pk Boutique. All rights reserved.
              </p>
              <p className="text-[10px] tracking-wide text-muted">
                Created and designed by{' '}
                <a
                  href="https://mirtalal.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash underline-offset-2 transition-colors hover:text-gold hover:underline"
                >
                  Mir Talal Baloch
                </a>
              </p>
            </div>
            <p className="text-[10px] tracking-wide text-muted">Karachi, Pakistan</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
