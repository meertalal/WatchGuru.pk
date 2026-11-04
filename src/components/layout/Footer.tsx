import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { newsletterSchema, type NewsletterValues } from '../../lib/validation'
import { useToast } from '../../store/contexts'
import { Container } from '../ui/Container'
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from '../ui/SocialIcons'

const SHOP_LINKS = [
  { label: 'All Watches', to: '/shop' },
  { label: 'Men', to: '/shop?category=men' },
  { label: 'Women', to: '/shop?category=women' },
  { label: 'New Arrivals', to: '/shop?tag=new' },
  { label: 'Sale', to: '/shop?tag=sale' },
]

const SERVICE_LINKS = [
  { label: 'Shipping & Returns', to: '/contact' },
  { label: 'Warranty & Servicing', to: '/about' },
  { label: 'Care Guide', to: '/about' },
  { label: 'Track Your Order', to: '/contact' },
  { label: 'Contact Us', to: '/contact' },
]

const CURRENT_YEAR = new Date().getFullYear()

const SOCIAL = [
  { label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
  { label: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com' },
  { label: 'X', icon: XIcon, href: 'https://x.com' },
  { label: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com' },
]

export function Footer() {
  const { notify } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: NewsletterValues) => {
    await new Promise((resolve) => setTimeout(resolve, 550))
    notify(`Thank you — ${values.email} is now subscribed to WatchGuru.pk Dispatches.`)
    reset()
  }

  return (
    <footer className="mt-auto border-t border-stone-200 bg-charcoal text-stone-300">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="font-playfair font-normal text-3xl tracking-[0.22em] text-ivory transition-colors hover:text-gold"
            >
              WatchGuru.pk
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone-400">
              A curated boutique of fine watches, assembled by hand and chosen for a lifetime.
              Independent horology, delivered worldwide.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {SOCIAL.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center border border-stone-700 text-stone-400 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  <Icon className="size-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Shopping */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-5 text-ivory font-semibold">Shop</h3>
            <ul className="flex flex-col gap-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-stone-400 transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-5 text-ivory font-semibold">Customer Care</h3>
            <ul className="flex flex-col gap-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-stone-400 transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="eyebrow mb-5 text-ivory font-semibold">WatchGuru.pk Dispatches</h3>
            <p className="text-sm leading-relaxed text-stone-400">
              New releases, auction notes and private events — a short letter, once a month.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5">
              <div className="flex items-center gap-2 border-b border-stone-700 focus-within:border-gold">
                <Mail className="size-4 text-stone-500" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Your email address"
                  aria-label="Email address"
                  aria-invalid={Boolean(errors.email)}
                  className="w-full bg-transparent py-3 font-lato text-sm text-ivory outline-none placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-montserrat text-[10px] font-medium tracking-[0.2em] whitespace-nowrap text-gold uppercase transition-opacity hover:opacity-70 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending…' : 'Subscribe'}
                </button>
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
              )}
            </form>
            <p className="mt-3 text-[11px] text-stone-500">
              Demo newsletter — no email is stored or sent.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-800 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] tracking-wide text-stone-500">
            © {CURRENT_YEAR} WatchGuru.pk Boutique. A demonstration storefront — no orders
            are processed.
          </p>
          <p className="text-[11px] tracking-wide text-stone-500">
            Crafted for horology lovers · Swiss-inspired · Worldwide
          </p>
        </div>
      </Container>
    </footer>
  )
}
