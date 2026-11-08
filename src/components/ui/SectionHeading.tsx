import type { ReactNode } from 'react'
import { classNames } from '../../lib/format'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: ReactNode
  className?: string
  /** Optional classes for the <h2> (used for per-section typography assignment). */
  titleClassName?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  action,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div
      className={classNames(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'items-start text-left',
        action && !centered ? 'sm:flex-row sm:items-end sm:justify-between' : '',
        className,
      )}
    >
      <div className={classNames('max-w-2xl', centered ? 'mx-auto' : '')}>
        {eyebrow && (
          <p
            className={classNames(
              'eyebrow mb-4 flex items-center gap-3 text-gold',
              centered && 'justify-center',
            )}
          >
            <span className="gold-rule" aria-hidden="true" />
            {eyebrow}
            {centered && <span className="gold-rule" aria-hidden="true" />}
          </p>
        )}
        <h2
          className={classNames(
            'font-cormorant font-normal text-[2.1rem] leading-[1.08] tracking-[-0.015em] text-ivory sm:text-[2.6rem] lg:text-[3rem]',
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-5 max-w-xl text-[13.5px] font-light leading-[1.8] text-ash sm:text-sm">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
