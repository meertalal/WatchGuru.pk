import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '../ui/Breadcrumbs'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import { Container } from '../ui/Container'

interface PageBannerProps {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  children?: ReactNode
}

/** A restrained interior-page header used across Shop, Cart, About, etc. */
export function PageBanner({ eyebrow, title, description, breadcrumbs, children }: PageBannerProps) {
  return (
    <section className="border-b border-stone-200 bg-stone-100">
      <Container>
        <div className="py-10 sm:py-16">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-5 sm:mb-6" />}
          {eyebrow && <p className="eyebrow mb-3 text-gold">{eyebrow}</p>}
          <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500">{description}</p>
          )}
          {children}
        </div>
      </Container>
    </section>
  )
}
