import { Link } from 'react-router-dom'
import { COLLECTION_LINKS, COMPANY_LINKS, SUPPORT_LINKS } from '../../lib/navigation'
import { Container } from '../ui/Container'
import { NewsletterForm } from '../newsletter/NewsletterForm'
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from '../ui/SocialIcons'

const CURRENT_YEAR = new Date().getFullYear()

const SOCIAL = [
  { label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/watchguru.pk' },
  { label: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com/watchguru.pk' },
  { label: 'X', icon: XIcon, href: 'https://x.com/watchgurupk' },
  { label: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/@watchgurupk' },
]

const PAYMENT_METHODS = ['Cash on Delivery', 'Bank Transfer', 'Easypaisa', 'JazzCash']

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-charcoal text-ash">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="font-playfair font-normal text-3xl tracking-[0.22em] text-ivory transition-colors hover:text-gold"
            >
              WatchGuru<span className="text-gold">.pk</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">
              Pakistan’s home for 100% original luxury watches — sourced from authorised
              maisons, verified in-house, and delivered to your door with a one-year machine
              warranty.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {SOCIAL.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WatchGuru.pk on ${label}`}
                  className="flex size-10 items-center justify-center border border-line text-ash transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  <Icon className="size-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="eyebrow mb-2 text-ash">We accept</p>
              <ul className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <li
                    key={method}
                    className="border border-line px-3 py-1.5 font-montserrat text-[9px] font-medium tracking-[0.18em] text-ash uppercase"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Shopping */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-5 font-semibold text-ivory">Shop</h3>
            <ul className="flex flex-col gap-3">
              {COLLECTION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ash transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer care */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow mb-5 font-semibold text-ivory">Customer Care</h3>
            <ul className="flex flex-col gap-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ash transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {COMPANY_LINKS.filter((l) => !SUPPORT_LINKS.some((s) => s.to === l.to)).map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ash transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow mb-5 font-semibold text-ivory">The Dispatch</h3>
            <p className="text-sm leading-relaxed text-ash">
              New arrivals, private events and atelier stories — a short letter, once a month.
            </p>
            <div className="mt-5">
              <NewsletterForm dark />
            </div>
            <p className="mt-3 text-[11px] text-ash">
              No spam, ever. Unsubscribe any time.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-7 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] tracking-wide text-ash">
            © {CURRENT_YEAR} WatchGuru.pk Boutique. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: 'Refund Policy', to: '/policies/refund-policy' },
              { label: 'Shipping Policy', to: '/policies/shipping-policy' },
              { label: 'Warranty', to: '/policies/warranty' },
              { label: 'Terms of Service', to: '/policies/terms-of-service' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[11px] tracking-wide text-ash transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  )
}
