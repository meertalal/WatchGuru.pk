import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Layers } from 'lucide-react'
import { BRANDS, COLLECTION_DEFS } from '../../data/collections'
import { useCatalog } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

/**
 * Collections module hub. Each collection is a separate admin module with its
 * own screen; this page is just the index of those modules.
 */
export function AdminCollections() {
  const { products } = useCatalog()

  useDocumentMeta({
    title: 'Admin | Collections',
    description: 'WatchGuru.pk admin: every catalogue collection as its own module.',
  })

  const collections = useMemo(
    () =>
      COLLECTION_DEFS.map((def) => ({
        slug: def.slug,
        title: def.title,
        eyebrow: def.eyebrow,
        rule: def.rule ?? '',
        count: products.filter(def.match).length,
      })),
    [products],
  )

  const brands = useMemo(
    () =>
      BRANDS.map((brand) => ({
        slug: brand.slug,
        name: brand.name,
        own: Boolean(brand.own),
        count: products.filter((product) => product.brand === brand.name).length,
      })),
    [products],
  )

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header>
        <p className="eyebrow text-gold">Catalogue</p>
        <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Collections</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] font-light leading-relaxed text-ash">
          Each collection has its own module. Membership is a rule over the one catalogue, so a
          watch is never duplicated and prices and stock stay in sync everywhere.
        </p>
      </header>

      <section className="mt-6" aria-labelledby="edits-heading">
        <h2 id="edits-heading" className="eyebrow text-ash">
          Edits
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link
                to={`/admin/collections/${collection.slug}`}
                className="group flex h-full flex-col justify-between gap-4 border border-line bg-charcoal p-5 transition-colors hover:border-gold/60"
              >
                <div>
                  <p className="eyebrow text-[9px] text-gold">{collection.eyebrow}</p>
                  <h3 className="mt-1 font-cormorant text-xl text-ivory">{collection.title}</h3>
                  <p className="mt-1 text-[11px] text-muted">{collection.rule}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-ash">
                    {collection.count} {collection.count === 1 ? 'piece' : 'pieces'}
                  </span>
                  <ArrowRight
                    className="size-4 text-muted transition-colors group-hover:text-gold"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="brands-heading">
        <h2 id="brands-heading" className="flex items-center gap-2 eyebrow text-ash">
          <Layers className="size-4" strokeWidth={1.4} aria-hidden="true" />
          Brand collections
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <Link
                to={`/admin/collections/brand/${brand.slug}`}
                className="group flex items-center justify-between gap-3 border border-line bg-charcoal px-5 py-4 transition-colors hover:border-gold/60"
              >
                <div>
                  <p className="text-[13px] text-ivory">{brand.name}</p>
                  <p className="text-[10.5px] text-muted">
                    {brand.own ? 'Our own brand' : 'Partner maison'} · {brand.count}{' '}
                    {brand.count === 1 ? 'piece' : 'pieces'}
                  </p>
                </div>
                <ArrowRight
                  className="size-4 text-muted transition-colors group-hover:text-gold"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
