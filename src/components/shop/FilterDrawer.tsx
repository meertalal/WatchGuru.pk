import { useEffect } from 'react'
import { X } from 'lucide-react'
import { classNames } from '../../lib/format'
import type { ShopFilters } from '../../lib/shop'
import type { PriceBounds } from '../../lib/catalog'
import type { Product } from '../../types'
import type { ArrayFilterKey } from '../../hooks/useShopFilters'
import { FilterPanel } from './FilterPanel'
import { Button } from '../ui/Button'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: ShopFilters
  products: Product[]
  bounds: PriceBounds
  resultCount: number
  onToggleArray: (key: ArrayFilterKey, value: string) => void
  onSetSingle: (key: string, value: string | null) => void
  onSetPriceRange: (min: number, max: number) => void
  onClearAll: () => void
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  products,
  bounds,
  resultCount,
  onToggleArray,
  onSetSingle,
  onSetPriceRange,
  onClearAll,
}: FilterDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div className={classNames('fixed inset-0 z-[95] lg:hidden', open ? '' : 'pointer-events-none')}>
      <div
        className={classNames(
          'absolute inset-0 bg-black/40 transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={classNames(
          'absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-obsidian transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-xl">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="text-ash transition-colors hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          <FilterPanel
            filters={filters}
            products={products}
            bounds={bounds}
            onToggleArray={onToggleArray}
            onSetSingle={onSetSingle}
            onSetPriceRange={onSetPriceRange}
            onClearAll={onClearAll}
          />
        </div>
        <div className="border-t border-line px-6 py-4">
          <Button className="w-full" onClick={onClose}>
            Show {resultCount} results
          </Button>
        </div>
      </div>
    </div>
  )
}
