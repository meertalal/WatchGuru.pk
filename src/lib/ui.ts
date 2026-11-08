import { classNames } from './format'

export type ButtonVariant = 'primary' | 'gold' | 'outline' | 'subtle' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-none font-akkurat font-medium uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  /* Signature ivory CTA: high contrast on dark */
  primary: 'bg-button text-button-text border border-button hover:bg-gold-bright hover:border-gold-bright',
  /* Restrained gold accent, used sparingly */
  gold: 'bg-gold text-obsidian border border-gold hover:bg-gold-bright hover:border-gold-bright',
  /* Hairline outline on dark */
  outline: 'border border-line text-ivory hover:border-gold hover:text-gold',
  /* Raised panel button */
  subtle: 'bg-charcoal text-ivory border border-line hover:border-gold hover:text-gold',
  /* Text-only */
  ghost: 'text-ash hover:text-ivory',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-[10px]',
  lg: 'px-9 py-4 text-[11px]',
}

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return classNames(BASE, VARIANTS[variant], SIZES[size], className)
}
