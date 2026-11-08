import type { BreadcrumbItem } from '../ui/Breadcrumbs'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import { Container } from '../ui/Container'
import { BreadcrumbJsonLd } from '../seo/BreadcrumbJsonLd'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=85'

interface ContactHeroProps {
  eyebrow?: string
  title: string
  breadcrumbs: BreadcrumbItem[]
}

/**
 * Contact page banner — an editorial luxury watch asset under a dark overlay, with the
 * page title centred above the breadcrumb trail.
 */
export function ContactHero({ eyebrow, title, breadcrumbs }: ContactHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-coal">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 size-full object-cover object-[64%_center] opacity-55 sm:object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-obsidian/85" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/50 via-obsidian/20 to-obsidian/70"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gold/20" />

      <Container>
        <div className="flex flex-col items-center py-20 text-center sm:py-24 lg:py-28">
          {eyebrow && (
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="gold-rule" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="display mt-5 text-[3rem] sm:text-[4rem] lg:text-[4.75rem]">{title}</h1>
          <Breadcrumbs items={breadcrumbs} className="mt-7" />
        </div>
      </Container>
    </section>
  )
}
