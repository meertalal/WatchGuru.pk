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

  // Sync the input when the URL changes (back/forward, suggestion chips),
  // adjusting state during render, per React's guidance.
  if (prevQuery !== query) {
    setPrevQuery(query)
    setDraft(query)
  }

  useDocumentMeta({
    title: query ? `Search: ${query}` : 'Search Watches',
    description:
      'Search the WatchGuru.pk boutique by brand, model, movement or complication. Every piece is 100% original.',
    noindex: true,
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
        <label className="flex items-center gap-4 border-b border-gold/60 pb-4 transition-colors focus-within:border-gold">
          <SearchIcon className="size-6 shrink-0 text-gold" strokeWidth={1.2} aria-hidden="true" />
          <input
            type="search"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search by brand, model, movement…"
            aria-label="Search watches"
            className="w-full bg-transparent font-cormorant text-2xl text-ivory outline-none placeholder:text-muted sm:text-3xl"
          />
          {draft && (
            <button
              type="button"
              onClick={() => setDraft('')}
              aria-label="Clear search"
              className="text-muted transition-colors hover:text-gold"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          )}
        </label>

        {/* Suggestions when idle */}
        {!query && (
          <div className="mt-8">
            <p className="eyebrow mb-4 text-gold">Popular searches</p>
            <ul className="flex flex-wrap gap-2">
              {POPULAR.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setDraft(item.query)}
                    className="border border-line px-4 py-2 font-inter text-[11.5px] font-light text-ash transition-colors hover:border-gold/60 hover:text-gold"
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
                    className="border border-line px-4 py-2 font-inter text-[11.5px] font-light text-ash transition-colors hover:border-gold/60 hover:text-gold"
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
            <p className="text-[12px] font-light text-ash" role="status">
              <span className="text-ivory">{results.length}</span>{' '}
              {results.length === 1 ? 'result' : 'results'} for{' '}
              <span className="text-ivory">“{query}”</span>
            </p>
            <div className="mt-8">
              {results.length > 0 ? (
                <ProductGrid products={results} columns={4} />
              ) : (
                <EmptyState
                  icon={<SearchIcon className="size-10" strokeWidth={1} />}
                  title="Nothing matched that search"
                  description="Check the spelling, or try a broader term. For example the maison, the movement (“automatic”), or the category (“dress”)."
                />
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
