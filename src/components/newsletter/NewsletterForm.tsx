import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { newsletterSchema, type NewsletterValues } from '../../lib/validation'
import { useToast } from '../../store'

/**
 * The WatchGuru.pk Dispatches signup — shared by the footer and the
 * homepage newsletter band. Simulated: validates, confirms, sends nothing.
 */
export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const { notify } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: NewsletterValues) => {
    await new Promise((resolve) => setTimeout(resolve, 550))
    notify(`Thank you — ${values.email} is now subscribed to WatchGuru Dispatches.`)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div
        className={
          dark
            ? 'flex items-center gap-2 border-b border-line focus-within:border-gold'
            : 'flex items-center gap-2 border-b border-line focus-within:border-gold'
        }
      >
        <Mail className={dark ? 'size-4 text-ash' : 'size-4 text-ash'} aria-hidden="true" />
        <input
          type="email"
          {...register('email')}
          placeholder="Your email address"
          aria-label="Email address"
          aria-invalid={Boolean(errors.email)}
          className={
            dark
              ? 'w-full bg-transparent py-3 font-lato text-sm text-ivory outline-none placeholder:text-ash'
              : 'w-full bg-transparent py-3 font-lato text-sm text-white outline-none placeholder:text-ash'
          }
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={
            dark
              ? 'font-montserrat text-[10px] font-medium tracking-[0.2em] whitespace-nowrap text-gold uppercase transition-opacity hover:opacity-70 disabled:opacity-50'
              : 'font-montserrat text-[10px] font-medium tracking-[0.2em] whitespace-nowrap text-white uppercase transition-opacity hover:text-gold disabled:opacity-50'
          }
        >
          {isSubmitting ? 'Sending…' : 'Subscribe'}
        </button>
      </div>
      {errors.email && <p className="mt-2 text-xs text-error">{errors.email.message}</p>}
    </form>
  )
}
