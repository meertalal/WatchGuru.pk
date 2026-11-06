import { type ReactNode } from 'react'
import { MessageCircle } from 'lucide-react'
import { PageBanner } from '../layout/PageBanner'
import { Container } from '../ui/Container'

interface PolicyLayoutProps {
  title: string
  description: string
  lastUpdated: string
  children: ReactNode
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="border-b border-line pb-3 text-xl sm:text-2xl">{title}</h2>
      <div className="prose-policy mt-5 flex flex-col gap-4 text-sm leading-relaxed text-ash">
        {children}
      </div>
    </section>
  )
}

/**
 * Shared layout for every WatchGuru.pk policy — consistent banner,
 * comfortable reading width, last-updated stamp and a help footer.
 */
export function PolicyLayout({ title, description, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <>
      <PageBanner
        eyebrow="Customer Care"
        title={title}
        description={description}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: title }]}
      />

      <Container className="py-10 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-[11px] tracking-[0.18em] text-ash uppercase">
            Last updated · {lastUpdated}
          </p>

          {children}

          <aside className="mt-12 flex flex-col gap-4 border border-gold/40 bg-gold/10 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-white">Still need a hand?</p>
              <p className="mt-1 text-sm text-ash">
                Our concierge replies within minutes, 9am–9pm PKT.
              </p>
            </div>
            <a
              href="https://wa.me/923222242389"
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 border px-5 py-3 font-montserrat text-[10px] font-medium tracking-[0.2em] uppercase transition-colors bg-gold-bright text-obsidian border-gold-bright hover:bg-gold hover:border-gold"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp us
            </a>
          </aside>
        </div>
      </Container>
    </>
  )
}
