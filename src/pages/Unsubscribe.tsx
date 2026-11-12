import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, MailX } from 'lucide-react'
import { newsletterSchema, type NewsletterValues } from '../lib/validation'
import { errorMessage } from '../lib/api'
import { unsubscribeNewsletter } from '../data/repositories/supportRepository'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/FormControls'

export function Unsubscribe() {
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [submitError, setSubmitError] = useState('')

  useDocumentMeta({
    title: 'Unsubscribe from The Dispatch',
    description: 'Remove your email address from the WatchGuru.pk Dispatch newsletter.',
    noindex: true,
  })

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
    setSubmitError('')
    const address = values.email.trim().toLowerCase()

    try {
      await unsubscribeNewsletter(address)
      setEmail(address)
      reset()
      setDone(true)
    } catch (error) {
      setSubmitError(errorMessage(error, 'Your request could not be completed. Please try again.'))
    }
  }

  return (
    <>
      <PageBanner
        eyebrow="The Dispatch"
        title="Unsubscribe"
        description="We are sorry to see you go. Enter the address you subscribed with and we will remove it from the list."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Unsubscribe' }]}
      />

      <Container className="py-16 lg:py-20">
        <div className="mx-auto max-w-lg border border-line bg-charcoal p-6 sm:p-8">
          {done ? (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <Check className="size-6" strokeWidth={1.4} aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-cormorant text-2xl text-ivory">Request received</h2>
              <p className="mt-3 max-w-sm text-[12.5px] font-light leading-relaxed text-ash">
                If <span className="text-ivory">{email}</span> was on The Dispatch list, it has been
                removed and a confirmation email is on its way.
              </p>
              <Link to="/" className="mt-6">
                <Button variant="outline" className="rounded-full!">
                  Back to the boutique
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              <span className="flex size-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <MailX className="size-5" strokeWidth={1.4} aria-hidden="true" />
              </span>

              <TextField
                label="Email address"
                id="unsubscribe-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              {submitError && (
                <p
                  role="alert"
                  className="border border-error/40 bg-error/10 px-4 py-3 text-[12px] leading-relaxed text-error"
                >
                  {submitError}
                </p>
              )}

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Removing…' : 'Unsubscribe me'}
              </Button>

              <p className="text-[10.5px] leading-relaxed text-muted">
                Only the address entered is affected. If you change your mind, reply to the
                confirmation email and we will add you back.
              </p>
            </form>
          )}
        </div>
      </Container>
    </>
  )
}
