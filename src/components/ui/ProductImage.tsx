import { useState } from 'react'
import { classNames } from '../../lib/format'

interface ProductImageProps {
  src: string
  alt: string
  /** Used to label the elegant fallback if the photo fails to load. */
  label?: string
  className?: string
  imgClassName?: string
  eager?: boolean
}

/**
 * A resilient product image, always rendered visible (no hover reveal and no
 * load-gated fade). If a remote photo fails to load, an on-brand placeholder
 * is shown instead of a broken image icon.
 */
export function ProductImage({
  src,
  alt,
  label,
  className,
  imgClassName,
  eager = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)
  // Reset the error state when the source changes (adjusting state during
  // render, per React's guidance, rather than in an effect).
  const [prevSrc, setPrevSrc] = useState(src)
  if (prevSrc !== src) {
    setPrevSrc(src)
    setHasError(false)
  }

  return (
    <div className={classNames('relative overflow-hidden bg-stone-100', className)}>
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setHasError(true)}
          className={classNames('size-full object-cover', imgClassName)}
        />
      )}

      {hasError && (
        <div className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 text-stone-500">
          <svg viewBox="0 0 48 48" className="size-12" aria-hidden="true">
            <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="2" fill="currentColor" />
            <path
              d="M24 14v10l7 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {label && <span className="eyebrow text-stone-500">{label}</span>}
        </div>
      )}
    </div>
  )
}
