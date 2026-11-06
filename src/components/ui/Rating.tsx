import { Star } from 'lucide-react'
import { classNames, formatNumber } from '../../lib/format'

interface RatingProps {
  value: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export function Rating({ value, reviewCount, size = 'sm', className }: RatingProps) {
  const starSize = size === 'md' ? 'size-4' : 'size-3.5'
  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = value >= star - 0.25
          return (
            <Star
              key={star}
              className={classNames(
                starSize,
                filled ? 'fill-gold text-gold' : 'fill-transparent text-ash',
              )}
              strokeWidth={1.5}
            />
          )
        })}
      </div>
      <span className="text-[11px] tracking-wide text-ash">
        {value.toFixed(1)}
        {typeof reviewCount === 'number' && (
          <span className="text-ash"> ({formatNumber(reviewCount)})</span>
        )}
      </span>
    </div>
  )
}
