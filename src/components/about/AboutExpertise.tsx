import { Reveal } from '../ui/Reveal'

export interface ExpertiseMetric {
  label: string
  /** Genuine share of the catalogue, 0–100. */
  value: number
  note: string
}

interface AboutExpertiseProps {
  eyebrow?: string
  heading?: string
  copy: string
  metrics: ExpertiseMetric[]
}

/**
 * Our Expertise — heading, short copy and three measured progress bars. Each
 * value is computed from the live catalogue, so the bars never overstate what
 * the boutique actually carries.
 */
export function AboutExpertise({
  eyebrow = 'Our Story',
  heading = 'Our Expertise',
  copy,
  metrics,
}: AboutExpertiseProps) {
  return (
    <Reveal>
      <p className="eyebrow flex items-center gap-3 text-gold">
        <span className="gold-rule" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-5 font-cormorant text-[2.4rem] leading-[1.08] tracking-[-0.015em] text-ivory sm:text-[3rem]">
        {heading}
      </h2>
      <p className="mt-5 max-w-xl text-[13.5px] font-light leading-[1.9] text-ash">{copy}</p>

      <ul className="mt-10 flex flex-col gap-7">
        {metrics.map((metric) => (
          <li key={metric.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-akkurat text-[9.5px] font-medium tracking-[0.2em] text-ivory uppercase">
                {metric.label}
              </span>
              <span className="font-cormorant text-lg text-gold tabular-nums">
                {Math.round(metric.value)}%
              </span>
            </div>
            <div
              className="mt-3 h-[3px] w-full overflow-hidden bg-line/70"
              role="progressbar"
              aria-label={metric.label}
              aria-valuenow={Math.round(metric.value)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span
                className="block h-full bg-gold"
                style={{ width: `${Math.max(2, Math.min(100, metric.value))}%` }}
              />
            </div>
            <p className="mt-2.5 text-[11px] font-light tracking-wide text-muted">{metric.note}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
