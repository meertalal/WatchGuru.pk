import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Product } from '../../types'
import { classNames } from '../../lib/format'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { CollectionProductCard } from './CollectionProductCard'

interface CollectionSectionProps {
  id: string
  title: string
  eyebrow?: string
  description?: string
  products: Product[]
  /** The Atelier section gets a lifted surface to set it apart. */
  accent?: boolean
}

/**
 * A centred collection heading followed by a four-across, snap-scrolling
 * product carousel. Arrows move one card at a time; a hairline progress
 * indicator shows how far through the section the shopper has travelled.
 */
export function CollectionSection({
  id,
  title,
  eyebrow,
  description,
  products,
  accent = false,
}: CollectionSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState({ progress: 0, atStart: true, atEnd: false, thumb: 100 })

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    const progress = max > 0 ? track.scrollLeft / max : 0
    const thumb = Math.max(12, Math.min(100, (track.clientWidth / track.scrollWidth) * 100))
    setPosition({
      progress,
      atStart: track.scrollLeft <= 2,
      atEnd: max <= 2 || track.scrollLeft >= max - 2,
      thumb,
    })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    sync()
    track.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      track.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync, products.length])

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    const amount = card ? card.offsetWidth + 20 : track.clientWidth * 0.8
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={classNames('py-14 sm:py-18 lg:py-20', accent ? 'border-y border-line/70 bg-coal' : '')}
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            titleClassName="text-[2.1rem] sm:text-[2.7rem] lg:text-[3.1rem]"
          />
        </Reveal>

        <Reveal delay={80}>
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={title}
            className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 sm:mt-12 sm:gap-5 lg:gap-6"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <CollectionProductCard product={product} eager={index < 4} />
              </div>
            ))}
          </div>
        </Reveal>

        {products.length > 0 && (
          <div className="mt-7 flex items-center justify-between gap-6">
            <div
              className="h-px flex-1 bg-line/70"
              role="presentation"
              aria-hidden="true"
            >
              <span
                className="block h-px bg-gold transition-[margin,width] duration-300"
                style={{
                  width: `${position.thumb}%`,
                  marginLeft: `${position.progress * (100 - position.thumb)}%`,
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={position.atStart}
                aria-label={`Previous ${title} pieces`}
                className="flex size-10 items-center justify-center border border-line text-ivory transition-colors duration-300 hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={position.atEnd}
                aria-label={`Next ${title} pieces`}
                className="flex size-10 items-center justify-center border border-line text-ivory transition-colors duration-300 hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
