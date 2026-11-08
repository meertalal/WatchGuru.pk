import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { classNames } from '../../lib/format'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={classNames(className)}>
      <ol className="flex flex-wrap items-center gap-2 font-akkurat text-[8.5px] font-medium tracking-[0.2em] uppercase">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="text-muted transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-ivory' : 'text-muted'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-2.5 text-line" strokeWidth={1.5} />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
