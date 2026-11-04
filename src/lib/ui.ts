import { classNames } from './format'

export type ButtonVariant = 'primary' | 'gold' | 'outline' | 'subtle' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-sm font-montserrat font-medium uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-charcoal text-ivory hover:bg-ink',
  gold: 'bg-gold text-white hover:bg-gold-dark',
  outline: 'border border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory',
  subtle: 'bg-stone-200 text-charcoal hover:bg-stone-300',
  ghost: 'text-charcoal hover:text-gold',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-[11px]',
  lg: 'px-9 py-4 text-xs',
}

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return classNames(BASE, VARIANTS[variant], SIZES[size], className)
}
