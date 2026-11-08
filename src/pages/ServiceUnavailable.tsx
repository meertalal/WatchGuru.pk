import { Clock, MessageCircle, RefreshCw } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export function ServiceUnavailable() {
  useDocumentMeta({
    title: '503 Service Temporarily Offline',
    description: 'The WatchGuru service is undergoing scheduled calibration.',
    noindex: true,
  })

  return (
    <Container className="flex min-h-[72svh] flex-col items-center justify-center py-20 text-center sm:py-28">
      <div className="relative mb-6 flex size-28 items-center justify-center rounded-full border border-gold/30 bg-coal/70 sm:size-36">
        <Clock className="size-14 text-gold/80 sm:size-18" strokeWidth={1.2} aria-hidden="true" />
        <span className="absolute -bottom-2 rounded-full border border-gold/40 bg-obsidian px-3 py-0.5 font-akkurat text-[9px] font-semibold tracking-[0.24em] text-gold uppercase">
          503 Unavailable
        </span>
      </div>

      <p className="eyebrow text-gold">Atelier Maintenance</p>
      <h1 className="display mt-3 text-[2.8rem] text-ivory sm:text-[3.8rem]">
        Boutique Temporarily Paused
      </h1>
      <p className="mt-4 max-w-lg text-[13.5px] font-light leading-relaxed text-ash">
        Our digital showroom is undergoing scheduled calibration to enhance security and catalogue accuracy.
        We expect to return momentarily. For urgent order inquiries, please message our Concierge.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button
          size="lg"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Check Again
        </Button>
        <a
          href="https://wa.me/923001234567?text=Hello%20WatchGuru%2C%20I%20have%20an%20urgent%20inquiry"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" variant="outline" className="inline-flex items-center gap-2">
            <MessageCircle className="size-4 text-gold" aria-hidden="true" />
            WhatsApp Concierge
          </Button>
        </a>
      </div>
    </Container>
  )
}
