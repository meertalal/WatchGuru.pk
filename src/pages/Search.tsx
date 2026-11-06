import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X } from 'lucide-react'
import { useCatalog } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { PageBanner } from '../components/layout/PageBanner'
import { ProductGrid } from '../components/product/ProductGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { BRANDS } from '../data/collections'

const POPULAR = [
  { label: 'Automatic', query: 'automatic' },
  { label: 'Dress watches', query: 'dress' },
  { label: 'Divers', query: 'diver' },
  { label: 'Chronographs', query: 'chronograph' },
  { label: 'Moonphase', query: 'moonphase' },
]

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { search } = useCatalog()
  const query = searchParams.get('q') ?? ''
  const [draft, setDraft] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)

  // Sync the input when the URL changes (back/forward, suggestion chips) —
  // adjusting state during render, per React's guidance.
  if (prevQuery !== query) {
    setPrevQuery(query)
    setDraft(query)
  }

  useDocumentMeta({
    title: query ? `Search: ${query}` : 'Search Watches',
    description:
      'Search the WatchGuru.pk boutique by brand, model, movement or complication — every piece 100% original.',
  })

  // Debounce the draft into the URL so the query is shareable.
  useEffect(() => {
    const trimmed = draft.trim()
    if (trimmed === query) return
    const handle = window.setTimeout(() => {
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true })
    }, 250)
    return () => window.clearTimeout(handle)
  }, [draft, query, setSearchParams])

  const results = useMemo(() => (query ? search(query) : []), [query, search])

  return (
    <>
      <PageBanner
        eyebrow="The Boutique"
        title="Search the collection"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]}
      />

      <Container className="py-10 lg:py-14">
        {/* Search field */}
        <label className="flex items-center gap-4 border-b-2 border-gold pb-4 focus-within:border-gold">
          <SearchIcon className="size-6 shrink-0 text-ash" aria-hidden="true" />
          <input
            type="search"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search by brand, model, movement…"
            aria-label="Search watches"
            className="w-full bg-transparent font-cormorant text-2xl outline-none placeholder:text-ash sm:text-3xl"
          />
          {draft && (
            <button
              type="button"
              onClick={() => setDraft('')}
              aria-label="Clear search"
              className="text-ash transition-colors hover:text-white"
            >
              <X className="size-5" />
            </button>
          )}
        </label>

        {/* Suggestions when idle */}
        {!query && (
          <div className="mt-8">
            <p className="eyebrow mb-4 text-ash">Popular searches</p>
            <ul className="flex flex-wrap gap-2">
              {POPULAR.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setDraft(item.query)}
                    className="border border-line px-4 py-2 text-sm text-ash transition-colors hover:border-gold hover:text-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <button
                    type="button"
                    onClick={() => setDraft(brand.name)}
                    className="border border-line px-4 py-2 text-sm text-ash transition-colors hover:border-gold hover:text-white"
                  >
                    {brand.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="mt-10">
            <p className="text-sm text-ash" role="status">
              <span className="text-white">{results.length}</span>{' '}
              {results.length === 1 ? 'result' : 'results'} for{' '}
              <span className="text-white">“{query}”</span>
            </p>
            <div className="mt-8">
              {results.length > 0 ? (
                <ProductGrid products={results} columns={4} />
              ) : (
                <EmptyState
                  icon={<SearchIcon className="size-10" strokeWidth={1.2} />}
                  title="Nothing matched that search"
                  description="Check the spelling, or try a broader term — for example the maison, the movement (“automatic”), or the category (“dress”)."
                />
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
