import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ProductImage } from '../ui/ProductImage'

interface FeaturedCollectionCardProps {
  to: string
  title: string
  eyebrow?: string
  count?: number
  image: string
  eager?: boolean
}

/**
 * A collection tile for the Collections grid — full-bleed artwork with a
 * graduated scrim, the collection title and a View Collection action.
 */
export function FeaturedCollectionCard({
  to,
  title,
  eyebrow,
  count,
  image,
  eager = false,
}: FeaturedCollectionCardProps) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden border border-line/60 bg-charcoal"
      aria-label={`View the ${title} collection`}
    >
      <ProductImage
        src={image}
        alt={title}
        label={title}
        eager={eager}
        className="aspect-[3/4] w-full"
        imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/35 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:p-6">
        {eyebrow && (
          <span className="font-akkurat text-[8px] font-medium tracking-[0.26em] text-gold uppercase">
            {eyebrow}
          </span>
        )}
        <h3 className="font-cormorant text-[1.6rem] leading-tight text-ivory sm:text-[1.8rem]">
          {title}
        </h3>
        {typeof count === 'number' && (
          <span className="text-[10.5px] font-light tracking-wide text-ash">
            {count} {count === 1 ? 'piece' : 'pieces'}
          </span>
        )}
        <span className="mt-2 inline-flex items-center gap-2 font-akkurat text-[9px] font-medium tracking-[0.22em] text-ivory uppercase transition-colors duration-300 group-hover:text-gold">
          View Collection
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
