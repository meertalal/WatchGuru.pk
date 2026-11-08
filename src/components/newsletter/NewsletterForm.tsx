import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { newsletterSchema, type NewsletterValues } from '../../lib/validation'

const SIGNUP_EMAIL = 'concierge@watchguru.pk'

/**
 * The WatchGuru.pk Dispatches signup — used in the footer. There is no mailing
 * integration, so the form opens a subscribe request in the visitor's mail app
 * instead of claiming an address was recorded.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (values: NewsletterValues) => {
    const href = `mailto:${SIGNUP_EMAIL}?subject=${encodeURIComponent(
      'Subscribe to WatchGuru Dispatches',
    )}&body=${encodeURIComponent(`Please add ${values.email} to the WatchGuru Dispatches list.`)}`
    window.location.assign(href)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={className}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
            strokeWidth={1.4}
          />
          <input
            type="email"
            {...register('email')}
            placeholder="Email address"
            aria-label="Email address"
            aria-invalid={Boolean(errors.email)}
            className="h-12 w-full border border-line bg-obsidian/60 pr-4 pl-10 font-inter text-[13px] font-light text-ivory outline-none transition-colors placeholder:text-muted hover:border-gold/40 focus:border-gold"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center border border-button bg-button px-6 font-akkurat text-[10px] font-semibold tracking-[0.2em] text-button-text uppercase transition-colors duration-300 hover:border-gold-bright hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-50"
        >
          Subscribe
        </button>
      </div>
      {errors.email && <p className="mt-2 text-[11px] text-error">{errors.email.message}</p>}
    </form>
  )
}
