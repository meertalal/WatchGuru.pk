import { useMemo, useState } from 'react'
import { Filter, SlidersHorizontal, X } from 'lucide-react'
import { products } from '../data/products'
import { formatPrice } from '../lib/format'
import {
  PAGE_SIZE,
  SORT_OPTIONS,
  countActiveFilters,
  filterProducts,
  sortProducts,
  type SortValue,
} from '../lib/shop'
import { useShopFilters, type ArrayFilterKey } from '../hooks/useShopFilters'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { ProductGrid } from '../components/product/ProductGrid'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { FilterPanel } from '../components/shop/FilterPanel'
import { FilterDrawer } from '../components/shop/FilterDrawer'

interface Chip {
  key: string
  label: string
  clear: () => void
}

export function Shop() {
  const {
    filters,
    toggleArray,
    setSingle,
    setPriceRange,
    setSort,
    setPage,
    clearAll,
    defaults,
  } = useShopFilters()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const result = useMemo(() => sortProducts(filterProducts(products, filters), filters.sort), [filters])

  const totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE))
  const currentPage = Math.min(filters.page, totalPages)
  const pageItems = result.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const heading = filters.tag === 'new'
      ? 'New Arrivals'
      : filters.tag === 'sale'
        ? 'On Sale'
        : filters.category === 'men'
          ? 'Men’s Watches'
          : filters.category === 'women'
            ? 'Women’s Watches'
            : filters.category === 'unisex'
              ? 'Unisex Watches'
              : 'All Watches'

  const chips: Chip[] = useMemo(() => {
    const list: Chip[] = []
    if (filters.category)
      list.push({
        key: 'category',
        label: filters.category,
        clear: () => setSingle('category', null),
      })
    if (filters.tag)
      list.push({ key: 'tag', label: filters.tag, clear: () => setSingle('tag', null) })
    if (filters.min !== defaults.min || filters.max !== defaults.max)
      list.push({
        key: 'price',
        label: `${formatPrice(filters.min)} – ${formatPrice(filters.max)}`,
        clear: () => setPriceRange(defaults.min, defaults.max),
      })
    const groups: { key: ArrayFilterKey; values: string[]; param: string }[] = [
      { key: 'brand', values: filters.brands, param: 'brand' },
      { key: 'collection', values: filters.collections, param: 'collection' },
      { key: 'dial', values: filters.dials, param: 'dial' },
      { key: 'strap', values: filters.straps, param: 'strap' },
      { key: 'feature', values: filters.features, param: 'feature' },
    ]
    groups.forEach((group) => {
      group.values.forEach((value) =>
        list.push({
          key: `${group.param}-${value}`,
          label: value,
          clear: () => toggleArray(group.key, value),
        }),
      )
    })
    return list
  }, [filters, defaults, setSingle, setPriceRange, toggleArray])

  const activeCount = countActiveFilters(filters)

  return (
    <>
      <PageBanner
        eyebrow="The Boutique"
        title={heading}
        description="Every watch in the WatchGuru.pk boutique is authenticated, serviced and prepared by hand before it is dispatched to you."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shop' }]}
      />

      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[264px_1fr] lg:gap-12">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterPanel
                filters={filters}
                onToggleArray={toggleArray}
                onSetSingle={setSingle}
                onSetPriceRange={setPriceRange}
                onClearAll={clearAll}
              />
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-500">
                <span className="text-charcoal">{result.length}</span>{' '}
                {result.length === 1 ? 'watch' : 'watches'}
                {activeCount > 0 && <span className="text-stone-400"> · {activeCount} filters</span>}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 border border-stone-300 px-4 py-2.5 font-montserrat text-[11px] font-medium tracking-[0.18em] uppercase transition-colors hover:border-charcoal lg:hidden"
                >
                  <SlidersHorizontal className="size-4" />
                  Filters{activeCount > 0 ? ` (${activeCount})` : ''}
                </button>

                <label className="flex items-center gap-2 font-montserrat text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                  <Filter className="size-3.5" />
                  <span className="sr-only sm:not-sr-only">Sort</span>
                  <select
                    value={filters.sort}
                    onChange={(e) => setSort(e.target.value as SortValue)}
                    className="border border-stone-300 bg-white px-3 py-2.5 text-[11px] tracking-[0.12em] text-charcoal uppercase outline-none transition-colors hover:border-charcoal focus:border-charcoal"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 py-5">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="group flex items-center gap-2 border border-stone-300 bg-white px-3 py-1.5 text-[11px] tracking-wide text-stone-600 transition-colors hover:border-charcoal hover:text-charcoal"
                  >
                    <span className="capitalize">{chip.label}</span>
                    <X className="size-3 text-stone-400 transition-colors group-hover:text-charcoal" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-2 font-montserrat text-[11px] tracking-[0.16em] text-gold uppercase transition-opacity hover:opacity-70"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="pt-8">
              {pageItems.length > 0 ? (
                <ProductGrid products={pageItems} columns={3} />
              ) : (
                <EmptyState
                  title="No watches match your filters"
                  description="Try widening your price range or removing a filter or two to see more pieces."
                  action={
                    <Button variant="outline" onClick={clearAll}>
                      Clear all filters
                    </Button>
                  }
                />
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={setPage}
                className="mt-16"
              />
            )}
          </div>
        </div>
      </Container>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        resultCount={result.length}
        onToggleArray={toggleArray}
        onSetSingle={setSingle}
        onSetPriceRange={setPriceRange}
        onClearAll={clearAll}
      />
    </>
  )
}
