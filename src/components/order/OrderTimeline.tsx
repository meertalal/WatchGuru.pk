import { Check, Circle, PackageCheck, Truck, Home, ClipboardCheck, Ban } from 'lucide-react'
import type { OrderStatus, OrderStatusEntry } from '../../types'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, statusStepIndex } from '../../lib/orders'
import { classNames, formatDate } from '../../lib/format'

const STEP_ICONS = [ClipboardCheck, Check, PackageCheck, Truck, Home] as const

/**
 * Fulfilment timeline — renders the five happy-path stages with the
 * timestamps recorded on the order. Cancelled orders render a single
 * terminal state instead.
 */
export function OrderTimeline({
  status,
  history = [],
}: {
  status: OrderStatus
  history?: OrderStatusEntry[]
}) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
        <Ban className="size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">Order cancelled</p>
          <p className="text-xs text-error">
            {history.find((entry) => entry.status === 'cancelled')?.note ??
              'If you believe this is a mistake, contact us with your order number.'}
          </p>
        </div>
      </div>
    )
  }

  const currentStep = statusStepIndex(status)

  const stampFor = (stepStatus: OrderStatus): string | null => {
    const entry = history.find((item) => item.status === stepStatus)
    return entry ? formatDate(entry.at) : null
  }

  return (
    <ol className="flex flex-col gap-0" aria-label="Order progress">
      {ORDER_STATUS_FLOW.map((stepStatus, index) => {
        const Icon = STEP_ICONS[index] ?? Circle
        const reached = index <= currentStep
        const isCurrent = index === currentStep
        const isLast = index === ORDER_STATUS_FLOW.length - 1
        const stamp = stampFor(stepStatus)

        return (
          <li key={stepStatus} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connector */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={classNames(
                  'absolute left-[15px] top-8 h-[calc(100%-16px)] w-px',
                  index < currentStep ? 'bg-gold' : 'bg-charcoal',
                )}
              />
            )}
            <span
              className={classNames(
                'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500',
                reached
                  ? 'border-gold bg-gold text-obsidian'
                  : 'border-line bg-charcoal text-ash',
                isCurrent && 'ring-4 ring-gold/20',
              )}
            >
              <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="pt-1">
              <span
                className={classNames(
                  'block text-[12px] font-medium tracking-[0.14em] uppercase',
                  reached ? 'text-white' : 'text-ash',
                )}
              >
                {ORDER_STATUS_LABEL[stepStatus]}
              </span>
              <span className="mt-0.5 block text-[11px] text-ash">
                {stamp ?? (reached ? 'Completed' : 'Pending')}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
