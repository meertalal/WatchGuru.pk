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
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start text-left',
        action && !centered ? 'sm:flex-row sm:items-end sm:justify-between' : '',
        className,
      )}
    >
      <div className={classNames('max-w-2xl', centered ? 'mx-auto' : '')}>
        {eyebrow && <p className="eyebrow mb-3 text-gold">{eyebrow}</p>}
        <h2 className={classNames('text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]', titleClassName)}>
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-ash sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
