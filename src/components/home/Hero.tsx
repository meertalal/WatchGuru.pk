import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Pause, Play } from 'lucide-react'
import { buttonClass } from '../../lib/ui'
import { classNames } from '../../lib/format'

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
    copy: 'A curated boutique of 100% original luxury watches — authorised sourcing, insured nationwide delivery and a one-year machine warranty on every piece.',
    image:
      '/heroes/2026-collection.svg',
    imageAlt: 'WatchGuru Atelier WG-01 Heritage Auto — original artwork',
    cta: { label: 'Shop the collection', to: '/collections/all' },
    secondary: { label: 'The Executive Edit', to: '/collections/executive' },
  },
  {
    id: 'executive',
    eyebrow: 'The Executive Edit',
    title: 'For the extraordinary few.',
    copy: 'Perpetual calendars, tourbillons and numbered editions — specially imported for clients who demand the singular.',
    image:
      '/heroes/executive.svg',
    imageAlt: 'Beaumont Monarch Perpetual with moonphase — original artwork',
    cta: { label: 'Explore Executive', to: '/collections/executive' },
    secondary: { label: 'Our own maison', to: '/collections/brand/watchguru-atelier' },
  },
  {
    id: 'cod',
    eyebrow: 'Cash on Delivery',
    title: 'See it. Check it. Then pay.',
    copy: 'Pay only after your watch is in your hands — a Rs. 1,000 advance confirms serious orders, and is adjusted against your bill.',
    image:
      '/heroes/cod.svg',
    imageAlt: 'WatchGuru Atelier WG-02 Chronosport chronograph — original artwork',
    cta: { label: 'How COD works', to: '/policies/shipping-policy' },
    secondary: { label: 'Shop with confidence', to: '/collections/all' },
  },
]

const AUTOPLAY_MS = 6500

/**
 * Promotional hero slider — auto-advances, pauses on hover/focus, honours
 * reduced motion, and never traps keyboard users.
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
      className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-charcoal"
    >
      {/* Slides — crossfade via opacity, only active is visible */}
      {SLIDES.map((item, i) => (
        <img
          key={item.id}
          src={item.image}
          alt={i === index ? item.imageAlt : ''}
          aria-hidden={i !== index}
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : 'auto'}
          className={classNames(
            'absolute inset-0 -z-10 size-full object-cover transition-opacity duration-[1200ms] ease-out',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/85 via-obsidian/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />

      <div className="mx-auto w-full max-w-[1280px] px-5 py-24 sm:px-8 lg:px-10">
        <div className="max-w-xl">
          <p className="eyebrow mb-5 text-gold" aria-live="polite">
            {slide.eyebrow}
          </p>
          <h1
            key={slide.id}
            className="fade-up font-playfair font-normal text-[2.75rem] leading-[1.05] text-ivory sm:text-6xl lg:text-[4.5rem]"
          >
            {slide.title}
          </h1>
          <p key={`${slide.id}-copy`} className="fade-up mt-6 max-w-md text-[15px] leading-relaxed text-ash">
            {slide.copy}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to={slide.cta.to} className={buttonClass('gold', 'lg')}>
              {slide.cta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            {slide.secondary && (
              <Link
                to={slide.secondary.to}
                className={buttonClass(
                  'outline',
                  'lg',
                  'border-ivory/40 text-ivory hover:border-ivory hover:bg-obsidian hover:text-white',
                )}
              >
                {slide.secondary.label}
              </Link>
            )}
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-ivory/15 pt-7">
            {[
              { value: '07', label: 'Maisons we carry' },
              { value: '1 yr', label: 'Machine warranty' },
              { value: '100%', label: 'Original watches' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-playfair font-normal text-3xl text-ivory">{stat.value}</dt>
                <dd className="mt-1 font-montserrat text-[10px] tracking-[0.18em] text-ash uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-5 flex items-center gap-3 sm:left-8 lg:left-10">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="flex size-10 items-center justify-center border border-ivory/30 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="flex size-10 items-center justify-center border border-ivory/30 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
          aria-pressed={!playing}
          className="flex size-10 items-center justify-center border border-ivory/30 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          {playing ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
        </button>
        <div className="ml-2 flex items-center gap-2" role="tablist" aria-label="Slides">
          {SLIDES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${item.eyebrow}`}
              onClick={() => goTo(i)}
              className={classNames(
                'h-1 transition-all duration-500',
                i === index ? 'w-10 bg-gold' : 'w-5 bg-obsidian/30 hover:bg-obsidian/60',
              )}
            />
          ))}
        </div>
      </div>

      <p className="absolute bottom-8 right-5 hidden font-montserrat text-[10px] tracking-[0.3em] text-ash uppercase sm:block sm:right-8 lg:right-10">
        {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </p>
    </section>
  )
}
