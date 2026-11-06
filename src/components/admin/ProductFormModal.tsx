import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import type { Product } from '../../types'
import { BRANDS, COLLECTIONS, DIAL_COLORS, STRAP_TYPES } from '../../data/products'
import { adminProductSchema, type AdminProductValues } from '../../lib/validation'
import { useCatalog, useToast } from '../../store'
import { classNames } from '../../lib/format'
import { Button } from '../ui/Button'
import { SelectField, TextAreaField, TextField } from '../ui/FormControls'
import { slugify } from '../../lib/format'

const BADGE_OPTIONS = ['', 'new', 'sale', 'bestseller', 'limited'] as const
const BLANK: AdminProductValues = {
  name: '',
  slug: '',
  brand: BRANDS[0]?.name ?? 'Meridian',
  category: 'men',
  price: 0,
  compareAtPrice: 0,
  stock: 5,
  rating: 4.8,
  reviewCount: 0,
  caseMaterial: 'Stainless Steel',
  caseSize: '40mm',
  movement: 'Automatic',
  dialColor: 'Charcoal',
  strapType: 'Stainless Steel',
  badge: '',
  description: '',
  inStock: true,
  collections: ['Heritage'],
  highlights: '',
  images: '',
  specs: '',
}

const parseLines = (value: string): string[] =>
  value.split('\n').map((line) => line.trim()).filter(Boolean)

const parseSpecs = (value: string): { label: string; value: string }[] =>
  parseLines(value).flatMap((line) => {
    const index = line.indexOf(':')
    if (index < 1) return []
    return [{ label: line.slice(0, index).trim(), value: line.slice(index + 1).trim() }]
  })

const toFormValues = (product: Product): AdminProductValues => ({
  name: product.name,
  slug: product.slug,
  brand: product.brand,
  category: product.category,
  price: product.price,
  compareAtPrice: product.compareAtPrice ?? 0,
  stock: product.stock,
  rating: product.rating,
  reviewCount: product.reviewCount,
  caseMaterial: product.caseMaterial,
  caseSize: product.caseSize,
  movement: product.movement,
  dialColor: product.dialColor,
  strapType: product.strapType,
  badge: product.badge ?? '',
  description: product.description,
  inStock: product.inStock,
  collections: product.collections as AdminProductValues['collections'],
  highlights: product.highlights.join('\n'),
  images: product.images.join('\n'),
  specs: product.specs.map((spec) => `${spec.label}: ${spec.value}`).join('\n'),
})

/**
 * The admin product editor — one form for both creating and editing.
 * Values are validated with zod; the saved entity is returned through
 * the catalog context so storefront pages update instantly.
 */
export function ProductFormModal({
  editing,
  onClose,
}: {
  /** Product being edited, or `null` for a brand-new piece. */
  editing: Product | null
  onClose: () => void
}) {
  const { saveProduct, suggestSlug } = useCatalog()
  const { notify } = useToast()
  const isNew = editing === null

  const defaultValues = useMemo(() => (editing ? toFormValues(editing) : BLANK), [editing])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<AdminProductValues>({
    resolver: zodResolver(adminProductSchema),
    defaultValues,
  })

  const watchedCollections = watch('collections')

  // Auto-derive the slug from the name until the user edits it manually.
  const nameValue = watch('name')
  useEffect(() => {
    if (!isNew || dirtyFields.slug) return
    setValue('slug', slugify(nameValue ?? ''), { shouldDirty: false })
  }, [nameValue, isNew, dirtyFields.slug, setValue])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  const toggleCollection = (collection: (typeof COLLECTIONS)[number]) => {
    const current = new Set(watchedCollections ?? [])
    if (current.has(collection)) current.delete(collection)
    else current.add(collection)
    setValue('collections', Array.from(current) as AdminProductValues['collections'], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = (values: AdminProductValues) => {
    const compareAt = values.compareAtPrice && values.compareAtPrice > 0 ? values.compareAtPrice : undefined
    const product: Product = {
      id: editing?.id ?? `custom_${Date.now().toString(36)}`,
      slug: values.slug,
      name: values.name.trim(),
      brand: values.brand,
      price: values.price,
      compareAtPrice: compareAt,
      rating: values.rating,
      reviewCount: values.reviewCount,
      description: values.description.trim(),
      highlights: parseLines(values.highlights),
      images: parseLines(values.images),
      category: values.category,
      collections: values.collections,
      dialColor: values.dialColor as Product['dialColor'],
      strapType: values.strapType as Product['strapType'],
      caseMaterial: values.caseMaterial.trim(),
      caseSize: values.caseSize.trim(),
      movement: values.movement.trim(),
      features: editing?.features ?? ['Automatic Movement'],
      specs: parseSpecs(values.specs),
      badge: (values.badge || undefined) as Product['badge'],
      inStock: values.inStock,
      stock: values.stock,
      addedAt: editing?.addedAt ?? new Date().toISOString().slice(0, 10),
    }
    saveProduct(product)
    notify(isNew ? `${product.name} added to the boutique.` : `${product.name} updated.`)
    onClose()
  }

  const inputClass = 'text-sm'

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close editor"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? 'Add a product' : `Edit ${editing?.name}`}
        className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-obsidian shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="eyebrow text-gold">{isNew ? 'New piece' : 'Editing'}</p>
            <h2 className="mt-0.5 text-lg">{isNew ? 'Add a product' : editing?.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ash transition-colors hover:text-white"
          >
            <X className="size-5" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          {/* Basics */}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Name"
              id="name"
              containerClassName="sm:col-span-2"
              className={inputClass}
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="sm:col-span-2">
              <TextField
                label="Slug (URL)"
                id="slug"
                className={inputClass}
                hint="watchguru.pk/products/<slug>"
                error={errors.slug?.message}
                {...register('slug')}
              />
              {isNew && (
                <button
                  type="button"
                  onClick={() => setValue('slug', suggestSlug(watch('name') || 'watch'), { shouldDirty: true })}
                  className="mt-1 text-[11px] text-gold underline-offset-2 hover:underline"
                >
                  Regenerate from name
                </button>
              )}
            </div>
            <SelectField
              label="Brand"
              id="brand"
              options={BRANDS.map((b) => ({ value: b.name, label: b.name }))}
              error={errors.brand?.message}
              {...register('brand')}
            />
            <SelectField
              label="Category"
              id="category"
              options={[
                { value: 'men', label: 'Men' },
                { value: 'women', label: 'Women' },
                { value: 'unisex', label: 'Unisex' },
              ]}
              error={errors.category?.message}
              {...register('category')}
            />
            <TextField
              label="Price (PKR)"
              id="price"
              type="number"
              min={0}
              step={1}
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
            <TextField
              label="Compare-at price (PKR, optional)"
              id="compareAtPrice"
              type="number"
              min={0}
              step={1}
              hint="Shown struck-through when set above price"
              error={errors.compareAtPrice?.message}
              {...register('compareAtPrice', {
                setValueAs: (value: string) =>
                  value === '' || Number.isNaN(Number(value)) ? undefined : Number(value),
              })}
            />
            <TextField
              label="Stock"
              id="stock"
              type="number"
              min={0}
              step={1}
              error={errors.stock?.message}
              {...register('stock', { valueAsNumber: true })}
            />
            <SelectField
              label="Badge"
              id="badge"
              options={BADGE_OPTIONS.map((b) => ({ value: b, label: b === '' ? 'None' : b }))}
              error={errors.badge?.message}
              {...register('badge')}
            />
            <TextField
              label="Case material"
              id="caseMaterial"
              error={errors.caseMaterial?.message}
              {...register('caseMaterial')}
            />
            <TextField
              label="Case size"
              id="caseSize"
              placeholder="40mm"
              error={errors.caseSize?.message}
              {...register('caseSize')}
            />
            <TextField
              label="Movement"
              id="movement"
              placeholder="Automatic"
              error={errors.movement?.message}
              {...register('movement')}
            />
            <SelectField
              label="Dial colour"
              id="dialColor"
              options={DIAL_COLORS.map((d) => ({ value: d, label: d }))}
              error={errors.dialColor?.message}
              {...register('dialColor')}
            />
            <SelectField
              label="Strap"
              id="strapType"
              options={STRAP_TYPES.map((s) => ({ value: s, label: s }))}
              error={errors.strapType?.message}
              {...register('strapType')}
            />
            <TextField
              label="Rating (0–5)"
              id="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              error={errors.rating?.message}
              {...register('rating', { valueAsNumber: true })}
            />
            <TextField
              label="Review count"
              id="reviewCount"
              type="number"
              min={0}
              step={1}
              error={errors.reviewCount?.message}
              {...register('reviewCount', { valueAsNumber: true })}
            />
          </div>

          {/* Collections */}
          <fieldset className="mt-5">
            <legend className="eyebrow text-ash">Collections</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLLECTIONS.map((collection) => {
                const active = (watchedCollections as readonly string[] | undefined)?.includes(
                  collection,
                )
                return (
                  <button
                    key={collection}
                    type="button"
                    onClick={() => toggleCollection(collection)}
                    aria-pressed={Boolean(active)}
                    className={classNames(
                      'border px-3 py-1.5 text-[11px] tracking-wide transition-colors',
                      active
                        ? 'border-gold bg-charcoal text-ivory'
                        : 'border-line text-ash hover:border-gold hover:text-white',
                    )}
                  >
                    {collection}
                  </button>
                )
              })}
            </div>
            {errors.collections && (
              <p className="mt-1.5 text-xs text-error">{errors.collections.message}</p>
            )}
          </fieldset>

          {/* Stock toggle */}
          <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 border border-line bg-charcoal px-4 py-3">
            <input type="checkbox" className="size-4 accent-gold" {...register('inStock')} />
            <span className="text-sm text-white">In stock and visible in the boutique</span>
          </label>

          {/* Story content */}
          <div className="mt-5 grid gap-4">
            <TextAreaField
              label="Description"
              id="description"
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />
            <TextAreaField
              label="Highlights (one per line)"
              id="highlights"
              rows={3}
              placeholder={'Hand-lacquered dial\nIn-house automatic calibre'}
              error={errors.highlights?.message}
              {...register('highlights')}
            />
            <TextAreaField
              label="Image URLs (one per line)"
              id="images"
              rows={3}
              placeholder="https://…/photo-1.jpg"
              error={errors.images?.message}
              {...register('images')}
            />
            <TextAreaField
              label="Specifications (Label: Value, one per line)"
              id="specs"
              rows={4}
              placeholder={'Case: 40mm brushed steel\nMovement: Calibre WG-2101 automatic\nWater Resistance: 50m / 5 ATM'}
              error={errors.specs?.message}
              {...register('specs')}
            />
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 -mx-6 mt-6 flex items-center justify-end gap-3 border-t border-line bg-obsidian px-6 py-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isNew ? 'Add to boutique' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
