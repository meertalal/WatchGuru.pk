import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface DocumentMetaInput {
  /** Page-specific title; the site suffix is appended automatically. */
  title: string
  description: string
  /** Absolute or root-relative image for Open Graph / Twitter cards. */
  image?: string
  /** Defaults to `website`. */
  type?: 'website' | 'article' | 'product'
  /** When true, search engines will not index this page (e.g. cart, checkout, admin). */
  noindex?: boolean
}

const SITE_NAME = 'WatchGuru.pk'
const SITE_SUFFIX = ` | ${SITE_NAME}`
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

/**
 * Per-page SEO: title, description, canonical, Open Graph, Twitter
 * cards, and robots indexing directives.
 */
export function useDocumentMeta({
  title,
  description,
  image,
  type = 'website',
  noindex = false,
}: DocumentMetaInput) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title.endsWith(SITE_SUFFIX) ? title : `${title}${SITE_SUFFIX}`
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.watchguru.pk'
    const canonical = `${origin}${pathname}`
    const resolvedImage = image
      ? image.startsWith('http')
        ? image
        : `${origin}${image.startsWith('/') ? '' : '/'}${image}`
      : DEFAULT_IMAGE

    document.title = fullTitle

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[property="og:image"]', 'property', 'og:image', resolvedImage)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImage)
    setCanonical(canonical)
  }, [title, description, image, type, pathname, noindex])
}
