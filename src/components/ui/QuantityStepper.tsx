import { Minus, Plus } from 'lucide-react'
import { classNames } from '../../lib/format'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
  label?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
  label = 'Quantity',
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))
  const buttonSize = size === 'sm' ? 'size-8' : 'size-10'
  const valueSize = size === 'sm' ? 'w-8 text-[12px]' : 'w-10 text-[13px]'

  return (
    <div
      className={classNames(
        'inline-flex items-center border border-line bg-charcoal',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={classNames(
          buttonSize,
          'flex items-center justify-center text-ash transition-colors hover:bg-lift hover:text-gold disabled:opacity-40',
        )}
      >
        <Minus className="size-3.5" strokeWidth={1.4} />
      </button>
      <span className={classNames(valueSize, 'text-center font-inter tabular-nums text-ivory')}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={classNames(
          buttonSize,
          'flex items-center justify-center text-ash transition-colors hover:bg-lift hover:text-gold disabled:opacity-40',
        )}
      >
        <Plus className="size-3.5" strokeWidth={1.4} />
      </button>
    </div>
  )
}
