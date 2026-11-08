import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { classNames } from '../../lib/format'
import { ProductImage } from '../ui/ProductImage'

interface ProductGalleryProps {
  images: string[]
  alt: string
  label?: string
  activeImage?: string
}

/**
 * Product gallery — a large primary frame with arrow and keyboard navigation,
 * a vertical thumbnail rail on desktop and a horizontal scrollable rail on
 * mobile. Thumbnails only render when the product has more than one image.
 */
export function ProductGallery({ images, alt, label, activeImage }: ProductGalleryProps) {
  // If an active image was passed that is not in images, combine them
  const galleryImages = activeImage && !images.includes(activeImage)
    ? [activeImage, ...images]
    : images

  const [active, setActive] = useState(() => {
    if (activeImage) {
      const idx = galleryImages.indexOf(activeImage)
      if (idx >= 0) return idx
    }
    return 0
  })

  // Sync active index when activeImage prop changes
  const [prevActiveImage, setPrevActiveImage] = useState(activeImage)
  if (prevActiveImage !== activeImage) {
    setPrevActiveImage(activeImage)
    if (activeImage) {
      const idx = galleryImages.indexOf(activeImage)
      if (idx >= 0) {
        setActive(idx)
      } else {
        setActive(0)
      }
    }
  }

  const total = galleryImages.length
  const primary = galleryImages[active] ?? galleryImages[0]

  const goTo = (index: number) => {
    if (total === 0) return
    setActive(((index % total) + total) % total)
  }

  const multiple = total > 1

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start">
      <div
        className="relative lg:order-2 lg:flex-1"
        role={multiple ? 'group' : undefined}
        aria-label={multiple ? `${alt} gallery` : undefined}
        tabIndex={multiple ? 0 : undefined}
        onKeyDown={
          multiple
            ? (event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  goTo(active + 1)
                }
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  goTo(active - 1)
                }
              }
            : undefined
        }
      >
        <ProductImage
          src={primary}
          alt={multiple ? `${alt}, view ${active + 1} of ${total}` : alt}
          label={label}
          eager
          className="aspect-square w-full"
          imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
        />

        {multiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center border border-line/70 bg-obsidian/75 text-ivory backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center border border-line/70 bg-obsidian/75 text-ivory backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <span className="pointer-events-none absolute right-3 bottom-3 bg-obsidian/75 px-2.5 py-1 font-akkurat text-[8.5px] tracking-[0.18em] text-ivory tabular-nums backdrop-blur">
              {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </>
        )}
      </div>

      {multiple && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto lg:order-1 lg:max-h-[560px] lg:w-[84px] lg:flex-col lg:overflow-y-auto">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active}
              className={classNames(
                'w-[72px] shrink-0 border transition-colors lg:w-full',
                index === active ? 'border-gold' : 'border-transparent hover:border-gold/60',
              )}
            >
              <ProductImage
                src={image}
                alt=""
                className="aspect-square w-full"
                imgClassName="transition-opacity duration-300"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
