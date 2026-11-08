import { Reveal } from '../ui/Reveal'

export interface AboutStat {
  value: string
  label: string
}

interface AboutStatisticsProps {
  stats: AboutStat[]
  /** Accessible description of where the figures come from. */
  caption?: string
}

/**
 * The 2×2 statistics grid beside Our Expertise. Values are passed in from the
 * catalogue so the page only ever reports what the boutique can stand behind.
 */
export function AboutStatistics({ stats, caption }: AboutStatisticsProps) {
  return (
    <Reveal delay={120}>
      <dl className="grid grid-cols-2 overflow-hidden border border-line/70 bg-coal/40">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={[
              'flex flex-col items-center justify-center gap-2 px-4 py-9 text-center sm:px-6 sm:py-12',
              index % 2 === 1 ? 'border-l border-line/70' : '',
              index > 1 ? 'border-t border-line/70' : '',
            ].join(' ')}
          >
            <dt className="font-cormorant text-[2.6rem] leading-none text-ivory sm:text-[3.4rem]">
              {stat.value}
            </dt>
            <dd className="mt-2 max-w-[16ch] font-akkurat text-[8.5px] leading-relaxed tracking-[0.22em] text-muted uppercase">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
      {caption && (
        <p className="mt-4 text-[10.5px] font-light tracking-wide text-muted">{caption}</p>
      )}
    </Reveal>
  )
}
