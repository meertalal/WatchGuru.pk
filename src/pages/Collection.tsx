import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getBrandCollection, getCollectionBySlug } from '../data/collections'
import { useCatalog } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CollectionView } from '../components/collection/CollectionView'
import { NotFound } from './NotFound'

/**
 * Single entry point for every collection route:
 *   /collections/:slug            → all, men, women, executive, original, fashion
 *   /collections/brand/:brandSlug → per-brand collections
 */
export function Collection() {
  const { slug, brandSlug } = useParams<{ slug?: string; brandSlug?: string }>()
  const { products } = useCatalog()

  const def = useMemo(
    () => (brandSlug ? getBrandCollection(brandSlug) : getCollectionBySlug(slug)),
    [slug, brandSlug],
  )

  useDocumentMeta({
    title: def ? `${def.title} — Buy Online in Pakistan` : 'Collection Not Found',
    description:
      def?.description ??
      'Browse the WatchGuru.pk boutique — 100% original luxury watches with nationwide delivery.',
  })

  const baseProducts = useMemo(() => (def ? products.filter(def.match) : []), [def, products])

  if (!def) return <NotFound />

  return (
    <CollectionView
      baseProducts={baseProducts}
      heading={def.title}
      eyebrow={def.eyebrow}
      description={def.description}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Collections', to: '/collections/all' },
        { label: def.title },
      ]}
    />
  )
}
