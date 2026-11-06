import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-4 border border-dashed border-line bg-charcoal/60 px-6 py-20 text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && <div className="text-ash">{icon}</div>}
      <h3 className="text-2xl">{title}</h3>
      {description && <p className="max-w-md text-sm text-ash">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
