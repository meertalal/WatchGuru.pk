import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, Search, X } from 'lucide-react'
import type { Product } from '../../types'
import { BRANDS, brandCollection, getCollectionBySlug } from '../../data/collections'
import { useCatalog, useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatPrice, classNames } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { ProductFormModal } from '../../components/admin/ProductFormModal'
import { ProductImage } from '../../components/ui/ProductImage'
import { Button } from '../../components/ui/Button'

/**
 * One collection module. Membership is edited through the product's existing
 * tag or category, so the storefront and admin always agree.
 */
export function AdminCollection() {
  const { slug, brandSlug } = useParams<{ slug: string; brandSlug: string }>()
  const { products, saveProduct } = useCatalog()
  const { notify } = useToast()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const [editor, setEditor] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })

  const brand = brandSlug ? BRANDS.find((entry) => entry.slug === brandSlug) : undefined
  const def = brand ? brandCollection(brand) : getCollectionBySlug(slug)

  const tag =
    def?.slug === 'executive' ? 'Executive' : def?.slug === 'fashion' ? 'Fashion' : null
  const category = def?.slug === 'men' ? 'men' : def?.slug === 'women' ? 'women' : null
  const editable = tag !== null || category !== null

  useDocumentMeta({
    title: `Admin | ${def?.title ?? 'Collection'}`,
    description: `WatchGuru.pk admin collection module for ${def?.title ?? 'collections'}.`,
  })

  const members = useMemo(
    () => (def ? products.filter(def.match) : []),
    [products, def],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return members
    return members.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        product.brand.toLowerCase().includes(needle) ||
        product.slug.toLowerCase().includes(needle),
    )
  }, [members, query])

  const candidates = useMemo(
    () =>
      def
        ? products
            .filter((product) => !def.match(product))
            .slice(0, 24)
        : [],
    [products, def],
  )

  if (!def) {
    return (
      <div className="mx-auto max-w-3xl p-5 sm:p-8">
        <p className="text-sm text-ash">That collection does not exist.</p>
        <Link to="/admin/collections" className="mt-4 inline-block text-[11px] text-gold uppercase">
          Back to collections
        </Link>
      </div>
    )
  }

  const apply = async (product: Product, add: boolean) => {
    setPending(product.id)
    try {
      const updated: Product = tag
        ? {
            ...product,
            collections: add
              ? Array.from(
                  new Set([...product.collections, tag as Product['collections'][number]]),
                )
              : product.collections.filter(
                  (entry) => entry !== (tag as Product['collections'][number]),
                ),
          }
        : {
            ...product,
            category: add
              ? (category as Product['category'])
              : product.category === category
                ? 'unisex'
                : product.category,
          }

      await saveProduct(updated)
      notify(
        add
          ? `${product.name} added to ${def.title}.`
          : `${product.name} removed from ${def.title}.`,
        'info',
      )
    } catch (error) {
      notify(errorMessage(error, 'The collection could not be updated.'), 'error')
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/admin/collections"
            className="inline-flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.18em] text-ash uppercase transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All collections
          </Link>
          <p className="mt-3 eyebrow text-gold">{def.eyebrow}</p>
          <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">{def.title}</h1>
          <p className="mt-1 max-w-2xl text-[12.5px] font-light leading-relaxed text-ash">
            {def.description}
          </p>
          <p className="mt-2 text-[11px] text-muted">Rule: {def.rule}</p>
        </div>
        {editable && (
          <Button onClick={() => setAdding((open) => !open)}>
            <Plus className="size-4" aria-hidden="true" />
            {adding ? 'Close picker' : 'Add products'}
          </Button>
        )}
      </header>

      {!editable && (
        <p className="mt-5 border border-line bg-charcoal px-4 py-3 text-[11.5px] leading-relaxed text-ash">
          Membership follows the rule above. Edit a product’s brand, price or tags in the product
          editor to change where it appears.
        </p>
      )}

      {adding && editable && (
        <section className="mt-5 bg-charcoal p-4" aria-label="Add products to collection">
          <h2 className="eyebrow text-ash">Add to {def.title}</h2>
          {candidates.length === 0 ? (
            <p className="mt-2 text-[12px] text-ash">Every product is already in this collection.</p>
          ) : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {candidates.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 border border-line/60 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] text-ivory">{product.name}</p>
                    <p className="text-[10px] text-muted">
                      {product.brand} · {formatPrice(product.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={pending === product.id}
                    onClick={() => void apply(product, true)}
                    className="shrink-0 border border-gold/50 px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-gold uppercase transition-colors hover:bg-gold/10 disabled:opacity-50"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex flex-1 items-center gap-2 border border-line bg-charcoal px-3 py-2.5 sm:max-w-md">
          <Search className="size-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this collection…"
            aria-label={`Search ${def.title}`}
            className="w-full bg-transparent font-inter text-[12.5px] font-light text-ivory outline-none placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="text-muted hover:text-gold"
            >
              <X className="size-4" strokeWidth={1.4} />
            </button>
          )}
        </label>
        <p className="text-[11px] text-ash">
          {members.length} {members.length === 1 ? 'piece' : 'pieces'} in this module
        </p>
      </div>

      <div className="mt-4 overflow-x-auto bg-charcoal">
        <table className="w-full min-w-[760px] text-left text-[12.5px]">
          <thead>
            <tr className="font-akkurat text-[8.5px] tracking-[0.2em] text-muted uppercase">
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">Brand</th>
              <th scope="col" className="px-4 py-3 text-right">Price</th>
              <th scope="col" className="px-4 py-3 text-center">Stock</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      label={product.brand}
                      className="size-12 shrink-0"
                    />
                    <div className="min-w-0 max-w-[260px]">
                      <p className="truncate font-cormorant text-base text-ivory">{product.name}</p>
                      <p className="truncate text-[9.5px] text-muted">/products/{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ash">{product.brand}</td>
                <td className="px-4 py-3 text-right text-ivory">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={classNames(
                      'font-inter tabular-nums',
                      product.stock === 0
                        ? 'text-error'
                        : product.stock < 5
                          ? 'text-gold'
                          : 'text-ivory',
                    )}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditor({ open: true, product })}
                      aria-label={`Edit ${product.name}`}
                      className="p-2 text-muted transition-colors hover:text-gold"
                    >
                      <Pencil className="size-4" strokeWidth={1.4} />
                    </button>
                    {editable && (
                      <button
                        type="button"
                        disabled={pending === product.id}
                        onClick={() => void apply(product, false)}
                        aria-label={`Remove ${product.name} from ${def.title}`}
                        className="p-2 text-ash transition-colors hover:text-error disabled:opacity-50"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ash">
                  {query ? `Nothing matches “${query}”.` : 'No products in this collection yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editor.open && (
        <ProductFormModal editing={editor.product} onClose={() => setEditor({ open: false, product: null })} />
      )}
    </div>
  )
}
