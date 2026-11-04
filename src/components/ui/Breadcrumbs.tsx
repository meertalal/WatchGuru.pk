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
    <nav aria-label="Breadcrumb" className={classNames('text-[11px] tracking-wide', className)}>
      <ol className="flex flex-wrap items-center gap-2 text-stone-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-charcoal' : undefined} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3 text-stone-400" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
