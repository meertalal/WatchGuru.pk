import { useState } from 'react'
import { classNames } from '../../lib/format'
import { ProductImage } from '../ui/ProductImage'

interface ProductGalleryProps {
  images: string[]
  alt: string
  label?: string
}

export function ProductGallery({ images, alt, label }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const primary = images[active] ?? images[0]

  return (
    <div className="flex flex-col gap-4">
      <ProductImage
        src={primary}
        alt={alt}
        label={label}
        eager
        className="aspect-square w-full"
        imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
      />

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active}
              className={classNames(
                'border transition-colors',
                index === active ? 'border-charcoal' : 'border-transparent hover:border-stone-300',
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
