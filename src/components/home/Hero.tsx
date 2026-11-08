import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { buttonClass } from '../../lib/ui'
import { classNames } from '../../lib/format'
import { Container } from '../ui/Container'

interface Slide {
  id: string
  eyebrow: string
  title: string
  copy: string
  image: string
  imageAlt: string
  cta: { label: string; to: string }
  secondary?: { label: string; to: string }
}

const SLIDES: Slide[] = [
  {
    id: 'collection-2026',
    eyebrow: 'The 2026 Collection',
    title: 'Time, crafted to be kept.',
    copy: 'A curated boutique of 100% original luxury watches. Authorised sourcing, insured nationwide delivery and a one-year machine warranty on every piece.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Luxury automatic wristwatch photographed in studio light',
    cta: { label: 'Shop the collection', to: '/collections/all' },
    secondary: { label: 'The Executive Edit', to: '/collections/executive' },
  },
  {
    id: 'executive',
    eyebrow: 'The Executive Edit',
    title: 'For the extraordinary few.',
    copy: 'Perpetual calendars, tourbillons and numbered editions, specially imported for clients who demand the singular.',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Executive dress watch with a detailed dial and metal case',
    cta: { label: 'Explore Executive', to: '/collections/executive' },
    secondary: { label: 'Our own maison', to: '/collections/brand/watchguru-atelier' },
  },
  {
    id: 'cod',
    eyebrow: 'Cash on Delivery',
    title: 'See it. Check it. Then pay.',
    copy: 'Pay only after your watch is in your hands. A Rs. 1,000 advance confirms serious orders and is adjusted against your bill.',
    image:
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Sports chronograph watch with a dark dial and steel bracelet',
    cta: { label: 'How COD works', to: '/policies/shipping-policy' },
    secondary: { label: 'Shop with confidence', to: '/collections/all' },
  },
]

const STATS = [
  { value: '07', label: 'Maisons we carry' },
  { value: '1 yr', label: 'Machine warranty' },
  { value: '100%', label: 'Original watches' },
]

/** Existing service promises, reused as the hero's right-hand highlights. */
const FEATURES = [
  {
    title: 'Free insured delivery',
    text: 'Nationwide, 2 to 5 days',
    to: '/policies/shipping-policy',
  },
  {
    title: 'Concierge support',
    text: 'WhatsApp, 9am to 9pm PKT',
    to: '/contact',
  },
]

const AUTOPLAY_MS = 6500

/**
 * Editorial hero, a three-part composition: existing copy on the left, a large
 * centred watch, and service highlights with connector lines on the right.
 * Autoplay pauses on hover, honours reduced motion, and keeps the existing
 * slide controls, indicators and CTA destinations intact.
 */
export function Hero() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const slide = SLIDES[index]

  useEffect(() => {
    if (!playing) return
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % SLIDES.length),
      AUTOPLAY_MS,
    )
    return () => window.clearInterval(timer)
  }, [playing])

  const goTo = (next: number) => setIndex((next + SLIDES.length) % SLIDES.length)

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      className="relative isolate overflow-hidden bg-obsidian"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_62%_42%,rgba(201,187,165,0.10),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 pb-12 pt-14 sm:gap-12 sm:pt-16 md:grid-cols-2 md:gap-x-10 md:gap-y-12 md:pb-14 md:pt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:pb-16 lg:pt-24">
          {/* Left side: introduction, heading, copy, CTA and trust figures */}
          <div className="contents md:col-span-1 md:flex md:flex-col lg:col-span-4">
            <div className="order-1 md:order-none">
              <p className="eyebrow flex items-center gap-3 text-gold" aria-live="polite">
                <span className="gold-rule" aria-hidden="true" />
                {slide.eyebrow}
              </p>
              <h1
                key={slide.id}
                className="fade-up display mt-6 text-[2.85rem] leading-[1.02] text-balance sm:text-[3.4rem] lg:text-[3.5rem] xl:text-[4.05rem]"
              >
                {slide.title}
              </h1>
            </div>

            <div className="order-3 md:order-none md:mt-8 lg:mt-9">
              <p
                key={`${slide.id}-copy`}
                className="fade-up max-w-md text-[13.5px] font-light leading-[1.9] text-ash sm:text-[14.5px]"
              >
                {slide.copy}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link to={slide.cta.to} className={buttonClass('primary', 'lg')}>
                  {slide.cta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                {slide.secondary && (
                  <Link
                    to={slide.secondary.to}
                    className={buttonClass(
                      'outline',
                      'lg',
                      'border-ivory/25 text-ivory hover:border-ivory hover:text-ivory',
                    )}
                  >
                    {slide.secondary.label}
                  </Link>
                )}
              </div>

              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-cormorant text-[1.7rem] leading-none text-ivory sm:text-[1.9rem]">
                      {stat.value}
                    </dt>
                    <dd className="mt-2 font-akkurat text-[8px] tracking-[0.2em] text-ash uppercase">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Centre: the watch, presented large on a restrained ring composition */}
          <div className="order-2 mx-auto w-full max-w-[340px] sm:max-w-[380px] md:order-none md:col-span-1 md:max-w-[420px] lg:col-span-5 lg:max-w-[500px]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="absolute size-[88%] rounded-full border border-gold/10" />
                <span className="absolute size-[72%] rounded-full border border-gold/15" />
                <span className="absolute size-[56%] rounded-full border border-gold/10" />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(201,187,165,0.18),transparent_60%)]"
              />

              {SLIDES.map((item, i) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt={i === index ? item.imageAlt : ''}
                  aria-hidden={i !== index}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className={classNames(
                    'absolute inset-0 size-full object-cover object-center transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    i === index ? 'scale-[1.45] opacity-100' : 'scale-[1.52] opacity-0',
                  )}
                />
              ))}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_56%,var(--color-obsidian)_100%)]"
              />
            </div>
          </div>

          {/* Right side: service highlights, connectors and circular CTA */}
          <aside className="order-4 flex flex-col gap-8 md:order-none md:col-span-2 md:flex-row md:items-center md:justify-between md:gap-10 lg:col-span-3 lg:flex-col lg:items-stretch lg:gap-12">
            <div className="grid gap-7 sm:grid-cols-2 md:gap-8 lg:grid-cols-1 lg:gap-12">
              {FEATURES.map((feature) => (
                <Link key={feature.title} to={feature.to} className="group relative block">
                  <span
                    aria-hidden="true"
                    className="absolute -left-8 top-[7px] hidden h-px w-8 bg-gradient-to-r from-gold/60 via-gold/25 to-transparent lg:block"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -left-8 top-[4px] hidden size-1.5 rounded-full bg-gold/70 lg:block"
                  />
                  <p className="eyebrow text-ivory transition-colors duration-300 group-hover:text-gold">
                    {feature.title}
                  </p>
                  <p className="mt-2 text-[11.5px] font-light leading-[1.7] text-ash">
                    {feature.text}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              to={slide.cta.to}
              aria-label={slide.cta.label}
              className="group inline-flex size-16 shrink-0 items-center justify-center self-start rounded-full border border-gold/40 text-gold transition-all duration-500 hover:border-gold hover:bg-gold hover:text-obsidian md:self-center lg:self-start"
            >
              <ArrowUpRight
                className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Link>
          </aside>
        </div>
      </Container>

      {/* Bottom slider indicators and controls */}
      <div className="relative z-10 border-t border-line/70">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5">
            <p className="order-1 font-akkurat text-[9px] tracking-[0.32em] text-ash uppercase">
              {String(index + 1).padStart(2, '0')}{' '}
              <span className="text-muted">/</span>{' '}
              {String(SLIDES.length).padStart(2, '0')}
            </p>

            <div
              className="order-3 flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto"
              role="tablist"
              aria-label="Slides"
            >
              {SLIDES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}: ${item.eyebrow}`}
                  onClick={() => goTo(i)}
                  className="group flex h-8 items-center px-1"
                >
                  <span
                    className={classNames(
                      'block h-px transition-all duration-500',
                      i === index ? 'w-10 bg-gold' : 'w-5 bg-ivory/25 group-hover:bg-ivory/50',
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="order-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous slide"
                className="flex size-10 items-center justify-center border border-line/80 bg-obsidian/40 text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next slide"
                className="flex size-10 items-center justify-center border border-line/80 bg-obsidian/40 text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
                aria-pressed={!playing}
                className="flex size-10 items-center justify-center border border-line/80 bg-obsidian/40 text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                {playing ? (
                  <Pause className="size-3.5" aria-hidden="true" />
                ) : (
                  <Play className="size-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
