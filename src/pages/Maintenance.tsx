import { Cog, MessageCircle, Mail } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'

export function Maintenance() {
  useDocumentMeta({
    title: 'Scheduled Maintenance | WatchGuru.pk',
    description: 'Our boutique is undergoing scheduled maintenance and will reopen shortly.',
    noindex: true,
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-4 py-16 text-center text-ivory">
      <Container className="flex flex-col items-center">
        {/* Brand identity */}
        <span className="font-playfair text-[2rem] tracking-[0.28em] text-ivory">
          WatchGuru<span className="text-gold">.pk</span>
        </span>
        <span className="mt-2 font-akkurat text-[9px] tracking-[0.3em] text-ash uppercase">
          Haute Horlogerie Boutique
        </span>

        <div className="relative my-10 flex size-32 items-center justify-center rounded-full border border-gold/30 bg-coal/70 sm:size-40">
          <div className="absolute inset-2 animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-gold/25" />
          <Cog className="size-16 animate-[spin_12s_linear_infinite] text-gold/80 sm:size-20" strokeWidth={1.2} />
        </div>

        <p className="eyebrow text-gold">Precision Servicing in Progress</p>
        <h1 className="display mt-3 text-[2.6rem] text-ivory sm:text-[3.5rem]">
          Atelier Maintenance Underway
        </h1>
        <p className="mt-4 max-w-lg text-[13.5px] font-light leading-relaxed text-ash">
          We are currently polishing our digital showcases and calibrating our catalogue.
          The boutique will reopen shortly. Thank you for your patience.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-6 border-t border-line/70 pt-8 text-[12px] text-ash">
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-gold"
          >
            <MessageCircle className="size-4 text-gold" />
            WhatsApp: +92 300 1234567
          </a>
          <a
            href="mailto:concierge@watchguru.pk"
            className="flex items-center gap-2 transition-colors hover:text-gold"
          >
            <Mail className="size-4 text-gold" />
            concierge@watchguru.pk
          </a>
        </div>
      </Container>
    </div>
  )
}
