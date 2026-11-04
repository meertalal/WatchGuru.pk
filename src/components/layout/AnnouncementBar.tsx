import { Sparkles, Truck, Undo2 } from 'lucide-react'

const MESSAGES = [
  { icon: Truck, text: 'Complimentary insured shipping on every order' },
  { icon: Sparkles, text: 'New arrivals from the 2026 collections' },
  { icon: Undo2, text: '30-day returns · 5-year international warranty' },
]

export function AnnouncementBar() {
  return (
    <div className="bg-charcoal text-ivory">
      <div className="mx-auto hidden w-full max-w-[1280px] items-center justify-center gap-10 px-8 py-2.5 lg:flex">
        {MESSAGES.map(({ icon: Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-2 font-inter text-[10.5px] font-medium tracking-[0.14em] uppercase"
          >
            <Icon className="size-3.5 text-gold" strokeWidth={1.6} />
            {text}
          </span>
        ))}
      </div>

      <div className="overflow-hidden lg:hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {MESSAGES.map(({ icon: Icon, text }) => (
                <span
                  key={`${copy}-${text}`}
                  className="flex items-center gap-2 px-6 py-2.5 font-inter text-[10px] font-medium tracking-[0.14em] whitespace-nowrap uppercase"
                >
                  <Icon className="size-3.5 text-gold" strokeWidth={1.6} />
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
