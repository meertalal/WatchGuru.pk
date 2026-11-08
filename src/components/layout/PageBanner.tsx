import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '../ui/Breadcrumbs'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import { Container } from '../ui/Container'
import { BreadcrumbJsonLd } from '../seo/BreadcrumbJsonLd'

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
    <section className="bg-coal">
      {breadcrumbs && <BreadcrumbJsonLd items={breadcrumbs} />}
      <Container>
        <div className="py-12 sm:py-16 lg:py-20">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
          {eyebrow && (
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="gold-rule" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="display mt-4 text-[2.4rem] sm:text-5xl lg:text-[3.5rem]">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-[13.5px] font-light leading-[1.9] text-ash">
              {description}
            </p>
          )}
          {children}
        </div>
      </Container>
    </section>
  )
}
