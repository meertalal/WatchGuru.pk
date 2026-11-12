import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import type { Product } from '../../types'
import { BRANDS, COLLECTIONS, DIAL_COLORS, STRAP_TYPES } from '../../data/products'
import { adminProductSchema, type AdminProductValues } from '../../lib/validation'
import { ApiError, errorMessage } from '../../lib/api'
import { fileToImageDataUrl } from '../../lib/imageUpload'
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
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultValues = useMemo(() => (editing ? toFormValues(editing) : BLANK), [editing])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    setFocus,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<AdminProductValues>({
    resolver: zodResolver(adminProductSchema),
    defaultValues,
  })

  const watchedCollections = watch('collections')
  const imageList = parseLines(watch('images') ?? '')

  const removeImage = (index: number) => {
    setValue('images', imageList.filter((_, position) => position !== index).join('\n'), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const addImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const slots = Math.max(0, 8 - imageList.length)
    if (slots === 0) {
      notify('A product can hold up to 8 photos.', 'error')
      return
    }

    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files).slice(0, slots)) {
        urls.push(await fileToImageDataUrl(file))
      }
      setValue('images', [...imageList, ...urls].join('\n'), {
        shouldDirty: true,
        shouldValidate: true,
      })
    } catch (error) {
      notify(errorMessage(error, 'The photo could not be added.'), 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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

  const onSubmit = async (values: AdminProductValues) => {
    setFormError('')
    const compareAt =
      values.compareAtPrice && values.compareAtPrice > 0 ? values.compareAtPrice : null
    const product: Product = {
      id: editing?.id ?? `custom_${Date.now().toString(36)}`,
      slug: values.slug,
      name: values.name.trim(),
      brand: values.brand,
      price: values.price,
      compareAtPrice: compareAt,
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
      badge: (values.badge || null) as Product['badge'],
      inStock: values.inStock,
      stock: values.stock,
      addedAt: editing?.addedAt ?? new Date().toISOString().slice(0, 10),
    }

    try {
      await saveProduct(product, isNew)
      notify(isNew ? `${product.name} added to the boutique.` : `${product.name} updated.`)
      onClose()
    } catch (error) {
      if (error instanceof ApiError) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as Parameters<typeof setError>[0], { type: 'server', message })
        }
      }
      const message = errorMessage(error, 'The product could not be saved.')
      setFormError(message)
      notify(message, 'error')
    }
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
        className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden bg-obsidian shadow-2xl"
      >
        <header className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="eyebrow text-gold">{isNew ? 'New piece' : 'Editing'}</p>
            <h2 className="mt-0.5 font-cormorant text-xl text-ivory">{isNew ? 'Add a product' : editing?.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted transition-colors hover:text-gold"
          >
            <X className="size-5" strokeWidth={1.4} />
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
            {isNew ? (
              <TextField
                label="Opening stock"
                id="stock"
                type="number"
                min={0}
                step={1}
                hint="After this, use the Stock module"
                error={errors.stock?.message}
                {...register('stock', { valueAsNumber: true })}
              />
            ) : (
              <div className="flex flex-col justify-end border border-line bg-charcoal px-3 py-2.5">
                <span className="eyebrow text-[9px] text-muted">Stock</span>
                <span className="mt-1 text-[12.5px] text-ivory">Managed in the Stock module</span>
              </div>
            )}
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
                        ? 'border-gold/70 bg-charcoal text-ivory'
                        : 'border-line text-ash hover:border-gold/50 hover:text-ivory',
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
            <span className="text-[12.5px] text-ivory">In stock and visible in the boutique</span>
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
            <div className="sm:col-span-2">
              <span className="mb-2 block font-akkurat text-[9px] font-medium tracking-[0.2em] text-ash uppercase">
                Product photos
              </span>
              <div className="flex flex-wrap gap-3">
                {imageList.map((src, index) => (
                  <div key={index} className="group relative size-24 border border-line bg-coal">
                    <img src={src} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="Remove photo"
                      className="absolute right-1 top-1 flex size-6 items-center justify-center bg-black/70 text-ivory transition-colors hover:text-error"
                    >
                      <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
                {imageList.length < 8 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex size-24 flex-col items-center justify-center gap-1.5 border border-dashed border-line text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
                  >
                    <ImagePlus className="size-5" strokeWidth={1.3} aria-hidden="true" />
                    <span className="text-[10px] uppercase tracking-[0.12em]">
                      {uploading ? 'Adding…' : 'Add photo'}
                    </span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(event) => void addImages(event.target.files)}
              />
              {errors.images?.message ? (
                <p className="mt-1.5 text-[11px] text-error">{errors.images.message}</p>
              ) : (
                <p className="mt-1.5 text-[11px] text-muted">
                  Up to 8 photos. Large images are resized automatically.
                </p>
              )}
            </div>
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
          {formError && (
            <p
              role="alert"
              className="mt-5 border border-error/40 bg-error/10 px-4 py-3 text-[12px] leading-relaxed text-error"
            >
              {formError}
            </p>
          )}

          <div className="sticky bottom-0 -mx-6 mt-6 flex items-center justify-end gap-3 bg-obsidian px-6 py-4">
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
