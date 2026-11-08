import type { ProductVariant } from '../../types'
import { classNames, formatPrice } from '../../lib/format'

interface WatchVariantSelectorProps {
  variants: ProductVariant[]
  value: string
  onChange: (variantId: string) => void
}

/**
 * Horizontal finish selector shown beneath the product showcase. Each option
 * carries its name, price and a swatch of the actual finish; the selected
 * option is outlined in gold.
 */
export function WatchVariantSelector({ variants, value, onChange }: WatchVariantSelectorProps) {
  const selected = variants.find((variant) => variant.id === value) ?? variants[0]

  return (
    <section aria-labelledby="variant-heading" className="border-y border-line/70 py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="variant-heading"
          className="font-akkurat text-[9.5px] font-medium tracking-[0.22em] text-ivory uppercase"
        >
          Finish
        </h2>
        <p className="text-[11.5px] font-light tracking-wide text-ash">
          Selected: <span className="text-gold">{selected?.name}</span>
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Choose a finish"
        className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {variants.map((variant) => {
          const isActive = variant.id === selected?.id
          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(variant.id)}
              className={classNames(
                'flex items-center gap-3 border px-4 py-3.5 text-left transition-colors duration-300',
                isActive
                  ? 'border-gold bg-charcoal'
                  : 'border-line bg-transparent hover:border-gold/60',
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'size-5 shrink-0 rounded-full border',
                  isActive ? 'border-gold' : 'border-line',
                )}
                style={{ backgroundColor: variant.swatch }}
              />
              <span className="min-w-0">
                <span className="block truncate font-inter text-[12px] font-light text-ivory">
                  {variant.name}
                </span>
                <span className="mt-0.5 block font-inter text-[11px] text-muted">
                  {formatPrice(variant.price)}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
