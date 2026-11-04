import type { ReactNode } from 'react'
import { classNames } from '../../lib/format'

export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={classNames('mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10', className)}>
      {children}
    </div>
  )
}
