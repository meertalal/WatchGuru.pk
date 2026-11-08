import { ArrowUpRight, MapPin } from 'lucide-react'

/** The boutique address already used across the site. */
const MAP_QUERY = 'Phase 6, DHA, Karachi 75500, Pakistan'
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

/**
 * Responsive map for the existing Karachi boutique address, with a direct
 * "Open in Maps" link for full directions.
 */
export function ContactMap() {
  return (
    <div className="overflow-hidden border border-line bg-charcoal">
      <iframe
        title="WatchGuru.pk boutique location, Phase 6, DHA, Karachi"
        src={MAP_EMBED}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[260px] w-full border-0 saturate-[0.75] sm:h-[300px]"
      />

      <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[11px] font-light text-ash">
          <MapPin className="size-3.5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          WatchGuru.pk Flagship, Phase 6, DHA, Karachi
        </p>
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex shrink-0 items-center gap-1.5 font-akkurat text-[9px] font-medium tracking-[0.2em] whitespace-nowrap text-gold uppercase transition-colors duration-300 hover:text-gold-bright"
        >
          Open in Maps
          <ArrowUpRight className="size-3" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
