import { useMemo, useState } from 'react'
import { Check, Pencil, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react'
import type { Product } from '../../types'
import { useCatalog, useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatPrice, classNames } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { discountPercent } from '../../lib/catalog'
import { ProductFormModal } from '../../components/admin/ProductFormModal'
import { ProductImage } from '../../components/ui/ProductImage'
import { Button } from '../../components/ui/Button'
import { BRANDS } from '../../data/collections'

export function AdminProducts() {
  const { products, loading, removeProduct, saveProduct, resetCatalogue } = useCatalog()
  const { notify } = useToast()
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState<string>('all')
  const [editor, setEditor] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })

  useDocumentMeta({
    title: 'Admin | Products',
    description: 'WatchGuru.pk catalogue manager. Add, edit, restock and retire watches.',
  })

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return products.filter((p) => {
      if (brand !== 'all' && p.brand !== brand) return false
      if (!needle) return true
      return (
        p.name.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle) ||
        p.id.toLowerCase().includes(needle)
      )
    })
  }, [products, query, brand])

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Remove “${product.name}” from the boutique? This cannot be undone.`)) return

    try {
      await removeProduct(product.id)
      notify(`${product.name} removed from the catalogue.`, 'info')
    } catch (error) {
      notify(errorMessage(error, 'The product could not be removed.'), 'error')
    }
  }

  const toggleStock = async (product: Product) => {
    try {
      await saveProduct({ ...product, inStock: !product.inStock })
      notify(product.inStock ? `${product.name} marked sold out.` : `${product.name} is back in stock.`, 'info')
    } catch (error) {
      notify(errorMessage(error, 'The stock status could not be updated.'), 'error')
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Restore the original factory catalogue? Your edits will be lost.')) return

    try {
      await resetCatalogue()
      notify('Catalogue restored to factory settings.', 'info')
    } catch (error) {
      notify(errorMessage(error, 'The catalogue could not be restored.'), 'error')
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Catalogue</p>
          <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Products</h1>
          <p className="mt-1 text-[12px] font-light text-ash">
            {loading && products.length === 0
              ? 'Loading the catalogue…'
              : `${products.length} pieces. Changes appear in the boutique instantly.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 border border-line px-4 py-3 font-akkurat text-[9px] font-medium tracking-[0.2em] text-ash uppercase transition-colors hover:border-gold hover:text-gold"
            title="Restore factory catalogue"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
          <Button onClick={() => setEditor({ open: true, product: null })}>
            <Plus className="size-4" aria-hidden="true" />
            Add product
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 border border-line bg-charcoal px-3 py-2.5">
          <Search className="size-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, slug…"
            aria-label="Search products"
            className="w-full bg-transparent font-inter text-[12.5px] font-light text-ivory outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted hover:text-gold">
              <X className="size-4" strokeWidth={1.4} />
            </button>
          )}
        </label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          aria-label="Filter by brand"
          className="border border-line bg-charcoal px-3 py-2.5 font-inter text-[12.5px] font-light text-ivory outline-none focus:border-gold"
        >
          <option value="all">All brands</option>
          {BRANDS.map((b) => (
            <option key={b.slug} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto bg-charcoal">
        <table className="w-full min-w-[820px] text-left text-[12.5px]">
          <thead>
            <tr className="font-akkurat text-[8.5px] tracking-[0.2em] text-muted uppercase">
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">Brand</th>
              <th scope="col" className="px-4 py-3 text-right">Price</th>
              <th scope="col" className="px-4 py-3 text-right">Sale</th>
              <th scope="col" className="px-4 py-3 text-center">Stock</th>
              <th scope="col" className="px-4 py-3 text-center">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const discount = discountPercent(product)
              return (
                <tr key={product.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        label={product.brand}
                        className="size-12 shrink-0"
                      />
                      <div className="min-w-0 max-w-[240px]">
                        <p className="truncate font-cormorant text-base text-ivory">{product.name}</p>
                        <p className="truncate text-[9.5px] text-muted">/products/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ash">{product.brand}</td>
                  <td className="px-4 py-3 text-right font-inter text-ivory">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {discount ? (
                      <span className="text-gold">−{discount}%</span>
                    ) : (
                      <span className="text-ash">None</span>
                    )}
                  </td>
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
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleStock(product)}
                      aria-pressed={product.inStock}
                      title={product.inStock ? 'Mark sold out' : 'Mark in stock'}
                      className={classNames(
                        'inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.18em] uppercase transition-colors',
                        product.inStock
                          ? 'border-gold/40 bg-gold/10 text-gold hover:border-error/40 hover:bg-error/10 hover:text-error'
                          : 'border-error/40 bg-error/10 text-error hover:border-gold/40 hover:bg-gold/10 hover:text-gold',
                      )}
                    >
                      {product.inStock ? <Check className="size-3" aria-hidden="true" /> : <X className="size-3" aria-hidden="true" />}
                      {product.inStock ? 'Live' : 'Sold out'}
                    </button>
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
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        aria-label={`Delete ${product.name}`}
                        className="p-2 text-ash transition-colors hover:text-error"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-ash">
                  Nothing matches “{query}”.
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
