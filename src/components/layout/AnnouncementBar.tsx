import { BadgeCheck, Truck, Wallet } from 'lucide-react'

const MESSAGES = [
  { icon: Truck, text: 'Free insured delivery nationwide, 2 to 5 days' },
  { icon: Wallet, text: 'Cash on Delivery available, Rs. 1,000 advance to confirm' },
  { icon: BadgeCheck, text: '100% original watches, 1-year machine warranty' },
]

export function AnnouncementBar() {
  return (
    <div className="bg-coal text-muted">
      <div className="mx-auto hidden w-full max-w-[1360px] items-center justify-center px-8 py-2.5 lg:flex">
        {MESSAGES.map(({ icon: Icon, text }, index) => (
          <span key={text} className="flex items-center">
            {index > 0 && <span className="mx-8" aria-hidden="true" />}
            <span className="flex items-center gap-2.5 font-akkurat text-[8.5px] font-medium tracking-[0.2em] uppercase">
              <Icon className="size-3 text-gold" strokeWidth={1.4} />
              {text}
            </span>
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
                  className="flex items-center gap-2 px-6 py-2.5 font-akkurat text-[8.5px] font-medium tracking-[0.18em] whitespace-nowrap uppercase"
                >
                  <Icon className="size-3 text-gold" strokeWidth={1.4} />
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
