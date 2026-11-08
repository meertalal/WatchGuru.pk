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
      <h2 className="pb-3 font-cormorant text-2xl leading-tight text-ivory sm:text-3xl">{title}</h2>
      <div className="prose-policy mt-5 flex flex-col gap-4 text-[13px] font-light leading-[1.85] text-ash">
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
          <p className="font-akkurat text-[8.5px] tracking-[0.22em] text-muted uppercase">
            Last updated: {lastUpdated}
          </p>

          {children}

          <aside className="mt-12 flex flex-col gap-4 border border-gold/30 bg-charcoal p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-cormorant text-xl text-ivory">Still need a hand?</p>
              <p className="mt-1 text-[12px] font-light text-ash">
                Our concierge replies within minutes, 9am to 9pm PKT.
              </p>
            </div>
            <a
              href="https://wa.me/923222242389"
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 border border-button bg-button px-5 py-3 font-akkurat text-[9px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:border-gold-bright hover:bg-gold-bright"
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
