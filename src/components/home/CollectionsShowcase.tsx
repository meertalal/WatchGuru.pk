import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCatalog } from '../../store'
import { ProductImage } from '../ui/ProductImage'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { classNames } from '../../lib/format'

const TILES = [
  {
    collection: 'Diver',
    title: 'Dive Watches',
    copy: 'Built for water, worn everywhere.',
    image:
      'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?auto=format&fit=crop&w=1000&q=80',
  },
  {
    collection: 'Dress',
    title: 'Dress Watches',
    copy: 'Quiet elegance for the evening.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
  },
  {
    collection: 'Chronograph',
    title: 'Chronographs',
    copy: 'Complications with clarity.',
    image:
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1000&q=80',
  },
]

/**
 * Shop by category — a horizontal, snap-scrolling carousel of the existing
 * collections. The active card receives a restrained rectangular highlight;
 * arrows and pagination scroll between cards, and every card links to the
 * existing filtered collection page.
 */
export function CollectionsShowcase() {
  const { products } = useCatalog()
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const frameRef = useRef<number | null>(null)
  const [active, setActive] = useState(0)

  /** Keep the highlighted card in step with the nearest card to the left edge. */
  const syncActive = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const trackLeft = track.getBoundingClientRect().left
    let next = 0
    let closest = Number.POSITIVE_INFINITY
    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft)
      if (distance < closest) {
        closest = distance
        next = index
      }
    })
    setActive(next)
  }, [])

  const handleScroll = useCallback(() => {
    if (frameRef.current !== null) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      syncActive()
    })
  }, [syncActive])

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  const goToCategory = (next: number) => {
    const index = (next + TILES.length) % TILES.length
    setActive(index)
    const track = trackRef.current
    const card = cardRefs.current[index]
    if (!track || !card) return
    const left =
      card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft
    track.scrollTo({ left, behavior: 'smooth' })
  }

  return (
    <section className="bg-coal py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Browse by style"
            title="Collections"
            description="Whatever the occasion, there is a WatchGuru.pk for it, from the depths of the ocean to the boardroom."
          />
        </Reveal>

        <Reveal delay={80}>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            role="region"
            aria-roledescription="carousel"
            aria-label="Shop by category"
            className="no-scrollbar relative mt-11 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 sm:mt-14 sm:gap-5 lg:gap-6"
          >
            {TILES.map((tile, index) => {
              const count = products.filter((product) =>
                product.collections.includes(tile.collection as never),
              ).length
              const isActive = active === index

              return (
                <Link
                  key={tile.collection}
                  ref={(node) => {
                    cardRefs.current[index] = node
                  }}
                  to={`/collections/all?collection=${encodeURIComponent(tile.collection)}`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-current={isActive ? 'true' : undefined}
                  className={classNames(
                    'group flex w-[82%] shrink-0 snap-start flex-col border p-3 transition-all duration-500 sm:w-[calc((100%-1.25rem)/2)] sm:p-4 lg:w-[calc((100%-3rem)/3)]',
                    isActive
                      ? 'border-gold/40 bg-charcoal'
                      : 'border-transparent bg-transparent hover:border-line hover:bg-charcoal/40',
                  )}
                >
                  <div className="relative overflow-hidden bg-surface">
                    <ProductImage
                      src={tile.image}
                      alt={tile.title}
                      label={tile.title}
                      className="aspect-[4/5] w-full"
                      imgClassName={classNames(
                        'object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                        isActive ? 'scale-[1.5]' : 'scale-[1.42] group-hover:scale-[1.5]',
                      )}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_58%,var(--color-obsidian)_100%)]"
                    />
                    <span
                      aria-hidden="true"
                      className={classNames(
                        'absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-500',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </div>

                  <div className="flex flex-1 flex-col items-center px-1 pb-1 pt-5 text-center">
                    <p className="font-akkurat text-[8px] font-medium tracking-[0.26em] text-gold uppercase">
                      {count} pieces
                    </p>
                    <h3
                      className={classNames(
                        'mt-2 font-cormorant text-[1.6rem] leading-none transition-colors duration-300 sm:text-[1.75rem]',
                        isActive ? 'text-gold' : 'text-ivory group-hover:text-gold',
                      )}
                    >
                      {tile.title}
                    </h3>
                    <p className="mt-2 max-w-[24ch] text-[11.5px] font-light leading-relaxed text-ash">
                      {tile.copy}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-8 flex items-center justify-center gap-5 sm:mt-10">
          <button
            type="button"
            onClick={() => goToCategory(active - 1)}
            aria-label="Previous category"
            className="flex size-11 items-center justify-center border border-line text-ivory transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Categories">
            {TILES.map((tile, index) => (
              <button
                key={tile.collection}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-label={`Show ${tile.title}`}
                onClick={() => goToCategory(index)}
                className="group flex h-8 items-center px-1"
              >
                <span
                  className={classNames(
                    'block h-px transition-all duration-500',
                    active === index ? 'w-10 bg-gold' : 'w-5 bg-ivory/25 group-hover:bg-ivory/50',
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToCategory(active + 1)}
            aria-label="Next category"
            className="flex size-11 items-center justify-center border border-line text-ivory transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </section>
  )
}
