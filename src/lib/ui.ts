import { classNames } from './format'

export type ButtonVariant = 'primary' | 'gold' | 'outline' | 'subtle' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-sm font-montserrat font-medium uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  /* Solid obsidian-gold CTA — the reference button */
  primary: 'bg-gold-bright text-obsidian hover:bg-gold',
  /* Luxury gold accent */
  gold: 'bg-gold text-obsidian hover:bg-gold-bright',
  /* Outlined gold on dark */
  outline: 'border border-gold/50 text-gold hover:border-gold hover:bg-gold hover:text-obsidian',
  /* Raised panel button */
  subtle: 'bg-charcoal text-ivory border border-line hover:border-gold hover:text-gold',
  /* Text-only */
  ghost: 'text-ash hover:text-gold',
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
