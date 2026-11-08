import { Breadcrumbs, type BreadcrumbItem } from '../ui/Breadcrumbs'
import { Container } from '../ui/Container'
import { BreadcrumbJsonLd } from '../seo/BreadcrumbJsonLd'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=1920&q=85'

interface AboutHeroProps {
  title: string
  breadcrumbs: BreadcrumbItem[]
}

/**
 * Full-bleed About banner — executive hero artwork under a heavy
 * scrim, with the page title centred above the breadcrumb trail.
 */
export function AboutHero({ title, breadcrumbs }: AboutHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-coal">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 size-full object-cover object-center opacity-60"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-obsidian/85" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/60 via-obsidian/25 to-obsidian/80"
      />

      <Container>
        <div className="flex flex-col items-center py-24 text-center sm:py-28 lg:py-32">
          <h1 className="display text-[3rem] sm:text-[4rem] lg:text-[4.75rem]">{title}</h1>
          <Breadcrumbs items={breadcrumbs} className="mt-7" />
        </div>
      </Container>
    </section>
  )
}
