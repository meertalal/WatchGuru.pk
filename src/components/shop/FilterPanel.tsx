import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  BRANDS,
  COLLECTIONS,
  DIAL_COLORS,
  FEATURES,
  STRAP_TYPES,
} from '../../data/products'
import { classNames, formatPrice } from '../../lib/format'
import type { ShopFilters } from '../../lib/shop'
import type { PriceBounds } from '../../lib/catalog'
import type { Product } from '../../types'
import type { ArrayFilterKey } from '../../hooks/useShopFilters'

interface FilterPanelProps {
  filters: ShopFilters
  /** Live catalogue — counts and price bounds derive from it. */
  products: Product[]
  bounds: PriceBounds
  onToggleArray: (key: ArrayFilterKey, value: string) => void
  onSetSingle: (key: string, value: string | null) => void
  onSetPriceRange: (min: number, max: number) => void
  onClearAll: () => void
  onNavigate?: () => void
}

const CATEGORIES = [
  { value: null, label: 'All watches' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
]

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-line py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between"
      >
        <span className="eyebrow text-white">{title}</span>
        <ChevronDown
          className={classNames('size-4 text-ash transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="flex items-center gap-3">
        <span
          className={classNames(
            'flex size-4 items-center justify-center border transition-colors',
            checked ? 'border-gold bg-gold' : 'border-line group-hover:border-gold',
          )}
        >
          {checked && (
            <svg viewBox="0 0 12 12" className="size-2.5 text-obsidian" aria-hidden="true">
              <path
                d="M2 6.5 4.5 9 10 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span
          className={classNames(
            'text-sm transition-colors',
            checked ? 'text-white' : 'text-ash group-hover:text-white',
          )}
        >
          {label}
        </span>
      </span>
      {typeof count === 'number' && <span className="text-xs text-ash">{count}</span>}
    </label>
  )
}

function PriceFilter({
  min,
  max,
  bounds,
  onCommit,
}: {
  min: number
  max: number
  bounds: PriceBounds
  onCommit: (min: number, max: number) => void
}) {
  const [local, setLocal] = useState({ min, max })
  const [prev, setPrev] = useState({ min, max })
  if (prev.min !== min || prev.max !== max) {
    setPrev({ min, max })
    setLocal({ min, max })
  }

  const step = 50
  const commit = () => {
    if (local.min !== min || local.max !== max) onCommit(local.min, local.max)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-white">
        <span className="font-inter font-medium">{formatPrice(local.min)}</span>
        <span className="text-ash">—</span>
        <span className="font-inter font-medium">{formatPrice(local.max)}</span>
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 text-[11px] tracking-wide text-ash uppercase">
          <span className="w-8">Min</span>
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={local.min}
            onChange={(e) =>
              setLocal((s) => ({ ...s, min: Math.min(Number(e.target.value), s.max - step) }))
            }
            onPointerUp={commit}
            onKeyUp={commit}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-gold"
          />
        </label>
        <label className="flex items-center gap-3 text-[11px] tracking-wide text-ash uppercase">
          <span className="w-8">Max</span>
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={local.max}
            onChange={(e) =>
              setLocal((s) => ({ ...s, max: Math.max(Number(e.target.value), s.min + step) }))
            }
            onPointerUp={commit}
            onKeyUp={commit}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-gold"
          />
        </label>
      </div>
    </div>
  )
}

export function FilterPanel({
  filters,
  products,
  bounds,
  onToggleArray,
  onSetSingle,
  onSetPriceRange,
  onClearAll,
  onNavigate,
}: FilterPanelProps) {
  const countFor = (predicate: (p: Product) => boolean): number =>
    products.filter(predicate).length

  return (
    <div>
      {/* Category */}
      <FilterSection title="Category">
        <ul className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat.value
            return (
              <li key={cat.label}>
                <button
                  type="button"
                  onClick={() => {
                    onSetSingle('category', cat.value)
                    onNavigate?.()
                  }}
                  className={classNames(
                    'w-full text-left text-sm transition-colors',
                    active ? 'text-gold' : 'text-ash hover:text-white',
                  )}
                >
                  {cat.label}
                </button>
              </li>
            )
          })}
        </ul>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <PriceFilter min={filters.min} max={filters.max} bounds={bounds} onCommit={onSetPriceRange} />
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands">
        {BRANDS.map((brand) => (
          <CheckboxRow
            key={brand.name}
            label={brand.name}
            count={countFor((p) => p.brand === brand.name)}
            checked={filters.brands.includes(brand.name)}
            onChange={() => onToggleArray('brand', brand.name)}
          />
        ))}
      </FilterSection>

      {/* Dial colour */}
      <FilterSection title="Dial colour">
        {DIAL_COLORS.map((color) => (
          <CheckboxRow
            key={color}
            label={color}
            count={countFor((p) => p.dialColor === color)}
            checked={filters.dials.includes(color)}
            onChange={() => onToggleArray('dial', color)}
          />
        ))}
      </FilterSection>

      {/* Strap */}
      <FilterSection title="Strap type">
        {STRAP_TYPES.map((strap) => (
          <CheckboxRow
            key={strap}
            label={strap}
            count={countFor((p) => p.strapType === strap)}
            checked={filters.straps.includes(strap)}
            onChange={() => onToggleArray('strap', strap)}
          />
        ))}
      </FilterSection>

      {/* Collections */}
      <FilterSection title="Collections" defaultOpen={false}>
        {COLLECTIONS.map((collection) => (
          <CheckboxRow
            key={collection}
            label={collection}
            checked={filters.collections.includes(collection)}
            onChange={() => onToggleArray('collection', collection)}
          />
        ))}
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features" defaultOpen={false}>
        {FEATURES.map((feature) => (
          <CheckboxRow
            key={feature}
            label={feature}
            checked={filters.features.includes(feature)}
            onChange={() => onToggleArray('feature', feature)}
          />
        ))}
      </FilterSection>

      <div className="pt-5">
        <button
          type="button"
          onClick={onClearAll}
          className="font-montserrat text-[11px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold"
        >
          Clear all filters
        </button>
      </div>
    </div>
  )
}
