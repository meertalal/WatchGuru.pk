import { ChevronLeft, ChevronRight } from 'lucide-react'
import { classNames } from '../../lib/format'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  className?: string
}

/** Builds a compact page list, e.g. [1, '…', 4, 5, 6, '…', 12]. */
function buildPages(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const pages: Array<number | 'ellipsis'> = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (end < totalPages - 1) pages.push('ellipsis')
  pages.push(totalPages)

  return pages
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const go = (next: number) => onChange(Math.min(totalPages, Math.max(1, next)))
  const pages = buildPages(page, totalPages)

  const navButton =
    'flex size-10 items-center justify-center border border-line text-ash transition-colors hover:border-gold hover:text-white disabled:opacity-40 disabled:hover:border-gold disabled:hover:text-ash'

  return (
    <nav
      aria-label="Pagination"
      className={classNames('flex items-center justify-center gap-2', className)}
    >
      <button
        type="button"
        className={navButton}
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-ash">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => go(item)}
            aria-current={item === page ? 'page' : undefined}
            className={classNames(
              'size-10 text-xs font-medium transition-colors',
              item === page
                ? 'bg-gold-bright text-obsidian'
                : 'border border-line text-ash hover:border-gold hover:text-white',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={navButton}
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
