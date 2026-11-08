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
        'flex flex-col items-center justify-center gap-4 bg-coal/60 px-6 py-20 text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && <div className="text-gold/60">{icon}</div>}
      <h3 className="font-cormorant text-2xl text-ivory">{title}</h3>
      {description && (
        <p className="max-w-md text-[12.5px] font-light leading-relaxed text-ash">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
